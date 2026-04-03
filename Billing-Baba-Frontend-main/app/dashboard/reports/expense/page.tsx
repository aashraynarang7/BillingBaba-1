"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Printer, FileSpreadsheet, Share2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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

interface Expense {
  _id: string;
  invoiceNo?: string;
  partyName?: string;
  expenseCategory?: string;
  paymentType?: string;
  grandTotal?: number;
  balanceDue?: number;
  dueDate?: string;
  status?: string;
  billDate?: string;
  documentType?: string;
}

const statusColor = (status?: string) => {
  switch (status) {
    case "Paid": return "text-green-600";
    case "Unpaid": return "text-red-600";
    case "Partial": return "text-orange-500";
    case "Overdue": return "text-red-700";
    case "Cancelled": return "text-gray-400";
    default: return "text-gray-600";
  }
};

export default function ExpenseReportPage() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<Expense[]>([]);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const loadData = useCallback(async () => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
    if (!companyId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: "EXPENSE",
        companyId,
        startDate: format(fromDate, "yyyy-MM-dd"),
        endDate: format(toDate, "yyyy-MM-dd"),
      });
      const res = await fetch(`${API_BASE}/purchases?${params}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        const expenses = Array.isArray(data) ? data : (data.data || data.purchases || []);
        setAllData(expenses.filter((e: Expense) => e.documentType === "EXPENSE" || !e.documentType));
      }
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return allData;
    const lower = searchTerm.toLowerCase();
    return allData.filter(
      (e) =>
        e.partyName?.toLowerCase().includes(lower) ||
        e.invoiceNo?.toLowerCase().includes(lower) ||
        e.expenseCategory?.toLowerCase().includes(lower)
    );
  }, [allData, searchTerm]);

  const totalAmount = useMemo(
    () => filtered.reduce((sum, e) => sum + (Number(e.grandTotal) || 0), 0),
    [filtered]
  );

  const handlePrint = () => window.print();

  const handleExcel = async () => {
    const xlsx = await import("xlsx");
    const rows = filtered.map((e) => ({
      Date: e.billDate ? format(new Date(e.billDate), "dd/MM/yyyy") : "-",
      "Exp No": e.invoiceNo || "-",
      Party: e.partyName || "-",
      Category: e.expenseCategory || "-",
      "Payment Type": e.paymentType || "-",
      Amount: Number(e.grandTotal) || 0,
      "Balance Due": Number(e.balanceDue) || 0,
      "Due Date": e.dueDate ? format(new Date(e.dueDate), "dd/MM/yyyy") : "-",
      Status: e.status || "-",
    }));
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Expense Report");
    xlsx.writeFile(wb, "expense-report.xlsx");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-800">Expense</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-blue-600 border-blue-300">
            <Share2 className="h-4 w-4" />
            Share With Accountant
          </Button>
          <Button variant="outline" size="sm" onClick={handleExcel} className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel Report
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-gray-50 flex-wrap">
        <span className="text-sm text-gray-600 font-medium">Between</span>

        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              {format(fromDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(d) => { if (d) { setFromDate(d); setFromOpen(false); } }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-sm text-gray-500">to</span>

        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              {format(toDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(d) => { if (d) { setToDate(d); setToOpen(false); } }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Transactions</h2>
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-52 h-8 text-sm"
          />
        </div>
        <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-medium text-gray-600">DATE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">EXP NO</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">PARTY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">CATEGORY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">PAYMENT TYPE</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">AMOUNT</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">BALANCE DUE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">DUE DATE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No expense records found for the selected period.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">
                      {e.billDate ? format(new Date(e.billDate), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{e.invoiceNo || "-"}</td>
                    <td className="px-4 py-3 text-gray-800">{e.partyName || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{e.expenseCategory || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{e.paymentType || "-"}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      ₹{(Number(e.grandTotal) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ₹{(Number(e.balanceDue) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {e.dueDate ? format(new Date(e.dueDate), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className={`px-4 py-3 font-medium ${statusColor(e.status)}`}>
                      {e.status || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-end text-sm font-medium text-gray-700">
        <span>
          Total Amount:{" "}
          <span className="text-gray-900 font-semibold">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </span>
      </div>
    </div>
  );
}
