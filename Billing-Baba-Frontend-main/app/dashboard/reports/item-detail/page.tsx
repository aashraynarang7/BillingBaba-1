// app/dashboard/reports/item-detail/page.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
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
type ItemTransaction = {
  id: string;
  date: string;
  saleQty: number;
  purchaseQty: number;
  type: string;
  adjustmentQty: number;
};

export default function ItemDetailPage() {
  const [transactions, setTransactions] = useState<ItemTransaction[]>([]);
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [hideInactive, setHideInactive] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!itemNameFilter) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    try {
      const filters: Record<string, string> = { itemName: itemNameFilter };
      if (fromDate) filters.startDate = format(fromDate, "yyyy-MM-dd");
      if (toDate) filters.endDate = format(toDate, "yyyy-MM-dd");
      const data = await fetchReport("item-detail", filters);

      // API returns {itemName: [{date, saleQty, purchaseQty, type}], ...}
      let allTransactions: ItemTransaction[] = [];
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([itemName, txns]: [string, any]) => {
          if (Array.isArray(txns)) {
            txns.forEach((txn: any, idx: number) => {
              allTransactions.push({
                id: `${itemName}-${idx}`,
                date: txn.date || "",
                saleQty: txn.saleQty || 0,
                purchaseQty: txn.purchaseQty || 0,
                type: txn.type || "",
                adjustmentQty: 0,
              });
            });
          }
        });
      }

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching item detail:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [itemNameFilter, fromDate, toDate]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(debounce);
  }, [loadData]);

  // Filter inactive dates
  const displayData = useMemo(() => {
    if (!hideInactive) return transactions;
    return transactions.filter(
      (item) =>
        item.saleQty !== 0 ||
        item.purchaseQty !== 0 ||
        item.adjustmentQty !== 0
    );
  }, [transactions, hideInactive]);

  // --- Running closing quantity ---
  const processedData = useMemo(() => {
    let closingQty = 0;
    return displayData.map((item) => {
      closingQty =
        closingQty - item.saleQty + item.purchaseQty + item.adjustmentQty;
      return { ...item, closingQty };
    });
  }, [displayData]);

  // --- Export and print functions ---
  const handleExportExcel = async () => {
    if (processedData.length === 0) return;
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = processedData.map((item) => ({
        Date: item.date,
        "Sale Quantity": item.saleQty,
        "Purchase Quantity": item.purchaseQty,
        "Adjustment Quantity": item.adjustmentQty,
        "Closing Quantity": item.closingQty,
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ItemDetailReport");
      XLSX.writeFile(workbook, `ItemDetail_${itemNameFilter}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Top Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50/50">
          <div className="flex items-center gap-2">
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
          <h2 className="text-lg font-semibold mb-2">DETAILS</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Label htmlFor="item-name-filter">Item name</Label>
            <Input
              id="item-name-filter"
              placeholder="e.g., Laptop HP ProBook"
              className="max-w-xs"
              value={itemNameFilter}
              onChange={(e) => setItemNameFilter(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-inactive"
                checked={hideInactive}
                onCheckedChange={(checked) => setHideInactive(Boolean(checked))}
              />
              <Label htmlFor="hide-inactive">Hide inactive dates</Label>
            </div>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sale Quantity</TableHead>
                  <TableHead>Purchase Quantity</TableHead>
                  <TableHead>Adjustment Quantity</TableHead>
                  <TableHead>Closing Quantity</TableHead>
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
                ) : processedData.length > 0 ? (
                  processedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date ? format(new Date(item.date), "dd/MM/yyyy") : "--"}</TableCell>
                      <TableCell>{item.saleQty}</TableCell>
                      <TableCell>{item.purchaseQty}</TableCell>
                      <TableCell>{item.adjustmentQty}</TableCell>
                      <TableCell className="font-medium">
                        {item.closingQty}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-48 text-center text-muted-foreground"
                    >
                      Please enter an item name to see the details.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
