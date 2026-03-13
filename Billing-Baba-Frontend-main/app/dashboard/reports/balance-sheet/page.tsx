"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar as CalendarIcon,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

// Balance sheet item ke liye TypeScript type (recursive)
type BalanceSheetItem = {
  name: string;
  amount: number;
  isBold?: boolean;
  children?: BalanceSheetItem[];
};

// Sample Data for Assets
const assetsData: BalanceSheetItem[] = [
  { name: "Fixed Assets", amount: 0 },
  { name: "Non Current Assets", amount: 0 },
  {
    name: "Current Assets",
    amount: 0,
    children: [
      { name: "Sundry Debtors", amount: 0, isBold: true },
      { name: "Input Duties & Taxes", amount: 0 },
      { name: "Bank Accounts", amount: 0 },
      { name: "Cash Accounts", amount: 0 },
      { name: "Other Current Assets", amount: 0 },
    ],
  },
  { name: "Other Assets", amount: 0 },
];

// Sample Data for Equities & Liabilities
const liabilitiesData: BalanceSheetItem[] = [
  {
    name: "Capital Account",
    amount: 0,
    children: [{ name: "Owner's Equity", amount: 0 }],
  },
  {
    name: "Reserves & Surplus",
    amount: 0,
    children: [
      { name: "Reserves & Surplus ...", amount: 0 },
      { name: "Revaluation Reserve", amount: 0 },
      { name: "Retained Earnings", amount: 0 },
    ],
  },
  { name: "Long-term Liabilities", amount: 0 },
];

// Recursive component to render nested accordion items
const BalanceSheetAccordion = ({ items }: { items: BalanceSheetItem[] }) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "Current Assets",
        "Capital Account",
        "Reserves & Surplus",
        "Owner's Equity",
      ]}
    >
      {items.map((item, index) => (
        <div key={index} className={`py-1 ${item.children ? "" : "pl-6"}`}>
          {item.children ? (
            <AccordionItem value={item.name} className="border-none">
              <AccordionTrigger className="hover:no-underline p-2 text-sm font-normal text-blue-600">
                <div className="flex justify-between w-full">
                  <span>{item.name}</span>
                  <span>{item.amount.toFixed(0)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6 pb-0">
                <BalanceSheetAccordion items={item.children} />
              </AccordionContent>
            </AccordionItem>
          ) : (
            <div
              className={`flex justify-between p-2 text-sm ${item.isBold ? "font-bold" : "font-normal"}`}
            >
              <span className="flex items-center gap-3">
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                {item.name}
              </span>
              <span>{item.amount.toFixed(0)}</span>
            </div>
          )}
        </div>
      ))}
    </Accordion>
  );
};

export default function BalanceSheetPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date("2025-04-01")
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date("2025-09-06")
  );

  // ===== BADLAV 1: View toggle ke liye state add kiya gaya hai =====
  const [isHorizontal, setIsHorizontal] = useState(true);

  // Calculate totals recursively
  const calculateTotal = (items: BalanceSheetItem[]): number => {
    return items.reduce(
      (sum, item) =>
        sum + item.amount + (item.children ? calculateTotal(item.children) : 0),
      0
    );
  };

  const totalAssets = calculateTotal(assetsData);
  const totalLiabilities = calculateTotal(liabilitiesData);

  // Reusable blocks for cleaner conditional rendering
  const AssetsBlock = () => (
    <div>
      <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-t-lg border-b">
        <h3 className="font-bold text-gray-700">Assets</h3>
        <p className="text-xs text-right text-gray-500">AMOUNT</p>
      </div>
      <BalanceSheetAccordion items={assetsData} />
    </div>
  );

  const LiabilitiesBlock = () => (
    <div>
      <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-t-lg border-b">
        <h3 className="font-bold text-gray-700">Equities & Liabilities</h3>
        <p className="text-xs text-right text-gray-500">AMOUNT</p>
      </div>
      <BalanceSheetAccordion items={liabilitiesData} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. Header with Title and Filters */}
      <header className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 absolute left-1/2 -translate-x-1/2">
            Balance Sheet
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-500">Enter Business Name</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 px-2">
              <FileText className="w-4 h-4 mr-1 text-red-500" /> Pdf
            </Button>
            <Button variant="outline" className="h-8 px-2">
              <FileSpreadsheet className="w-4 h-4 mr-1 text-green-600" /> xls
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Period :</Label>
              <Select defaultValue="custom">
                <SelectTrigger className="w-32 h-9 bg-blue-50 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 p-1 border rounded-md">
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
          </div>
          {/* ===== BADLAV 2: Switch ko state se connect kiya gaya hai ===== */}
          <div className="flex items-center space-x-2">
            <Label>Horizontal</Label>
            <Switch checked={isHorizontal} onCheckedChange={setIsHorizontal} />
            <Label>Vertical</Label>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-600 mb-4 font-semibold">
          Balance Sheet as on {toDate ? format(toDate, "MMM dd, yyyy") : ""}
        </p>

        {/* ===== BADLAV 3: Layout ko conditionally render kiya gaya hai ===== */}
        {isHorizontal ? (
          // Horizontal View (2 columns)
          <div className="grid grid-cols-2 gap-8">
            <AssetsBlock />
            <LiabilitiesBlock />
          </div>
        ) : (
          // Vertical View (1 column)
          <div className="space-y-8">
            <AssetsBlock />
            <LiabilitiesBlock />
          </div>
        )}
      </main>

      {/* 3. Totals Footer */}
      <footer className="grid grid-cols-2 bg-blue-600 text-white font-bold text-sm">
        <div className="flex justify-between p-3 border-r border-blue-500">
          <span>Total Assets</span>
          <span>{totalAssets.toFixed(0)}</span>
        </div>
        <div className="flex justify-between p-3">
          <span>Total Equities & Liabilities</span>
          <span>{totalLiabilities.toFixed(0)}</span>
        </div>
      </footer>
    </div>
  );
}
