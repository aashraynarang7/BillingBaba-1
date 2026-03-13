"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Printer, Search, Filter, FileSpreadsheet,
  Calendar as CalendarIcon, Share2, MoreVertical, Loader2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type CashTx = {
  _id: string;
  date: Date;
  refNo: string;
  name: string;
  category: string;
  txType: string;
  cashIn: number;
  cashOut: number;
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

const fmtDate = (d: Date) => {
  try { return format(d, "dd/MM/yyyy, HH:mm..."); } catch { return "—"; }
};

// ── Transform helpers ─────────────────────────────────────────────────────────

const toArr = (d: any) => (Array.isArray(d) ? d : d?.data ?? []);

function mapSales(docs: any[]): CashTx[] {
  return docs
    .filter(d => d.status !== "Cancelled")
    .map(d => ({
      _id: d._id,
      date: new Date(d.invoiceDate || d.createdAt),
      refNo: d.invoiceNumber || "",
      name: d.partyName || d.partyId?.name || "Cash Sale",
      category: "",
      txType: "Sale",
      cashIn: d.receivedAmount ?? (d.paymentType === "Cash" ? d.grandTotal ?? 0 : 0),
      cashOut: 0,
    }));
}

function mapPaymentIn(docs: any[]): CashTx[] {
  return docs.map(d => ({
    _id: d._id,
    date: new Date(d.date || d.createdAt),
    refNo: d.receiptNo || "",
    name: d.partyId?.name || d.partyName || "",
    category: "",
    txType: "Payment-In",
    cashIn: d.amount ?? 0,
    cashOut: 0,
  }));
}

function mapDebitNotes(docs: any[]): CashTx[] {
  return docs
    .filter(d => d.status !== "Cancelled")
    .map(d => ({
      _id: d._id,
      date: new Date(d.debitNoteDate || d.createdAt),
      refNo: d.returnNo || "",
      name: d.partyName || d.partyId?.name || "",
      category: "",
      txType: "Debit Note",
      cashIn: d.receivedAmount ?? (d.paymentType === "Cash" ? d.grandTotal ?? 0 : 0),
      cashOut: 0,
    }));
}

function mapBills(docs: any[]): CashTx[] {
  return docs
    .filter(d => d.status !== "Cancelled" && d.paymentType === "Cash")
    .map(d => ({
      _id: d._id,
      date: new Date(d.invoiceDate || d.billDate || d.createdAt),
      refNo: d.invoiceNumber || d.billNumber || "",
      name: d.partyName || d.partyId?.name || "",
      category: "",
      txType: "Purchase",
      cashIn: 0,
      cashOut: d.grandTotal ?? 0,
    }));
}

function mapPaymentOut(docs: any[]): CashTx[] {
  return docs.map(d => ({
    _id: d._id,
    date: new Date(d.date || d.createdAt),
    refNo: d.receiptNo || d.voucherNo || "",
    name: d.partyId?.name || d.partyName || "",
    category: "",
    txType: "Payment-Out",
    cashIn: 0,
    cashOut: d.amount ?? 0,
  }));
}

function mapExpenses(docs: any[]): CashTx[] {
  return docs
    .filter(d => d.status !== "Cancelled")
    .map(d => ({
      _id: d._id,
      date: new Date(d.invoiceDate || d.createdAt),
      refNo: "",
      name: d.partyName || "",
      category: d.category || "",
      txType: "Expense",
      cashIn: 0,
      cashOut: d.grandTotal ?? 0,
    }));
}

// ── TH Cell ───────────────────────────────────────────────────────────────────

const TH = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1 p-2.5 text-xs font-bold text-gray-500 uppercase border-r last:border-r-0">
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer flex-shrink-0" />
  </div>
);

