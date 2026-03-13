"use client";

import * as React from "react";
import { useState } from "react";
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
  FileSpreadsheet,
  Calendar as CalendarIcon,
  ListFilter,
} from "lucide-react";

// Table Header ke liye ek reusable component
const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1 p-3 text-xs font-semibold text-gray-500 uppercase">
    <span>{children}</span>
    <ListFilter className="w-4 h-4 text-gray-400" />
  </div>
);

// Transaction data ke liye TypeScript type
type ProfitData = {
  id: number;
  date: Date;
  invoiceNo: string;
  party: string;
  totalSaleAmount: number;
  profitOrLoss: number;
};

// Sample data jo table mein dikhega
const sampleData: ProfitData[] = [
  {
    id: 1,
    date: new Date("2025-09-02"),
    invoiceNo: "INV-001",
    party: "Rohan Sharma",
    totalSaleAmount: 5000,
    profitOrLoss: 1200,
  },
  {
    id: 2,
    date: new Date("2025-09-03"),
    invoiceNo: "INV-002",
    party: "Priya Mehta",
    totalSaleAmount: 3200,
    profitOrLoss: 450,
  },
  {
    id: 3,
    date: new Date("2025-09-04"),
    invoiceNo: "INV-003",
    party: "Kavita Singh",
    totalSaleAmount: 8500,
    profitOrLoss: -250,
  }, // Example of a loss
  {
    id: 4,
    date: new Date("2025-09-05"),
    invoiceNo: "INV-004",
    party: "Ankit General Store",
    totalSaleAmount: 12000,
    profitOrLoss: 2800,
  },
];

export default function BillWiseProfitPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date("2025-09-01")
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date("2025-09-06")
  );

  // Footer ke totals ko dynamically calculate karna
  const totalSaleAmount = sampleData.reduce(
    (sum, item) => sum + item.totalSaleAmount,
    0
  );
  const totalProfit = sampleData.reduce(
    (sum, item) => sum + item.profitOrLoss,
    0
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. Filters and Actions Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2 p-1 border rounded-md">
          <span className="text-sm text-gray-500 pl-2">From</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className="w-[140px] justify-start text-left font-normal p-2 h-auto"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? (
                  format(fromDate, "dd/MM/yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-500">To</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className="w-[140px] justify-start text-left font-normal p-2 h-auto"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? (
                  format(toDate, "dd/MM/yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-700" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9"
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 flex flex-col">
        <h2 className="text-sm font-bold text-gray-800 uppercase mb-4">
          Profit on Sale Invoices
        </h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-gray-500">FILTERS</span>
          <Input placeholder="Party filter" className="w-64 h-8" />
        </div>

        <div className="border rounded-t-lg flex-1 flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_2fr_1.5fr_1.5fr_0.5fr] border-b bg-gray-50 rounded-t-lg">
            <TableHeader>Date</TableHeader>
            <TableHeader>Invoice No</TableHeader>
            <TableHeader>Party</TableHeader>
            <TableHeader>Total Sale Amount</TableHeader>
            <TableHeader>Profit(+) / Loss(-)</TableHeader>
            <TableHeader>Details</TableHeader>
          </div>

          {/* Data Rows */}
          <div className="flex-1 overflow-y-auto">
            {sampleData.length > 0 ? (
              sampleData.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_1fr_2fr_1.5fr_1.5fr_0.5fr] border-b text-sm items-center"
                >
                  <div className="p-3 text-gray-700">
                    {format(item.date, "dd/MM/yyyy")}
                  </div>
                  <div className="p-3 text-gray-700">{item.invoiceNo}</div>
                  <div className="p-3 font-medium text-gray-800">
                    {item.party}
                  </div>
                  <div className="p-3 text-gray-700">
                    ₹{item.totalSaleAmount.toFixed(2)}
                  </div>
                  <div
                    className={`p-3 font-semibold ${item.profitOrLoss < 0 ? "text-red-500" : "text-teal-600"}`}
                  >
                    ₹{item.profitOrLoss.toFixed(2)}
                  </div>
                  <div className="p-3 text-center text-gray-500">...</div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-gray-500">No Party to show</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Summary Footer */}
      <footer className="p-4 border-t bg-white">
        <h3 className="font-bold text-gray-800 mb-2">Summary</h3>
        <div className="flex gap-8 text-sm">
          <p className="text-gray-600">
            Total Sale Amount:{" "}
            <span className="font-semibold text-gray-800">
              ₹{totalSaleAmount.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-600">
            Total Profit(+)/Loss(-):
            <span
              className={`font-semibold ${totalProfit < 0 ? "text-red-500" : "text-teal-600"}`}
            >
              ₹{totalProfit.toFixed(2)}
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
