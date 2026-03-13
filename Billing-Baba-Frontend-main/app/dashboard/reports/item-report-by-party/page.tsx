// app/dashboard/reports/item-report-by-party/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Printer, FileSpreadsheet, Loader2 } from "lucide-react";
import { format } from "date-fns";

// ── Types ─────────────────────────────────────────────────────────────────────

type ItemRow = {
  itemName: string;
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

const fmt = (n: number) => {
  if (n < 0)
    return `- ₹ ${Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function accumulate(
  docs: any[],
  map: Map<string, ItemRow>,
  side: "sale" | "purchase",
  partyFilter: string
) {
  for (const doc of docs) {
    if (doc.status === "Cancelled") continue;

    const partyName: string = doc.partyName || doc.partyId?.name || "";
    if (partyFilter && !partyName.toLowerCase().includes(partyFilter.toLowerCase())) continue;

    const items: any[] = doc.items || [];
    for (const item of items) {
      const name: string = (item.name || "Unknown").trim();
      const qty: number = item.quantity ?? 0;
      const amount: number = item.amount ?? 0;

      if (!map.has(name)) {
        map.set(name, { itemName: name, saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 });
      }
      const row = map.get(name)!;
      if (side === "sale") {
        row.saleQty += qty;
        row.saleAmount += amount;
      } else {
        row.purchaseQty += qty;
        row.purchaseAmount += amount;
      }
    }
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ItemReportByPartyPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [partyFilter, setPartyFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawSales, setRawSales] = useState<any[]>([]);
  const [rawPurchases, setRawPurchases] = useState<any[]>([]);

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!fromDate || !toDate || !companyId) return;
    setLoading(true);
    try {
      const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
      const end = new Date(toDate); end.setHours(23, 59, 59, 999);
      const qs = `companyId=${companyId}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`;

      const [salesRes, purchasesRes] = await Promise.all([
        fetch(`${API_BASE}/sales?type=INVOICE&${qs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=BILL&${qs}`, { headers: getHeaders() }),
      ]);

      const salesData = salesRes.ok ? await salesRes.json() : [];
      const purchasesData = purchasesRes.ok ? await purchasesRes.json() : [];

      setRawSales(Array.isArray(salesData) ? salesData : salesData.data ?? []);
      setRawPurchases(Array.isArray(purchasesData) ? purchasesData : purchasesData.data ?? []);
    } catch (err) {
      console.error("Item report fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Build rows (re-runs when partyFilter changes, no extra API call) ─────────

  const rows: ItemRow[] = useMemo(() => {
    const map = new Map<string, ItemRow>();
    accumulate(rawSales, map, "sale", partyFilter);
    accumulate(rawPurchases, map, "purchase", partyFilter);
    return Array.from(map.values()).sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [rawSales, rawPurchases, partyFilter]);

  // ── Totals ───────────────────────────────────────────────────────────────────

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

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const data = rows.map((r) => ({
      "Item Name": r.itemName,
      "Sale Quantity": r.saleQty,
      "Sale Amount": r.saleAmount,
      "Purchase Quantity": r.purchaseQty,
      "Purchase Amount": r.purchaseAmount,
    }));
    data.push({
      "Item Name": "Total",
      "Sale Quantity": totals.saleQty,
      "Sale Amount": totals.saleAmount,
      "Purchase Quantity": totals.purchaseQty,
      "Purchase Amount": totals.purchaseAmount,
    });
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "ItemReportByParty");
    xlsx.writeFile(wb, `ItemReportByParty_${format(fromDate!, "MMM-yyyy")}.xlsx`);
  };

  // ── Qty color helper ──────────────────────────────────────────────────────────

  const qtyClass = (n: number) =>
    n < 0 ? "text-red-500" : n > 0 ? "text-teal-600" : "text-gray-400";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b">
        {/* ALL FIRMS */}
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-36 h-9 text-sm font-semibold text-teal-600 border-teal-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL FIRMS</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex items-center border rounded-md bg-white h-9 px-2 gap-1">
            <span className="text-xs text-gray-500 font-medium">From</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : "Start"}
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-gray-500 font-medium">To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                  {toDate ? format(toDate, "dd/MM/yyyy") : "End"}
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleExportExcel} title="Export Excel">
            <FileSpreadsheet className="h-4 w-4 text-teal-600" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => window.print()} title="Print">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">DETAILS</h2>

        {/* FILTERS row */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide border border-gray-200 px-3 py-1.5 rounded">
            FILTERS
          </span>
          <Input
            placeholder="Party filter"
            className="w-48 h-8 text-sm"
            value={partyFilter}
            onChange={(e) => setPartyFilter(e.target.value)}
          />
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-t border-gray-200 bg-gray-50">
              <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-600 w-[40%]">
                Item Name
              </th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">
                Sale Quantity
              </th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">
                Sale Amount
              </th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">
                Purchase Quantity
              </th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">
                Purchase Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-400 text-sm">
                  No data for the selected period.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.itemName}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3 text-gray-800">{row.itemName}</td>
                  <td className={`py-3 px-3 text-right font-medium ${qtyClass(row.saleQty)}`}>
                    {row.saleQty}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700">
                    {fmt(row.saleAmount)}
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${qtyClass(row.purchaseQty)}`}>
                    {row.purchaseQty}
                  </td>
                  <td
                    className={`py-3 px-3 text-right ${
                      row.purchaseAmount < 0 ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {fmt(row.purchaseAmount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {!loading && rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td className="py-3 px-3 font-bold text-gray-800">Total</td>
                <td className={`py-3 px-3 text-right font-bold ${qtyClass(totals.saleQty)}`}>
                  {totals.saleQty}
                </td>
                <td className="py-3 px-3 text-right font-bold text-gray-800">
                  {fmt(totals.saleAmount)}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${qtyClass(totals.purchaseQty)}`}>
                  {totals.purchaseQty}
                </td>
                <td
                  className={`py-3 px-3 text-right font-bold ${
                    totals.purchaseAmount < 0 ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  {fmt(totals.purchaseAmount)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
