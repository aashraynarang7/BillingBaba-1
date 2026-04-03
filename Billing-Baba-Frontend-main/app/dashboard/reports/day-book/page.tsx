"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Share2,
  Loader2,
} from "lucide-react";
import { fetchReport } from "@/lib/api";

const TableHeaderCell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 p-2.5 text-xs font-bold text-gray-600 uppercase border-r last:border-r-0">
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer" />
  </div>
);

type Transaction = {
  _id: string;
  partyName: string;
  refNo: string;
  type: string;
  date: string;
  total: number;
  moneyIn: number;
  moneyOut: number;
};

export default function DayBookPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    const d = format(date, "yyyy-MM-dd");
    fetchReport("day-book", { startDate: d, endDate: d })
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [date]);

  const filtered = data.filter(
    (tx) =>
      !search ||
      tx.partyName?.toLowerCase().includes(search.toLowerCase()) ||
      tx.refNo?.toLowerCase().includes(search.toLowerCase()) ||
      tx.type?.toLowerCase().includes(search.toLowerCase())
  );

  const totalMoneyIn = filtered.reduce((sum, tx) => sum + (tx.moneyIn || 0), 0);
  const totalMoneyOut = filtered.reduce((sum, tx) => sum + (tx.moneyOut || 0), 0);
  const netTotal = totalMoneyIn - totalMoneyOut;

  const getTypeColor = (type: string) => {
    if (type === "Sale" || type === "Payment In") return "text-teal-600";
    if (type === "Purchase" || type === "Payment Out" || type === "Expense") return "text-red-500";
    return "text-gray-700";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-2 rounded-l-md border border-r-0 border-gray-300">
              Date
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal rounded-l-none">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-1 font-normal">
            <FileSpreadsheet className="w-6 h-6 text-blue-700" />
            <span>Excel Report</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-1 font-normal">
            <Printer className="w-6 h-6 text-gray-700" />
            <span>Print</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 flex">
        <div className="border rounded-lg h-full w-full flex flex-col">
          <div className="p-4 border-b relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="Search transactions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1.5fr] border-b bg-gray-50">
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Ref No.</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Total</TableHeaderCell>
            <TableHeaderCell>Money In</TableHeaderCell>
            <TableHeaderCell>Money Out</TableHeaderCell>
            <TableHeaderCell>Print / Share</TableHeaderCell>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((tx) => (
                <div key={tx._id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1.5fr] border-b text-sm items-center">
                  <div className="p-2.5 font-medium text-gray-800">{tx.partyName}</div>
                  <div className="p-2.5 text-gray-600">{tx.refNo}</div>
                  <div className={`p-2.5 font-semibold ${getTypeColor(tx.type)}`}>{tx.type}</div>
                  <div className="p-2.5 text-gray-600">₹{(tx.total || 0).toFixed(2)}</div>
                  <div className="p-2.5 text-teal-600">{tx.moneyIn > 0 ? `₹${tx.moneyIn.toFixed(2)}` : "-"}</div>
                  <div className="p-2.5 text-red-500">{tx.moneyOut > 0 ? `₹${tx.moneyOut.toFixed(2)}` : "-"}</div>
                  <div className="p-2.5 flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Printer className="w-4 h-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Share2 className="w-4 h-4 text-gray-500" /></Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center py-20">
                <p className="text-gray-500">No transactions to show</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="grid grid-cols-3 p-4 border-t bg-white font-semibold">
        <div className="text-teal-600">Total Money-In: ₹{totalMoneyIn.toFixed(2)}</div>
        <div className="text-red-500 text-center">Total Money-Out: ₹{totalMoneyOut.toFixed(2)}</div>
        <div className="text-gray-800 text-right">Total Money In - Total Money Out: ₹{netTotal.toFixed(2)}</div>
      </footer>
    </div>
  );
}
