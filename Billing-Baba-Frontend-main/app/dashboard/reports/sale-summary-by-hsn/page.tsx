"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Printer,
  Search,
  Filter,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type InvoiceItem = {
  invoiceNo: string;
  date: string;
  partyName: string;
  totalValue: number;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
};

type HSNRow = {
  hsn: string;
  totalValue: number;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  invoices: InvoiceItem[];
};

// ── Constants ──────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("activeCompanyId")
      : null;
  return {
    "Content-Type": "application/json",
    ...(token && { "x-auth-token": token }),
    ...(companyId && { "x-company-id": companyId }),
  };
};

const fmt = (n: number) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Data transformation ────────────────────────────────────────────────────────

function buildHsnRows(invoices: any[]): HSNRow[] {
  // Map: hsn → HSNRow accumulator
  const map = new Map<string, HSNRow>();

  for (const inv of invoices) {
    if (inv.status === "Cancelled") continue;

    const items: any[] = inv.items || [];
    if (items.length === 0) continue;

    const invoiceNo =
      inv.invoiceNumber || inv.orderNumber || inv.creditNoteNumber || "—";
    const rawDate = inv.invoiceDate || inv.createdAt;
    const date = rawDate ? format(new Date(rawDate), "dd/MM/yyyy") : "—";
    const partyName = inv.partyName || inv.partyId?.name || "—";

    // Track per-invoice HSN contributions so we don't double-count invoice-level totals
    const invHsnTotals = new Map<
      string,
      { totalValue: number; taxableValue: number; igst: number; cgst: number; sgst: number; cess: number }
    >();

    for (const item of items) {
      const hsn: string = (item.hsn || "NA").trim() || "NA";
      const itemAmount: number = item.amount ?? 0; // final amount (incl. tax)
      const taxAmount: number = item.tax?.amount ?? 0;
      const taxable = itemAmount - taxAmount;

      // intra-state split by default
      const cgst = Math.round((taxAmount / 2) * 100) / 100;
      const sgst = Math.round((taxAmount / 2) * 100) / 100;

      if (!invHsnTotals.has(hsn)) {
        invHsnTotals.set(hsn, { totalValue: 0, taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 });
      }
      const cur = invHsnTotals.get(hsn)!;
      cur.totalValue += itemAmount;
      cur.taxableValue += taxable;
      cur.cgst += cgst;
      cur.sgst += sgst;
    }

    // Merge into global map
    for (const [hsn, totals] of invHsnTotals) {
      if (!map.has(hsn)) {
        map.set(hsn, {
          hsn,
          totalValue: 0,
          taxableValue: 0,
          igst: 0,
          cgst: 0,
          sgst: 0,
          cess: 0,
          invoices: [],
        });
      }
      const row = map.get(hsn)!;
      row.totalValue += totals.totalValue;
      row.taxableValue += totals.taxableValue;
      row.igst += totals.igst;
      row.cgst += totals.cgst;
      row.sgst += totals.sgst;
      row.cess += totals.cess;
      row.invoices.push({
        invoiceNo,
        date,
        partyName,
        totalValue: totals.totalValue,
        taxableValue: totals.taxableValue,
        igst: totals.igst,
        cgst: totals.cgst,
        sgst: totals.sgst,
        cess: totals.cess,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.hsn.localeCompare(b.hsn));
}

// ── Header cell ────────────────────────────────────────────────────────────────

const TH = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-1 p-3 text-xs font-bold text-gray-500 uppercase ${className}`}
  >
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer flex-shrink-0" />
  </div>
);

// ── Column grid class ──────────────────────────────────────────────────────────
const GRID =
  "grid grid-cols-[40px_32px_1.8fr_1.5fr_1.5fr_1.2fr_1.2fr_1.2fr_1.2fr]";

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SaleSummaryByHSNPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hsnRows, setHsnRows] = useState<HSNRow[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [period, setPeriod] = useState("this-month");

  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("activeCompanyId")
      : "";

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!fromDate || !toDate || !companyId) return;
    setLoading(true);
    try {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      const res = await fetch(
        `${API_BASE}/sales?type=INVOICE&companyId=${companyId}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
        { headers: getHeaders() }
      );
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      const invoices = Array.isArray(data) ? data : data.data ?? [];
      setHsnRows(buildHsnRows(invoices));
    } catch (err) {
      console.error("HSN fetch error:", err);
      setHsnRows([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Period preset ────────────────────────────────────────────────────────────

  const handlePeriodChange = (val: string) => {
    setPeriod(val);
    const now = new Date();
    if (val === "this-month") {
      setFromDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setToDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (val === "last-month") {
      setFromDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      setToDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (val === "this-year") {
      setFromDate(new Date(now.getFullYear(), 3, 1)); // April 1
      setToDate(new Date(now.getFullYear() + 1, 2, 31)); // March 31
    }
  };

  // ── Search filter ────────────────────────────────────────────────────────────

  const filteredRows = useMemo(
    () =>
      hsnRows.filter((r) =>
        r.hsn.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [hsnRows, searchTerm]
  );

  // ── Totals ───────────────────────────────────────────────────────────────────

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, r) => ({
          totalValue: acc.totalValue + r.totalValue,
          taxableValue: acc.taxableValue + r.taxableValue,
          igst: acc.igst + r.igst,
          cgst: acc.cgst + r.cgst,
          sgst: acc.sgst + r.sgst,
          cess: acc.cess + r.cess,
        }),
        { totalValue: 0, taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 }
      ),
    [filteredRows]
  );

  // ── Toggle expand ─────────────────────────────────────────────────────────────

  const toggleExpand = (hsn: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(hsn) ? next.delete(hsn) : next.add(hsn);
      return next;
    });
  };

  // ── Export Excel ──────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const rows = filteredRows.map((r) => ({
      HSN: r.hsn,
      "Total Value": r.totalValue,
      "Taxable Value": r.taxableValue,
      "IGST Amount": r.igst,
      "CGST Amount": r.cgst,
      "SGST Amount": r.sgst,
      "Additional Cess": r.cess,
    }));
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "HSN_Summary");
    xlsx.writeFile(
      wb,
      `SaleSummaryByHSN_${fromDate ? format(fromDate, "MMM-yyyy") : "export"}.xlsx`
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {/* ── Header / Filters ── */}
        <header className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Period selector */}
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-44 h-10 font-semibold text-base bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Date range */}
            <div className="flex items-center border rounded-md bg-white h-10 px-1 gap-1">
              <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded-sm">
                Between
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto px-2 py-1 text-sm font-normal"
                  >
                    <CalendarIcon className="mr-1 h-3.5 w-3.5 text-gray-500" />
                    {fromDate ? format(fromDate, "dd/MM/yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(d) => { setFromDate(d); setPeriod("custom"); }}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-gray-500">To</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto px-2 py-1 text-sm font-normal"
                  >
                    <CalendarIcon className="mr-1 h-3.5 w-3.5 text-gray-500" />
                    {toDate ? format(toDate, "dd/MM/yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(d) => { setToDate(d); setPeriod("custom"); }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-9 h-9 bg-white"
              onClick={handleExportExcel}
              title="Export Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-9 h-9 bg-white"
              onClick={() => window.print()}
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* ── Table card ── */}
        <div className="border rounded-lg flex flex-col bg-white flex-1 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by HSN..."
              className="pl-9 max-w-xs h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Column headers */}
          <div className={`${GRID} border-b bg-gray-50`}>
            {/* expand toggle col */}
            <div />
            {/* # */}
            <TH className="justify-center">#</TH>
            <TH>HSN</TH>
            <TH className="justify-end">Total Value</TH>
            <TH className="justify-end">Taxable Value</TH>
            <TH className="justify-end">IGST Amount</TH>
            <TH className="justify-end">CGST Amount</TH>
            <TH className="justify-end">SGST Amount</TH>
            <TH className="justify-end">Add. Cess</TH>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
                <p className="text-gray-500 font-medium">
                  No data available for Sale Summary by HSN.
                </p>
                <p className="text-sm text-gray-400">
                  Create sale invoices with items that have HSN codes assigned.
                </p>
              </div>
            ) : (
              filteredRows.map((row, idx) => {
                const isOpen = expanded.has(row.hsn);
                return (
                  <React.Fragment key={row.hsn}>
                    {/* HSN summary row */}
                    <div
                      className={`${GRID} border-b text-sm items-center cursor-pointer hover:bg-slate-50 transition-colors ${isOpen ? "bg-blue-50/40" : ""}`}
                      onClick={() => toggleExpand(row.hsn)}
                    >
                      {/* Expand chevron */}
                      <div className="flex items-center justify-center p-3 text-gray-400">
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                      {/* # */}
                      <div className="p-3 text-center text-gray-400 text-xs">
                        {idx + 1}
                      </div>
                      {/* HSN */}
                      <div className="p-3 font-medium text-gray-800 border-r">
                        {row.hsn}
                      </div>
                      {/* Total Value */}
                      <div className="p-3 text-right text-gray-700 border-r">
                        ₹{fmt(row.totalValue)}
                      </div>
                      {/* Taxable Value */}
                      <div className="p-3 text-right text-gray-700 border-r">
                        ₹{fmt(row.taxableValue)}
                      </div>
                      {/* IGST */}
                      <div className="p-3 text-right text-gray-500 border-r">
                        {row.igst > 0 ? `₹${fmt(row.igst)}` : "---"}
                      </div>
                      {/* CGST */}
                      <div className="p-3 text-right text-gray-700 border-r">
                        {row.cgst > 0 ? `₹${fmt(row.cgst)}` : "---"}
                      </div>
                      {/* SGST */}
                      <div className="p-3 text-right text-gray-700 border-r">
                        {row.sgst > 0 ? `₹${fmt(row.sgst)}` : "---"}
                      </div>
                      {/* Cess */}
                      <div className="p-3 text-right text-gray-500">
                        {row.cess > 0 ? `₹${fmt(row.cess)}` : "---"}
                      </div>
                    </div>

                    {/* Expanded child invoices */}
                    {isOpen &&
                      row.invoices.map((inv, i) => (
                        <div
                          key={`${row.hsn}-${i}`}
                          className={`${GRID} border-b text-xs items-center bg-blue-50/20 hover:bg-blue-50/40`}
                        >
                          {/* indent */}
                          <div />
                          <div className="p-2 text-center text-gray-300">
                            {i + 1}
                          </div>
                          {/* Invoice info */}
                          <div className="p-2 pl-4 text-gray-600 border-r">
                            <span className="font-medium">{inv.invoiceNo}</span>
                            <span className="text-gray-400 ml-2">{inv.date}</span>
                            <div className="text-gray-400 truncate">{inv.partyName}</div>
                          </div>
                          <div className="p-2 text-right text-gray-600 border-r">
                            ₹{fmt(inv.totalValue)}
                          </div>
                          <div className="p-2 text-right text-gray-600 border-r">
                            ₹{fmt(inv.taxableValue)}
                          </div>
                          <div className="p-2 text-right text-gray-400 border-r">
                            {inv.igst > 0 ? `₹${fmt(inv.igst)}` : "---"}
                          </div>
                          <div className="p-2 text-right text-gray-600 border-r">
                            {inv.cgst > 0 ? `₹${fmt(inv.cgst)}` : "---"}
                          </div>
                          <div className="p-2 text-right text-gray-600 border-r">
                            {inv.sgst > 0 ? `₹${fmt(inv.sgst)}` : "---"}
                          </div>
                          <div className="p-2 text-right text-gray-400">
                            {inv.cess > 0 ? `₹${fmt(inv.cess)}` : "---"}
                          </div>
                        </div>
                      ))}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="flex justify-between px-6 py-3 border-t bg-white font-semibold text-sm">
        <div className="text-gray-700">
          Total Value:{" "}
          <span className="text-teal-600">₹{fmt(totals.totalValue)}</span>
        </div>
        <div className="text-gray-700">
          Total Items:{" "}
          <span className="text-gray-900">{filteredRows.length}</span>
        </div>
      </footer>
    </div>
  );
}
