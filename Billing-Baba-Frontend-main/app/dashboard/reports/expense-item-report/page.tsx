"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Printer, FileSpreadsheet, Plus } from "lucide-react";
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

interface ItemRow {
  name: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export default function ExpenseItemReportPage() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemRows, setItemRows] = useState<ItemRow[]>([]);
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
      if (!res.ok) return;
      const data = await res.json();
      const expenseList = Array.isArray(data) ? data : (data.data || data.purchases || []);

      // Aggregate by item name
      const grouped: Record<string, { quantity: number; amount: number; unitPrice: number }> = {};
      expenseList.forEach((expense: any) => {
        if (expense.documentType && expense.documentType !== "EXPENSE") return;
        const items = Array.isArray(expense.items) ? expense.items : [];
        items.forEach((item: any) => {
          const name = item.name || item.itemName || "Unknown Item";
          if (!grouped[name]) {
            grouped[name] = { quantity: 0, amount: 0, unitPrice: 0 };
          }
          grouped[name].quantity += Number(item.quantity) || 0;
          grouped[name].amount += Number(item.amount) || 0;
          // Use latest unit price
          if (item.priceUnit?.amount || item.unitPrice) {
            grouped[name].unitPrice = Number(item.priceUnit?.amount || item.unitPrice) || 0;
          }
        });
      });

      const rows: ItemRow[] = Object.entries(grouped).map(([name, vals]) => ({
        name,
        unitPrice: vals.unitPrice,
        quantity: vals.quantity,
        amount: vals.amount,
      }));

      rows.sort((a, b) => b.amount - a.amount);
      setItemRows(rows);
    } catch (err) {
      console.error("Failed to load expense items", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return itemRows;
    const lower = searchTerm.toLowerCase();
    return itemRows.filter((r) => r.name.toLowerCase().includes(lower));
  }, [itemRows, searchTerm]);

  const totals = useMemo(() => {
    const totalQty = filtered.reduce((sum, r) => sum + r.quantity, 0);
    const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);
    return { totalQty, totalAmount };
  }, [filtered]);

  const handlePrint = () => window.print();

  const handleExcel = async () => {
    const xlsx = await import("xlsx");
    const rows = filtered.map((r) => ({
      "Expense Item": r.name,
      "Unit Price": r.unitPrice,
      Quantity: r.quantity,
      Amount: r.amount,
    }));
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Expense Item Report");
    xlsx.writeFile(wb, "expense-item-report.xlsx");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-800">Expense Item Report</h1>
        <div className="flex items-center gap-2">
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
        <Input
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-52 h-8 text-sm"
        />
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">EXPENSE ITEM</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">UNIT PRICE</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">QUANTITY</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    No expense items found for the selected period.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {row.unitPrice > 0
                        ? `₹${row.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">{row.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-800">
                      ₹{row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-700">
        <span>
          Total Quantity: <span className="text-gray-900">{totals.totalQty}</span>
        </span>
        <span>
          Total Amount:{" "}
          <span className="text-gray-900 font-semibold">
            ₹{totals.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </span>
      </div>
    </div>
  );
}
