"use client";

import * as React from "react";
import { useState } from "react";
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
  Share2,
} from "lucide-react";

// Table Header ke liye ek chhota sa reusable component
const TableHeaderCell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 p-2.5 text-xs font-bold text-gray-600 uppercase border-r last:border-r-0">
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer" />
  </div>
);

// Transaction data ke liye TypeScript type
type Transaction = {
  id: number;
  name: string;
  refNo: string;
  type: "Sale" | "Purchase" | "Payment In" | "Payment Out";
  total: number;
  moneyIn: number;
  moneyOut: number;
};

// Sample data jo table mein dikhega
const sampleData: Transaction[] = [
  {
    id: 1,
    name: "Rohan Sharma",
    refNo: "INV-001",
    type: "Sale",
    total: 5000,
    moneyIn: 5000,
    moneyOut: 0,
  },
  {
    id: 2,
    name: "Aditya Verma (Supplier)",
    refNo: "PUR-102",
    type: "Purchase",
    total: 2500,
    moneyIn: 0,
    moneyOut: 2500,
  },
  {
    id: 3,
    name: "Priya Mehta",
    refNo: "PAY-003",
    type: "Payment In",
    total: 1500,
    moneyIn: 1500,
    moneyOut: 0,
  },
  {
    id: 4,
    name: "Office Rent",
    refNo: "EXP-004",
    type: "Payment Out",
    total: 8000,
    moneyIn: 0,
    moneyOut: 8000,
  },
  {
    id: 5,
    name: "Kavita Singh",
    refNo: "INV-002",
    type: "Sale",
    total: 3200,
    moneyIn: 3200,
    moneyOut: 0,
  },
];

export default function DayBookPage() {
  const [date, setDate] = useState<Date | undefined>(new Date("2025-09-06"));

  // Footer ke totals ko dynamically calculate karna
  const totalMoneyIn = sampleData.reduce((sum, tx) => sum + tx.moneyIn, 0);
  const totalMoneyOut = sampleData.reduce((sum, tx) => sum + tx.moneyOut, 0);
  const netTotal = totalMoneyIn - totalMoneyOut;

  // Transaction type ke hisaab se color return karne wala function
  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "Sale":
      case "Payment In":
        return "text-teal-600";
      case "Purchase":
      case "Payment Out":
        return "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. Filters and Actions Header */}
      <header className="flex justify-between items-center p-4 border-b">
        {/* ... Header ka code waisa hi rahega ... */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-2 rounded-l-md border border-r-0 border-gray-300">
              Date
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[180px] justify-start text-left font-normal rounded-l-none"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Select defaultValue="all-firms">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Firm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-firms">ALL FIRMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-1 font-normal"
          >
            <FileSpreadsheet className="w-6 h-6 text-blue-700" />
            <span>Excel Report</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-1 font-normal"
          >
            <Printer className="w-6 h-6 text-gray-700" />
            <span>Print</span>
          </Button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 flex">
        <div className="border rounded-lg h-full w-full flex flex-col">
          <div className="p-4 border-b relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="" className="pl-10" />
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

          {/* ===== DATA RENDERING LOGIC YAHAN HAI ===== */}
          <div className="flex-1 overflow-y-auto">
            {sampleData.length > 0 ? (
              sampleData.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1.5fr] border-b text-sm items-center"
                >
                  <div className="p-2.5 font-medium text-gray-800">
                    {tx.name}
                  </div>
                  <div className="p-2.5 text-gray-600">{tx.refNo}</div>
                  <div
                    className={`p-2.5 font-semibold ${getTypeColor(tx.type)}`}
                  >
                    {tx.type}
                  </div>
                  <div className="p-2.5 text-gray-600">
                    ₹{tx.total.toFixed(2)}
                  </div>
                  <div className="p-2.5 text-teal-600">
                    {tx.moneyIn > 0 ? `₹${tx.moneyIn.toFixed(2)}` : "-"}
                  </div>
                  <div className="p-2.5 text-red-500">
                    {tx.moneyOut > 0 ? `₹${tx.moneyOut.toFixed(2)}` : "-"}
                  </div>
                  <div className="p-2.5 flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Printer className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Share2 className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">No transactions to show</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Totals Footer */}
      <footer className="grid grid-cols-3 p-4 border-t bg-white font-semibold">
        <div className="text-teal-600">
          Total Money-In: ₹{totalMoneyIn.toFixed(2)}
        </div>
        <div className="text-red-500 text-center">
          Total Money-Out: ₹{totalMoneyOut.toFixed(2)}
        </div>
        <div className="text-gray-800 text-right">
          Total Money In - Total Money Out: ₹{netTotal.toFixed(2)}
        </div>
      </footer>
    </div>
  );
}
