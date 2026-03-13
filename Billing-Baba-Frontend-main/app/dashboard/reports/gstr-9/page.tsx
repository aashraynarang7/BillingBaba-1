"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, FileSpreadsheet } from "lucide-react";

// Section Header ke liye ek reusable component
const ReportSectionHeader = ({
  part,
  title,
  subtitle,
}: {
  part: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="bg-gray-600 text-white font-bold p-2 flex justify-between items-center text-sm rounded-t-md">
    <span>
      {part} &nbsp;&nbsp; {title}
    </span>
    {subtitle && <span className="text-xs font-normal">{subtitle}</span>}
  </div>
);

// Basic Details Table Row
const BasicDetailRow = ({
  number,
  label,
  value,
}: {
  number: string;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-[80px_2fr_3fr] border-b">
    <div className="p-2 border-r text-center bg-gray-50 font-medium">
      {number}
    </div>
    <div className="p-2 border-r">{label}</div>
    <div className="p-2">{value}</div>
  </div>
);

// Main Table Row
const MainTableRow = ({
  number,
  label,
  values,
  isSubItem = false,
  isHeader = false,
}: {
  number: string;
  label: string;
  values: (string | number)[];
  isSubItem?: boolean;
  isHeader?: boolean;
}) => (
  <div
    className={`grid grid-cols-[60px_4fr_repeat(5,1fr)] ${isHeader ? "bg-gray-200 font-bold" : "border-b"}`}
  >
    <div className={`p-2 border-r text-center ${isSubItem ? "pl-8" : ""}`}>
      {number}
    </div>
    <div className={`p-2 border-r col-span-1 ${isHeader ? "text-center" : ""}`}>
      {label}
    </div>
    {values.map((val, i) => (
      <div key={i} className="p-2 text-right border-r last:border-r-0">
        {val}
      </div>
    ))}
  </div>
);

export default function GSTR9Page() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* 1. Filters and Actions Header */}
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <Select defaultValue="2023-2024">
            <SelectTrigger className="w-64 h-9">
              <span className="text-gray-500 mr-2">Financial Year</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
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

      {/* 2. Main Scrollable Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">GSTR9 REPORT</h1>
          <div className="flex items-center space-x-2">
            <Checkbox id="non-tax" />
            <Label htmlFor="non-tax" className="font-normal text-gray-600">
              CONSIDER NON-TAX AS EXEMPTED
            </Label>
          </div>
        </div>

        {/* --- Part I: Basic Details --- */}
        <div className="mb-8 border rounded-md bg-white">
          <ReportSectionHeader part="Pt. I" title="Basic Details" />
          <div className="text-sm">
            <BasicDetailRow
              number="1"
              label="Financial Year"
              value="2023-2024"
            />
            <BasicDetailRow number="2" label="GSTIN" value="" />
            <BasicDetailRow number="3A" label="Legal Name" value="My Company" />
            <BasicDetailRow number="3B" label="Trade Name (if any)" value="" />
          </div>
        </div>

        {/* --- Part II: Details Of Outward And Inward Supplies --- */}
        <div className="border rounded-md bg-white text-sm">
          <ReportSectionHeader
            part="Pt. II"
            title="Details Of Outward And Inward Supplies Declared During The Financial Year"
            subtitle="(Amount in Rupees in All Tables)"
          />
          {/* Table Header */}
          <div className="grid grid-cols-[60px_4fr_repeat(5,1fr)] bg-gray-100 font-semibold text-xs text-center">
            <div className="p-1 border-r"></div>
            <div className="p-1 border-r">Nature of Supplies</div>
            <div className="p-1 border-r">Taxable Value</div>
            <div className="p-1 border-r">Central Tax</div>
            <div className="p-1 border-r">State Tax / UT Tax</div>
            <div className="p-1 border-r">Integrated Tax</div>
            <div className="p-1">Cess</div>
          </div>
          <div className="grid grid-cols-[60px_4fr_repeat(5,1fr)] bg-gray-50 font-semibold text-xs text-center border-b">
            <div className="p-1 border-r"></div>
            <div className="p-1 border-r">1</div>
            <div className="p-1 border-r">2</div>
            <div className="p-1 border-r">3</div>
            <div className="p-1 border-r">4</div>
            <div className="p-1 border-r">5</div>
            <div className="p-1">6</div>
          </div>
          {/* Table Body */}
          <div>
            <div className="grid grid-cols-[60px_1fr] bg-gray-200 font-bold border-b">
              <div className="p-2 border-r text-center">4</div>
              <div className="p-2 border-r col-span-6">
                Details of advances, inward and outward supplies on which tax is
                payable as declared in returns filed during the financial year
              </div>
            </div>
            <MainTableRow
              number="A"
              label="Supplies made to un-registered persons(B2C)"
              values={[0, 0, 0, 0, 0]}
              isSubItem
            />
            <MainTableRow
              number="B"
              label="Supplies made to registered persons(B2B)"
              values={[0, 0, 0, 0, 0]}
              isSubItem
            />
            <MainTableRow
              number="C"
              label="Zero rated supply(Export) on payment of tax (except supplies to SEZs)"
              values={[0, 0, 0, 0, 0]}
              isSubItem
            />
            {/* ... Add other rows for Part II here ... */}
          </div>
        </div>
      </main>
    </div>
  );
}
