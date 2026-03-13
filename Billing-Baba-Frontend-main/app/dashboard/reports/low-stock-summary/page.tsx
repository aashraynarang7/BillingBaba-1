// app/dashboard/reports/low-stock-summary/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Printer, FileSpreadsheet } from "lucide-react";

// --- डेटा की संरचना ---
type LowStockItem = {
  id: number;
  name: string;
  category: string;
  minimumStockQty: number;
  stockQty: number;
  purchasePrice: number; // Stock Value की गणना के लिए
};

// --- सैंपल डेटा ---
const sampleData: LowStockItem[] = [
  {
    id: 1,
    name: "Laptop HP ProBook",
    category: "Electronics",
    minimumStockQty: 10,
    stockQty: 5,
    purchasePrice: 48000,
  },
  {
    id: 2,
    name: "A4 Paper Rim",
    category: "Stationery",
    minimumStockQty: 50,
    stockQty: 150,
    purchasePrice: 420,
  }, // Not low stock
  {
    id: 3,
    name: "Drill Machine Bosch",
    category: "Hardware",
    minimumStockQty: 10,
    stockQty: 8,
    purchasePrice: 6800,
  },
  {
    id: 4,
    name: "Mouse Logitech MX",
    category: "Electronics",
    minimumStockQty: 20,
    stockQty: 45,
    purchasePrice: 650,
  }, // Not low stock
  {
    id: 5,
    name: "Antivirus Pro (1 Year)",
    category: "Software",
    minimumStockQty: 25,
    stockQty: 10,
    purchasePrice: 250,
  },
  {
    id: 6,
    name: "Office Chair",
    category: "Furniture",
    minimumStockQty: 5,
    stockQty: 0,
    purchasePrice: 7200,
  },
];
const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function LowStockSummaryPage() {
  const [filteredData, setFilteredData] = useState<LowStockItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // --- फिल्टर लॉजिक ---
  useEffect(() => {
    // 1. पहले low stock items को फिल्टर करें
    let data = sampleData.filter(
      (item) => item.stockQty <= item.minimumStockQty
    );

    // 2. फिर कैटेगरी फिल्टर लगाएं
    if (selectedCategory !== "all") {
      data = data.filter((item) => item.category === selectedCategory);
    }

    // 3. फिर 'Show items in stock' फिल्टर लगाएं (यह 0 quantity वालों को हटा देगा)
    if (showInStockOnly) {
      data = data.filter((item) => item.stockQty > 0);
    }

    setFilteredData(data);
  }, [selectedCategory, showInStockOnly]);

  // --- फिल्टर ड्रॉपडाउन के लिए यूनिक कैटेगरी ---
  const uniqueCategories = useMemo(
    () => ["all", ...Array.from(new Set(sampleData.map((d) => d.category)))],
    []
  );

  // --- एक्सपोर्ट और प्रिंट फंक्शन ---
  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = filteredData.map((item) => ({
        "Item Name": item.name,
        "Minimum Stock Qty": item.minimumStockQty,
        "Stock Qty": item.stockQty,
        "Stock Value": item.stockQty * item.purchasePrice,
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
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.minimumStockQty}</TableCell>
                    <TableCell className="font-bold text-red-600">
                      {item.stockQty}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.stockQty * item.purchasePrice)}
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