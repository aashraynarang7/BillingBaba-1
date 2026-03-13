"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Printer,
  FileSpreadsheet,
  Calendar as CalendarIcon,
} from "lucide-react";

// Section wrapper ke liye ek reusable component
const ReportSection = ({
  sectionNumber,
  title,
  children,
}: {
  sectionNumber?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h2 className="text-base font-bold text-gray-800 mb-2">
      {sectionNumber && `${sectionNumber}. `}
      {title}
    </h2>
    <div className="border rounded-md overflow-hidden bg-white">{children}</div>
  </div>
);

const ReportTableRow = ({
  label,
  values,
  isSubItem = false,
}: {
  label: React.ReactNode;
  values: number[];
  isSubItem?: boolean;
}) => (
  <div className="grid grid-cols-6 text-sm border-b last:border-b-0">
    <div className={`p-2 col-span-2 ${isSubItem ? "pl-8" : ""}`}>{label}</div>
    {values.map((val, i) => (
      <div key={i} className="p-2 text-right border-l">
        {val.toFixed(2)}
      </div>
    ))}
  </div>
);

export default function GSTR3BPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* 1. Filters and Actions Header */}
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md p-1">
            <Input
              placeholder="From Month/Year"
              className="border-none h-8 w-40 focus-visible:ring-0"
            />
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center border rounded-md p-1">
            <Input
              placeholder="To Month/Year"
              className="border-none h-8 w-40 focus-visible:ring-0"
            />
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>
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

      {/* 2. Main Scrollable Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          {/* ===== YAHAN DEKHEIN: Main Title ka size 'text-lg' kiya gaya hai ===== */}
          <h1 className="text-lg font-bold text-gray-800">GSTR3 REPORT</h1>
          <div className="flex items-center space-x-2">
            <Checkbox id="non-tax" />
            <Label htmlFor="non-tax" className="font-normal text-gray-600">
              CONSIDER NON-TAX AS EXEMPTED
            </Label>
          </div>
        </div>

        {/* Section 1 */}
        <ReportSection
          sectionNumber="1"
          title="Details of outward supplies and inward supplies liable to reverse charge"
        >
          <div className="grid grid-cols-6 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <div className="p-2 col-span-2">Nature Of Supplies</div>
            <div className="p-2 text-right border-l">Total Taxable Value</div>
            <div className="p-2 text-right border-l">Integrated Tax</div>
            <div className="p-2 text-right border-l">Central Tax</div>
            <div className="p-2 text-right border-l">State/UT Tax</div>
            <div className="p-2 text-right border-l">Cess</div>
          </div>
          <div>
            <ReportTableRow
              label="Outward taxable supplies (other than zero rated, nil rated and exempted)"
              values={[0, 0, 0, 0, 0]}
            />
            <ReportTableRow
              label="Outward taxable supplies (zero rated)"
              values={[0, 0, 0, 0, 0]}
            />
            <ReportTableRow
              label="Other outward supplies (nil rated, exempted)"
              values={[0, 0, 0, 0, 0]}
            />
            <ReportTableRow
              label="Inward supplies (liable to reverse charge)"
              values={[0, 0, 0, 0, 0]}
            />
            <ReportTableRow
              label="Non-GST outward supplies"
              values={[0, 0, 0, 0, 0]}
            />
          </div>
        </ReportSection>

        {/* Section 2 */}
        <ReportSection
          sectionNumber="5"
          title="Details of inter-State supplies made to unregistered persons, composition dealer and UIN holders"
        >
          <div className="grid grid-cols-4 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <div className="p-2 border-r">Place Of Supply (State/UT)</div>
            <div className="p-2 border-r text-center">
              Supplies Made To Unregistered Persons
            </div>
            <div className="p-2 border-r text-center">
              Supplies Made To Composition Taxable Persons
            </div>
            <div className="p-2 text-center">Supplies Made To UIN Holders</div>
          </div>
          <div className="grid grid-cols-4 border-b bg-gray-50 text-xs font-semibold text-gray-500">
            <div className="border-r"></div>
            <div className="grid grid-cols-2 border-r">
              <div className="p-2 border-r">Total Taxable Value</div>
              <div className="p-2">Amount Of Integrated Tax</div>
            </div>
            <div className="grid grid-cols-2 border-r">
              <div className="p-2 border-r">Total Taxable Value</div>
              <div className="p-2">Amount Of Integrated Tax</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 border-r">Total Taxable Value</div>
              <div className="p-2">Amount Of Integrated Tax</div>
            </div>
          </div>
          <div className="grid grid-cols-4 text-sm">
            <div className="border-r p-2"></div>
            <div className="grid grid-cols-2 border-r">
              <div className="p-2 border-r text-right">0.00</div>
              <div className="p-2 text-right">0.00</div>
            </div>
            <div className="grid grid-cols-2 border-r">
              <div className="p-2 border-r text-right">0.00</div>
              <div className="p-2 text-right">0.00</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 border-r text-right">0.00</div>
              <div className="p-2 text-right">0.00</div>
            </div>
          </div>
        </ReportSection>

        {/* Section 3 */}
        <ReportSection sectionNumber="3" title="Eligible ITC">
          <div className="grid grid-cols-5 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <div className="p-2">Details</div>
            <div className="p-2 text-right border-l">Integrated Tax</div>
            <div className="p-2 text-right border-l">Central Tax</div>
            <div className="p-2 text-right border-l">State/UT Tax</div>
            <div className="p-2 text-right border-l">Cess</div>
          </div>
          <div>
            <div className="font-bold p-2 text-sm bg-gray-50">
              (A) ITC Available (whether in full or part)
            </div>
            <ReportTableRow
              label="(1) Import of goods"
              values={[0, 0, 0, 0]}
              isSubItem
            />
            <ReportTableRow
              label="(2) Import of services"
              values={[0, 0, 0, 0]}
              isSubItem
            />
            <ReportTableRow
              label="(3) Inward supplies liable to reverse charge (other than 1 & 2 above)"
              values={[0, 0, 0, 0]}
              isSubItem
            />
            <ReportTableRow
              label="(4) Inward supplies from ISD"
              values={[0, 0, 0, 0]}
              isSubItem
            />
            <ReportTableRow
              label="(5) All other ITC"
              values={[0, 0, 0, 0]}
              isSubItem
            />

            <div className="font-bold p-2 text-sm bg-gray-50">
              (D) Ineligible ITC
            </div>
            <ReportTableRow
              label="(1) As per section 17(5)"
              values={[0, 0, 0, 0]}
              isSubItem
            />
            <ReportTableRow
              label="(2) Others"
              values={[0, 0, 0, 0]}
              isSubItem
            />
          </div>
        </ReportSection>

        {/* Section 4 */}
        <ReportSection
          sectionNumber="4"
          title="Details of exempt, nil-rated and non-GST inward supplies"
        >
          <div className="grid grid-cols-3 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <div className="p-2">Nature Of Supplies</div>
            <div className="p-2 text-right border-l">Inter-State Supplies</div>
            <div className="p-2 text-right border-l">Intra-State Supplies</div>
          </div>
          <div className="grid grid-cols-3 text-sm border-b">
            <div className="p-2">
              From a supplier under composition scheme, Exempt and Nil rated
              supply
            </div>
            <div className="p-2 text-right border-l">0.00</div>
            <div className="p-2 text-right border-l">0.00</div>
          </div>
          <div className="grid grid-cols-3 text-sm">
            <div className="p-2">Non GST supply</div>
            <div className="p-2 text-right border-l">0.00</div>
            <div className="p-2 text-right border-l">0.00</div>
          </div>
        </ReportSection>
      </main>
    </div>
  );
}
