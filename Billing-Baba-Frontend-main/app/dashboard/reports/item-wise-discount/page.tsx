// app/dashboard/reports/item-wise-discount/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { ChevronDown, Printer, FileText } from "lucide-react";

type DiscountItem = {
  id: number;
  itemName: string;
  category: string;
  partyName: string; 
  totalQtySold: number;
  totalSaleAmount: number;
  totalDiscountAmount: number;
};

const sampleData: DiscountItem[] = [
  {
    id: 1,
    itemName: "Laptop HP ProBook",
    category: "Electronics",
    partyName: "Krishna Traders",
    totalQtySold: 5,
    totalSaleAmount: 275000,
    totalDiscountAmount: 10000,
  },
  {
    id: 2,
    itemName: "A4 Paper Rim",
    category: "Stationery",
    partyName: "Verma Supplies",
    totalQtySold: 50,
    totalSaleAmount: 27500,
    totalDiscountAmount: 500,
  },
  {
    id: 3,
    itemName: "Drill Machine Bosch",
    category: "Hardware",
    partyName: "Gupta & Sons",
    totalQtySold: 10,
    totalSaleAmount: 75000,
    totalDiscountAmount: 2500,
  },
  {
    id: 4,
    itemName: "Mouse Logitech MX",
    category: "Electronics",
    partyName: "Krishna Traders",
    totalQtySold: 20,
    totalSaleAmount: 16000,
    totalDiscountAmount: 1200,
  },
];
const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function ItemWiseDiscountPage() {
  const [filteredData, setFilteredData] = useState<DiscountItem[]>(sampleData);
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [partyFilter, setPartyFilter] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("all-firms");

  const uniqueCategories = useMemo(
    () => ["all", ...Array.from(new Set(sampleData.map((d) => d.category)))],
    []
  );

  useEffect(() => {
    let data = sampleData;
    if (itemNameFilter)
      data = data.filter((item) =>
        item.itemName.toLowerCase().includes(itemNameFilter.toLowerCase())
      );
    if (selectedCategory !== "all")
      data = data.filter((item) => item.category === selectedCategory);
    if (partyFilter)
      data = data.filter((item) =>
        item.partyName.toLowerCase().includes(partyFilter.toLowerCase())
      );
    setFilteredData(data);
  }, [itemNameFilter, selectedCategory, partyFilter]);

  // --- समरी की गणना ---
  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.totalSaleAmount += item.totalSaleAmount;
        acc.totalDiscountAmount += item.totalDiscountAmount;
        return acc;
      },
      { totalSaleAmount: 0, totalDiscountAmount: 0 }
    );
  }, [filteredData]);

  // --- एक्सपोर्ट और प्रिंट फंक्शन ---
  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = filteredData.map((item) => ({
        "Item Name": item.itemName,
        "Total Qty Sold": item.totalQtySold,
        "Total Sale Amount": item.totalSaleAmount,
        "Total Disc. Amount": item.totalDiscountAmount,
        "Avg. Disc. (%)":
          item.totalSaleAmount > 0
            ? ((item.totalDiscountAmount / item.totalSaleAmount) * 100).toFixed(2)
            : 0,
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
                  defaultValue="01/09/2025"
                  className="w-28 h-8 border-none bg-transparent focus-visible:ring-0"
                />
                <span>To</span>
                <Input
                  type="text"
                  defaultValue="30/09/2025"
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
            <Input
              placeholder="Party Filter"
              value={partyFilter}
              onChange={(e) => setPartyFilter(e.target.value)}
            />
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
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const avgDiscount =
                      item.totalSaleAmount > 0
                        ? (item.totalDiscountAmount / item.totalSaleAmount) *
                          100
                        : 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.itemName}
                        </TableCell>
                        <TableCell>{item.totalQtySold}</TableCell>
                        <TableCell>
                          {formatCurrency(item.totalSaleAmount)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.totalDiscountAmount)}
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
