// app/dashboard/reports/low-stock-summary/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Printer, FileSpreadsheet, Loader2 } from "lucide-react";
import { fetchReport } from "@/lib/api";

// --- Data structure ---
type LowStockItem = {
  name: string;
  category: string;
  minStockToMaintain: number;
  currentQuantity: number;
  stockValue: number;
};

const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function LowStockSummaryPage() {
  const [allData, setAllData] = useState<LowStockItem[]>([]);
  const [filteredData, setFilteredData] = useState<LowStockItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReport("low-stock-summary");
      const items = Array.isArray(data) ? data : [];
      setAllData(items);
    } catch (error) {
      console.error("Error fetching low stock summary:", error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Filter logic ---
  useEffect(() => {
    let data = allData;

    // Category filter
    if (selectedCategory !== "all") {
      data = data.filter((item) => item.category === selectedCategory);
    }

    // 'Show items in stock' filter (removes 0 quantity items)
    if (showInStockOnly) {
      data = data.filter((item) => item.currentQuantity > 0);
    }

    setFilteredData(data);
  }, [selectedCategory, showInStockOnly, allData]);

  // --- Unique categories for filter dropdown ---
  const uniqueCategories = useMemo(
    () => ["all", ...Array.from(new Set(allData.map((d) => d.category).filter(Boolean)))],
    [allData]
  );

  // --- Export and print functions ---
  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = filteredData.map((item) => ({
        "Item Name": item.name,
        "Minimum Stock Qty": item.minStockToMaintain,
        "Stock Qty": item.currentQuantity,
        "Stock Value": item.stockValue,
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "LowStockSummary");
      XLSX.writeFile(workbook, "LowStockSummary.xlsx");
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
        {/* Filters Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <Label className="font-semibold text-gray-600">FILTERS</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={showInStockOnly}
                onCheckedChange={(checked) =>
                  setShowInStockOnly(Boolean(checked))
                }
              />
              <Label htmlFor="in-stock">Show items in stock</Label>
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

        {/* Table Section */}
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Minimum Stock Qty</TableHead>
                <TableHead>Stock Qty</TableHead>
                <TableHead>Stock Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-muted-foreground">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={item.name + index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.minStockToMaintain}</TableCell>
                    <TableCell className="font-bold text-red-600">
                      {item.currentQuantity}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.stockValue)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-48 text-center text-muted-foreground"
                  >
                    No low stock items found based on the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
