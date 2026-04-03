// app/dashboard/reports/item-wise-discount/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ChevronDown, Printer, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fetchReport } from "@/lib/api";

type DiscountItem = {
  name: string;
  totalQty: number;
  saleAmount: number;
  discountAmount: number;
  avgDiscountPercent: number;
};

const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function ItemWiseDiscountPage() {
  const [allData, setAllData] = useState<DiscountItem[]>([]);
  const [filteredData, setFilteredData] = useState<DiscountItem[]>([]);
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("all-firms");
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (fromDate) filters.startDate = format(fromDate, "yyyy-MM-dd");
      if (toDate) filters.endDate = format(toDate, "yyyy-MM-dd");
      const data = await fetchReport("item-wise-discount", filters);
      const items = Array.isArray(data) ? data : [];
      setAllData(items);
      setFilteredData(items);
    } catch (error) {
      console.error("Error fetching item-wise discount:", error);
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Client-side filtering
  useEffect(() => {
    let data = allData;
    if (itemNameFilter)
      data = data.filter((item) =>
        item.name.toLowerCase().includes(itemNameFilter.toLowerCase())
      );
    setFilteredData(data);
  }, [itemNameFilter, allData]);

  // --- Summary ---
  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.totalSaleAmount += item.saleAmount;
        acc.totalDiscountAmount += item.discountAmount;
        return acc;
      },
      { totalSaleAmount: 0, totalDiscountAmount: 0 }
    );
  }, [filteredData]);

  // --- Export and print functions ---
  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = filteredData.map((item) => ({
        "Item Name": item.name,
        "Total Qty Sold": item.totalQty,
        "Total Sale Amount": item.saleAmount,
        "Total Disc. Amount": item.discountAmount,
        "Avg. Disc. (%)": item.avgDiscountPercent?.toFixed(2) || (
          item.saleAmount > 0
            ? ((item.discountAmount / item.saleAmount) * 100).toFixed(2)
            : 0
        ),
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            "",
            "",
            "Total Sale:",
            summary.totalSaleAmount,
            "Total Discount:",
            summary.totalDiscountAmount,
          ],
        ],
        { origin: -1 }
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ItemWiseDiscount");
      XLSX.writeFile(workbook, "ItemWiseDiscount.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xl font-bold p-1">
                    This Month <ChevronDown className="w-5 h-5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2 rounded-md border p-1 text-sm bg-gray-100">
                <Button variant="ghost" size="sm" className="bg-white">
                  Between
                </Button>
                <Input
                  type="text"
                  value={fromDate ? format(fromDate, "dd/MM/yyyy") : ""}
                  readOnly
                  className="w-28 h-8 border-none bg-transparent focus-visible:ring-0"
                />
                <span>To</span>
                <Input
                  type="text"
                  value={toDate ? format(toDate, "dd/MM/yyyy") : ""}
                  readOnly
                  className="w-28 h-8 border-none bg-transparent focus-visible:ring-0"
                />
              </div>
              <Select value={selectedFirm} onValueChange={setSelectedFirm}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-firms">All Firms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-muted-foreground"
                onClick={handleExportExcel}
              >
                <FileText className="w-5 h-5" /> Excel Report
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-muted-foreground"
                onClick={handlePrint}
              >
                <Printer className="w-5 h-5" /> Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Item Wise Discount</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="item-name">ITEM NAME</Label>
              <Input
                id="item-name"
                value={itemNameFilter}
                onChange={(e) => setItemNameFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>ITEM NAME</TableHead>
                  <TableHead>TOTAL QTY SOLD</TableHead>
                  <TableHead>TOTAL SALE AMOUNT</TableHead>
                  <TableHead>TOTAL DISC. AMOUNT</TableHead>
                  <TableHead>AVG. DISC. (%)</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-muted-foreground">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const avgDiscount = item.avgDiscountPercent ??
                      (item.saleAmount > 0
                        ? (item.discountAmount / item.saleAmount) * 100
                        : 0);
                    return (
                      <TableRow key={item.name + index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.totalQty}</TableCell>
                        <TableCell>
                          {formatCurrency(item.saleAmount)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.discountAmount)}
                        </TableCell>
                        <TableCell>{avgDiscount.toFixed(2)} %</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-48 text-center text-muted-foreground"
                    >
                      No Items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div>
            <h3 className="font-bold mb-2">Summary</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Total Sale Amount: {formatCurrency(summary.totalSaleAmount)}
              </p>
              <p>
                Total Discount amount:{" "}
                {formatCurrency(summary.totalDiscountAmount)}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
