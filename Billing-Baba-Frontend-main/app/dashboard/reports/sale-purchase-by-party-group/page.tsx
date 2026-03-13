"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
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
import Image from "next/image";
import {
  Printer,
  Search,
  Filter,
  FileSpreadsheet,
  Calendar as CalendarIcon,
} from "lucide-react";

// Table Header ke liye ek reusable component
const TableHeaderCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-2 p-3 text-xs font-bold text-gray-500 uppercase ${className}`}
  >
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer" />
  </div>
);

// Party group data ke liye TypeScript type
type PartyGroupData = {
  id: number;
  groupName: string;
  saleAmount: number;
  purchaseAmount: number;
};

// Sample data
const sampleData: PartyGroupData[] = [
  { id: 1, groupName: "Retailers", saleAmount: 125000, purchaseAmount: 75000 },
  {
    id: 2,
    groupName: "Wholesalers",
    saleAmount: 450000,
    purchaseAmount: 320000,
  },
  {
    id: 3,
    groupName: "Distributors",
    saleAmount: 875000,
    purchaseAmount: 650000,
  },
  {
    id: 4,
    groupName: "Online Customers",
    saleAmount: 75000,
    purchaseAmount: 0,
  },
  {
    id: 5,
    groupName: "Corporate Clients",
    saleAmount: 210000,
    purchaseAmount: 50000,
  },
];

export default function SalePurchaseByPartyGroupPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date("2025-09-01")
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date("2025-09-30")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] =
    useState<PartyGroupData[]>(sampleData);

  // Search filter ka logic
  useEffect(() => {
    const results = sampleData.filter((item) =>
      item.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm]);

  // Footer ke totals ko dynamically calculate karna
  const { totalSaleAmount, totalPurchaseAmount } = useMemo(() => {
    return filteredData.reduce(
      (totals, item) => {
        totals.totalSaleAmount += item.saleAmount;
        totals.totalPurchaseAmount += item.purchaseAmount;
        return totals;
      },
      { totalSaleAmount: 0, totalPurchaseAmount: 0 }
    );
  }, [filteredData]);

  // Fixed onChange handler
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value || "");
  // };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* 1. Main Content Area */}
      <main className="flex-1 p-4 flex flex-col">
        {/* Filters Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Select defaultValue="this-month">
              <SelectTrigger className="w-48 h-10 font-semibold text-lg bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center p-1 border rounded-md bg-white">
              <span className="text-sm text-gray-500 px-2 bg-gray-200 py-1 rounded-sm font-semibold">
                Between
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="w-[140px] justify-start text-left font-normal p-1 h-auto"
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
                    className="w-[140px] justify-start text-left font-normal p-1 h-auto"
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
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Select defaultValue="all-firms">
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue />
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

        <div className="border rounded-lg h-full w-full flex flex-col bg-white">
          {/* Title and Search */}
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="font-semibold text-gray-600 uppercase">
              Sale Purchase By Party Group
            </h4>
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder=""
                className="pl-10"
                value={searchTerm}
                // onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 border-b bg-gray-50">
            <TableHeaderCell>Group Name</TableHeaderCell>
            <TableHeaderCell>Sale Amount</TableHeaderCell>
            <TableHeaderCell>Purchase Amount</TableHeaderCell>
          </div>

          {/* Data Rows / Empty State */}
          <div className="flex-1 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 border-b text-sm items-center hover:bg-slate-50"
                >
                  <div className="p-3 font-medium text-gray-800 border-r">
                    {item.groupName}
                  </div>
                  <div className="p-3 text-gray-600 border-r">
                    ₹{item.saleAmount.toFixed(2)}
                  </div>
                  <div className="p-3 text-gray-600">
                    ₹{item.purchaseAmount.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500">No transactions to show</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 2. Totals Footer */}
      <footer className="flex justify-between p-4 border-t bg-white font-semibold text-sm">
        <div className="text-gray-700">
          Total Sale Amount:{" "}
          <span className="text-teal-600">₹{totalSaleAmount.toFixed(2)}</span>
        </div>
        <div className="text-gray-700">
          Total Purchase Amount:{" "}
          <span className="text-red-500">
            ₹{totalPurchaseAmount.toFixed(2)}
          </span>
        </div>
      </footer>
    </div>
  );
}