const GRID = "grid grid-cols-[1.6fr_0.8fr_1.8fr_1.2fr_1fr_1fr_1fr_1.4fr_0.9fr]";

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CashFlowPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [period, setPeriod] = useState("this-month");
  const [searchTerm, setSearchTerm] = useState("");
  const [showZero, setShowZero] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txs, setTxs] = useState<CashTx[]>([]);
  const [openingCash, setOpeningCash] = useState(0);

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  // ── Fetch a time-range of transactions ────────────────────────────────────────

  const fetchPeriod = useCallback(async (start: Date, end: Date, cid: string): Promise<CashTx[]> => {
    const s = start.toISOString();
    const e = end.toISOString();
    const qs = `companyId=${cid}&startDate=${s}&endDate=${e}`;

    const [salesR, piR, drR, billsR, poR, expR] = await Promise.all([
      fetch(`${API_BASE}/sales?type=INVOICE&${qs}`, { headers: getHeaders() }),
      fetch(`${API_BASE}/payment-in?${qs}`, { headers: getHeaders() }),
      fetch(`${API_BASE}/purchases?type=DEBIT_NOTE&${qs}`, { headers: getHeaders() }),
      fetch(`${API_BASE}/purchases?type=BILL&${qs}`, { headers: getHeaders() }),
      fetch(`${API_BASE}/payment-out?${qs}`, { headers: getHeaders() }),
      fetch(`${API_BASE}/purchases?type=EXPENSE&${qs}`, { headers: getHeaders() }),
    ]);

    const [sales, pi, dr, bills, po, exp] = await Promise.all([
      salesR.ok ? salesR.json().then(toArr) : [],
      piR.ok ? piR.json().then(toArr) : [],
      drR.ok ? drR.json().then(toArr) : [],
      billsR.ok ? billsR.json().then(toArr) : [],
      poR.ok ? poR.json().then(toArr) : [],
      expR.ok ? expR.json().then(toArr) : [],
    ]);

    return [
      ...mapSales(sales),
      ...mapPaymentIn(pi),
      ...mapDebitNotes(dr),
      ...mapBills(bills),
      ...mapPaymentOut(po),
      ...mapExpenses(exp),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, []);

  // ── Main data fetch ───────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!fromDate || !toDate || !companyId) return;
    setLoading(true);
    try {
      const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
      const end = new Date(toDate); end.setHours(23, 59, 59, 999);

      // Opening balance = all tx from epoch up to day before period starts
      const epoch = new Date("2000-01-01");
      const dayBefore = new Date(start);
      dayBefore.setDate(dayBefore.getDate() - 1);
      dayBefore.setHours(23, 59, 59, 999);

      const [periodTxs, priorTxs] = await Promise.all([
        fetchPeriod(start, end, companyId),
        fetchPeriod(epoch, dayBefore, companyId),
      ]);

      const opening = priorTxs.reduce((acc, t) => acc + t.cashIn - t.cashOut, 0);
      setOpeningCash(opening);
      setTxs(periodTxs);
    } catch (err) {
      console.error("Cash flow fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId, fetchPeriod]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  // ── Filtered ──────────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let data = txs;
    if (!showZero) data = data.filter(t => t.cashIn > 0 || t.cashOut > 0);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.txType.toLowerCase().includes(q) ||
          t.refNo.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return data;
  }, [txs, showZero, searchTerm]);

  // ── Totals ────────────────────────────────────────────────────────────────────

  const totalCashIn = useMemo(() => filtered.reduce((s, t) => s + t.cashIn, 0), [filtered]);
  const totalCashOut = useMemo(() => filtered.reduce((s, t) => s + t.cashOut, 0), [filtered]);
  const closingCash = openingCash + totalCashIn - totalCashOut;

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    let running = openingCash;
    const data = filtered.map(t => {
      running += t.cashIn - t.cashOut;
      return {
        Date: fmtDate(t.date),
        "Ref No.": t.refNo,
        Name: t.name,
        Category: t.category,
        Type: t.txType,
        "Cash In": t.cashIn || "",
        "Cash Out": t.cashOut || "",
        "Running Balance": running,
      };
    });
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "CashFlow");
    xlsx.writeFile(wb, `CashFlow_${fromDate ? format(fromDate, "MMM-yyyy") : "export"}.xlsx`);
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  let runningBalance = openingCash;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Top bar ── */}
      <header className="flex justify-between items-center px-4 py-3 border-b gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={period} onValueChange={handlePeriod}>
            <SelectTrigger className="w-44 h-9 font-semibold text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md h-9 px-1 gap-0.5 bg-white">
            <span className="text-xs text-white font-semibold bg-gray-500 px-2 py-1 rounded-sm mx-1">
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
            <span className="text-sm text-gray-500 px-1">To</span>
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

          <Select defaultValue="all">
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL FIRMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
            onClick={handleExportExcel}
          >
            <FileSpreadsheet className="w-6 h-6 text-blue-700" />
            <span>Excel Report</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
            onClick={() => window.print()}
          >
            <Printer className="w-6 h-6 text-gray-700" />
            <span>Print</span>
          </Button>
        </div>
      </header>

      {/* ── Opening cash + zero toggle ── */}
      <div className="flex items-center gap-6 px-4 py-2 border-b">
        <p className="text-sm">
          Opening Cash-in Hand:{" "}
          <span className={`font-semibold ${openingCash < 0 ? "text-red-500" : "text-teal-600"}`}>
            {openingCash < 0 ? "- " : ""}₹ {n2(Math.abs(openingCash))}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Checkbox id="show-zero" checked={showZero} onCheckedChange={v => setShowZero(Boolean(v))} />
          <Label htmlFor="show-zero" className="text-sm font-normal text-gray-600 cursor-pointer">
            Show zero amount transaction
          </Label>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="flex-1 flex flex-col overflow-hidden border rounded-lg m-4">
        {/* Search */}
        <div className="p-2 border-b relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder=""
            className="pl-9 h-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Column headers */}
        <div className={`${GRID} border-b bg-gray-50 shrink-0`}>
          <TH>Date</TH>
          <TH>Ref No.</TH>
          <TH>Name</TH>
          <TH>Category</TH>
          <TH>Type</TH>
          <TH>Cash In</TH>
          <TH>Cash Out</TH>
          <TH>Running ...</TH>
          <TH>Print / S...</TH>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400 text-sm">No transactions to show</p>
            </div>
          ) : (
            filtered.map(tx => {
              runningBalance = runningBalance + tx.cashIn - tx.cashOut;
              const isNeg = runningBalance < 0;
              return (
                <div key={tx._id} className={`${GRID} border-b text-sm items-center hover:bg-slate-50 cursor-pointer`}>
                  <div className="p-2.5 text-gray-600 text-xs truncate">{fmtDate(tx.date)}</div>
                  <div className="p-2.5 text-gray-500 text-xs">{tx.refNo}</div>
                  <div className="p-2.5 font-medium text-gray-800 text-xs truncate">{tx.name}</div>
                  <div className="p-2.5 text-gray-500 text-xs truncate">{tx.category}</div>
                  <div className="p-2.5 text-gray-700 text-xs font-medium">{tx.txType}</div>
                  <div className="p-2.5 text-xs text-gray-800">
                    {tx.cashIn > 0 ? `₹ ${n2(tx.cashIn)}` : ""}
                  </div>
                  <div className="p-2.5 text-xs text-gray-800">
                    {tx.cashOut > 0 ? `₹ ${n2(tx.cashOut)}` : ""}
                  </div>
                  <div className={`p-2.5 text-xs font-semibold ${isNeg ? "text-red-500" : "text-gray-800"}`}>
                    {isNeg ? `- ₹ ${n2(Math.abs(runningBalance))}` : `₹ ${n2(runningBalance)}`}
                  </div>
                  <div className="p-2.5 flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <Printer className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <Share2 className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer totals ── */}
      <footer className="grid grid-cols-3 px-4 py-3 border-t bg-white font-semibold text-sm shrink-0">
        <div className="text-teal-600">Total Cash-in: ₹ {n2(totalCashIn)}</div>
        <div className="text-red-500 text-center">Total Cash-out: ₹ {n2(totalCashOut)}</div>
        <div className={`text-right ${closingCash < 0 ? "text-red-500" : "text-teal-600"}`}>
          Closing Cash-in Hand:{closingCash < 0 ? " - " : " "}₹ {n2(Math.abs(closingCash))}
        </div>
      </footer>
    </div>
  );
}
