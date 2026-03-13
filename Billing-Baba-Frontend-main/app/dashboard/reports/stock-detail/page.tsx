// app/dashboard/reports/stock-detail/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Printer, FileSpreadsheet, Loader2 } from "lucide-react";
import { format } from "date-fns";

// ── Types ─────────────────────────────────────────────────────────────────────

type StockRow = {
  itemName: string;
  category: string;
  beginningQty: number;
  qtyIn: number;
  purchaseAmount: number; // net: bills − debit notes
  qtyOut: number;
  saleAmount: number;
  closingQty: number;    // currentQuantity from product
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const n2 = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtAmt = (n: number) => {
  if (n < 0) return `-₹ ${n2(Math.abs(n))}`;
  return `₹ ${n2(n)}`;
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StockDetailPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [allRows, setAllRows] = useState<StockRow[]>([]);

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

      const [itemsRes, salesRes, billsRes, drRes] = await Promise.all([
        fetch(`${API_BASE}/items?type=product&${cid}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/sales?type=INVOICE&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=BILL&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=DEBIT_NOTE&${cid}&${dateQs}`, { headers: getHeaders() }),
      ]);

      const toArr = async (r: Response) => {
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : d.data ?? [];
      };

      const [items, sales, bills, drNotes] = await Promise.all([
        toArr(itemsRes), toArr(salesRes), toArr(billsRes), toArr(drRes),
      ]);

      // Build base map from items/products
      const map = new Map<string, StockRow>();
      for (const item of items) {
        if (!item.product) continue;
        const name = (item.name || "").trim();
        map.set(name, {
          itemName: name,
          category: item.product.category || "",
          beginningQty: item.product.openingQuantity ?? 0,
          qtyIn: 0,
          purchaseAmount: 0,
          qtyOut: 0,
          saleAmount: 0,
          closingQty: item.product.currentQuantity ?? 0,
        });
      }

      // Helper to ensure unknown items get a row
      const ensureRow = (name: string) => {
        if (!map.has(name)) {
          map.set(name, {
            itemName: name, category: "", beginningQty: 0, qtyIn: 0,
            purchaseAmount: 0, qtyOut: 0, saleAmount: 0, closingQty: 0,
          });
        }
        return map.get(name)!;
      };

      // Purchase bills → Qty In, Purchase Amount
      for (const doc of bills) {
        if (doc.status === "Cancelled") continue;
        for (const item of (doc.items || [])) {
          const row = ensureRow((item.name || "Unknown").trim());
          row.qtyIn += item.quantity ?? 0;
          row.purchaseAmount += item.amount ?? 0;
        }
      }

      // Debit notes → subtract from Purchase Amount (returns)
      for (const doc of drNotes) {
        if (doc.status === "Cancelled") continue;
        for (const item of (doc.items || [])) {
          const row = ensureRow((item.name || "Unknown").trim());
          row.purchaseAmount -= item.amount ?? 0;
        }
      }

      // Sale invoices → Qty Out, Sale Amount
      for (const doc of sales) {
        if (doc.status === "Cancelled") continue;
        for (const item of (doc.items || [])) {
          const row = ensureRow((item.name || "Unknown").trim());
          row.qtyOut += item.quantity ?? 0;
          row.saleAmount += item.amount ?? 0;
        }
      }

      setAllRows(Array.from(map.values()).sort((a, b) => a.itemName.localeCompare(b.itemName)));
    } catch (err) {
      console.error("Stock detail fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Categories ────────────────────────────────────────────────────────────────

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(allRows.map(r => r.category).filter(Boolean)))],
    [allRows]
  );

  // ── Filtered rows ────────────────────────────────────────────────────────────

  const rows = useMemo(
    () =>
      selectedCategory === "all"
        ? allRows
        : allRows.filter(r => r.category === selectedCategory),
    [allRows, selectedCategory]
  );

  // ── Totals ────────────────────────────────────────────────────────────────────

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          beginningQty: acc.beginningQty + r.beginningQty,
          qtyIn: acc.qtyIn + r.qtyIn,
          purchaseAmount: acc.purchaseAmount + r.purchaseAmount,
          qtyOut: acc.qtyOut + r.qtyOut,
          saleAmount: acc.saleAmount + r.saleAmount,
          closingQty: acc.closingQty + r.closingQty,
        }),
        { beginningQty: 0, qtyIn: 0, purchaseAmount: 0, qtyOut: 0, saleAmount: 0, closingQty: 0 }
      ),
    [rows]
  );

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const data = rows.map(r => ({
      "Item Name": r.itemName,
      "Beginning Quantity": r.beginningQty,
      "Quantity In": r.qtyIn,
      "Purchase Amount": r.purchaseAmount,
      "Quantity Out": r.qtyOut,
      "Sale Amount": r.saleAmount,
      "Closing Quantity": r.closingQty,
    }));
    data.push({
      "Item Name": "Total",
      "Beginning Quantity": totals.beginningQty,
      "Quantity In": totals.qtyIn,
      "Purchase Amount": totals.purchaseAmount,
      "Quantity Out": totals.qtyOut,
      "Sale Amount": totals.saleAmount,
      "Closing Quantity": totals.closingQty,
    });
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "StockDetail");
    xlsx.writeFile(wb, `StockDetail_${format(fromDate!, "MMM-yyyy")}.xlsx`);
  };

  // ── Qty color helper ──────────────────────────────────────────────────────────

  const qtyClass = (n: number) =>
    n < 0 ? "text-red-500" : n > 0 ? "text-teal-600" : "text-gray-400";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={handleExportExcel} title="Export Excel">
            <FileSpreadsheet className="h-4 w-4 text-teal-600" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => window.print()} title="Print">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 py-4 gap-3">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">DETAILS</h2>

        {/* Sub-filters */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-medium">Filter by Item Category</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-44 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="all-godown">
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-godown">All Godown</SelectItem>
            </SelectContent>
          </Select>
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
                <tr className="border-b border-t border-gray-200 bg-white">
                  <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-600 w-[200px]">Item Name</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">Begining Quantity</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">Quantity In</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">Purchase Amount</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">Quantity Out</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">Sale Amount</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-600">Closing Quantity</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                      No data for the selected period.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr
                      key={row.itemName}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}
                    >
                      <td className="py-2.5 px-3 text-gray-800 text-sm break-words max-w-[200px]">
                        {row.itemName}
                      </td>
                      {/* Beginning Qty */}
                      <td className={`py-2.5 px-3 text-right text-sm ${qtyClass(row.beginningQty)}`}>
                        {row.beginningQty}
                      </td>
                      {/* Qty In */}
                      <td className={`py-2.5 px-3 text-right text-sm ${qtyClass(row.qtyIn)}`}>
                        {row.qtyIn}
                      </td>
                      {/* Purchase Amount */}
                      <td className={`py-2.5 px-3 text-right text-sm ${row.purchaseAmount < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {fmtAmt(row.purchaseAmount)}
                      </td>
                      {/* Qty Out */}
                      <td className={`py-2.5 px-3 text-right text-sm ${qtyClass(row.qtyOut)}`}>
                        {row.qtyOut}
                      </td>
                      {/* Sale Amount */}
                      <td className="py-2.5 px-3 text-right text-sm text-gray-700">
                        ₹ {n2(row.saleAmount)}
                      </td>
                      {/* Closing Qty */}
                      <td className={`py-2.5 px-3 text-right text-sm ${qtyClass(row.closingQty)}`}>
                        {row.closingQty}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {!loading && rows.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gray-200 font-semibold text-sm">
                    <td className="py-3 px-3 text-gray-800">Total</td>
                    <td className={`py-3 px-3 text-right ${qtyClass(totals.beginningQty)}`}>
                      {totals.beginningQty}
                    </td>
                    <td className={`py-3 px-3 text-right ${qtyClass(totals.qtyIn)}`}>
                      {totals.qtyIn}
                    </td>
                    <td className={`py-3 px-3 text-right ${totals.purchaseAmount < 0 ? "text-red-500" : "text-gray-800"}`}>
                      {fmtAmt(totals.purchaseAmount)}
                    </td>
                    <td className={`py-3 px-3 text-right ${qtyClass(totals.qtyOut)}`}>
                      {totals.qtyOut}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-800">
                      ₹ {n2(totals.saleAmount)}
                    </td>
                    <td className={`py-3 px-3 text-right ${qtyClass(totals.closingQty)}`}>
                      {totals.closingQty}
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
