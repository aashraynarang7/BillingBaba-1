// app/dashboard/reports/sale-purchase-report-by-item-category/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fetchReport } from "@/lib/api";

// --- Data structure ---
type CategoryData = {
  category: string;
  saleQty: number;
  saleAmount: number;
  purchaseQty: number;
  purchaseAmount: number;
};

const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function SalePurchaseReportByCategoryPage() {
  const [reportData, setReportData] = useState<CategoryData[]>([]);
  const [partyFilter, setPartyFilter] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (fromDate) filters.startDate = format(fromDate, "yyyy-MM-dd");
      if (toDate) filters.endDate = format(toDate, "yyyy-MM-dd");
      const data = await fetchReport("sale-purchase-by-item-category", filters);
      const items = Array.isArray(data) ? data : [];
      setReportData(items);
    } catch (error) {
      console.error("Error fetching sale-purchase by item category:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Client-side party filter (filter categories that match party name if provided)
  const displayData = useMemo(() => {
    if (!partyFilter) return reportData;
    return reportData.filter((item) =>
      item.category.toLowerCase().includes(partyFilter.toLowerCase())
    );
  }, [reportData, partyFilter]);

  // --- Table totals ---
  const totals = useMemo(() => {
    return displayData.reduce(
      (acc, item) => {
        acc.saleQty += item.saleQty;
        acc.saleAmount += item.saleAmount;
        acc.purchaseQty += item.purchaseQty;
        acc.purchaseAmount += item.purchaseAmount;
        return acc;
      },
      { saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 }
    );
  }, [displayData]);

  // --- Export and print functions ---
  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const { utils } = xlsx;
    const dataToExport = displayData.map((item) => ({
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-muted-foreground">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayData.length > 0 ? (
                  displayData.map((item) => (
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
