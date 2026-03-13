// app/dashboard/reports/trial-balance/page.tsx
"use client";

import * as React from "react";
import { useState, useMemo } from "react"; // useMemo को import करें
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

type ReportItem = {
  id: string;
  name: string;
  debit?: number;
  credit?: number;
  children?: ReportItem[];
};

const trialBalanceData: ReportItem[] = [
  {
    id: "assets",
    name: "Assets",
    children: [
      { id: "fixed-assets", name: "Fixed Assets", debit: 500000 },
      { id: "non-current-assets", name: "Non Current Assets", debit: 75000 },
      {
        id: "current-assets",
        name: "Current Assets",
        children: [
          { id: "sundry-debtors", name: "Sundry Debtors", debit: 125000 },
          { id: "input-duties", name: "Input Duties & Taxes", debit: 15000 },
          { id: "bank-accounts", name: "Bank Accounts", debit: 250000 },
          { id: "cash-accounts", name: "Cash Accounts", debit: 45000 },
          {
            id: "other-current-assets",
            name: "Other Current Assets",
            debit: 5000,
          },
        ],
      },
      { id: "other-assets", name: "Other Assets", debit: 2000 },
    ],
  },
  {
    id: "incomes",
    name: "Incomes",
    children: [
      { id: "sale-accounts", name: "Sale Accounts", credit: 950000 },
      {
        id: "other-incomes-direct",
        name: "Other Incomes (Direct)",
        credit: 12000,
      },
      {
        id: "other-incomes-indirect",
        name: "Other Incomes (Indirect)",
        credit: 5000,
      },
    ],
  },
  {
    id: "expenses",
    name: "Expenses",
    children: [
      { id: "purchase-accounts", name: "Purchase Accounts", debit: 350000 },
      { id: "direct-expenses", name: "Direct Expenses", debit: 45000 },
      { id: "indirect-expenses", name: "Indirect Expenses", debit: 65000 },
    ],
  },
];

const formatCurrency = (value?: number) => {
  if (value === undefined || value === 0) return "--";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// --- रिकर्सिव रो कंपोनेंट (अब डेटा दिखाएगा) ---
const ReportRow: React.FC<{
  item: ReportItem;
  level: number;
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}> = ({ item, level, openItems, toggleItem }) => {
  const isOpen = openItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <>
      <div className="flex items-center text-sm hover:bg-gray-50 py-2">
        <div
          className="w-1/2 flex items-center"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          <button
            onClick={() => hasChildren && toggleItem(item.id)}
            className="flex items-center text-left w-full"
          >
            {hasChildren ? (
              isOpen ? (
                <ChevronUp className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
              )
            ) : (
              <span className="w-4 h-4 mr-2 flex-shrink-0 text-center">•</span>
            )}
            <span className={level === 0 ? "font-bold" : ""}>{item.name}</span>
          </button>
        </div>
        <div className="w-1/4 text-right pr-8">
          {formatCurrency(item.debit)}
        </div>
        <div className="w-1/4 text-right pr-8">
          {formatCurrency(item.credit)}
        </div>
      </div>
      {isOpen &&
        hasChildren &&
        item.children?.map((child) => (
          <ReportRow
            key={child.id}
            item={child}
            level={level + 1}
            openItems={openItems}
            toggleItem={toggleItem}
          />
        ))}
    </>
  );
};

export default function TrialBalanceReportPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(2025, 3, 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2025, 8, 6));
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(["assets", "current-assets", "incomes", "expenses"])
  );

  const processedData = useMemo(() => {
    const calculateTotals = (items: ReportItem[]): ReportItem[] => {
      return items.map((item) => {
        if (!item.children || item.children.length === 0) {
          return {
            ...item,
            debit: item.debit || 0,
            credit: item.credit || 0,
          };
        }

        const processedChildren = calculateTotals(item.children);

        const totalDebit = processedChildren.reduce(
          (sum, child) => sum + (child.debit || 0),
          0
        );
        const totalCredit = processedChildren.reduce(
          (sum, child) => sum + (child.credit || 0),
          0
        );

        return {
          ...item,
          debit: totalDebit,
          credit: totalCredit,
          children: processedChildren,
        };
      });
    };
    return calculateTotals(trialBalanceData);
  }, []); // यह सिर्फ एक बार कैलकुलेट होगा

  // फुटर के लिए टोटल कैलकुलेट करें
  const footerTotals = useMemo(() => {
    return processedData.reduce(
      (totals, item) => {
        totals.debit += item.debit || 0;
        totals.credit += item.credit || 0;
        return totals;
      },
      { debit: 0, credit: 0 }
    );
  }, [processedData]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const collapseAll = () => setOpenItems(new Set());
  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (items: ReportItem[]) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id);
          collectIds(item.children);
        }
      });
    };
    collectIds(trialBalanceData);
    setOpenItems(allIds);
  };

  const areAllCollapsed = openItems.size === 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Trial Balance Report</h1>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
              Pdf
            </span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
              xls
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Filters remain the same */}
          <div className="flex items-center gap-2">
            <Label>Period :</Label>
            <Select defaultValue="custom">
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-32">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : ""}
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
            <span>To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-32">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "dd/MM/yyyy") : ""}
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
          <div className="flex items-center space-x-2">
            <Checkbox id="working-trial" />
            <Label htmlFor="working-trial">Show working trial balance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="zero-balance" />
            <Label htmlFor="zero-balance">Show 0 balances account</Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
        <div className="p-3 border-b">
          <Button
            variant="link"
            className="text-blue-600 p-0 h-auto"
            onClick={areAllCollapsed ? expandAll : collapseAll}
          >
            {areAllCollapsed ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronUp className="h-4 w-4 mr-1" />
            )}
            {areAllCollapsed ? "Expand all accounts" : "Collapse all accounts"}
          </Button>
        </div>
        <div className="flex bg-gray-100 p-3 font-bold text-sm text-gray-600 sticky top-0 z-10">
          <div className="w-1/2">ACCOUNT</div>
          <div className="w-1/2">
            <div className="text-center mb-1">CLOSING BALANCE</div>
            <div className="flex">
              <div className="w-1/2 text-right pr-8">DEBIT</div>
              <div className="w-1/2 text-right pr-8">CREDIT</div>
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto thin-scrollbar">
          {/* --- स्टेप 4: प्रोसेस्ड डेटा का उपयोग करें --- */}
          {processedData.map((item) => (
            <ReportRow
              key={item.id}
              item={item}
              level={0}
              openItems={openItems}
              toggleItem={toggleItem}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-blue-50 border-t flex justify-between font-bold text-blue-800">
        <span>Total</span>
        <div className="w-1/2 flex">
          <span className="w-1/2 text-right pr-8">
            {formatCurrency(footerTotals.debit)}
          </span>
          <span className="w-1/2 text-right pr-8">
            {formatCurrency(footerTotals.credit)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
