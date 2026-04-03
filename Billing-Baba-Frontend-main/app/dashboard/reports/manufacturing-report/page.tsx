"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Printer, FileSpreadsheet } from "lucide-react";
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

export default function ManufacturingReportPage() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const loadData = useCallback(async () => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
    if (!companyId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyId,
        startDate: format(fromDate, "yyyy-MM-dd"),
        endDate: format(toDate, "yyyy-MM-dd"),
      });
      const res = await fetch(`${API_BASE}/job-work?${params}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAllData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load manufacturing data", err);
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
    return allData.filter((row) =>
      row.finishedGood?.name?.toLowerCase().includes(lower)
    );
  }, [allData, searchTerm]);

  const totals = useMemo(() => {
    const totalQty = filtered.reduce((sum, row) => sum + (Number(row.finishedGood?.quantity) || 0), 0);
    const totalAmount = filtered.reduce((sum, row) => sum + (Number(row.grandTotal) || 0), 0);
    return { totalQty, totalAmount };
  }, [filtered]);

  const handlePrint = () => window.print();

  const handleExcel = async () => {
    const xlsx = await import("xlsx");
    const rows = filtered.map((row, i) => ({
      "#": i + 1,
      "Item Name": row.finishedGood?.name || "-",
      Date: row.invoiceDate ? format(new Date(row.invoiceDate), "dd/MM/yyyy") : "-",
      "Qty Manufactured": `${row.finishedGood?.quantity || 0} ${row.finishedGood?.unit || ""}`.trim(),
      Amount: Number(row.grandTotal) || 0,
    }));
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Manufacturing Report");
    xlsx.writeFile(wb, "manufacturing-report.xlsx");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-800">Manufacturing Report</h1>
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

        {/* From Date */}
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

        {/* To Date */}
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

        {/* Search */}
        <Input
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-56 h-8 text-sm"
        />
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-10">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ITEM NAME</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">DATE</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">QTY MANUFACTURED</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">AMOUNT</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No manufacturing records found for the selected period.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row._id || i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.finishedGood?.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.invoiceDate ? format(new Date(row.invoiceDate), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">
                      {row.finishedGood?.quantity || 0} {row.finishedGood?.unit || ""}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">
                      ₹{(Number(row.grandTotal) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 hover:underline text-xs">View BOM</button>
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
          Total Qty Manufactured: <span className="text-gray-900">{totals.totalQty}</span>
        </span>
        <span>
          Total Amount:{" "}
          <span className="text-gray-900">
            ₹{totals.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </span>
      </div>
    </div>
  );
}
