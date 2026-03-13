"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Printer, Search, Filter, FileSpreadsheet,
  Calendar as CalendarIcon, Loader2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SaleDoc = {
  _id: string;
  partyName: string;
  grandTotal: number;
  status: string;
  items: { name: string; quantity: number; priceUnit?: { amount: number }; amount: number }[];
};

type ItemDoc = {
  _id: string;
  name: string;
  product?: { purchasePrice?: { amount: number } };
};

type PartyRow = {
  partyName: string;
  phone: string;
  totalSale: number;
  profit: number;
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

// ── TH helper ─────────────────────────────────────────────────────────────────

const TH = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center gap-1 p-3 text-xs font-bold text-gray-500 uppercase ${className}`}>
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer flex-shrink-0" />
  </div>
);

const GRID = "grid grid-cols-[56px_2.5fr_2fr_2fr_2fr]";

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PartyWiseProfitLossPage() {
  const now = new Date();
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(now));
  const [toDate, setToDate] = useState<Date>(endOfMonth(now));
  const [period, setPeriod] = useState("this-month");
  const [partyFilter, setPartyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<PartyRow[]>([]);
  const [loading, setLoading] = useState(false);

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const from = fromDate.toISOString().split("T")[0];
      const to = toDate.toISOString().split("T")[0];

      const [salesRes, crNoteRes, itemsRes, partiesRes] = await Promise.all([
        fetch(`${API_BASE}/sales?type=INVOICE&startDate=${from}&endDate=${to}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/sales?type=CREDIT_NOTE&startDate=${from}&endDate=${to}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/items?type=product`, { headers: getHeaders() }),
        fetch(`${API_BASE}/parties?companyId=${companyId}`, { headers: getHeaders() }),
      ]);

      const [salesData, crNoteData, itemsData, partiesData] = await Promise.all([
        salesRes.json(), crNoteRes.json(), itemsRes.json(), partiesRes.json(),
      ]);

      const sales: SaleDoc[] = (Array.isArray(salesData) ? salesData : salesData.data ?? [])
        .filter((d: any) => d.status !== "Cancelled");
      const crNotes: SaleDoc[] = (Array.isArray(crNoteData) ? crNoteData : crNoteData.data ?? [])
        .filter((d: any) => d.status !== "Cancelled");
      const items: ItemDoc[] = Array.isArray(itemsData) ? itemsData : itemsData.data ?? [];
      const parties: any[] = Array.isArray(partiesData) ? partiesData : partiesData.data ?? [];

      // Build purchase price map: itemName (lowercase) → purchasePrice
      const ppMap = new Map<string, number>();
      for (const item of items) {
        ppMap.set((item.name ?? "").toLowerCase(), item.product?.purchasePrice?.amount ?? 0);
      }

      // Build party phone map
      const phoneMap = new Map<string, string>();
      for (const p of parties) {
        phoneMap.set((p.name ?? "").toLowerCase(), p.phone || "---");
      }

      // Aggregate by partyName
      const partyMap = new Map<string, { totalSale: number; profit: number; phone: string }>();

      const addDoc = (doc: SaleDoc, sign: 1 | -1) => {
        const key = doc.partyName || "Cash Sale";
        if (!partyMap.has(key)) {
          partyMap.set(key, {
            totalSale: 0,
            profit: 0,
            phone: phoneMap.get(key.toLowerCase()) ?? "---",
          });
        }
        const entry = partyMap.get(key)!;
        entry.totalSale += sign * (doc.grandTotal ?? 0);
        for (const item of doc.items ?? []) {
          const saleLineAmount = item.amount ?? 0;
          const purchasePrice = ppMap.get((item.name ?? "").toLowerCase()) ?? 0;
          const purchaseCost = (item.quantity ?? 0) * purchasePrice;
          entry.profit += sign * (saleLineAmount - purchaseCost);
        }
      };

      for (const sale of sales) addDoc(sale, 1);
      for (const cr of crNotes) addDoc(cr, -1);

      const result: PartyRow[] = Array.from(partyMap.entries())
        .map(([name, val]) => ({
          partyName: name,
          phone: val.phone,
          totalSale: val.totalSale,
          profit: val.profit,
        }))
        .sort((a, b) => a.partyName.localeCompare(b.partyName));

      setRows(result);
    } catch (err) {
      console.error("Party-wise P&L fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [companyId, fromDate, toDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Period presets ────────────────────────────────────────────────────────────

  const handlePeriodChange = (val: string) => {
    setPeriod(val);
    const n = new Date();
    if (val === "this-month") {
      setFromDate(startOfMonth(n)); setToDate(endOfMonth(n));
    } else if (val === "last-month") {
      const last = new Date(n.getFullYear(), n.getMonth() - 1, 1);
      setFromDate(startOfMonth(last)); setToDate(endOfMonth(last));
    } else if (val === "this-year") {
      setFromDate(new Date(n.getFullYear(), 3, 1)); setToDate(n);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────────

  const uniqueParties = useMemo(() => ["all", ...rows.map(r => r.partyName)], [rows]);

  const filtered = useMemo(() => {
    let data = rows;
    if (partyFilter !== "all") data = data.filter(r => r.partyName === partyFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(r =>
        r.partyName.toLowerCase().includes(q) || r.phone.includes(q)
      );
    }
    return data;
  }, [rows, partyFilter, searchTerm]);

  const totalSale = useMemo(() => filtered.reduce((s, r) => s + r.totalSale, 0), [filtered]);
  const totalProfit = useMemo(() => filtered.reduce((s, r) => s + r.profit, 0), [filtered]);

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExport = async () => {
    const xlsx: any = await import("xlsx");
    const data = filtered.map(r => ({
      "Party Name": r.partyName,
      "Phone No.": r.phone,
      "Total Sale Amount": r.totalSale,
      "Profit(+) / Loss(-)": r.profit,
    }));
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "PartyWisePL");
    xlsx.writeFile(wb, "PartyWiseProfitLoss.xlsx");
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <main className="flex-1 p-4 flex flex-col overflow-hidden">

        {/* ── Top header ── */}
        <header className="flex justify-between items-center mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Period dropdown */}
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-44 h-9 font-semibold text-base border-0 shadow-none bg-transparent p-0 gap-1 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Date range pill */}
            <div className="flex items-center border rounded-md h-9 px-1 gap-0.5 bg-white">
              <span className="bg-gray-200 text-xs font-semibold px-2 py-1 rounded text-gray-600">Between</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                    {format(fromDate, "dd/MM/yyyy")}
                    <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={d => d && setFromDate(d)} />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-gray-400">To</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                    {format(toDate, "dd/MM/yyyy")}
                    <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={d => d && setToDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
              onClick={handleExport}
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
        </header>

        <div className="border rounded-lg flex-1 flex flex-col bg-white overflow-hidden">

          {/* ── Secondary filters + search ── */}
          <div className="flex items-center gap-3 px-4 py-2 border-b flex-wrap">
            <Select value={partyFilter} onValueChange={setPartyFilter}>
              <SelectTrigger className="w-44 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueParties.map(p => (
                  <SelectItem key={p} value={p}>{p === "all" ? "All Parties" : p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder=""
                className="pl-9 h-8 w-52"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* ── Column headers ── */}
          <div className={`${GRID} border-b bg-gray-50 shrink-0`}>
            <div className="p-3 text-xs font-bold text-gray-500 uppercase">#</div>
            <TH>Party Name</TH>
            <TH>Phone No.</TH>
            <TH className="justify-end">Total Sale Amount</TH>
            <TH className="justify-end">Profit (+) / Loss (-)</TH>
          </div>

          {/* ── Rows ── */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center gap-1">
                <p className="text-gray-500 font-medium">No data available.</p>
                <p className="text-sm text-gray-400">Try adjusting the date range or filters.</p>
              </div>
            ) : (
              filtered.map((row, idx) => (
                <div
                  key={row.partyName}
                  className={`${GRID} border-b text-sm items-center hover:bg-blue-50/30 transition-colors`}
                >
                  <div className="p-3 text-gray-400 text-xs">{idx + 1}</div>
                  <div className="p-3 font-medium text-gray-800 border-r">{row.partyName}</div>
                  <div className="p-3 text-gray-600 border-r text-xs">{row.phone}</div>
                  <div className="p-3 text-gray-700 border-r text-right text-xs">
                    ₹ {n2(row.totalSale)}
                  </div>
                  <div className={`p-3 text-right text-xs font-semibold ${row.profit >= 0 ? "text-teal-600" : "text-red-500"}`}>
                    ₹ {n2(Math.abs(row.profit))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="flex justify-between px-6 py-3 border-t bg-white font-semibold text-sm shrink-0">
        <div className="text-gray-700">
          Total Sale Amount:{" "}
          <span className="text-gray-900">₹ {n2(totalSale)}</span>
        </div>
        <div className="text-gray-700">
          Total Profit(+) / Loss (-):{" "}
          <span className={totalProfit >= 0 ? "text-teal-600" : "text-red-500"}>
            ₹ {n2(totalProfit)}
          </span>
        </div>
      </footer>
    </div>
  );
}
