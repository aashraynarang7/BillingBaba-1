"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Printer, FileSpreadsheet, Search, Filter,
  Calendar as CalendarIcon, Loader2, ChevronDown,
} from "lucide-react";
import { format } from "date-fns";

// ── Types ─────────────────────────────────────────────────────────────────────

type PartyRow = {
  partyName: string;
  saleQty: number;
  saleAmount: number;
  purchaseQty: number;
  purchaseAmount: number;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { "x-auth-token": token }),
    ...(companyId && { "x-company-id": companyId }),
  };
};

const n2 = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtAmt = (n: number) =>
  n < 0 ? `- ₹ ${n2(Math.abs(n))}` : `₹ ${n2(n)}`;

// ── TH helper ─────────────────────────────────────────────────────────────────

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
    <div className="flex items-center gap-1">
      <span>{children}</span>
      <Filter className="w-3 h-3 text-gray-400" />
    </div>
  </th>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PartyReportByItemPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [period, setPeriod] = useState("this-month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // raw data
  const [rawSales, setRawSales] = useState<any[]>([]);
  const [rawPurchases, setRawPurchases] = useState<any[]>([]);
  const [rawDrNotes, setRawDrNotes] = useState<any[]>([]);
  // item → category mapping
  const [itemCategoryMap, setItemCategoryMap] = useState<Map<string, string>>(new Map());

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!fromDate || !toDate || !companyId) return;
    setLoading(true);
    try {
      const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
      const end = new Date(toDate); end.setHours(23, 59, 59, 999);
      const dateQs = `startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      const cid = `companyId=${companyId}`;

      const [salesR, purchR, drR, itemsR] = await Promise.all([
        fetch(`${API_BASE}/sales?type=INVOICE&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=BILL&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=DEBIT_NOTE&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/items?type=product&${cid}`, { headers: getHeaders() }),
      ]);

      const toArr = async (r: Response) => {
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : d.data ?? [];
      };

      const [sales, purchases, drNotes, items] = await Promise.all([
        toArr(salesR), toArr(purchR), toArr(drR), toArr(itemsR),
      ]);

      setRawSales(sales.filter((d: any) => d.status !== "Cancelled"));
      setRawPurchases(purchases.filter((d: any) => d.status !== "Cancelled"));
      setRawDrNotes(drNotes.filter((d: any) => d.status !== "Cancelled"));

      // Build item → category map
      const catMap = new Map<string, string>();
      for (const item of items) {
        if (item.product?.category) {
          catMap.set((item.name || "").trim(), item.product.category);
        }
      }
      setItemCategoryMap(catMap);
    } catch (err) {
      console.error("Party report fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Unique items & categories (for dropdowns) ─────────────────────────────────

  const allItemNames = useMemo(() => {
    const names = new Set<string>();
    [...rawSales, ...rawPurchases, ...rawDrNotes].forEach(doc =>
      (doc.items || []).forEach((item: any) => {
        if (item.name) names.add(item.name.trim());
      })
    );
    return ["all", ...Array.from(names).sort()];
  }, [rawSales, rawPurchases, rawDrNotes]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    itemCategoryMap.forEach(cat => { if (cat) cats.add(cat); });
    return ["all", ...Array.from(cats).sort()];
  }, [itemCategoryMap]);

  // ── Build party rows ──────────────────────────────────────────────────────────

  const rows: PartyRow[] = useMemo(() => {
    const map = new Map<string, PartyRow>();

    const ensure = (name: string) => {
      if (!map.has(name)) {
        map.set(name, { partyName: name, saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 });
      }
      return map.get(name)!;
    };

    const passesFilter = (itemName: string) => {
      const name = (itemName || "").trim();
      if (selectedItem !== "all" && name !== selectedItem) return false;
      if (selectedCategory !== "all") {
        const cat = itemCategoryMap.get(name) || "";
        if (cat !== selectedCategory) return false;
      }
      return true;
    };

    // Sales
    for (const doc of rawSales) {
      const party = (doc.partyName || doc.partyId?.name || "Cash Sale").trim();
      for (const item of (doc.items || [])) {
        if (!passesFilter(item.name)) continue;
        const row = ensure(party);
        row.saleQty += item.quantity ?? 0;
        row.saleAmount += item.amount ?? 0;
      }
    }

    // Purchase bills
    for (const doc of rawPurchases) {
      const party = (doc.partyName || doc.partyId?.name || "").trim();
      for (const item of (doc.items || [])) {
        if (!passesFilter(item.name)) continue;
        const row = ensure(party);
        row.purchaseQty += item.quantity ?? 0;
        row.purchaseAmount += item.amount ?? 0;
      }
    }

    // Debit notes (subtract from purchase)
    for (const doc of rawDrNotes) {
      const party = (doc.partyName || doc.partyId?.name || "").trim();
      for (const item of (doc.items || [])) {
        if (!passesFilter(item.name)) continue;
        const row = ensure(party);
        row.purchaseQty -= item.quantity ?? 0;
        row.purchaseAmount -= item.amount ?? 0;
      }
    }

    // Filter rows with no activity
    let result = Array.from(map.values()).filter(
      r => r.saleQty !== 0 || r.saleAmount !== 0 || r.purchaseQty !== 0 || r.purchaseAmount !== 0
    );

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => r.partyName.toLowerCase().includes(q));
    }

    return result.sort((a, b) => a.partyName.localeCompare(b.partyName));
  }, [rawSales, rawPurchases, rawDrNotes, selectedItem, selectedCategory, itemCategoryMap, searchTerm]);

  // ── Totals ────────────────────────────────────────────────────────────────────

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          saleQty: acc.saleQty + r.saleQty,
          saleAmount: acc.saleAmount + r.saleAmount,
          purchaseQty: acc.purchaseQty + r.purchaseQty,
          purchaseAmount: acc.purchaseAmount + r.purchaseAmount,
        }),
        { saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 }
      ),
    [rows]
  );

  // ── Period preset ─────────────────────────────────────────────────────────────

  const handlePeriod = (val: string) => {
    setPeriod(val);
    const now = new Date();
    if (val === "this-month") {
      setFromDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setToDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (val === "last-month") {
      setFromDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      setToDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (val === "this-year") {
      setFromDate(new Date(now.getFullYear(), 3, 1));
      setToDate(new Date(now.getFullYear() + 1, 2, 31));
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const data = rows.map(r => ({
      "Party Name": r.partyName,
      "Sale Quantity": r.saleQty,
      "Sale Amount": r.saleAmount,
      "Purchase Quantity": r.purchaseQty,
      "Purchase Amount": r.purchaseAmount,
    }));
    data.push({
      "Party Name": "Total:",
      "Sale Quantity": totals.saleQty,
      "Sale Amount": totals.saleAmount,
      "Purchase Quantity": totals.purchaseQty,
      "Purchase Amount": totals.purchaseAmount,
    });
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "PartyReportByItem");
    xlsx.writeFile(wb, `PartyReportByItem_${format(fromDate!, "MMM-yyyy")}.xlsx`);
  };

  const qtyClass = (n: number) =>
    n < 0 ? "text-red-500" : n > 0 ? "text-gray-800" : "text-gray-400";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b">
        <div className="flex flex-wrap items-center gap-3">
          {/* Period */}
          <Select value={period} onValueChange={handlePeriod}>
            <SelectTrigger className="w-40 h-9 font-bold text-base border-none shadow-none">
              <SelectValue />
              <ChevronDown className="ml-1 h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex items-center border rounded-md h-9 px-1 gap-0.5 bg-white">
            <span className="text-xs text-white font-semibold bg-gray-500 px-2 py-1 rounded-sm">
              Between
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : "Start"}
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={d => { setFromDate(d); setPeriod("custom"); }} />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-gray-500 px-1">To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                  {toDate ? format(toDate, "dd/MM/yyyy") : "End"}
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={d => { setToDate(d); setPeriod("custom"); }} />
              </PopoverContent>
            </Popover>
          </div>

          <Select defaultValue="all-firms">
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-firms">All Firms</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-godown">
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-godown">All Godown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
            onClick={handleExportExcel}
          >
            <FileSpreadsheet className="w-5 h-5 text-blue-700" />
            <span>Excel Report</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
            onClick={() => window.print()}
          >
            <Printer className="w-5 h-5 text-gray-700" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* ── Sub-filters ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-44 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allCategories.map(c => (
              <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedItem} onValueChange={setSelectedItem}>
          <SelectTrigger className="w-44 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allItemNames.map(i => (
              <SelectItem key={i} value={i}>{i === "all" ? "All Items" : i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 py-3 gap-3">
        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Party..."
            className="pl-9 h-8 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 w-12">#</th>
                  <TH>Party Name</TH>
                  <TH>Sale Quantity</TH>
                  <TH>Sale Amount</TH>
                  <TH>Purchase Quantity</TH>
                  <TH>Purchase Amount</TH>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                      No data available for the selected period.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr
                      key={row.partyName}
                      className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{row.partyName}</td>
                      <td className={`px-4 py-3 text-right ${qtyClass(row.saleQty)}`}>
                        {row.saleQty}
                      </td>
                      <td className={`px-4 py-3 text-right ${row.saleAmount < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {fmtAmt(row.saleAmount)}
                      </td>
                      <td className={`px-4 py-3 text-right ${qtyClass(row.purchaseQty)}`}>
                        {row.purchaseQty}
                      </td>
                      <td className={`px-4 py-3 text-right ${row.purchaseAmount < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {fmtAmt(row.purchaseAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {rows.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gray-200 font-semibold text-sm">
                    <td className="px-4 py-3 text-gray-800" colSpan={2}>Total:</td>
                    <td className={`px-4 py-3 text-right ${qtyClass(totals.saleQty)}`}>
                      {totals.saleQty}
                    </td>
                    <td className={`px-4 py-3 text-right ${totals.saleAmount < 0 ? "text-red-500" : "text-gray-800"}`}>
                      {fmtAmt(totals.saleAmount)}
                    </td>
                    <td className={`px-4 py-3 text-right ${qtyClass(totals.purchaseQty)}`}>
                      {totals.purchaseQty}
                    </td>
                    <td className={`px-4 py-3 text-right ${totals.purchaseAmount < 0 ? "text-red-500" : "text-gray-800"}`}>
                      {fmtAmt(totals.purchaseAmount)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
