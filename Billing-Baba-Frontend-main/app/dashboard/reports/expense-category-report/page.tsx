"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Printer, FileSpreadsheet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface CategoryDef {
  _id: string;
  name: string;
  expenseType?: string;
}

interface CategoryRow {
  category: string;
  categoryType: string;
  amount: number;
}

export default function ExpenseCategoryReportPage() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);

  const loadData = useCallback(async () => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
    if (!companyId) return;
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        fetch(
          `${API_BASE}/purchases?type=EXPENSE&companyId=${companyId}&startDate=${format(fromDate, "yyyy-MM-dd")}&endDate=${format(toDate, "yyyy-MM-dd")}`,
          { headers: getHeaders() }
        ),
        fetch(`${API_BASE}/expense-categories?companyId=${companyId}`, { headers: getHeaders() }),
      ]);

      const expenses = expRes.ok ? await expRes.json() : [];
      const categories: CategoryDef[] = catRes.ok ? await catRes.json() : [];

      const expenseList = Array.isArray(expenses) ? expenses : (expenses.data || expenses.purchases || []);

      // Build a map from category name -> expenseType
      const catMap: Record<string, string> = {};
      categories.forEach((c) => {
        catMap[c.name] = c.expenseType || "-";
      });

      // Group by expenseCategory
      const grouped: Record<string, number> = {};
      expenseList.forEach((e: any) => {
        if (e.documentType && e.documentType !== "EXPENSE") return;
        const cat = e.expenseCategory || "Uncategorized";
        grouped[cat] = (grouped[cat] || 0) + (Number(e.grandTotal) || 0);
      });

      const rows: CategoryRow[] = Object.entries(grouped).map(([cat, amount]) => ({
        category: cat,
        categoryType: catMap[cat] || "-",
        amount,
      }));

      rows.sort((a, b) => b.amount - a.amount);
      setCategoryRows(rows);
    } catch (err) {
      console.error("Failed to load expense categories", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalExpense = useMemo(
    () => categoryRows.reduce((sum, r) => sum + r.amount, 0),
    [categoryRows]
  );

  const handlePrint = () => window.print();

  const handleExcel = async () => {
    const xlsx = await import("xlsx");
    const rows = categoryRows.map((r) => ({
      "Expense Category": r.category,
      "Category Type": r.categoryType,
      Amount: r.amount,
    }));
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Expense Category Report");
    xlsx.writeFile(wb, "expense-category-report.xlsx");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-800">Expense Category Report</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExcel} className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-gray-50 flex-wrap">
        <span className="text-sm text-gray-600 font-medium">From</span>

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
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Expense</h2>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">EXPENSE CATEGORY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">CATEGORY TYPE</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    No expense records found for the selected period.
                  </td>
                </tr>
              ) : (
                categoryRows.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.category}</td>
                    <td className="px-4 py-3 text-gray-600">{row.categoryType}</td>
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
      <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-end text-sm">
        <span className="font-medium text-orange-600">
          Total Expense:{" "}
          <span className="font-bold">
            ₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </span>
      </div>
    </div>
  );
}
