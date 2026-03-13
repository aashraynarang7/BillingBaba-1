// app/dashboard/reports/sale-purchase-report-by-item-category/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import { format } from "date-fns";
// Use dynamic import to avoid SSR bundling issues with xlsx

// --- हर ट्रांजेक्शन के लिए डेटा की संरचना ---
type TransactionData = {
  id: number;
  partyName: string;
  category: string;
  saleQty: number;
  saleAmount: number;
  purchaseQty: number;
  purchaseAmount: number;
};

// --- सैंपल ट्रांजेक्शन डेटा ---
const sampleTransactions: TransactionData[] = [
  {
    id: 1,
    partyName: "Krishna Traders",
    category: "Electronics",
    saleQty: 5,
    saleAmount: 275000,
    purchaseQty: 0,
    purchaseAmount: 0,
  },
  {
    id: 2,
    partyName: "Verma Supplies",
    category: "Stationery",
    saleQty: 50,
    saleAmount: 27500,
    purchaseQty: 100,
    purchaseAmount: 42000,
  },
  {
    id: 3,
    partyName: "Gupta & Sons",
    category: "Hardware",
    saleQty: 0,
    purchaseAmount: 68000,
    purchaseQty: 10,
    saleAmount: 0,
  },
  {
    id: 4,
    partyName: "Krishna Traders",
    category: "Electronics",
    saleQty: 20,
    saleAmount: 16000,
    purchaseQty: 50,
    purchaseAmount: 32500,
  },
  {
    id: 5,
    partyName: "Verma Supplies",
    category: "Furniture",
    saleQty: 2,
    saleAmount: 18000,
    purchaseQty: 5,
    purchaseAmount: 36000,
  },
];
const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function SalePurchaseReportByCategoryPage() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [partyFilter, setPartyFilter] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(2025, 8, 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2025, 8, 6));

  // --- पार्टी फिल्टर और डेटा को ग्रुप करने का लॉजिक ---
  useEffect(() => {
    // 1. पार्टी के नाम से ट्रांजेक्शन को फिल्टर करें
    const filteredTransactions = partyFilter
      ? sampleTransactions.filter((t) =>
          t.partyName.toLowerCase().includes(partyFilter.toLowerCase())
        )
      : sampleTransactions;

    // 2. फिल्टर किए गए ट्रांजेक्शन को कैटेगरी के अनुसार ग्रुप करें
    const groupedData = filteredTransactions.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            saleQty: 0,
            saleAmount: 0,
            purchaseQty: 0,
            purchaseAmount: 0,
          };
        }
        acc[item.category].saleQty += item.saleQty;
        acc[item.category].saleAmount += item.saleAmount;
        acc[item.category].purchaseQty += item.purchaseQty;
        acc[item.category].purchaseAmount += item.purchaseAmount;
        return acc;
      },
      {} as Record<string, any>
    );

    // 3. ग्रुप किए गए डेटा को टेबल में दिखाने के लिए ऐरे में बदलें
    const finalReport = Object.keys(groupedData).map((category) => ({
      category,
      ...groupedData[category],
    }));

    setReportData(finalReport);
  }, [partyFilter]);

  // --- टेबल के टोटल की गणना ---
  const totals = useMemo(() => {
    return reportData.reduce(
      (acc, item) => {
        acc.saleQty += item.saleQty;
        acc.saleAmount += item.saleAmount;
        acc.purchaseQty += item.purchaseQty;
        acc.purchaseAmount += item.purchaseAmount;
        return acc;
      },
      { saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 }
    );
  }, [reportData]);

  // --- एक्सपोर्ट और प्रिंट फंक्शन ---
  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const { utils } = xlsx;
    const dataToExport = reportData.map((item) => ({
      "Item Category": item.category,
      "Sale Quantity": item.saleQty,
      "Total Sale Amount": item.saleAmount,
      "Purchase Quantity": item.purchaseQty,
      "Total Purchase Amount": item.purchaseAmount,
    }));
    const worksheet = utils.json_to_sheet(dataToExport);
    utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Total",
          totals.saleQty,
          totals.saleAmount,
          totals.purchaseQty,
          totals.purchaseAmount,
        ],
      ],
      { origin: -1 }
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "ReportByCategory");
    xlsx.writeFile(workbook, "SalePurchaseReportByCategory.xlsx");
  };
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Top Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div>
              <Label htmlFor="party-name" className="text-xs text-gray-600">
                Party name
              </Label>
              <Input
                id="party-name"
                placeholder="Party name"
                value={partyFilter}
                onChange={(e) => setPartyFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? `From ${format(fromDate, "dd/MM/yyyy")}` : ""}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? `To ${format(toDate, "dd/MM/yyyy")}` : ""}
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleExportExcel}>
              <FileSpreadsheet className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Details and Table Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            SALE/PURCHASE REPORT BY ITEM CATEGORY
          </h2>
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Item Category</TableHead>
                  <TableHead>Sale Quantity</TableHead>
                  <TableHead>Total Sale Amount</TableHead>
                  <TableHead>Purchase Quantity</TableHead>
                  <TableHead>Total Purchase Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? (
                  reportData.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                      <TableCell>{item.saleQty}</TableCell>
                      <TableCell>{formatCurrency(item.saleAmount)}</TableCell>
                      <TableCell>{item.purchaseQty}</TableCell>
                      <TableCell>
                        {formatCurrency(item.purchaseAmount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-48 text-center text-muted-foreground"
                    >
                      No data to display.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-gray-100 font-bold">
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell>{totals.saleQty}</TableCell>
                  <TableCell>{formatCurrency(totals.saleAmount)}</TableCell>
                  <TableCell>{totals.purchaseQty}</TableCell>
                  <TableCell>{formatCurrency(totals.purchaseAmount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
