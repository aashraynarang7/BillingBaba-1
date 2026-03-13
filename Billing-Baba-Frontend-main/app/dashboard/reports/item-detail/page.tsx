// app/dashboard/reports/item-detail/page.tsx
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
} from "lucide-react";
import { format } from "date-fns";

// --- डेटा की संरचना ---
type ItemTransaction = {
  id: number;
  itemName: string;
  date: string;
  saleQty: number;
  purchaseQty: number;
  adjustmentQty: number;
};

// --- सैंपल डेटा (एक आइटम के लिए कई तारीखों का) ---
const sampleTransactions: ItemTransaction[] = [
  {
    id: 1,
    itemName: "Laptop HP ProBook",
    date: "01/09/2025",
    saleQty: 3,
    purchaseQty: 5,
    adjustmentQty: 0,
  },
  {
    id: 2,
    itemName: "Laptop HP ProBook",
    date: "02/09/2025",
    saleQty: 0,
    purchaseQty: 0,
    adjustmentQty: 0,
  }, // Inactive date
  {
    id: 3,
    itemName: "Laptop HP ProBook",
    date: "03/09/2025",
    saleQty: 1,
    purchaseQty: 0,
    adjustmentQty: 0,
  },
  {
    id: 4,
    itemName: "Laptop HP ProBook",
    date: "04/09/2025",
    saleQty: 0,
    purchaseQty: 10,
    adjustmentQty: -1,
  }, // Stock adjustment
  {
    id: 5,
    itemName: "Laptop HP ProBook",
    date: "05/09/2025",
    saleQty: 4,
    purchaseQty: 0,
    adjustmentQty: 0,
  },
  {
    id: 6,
    itemName: "A4 Paper Rim",
    date: "01/09/2025",
    saleQty: 20,
    purchaseQty: 50,
    adjustmentQty: 0,
  },
  {
    id: 7,
    itemName: "A4 Paper Rim",
    date: "03/09/2025",
    saleQty: 10,
    purchaseQty: 0,
    adjustmentQty: 5,
  },
];

export default function ItemDetailPage() {
  const [transactions, setTransactions] = useState<ItemTransaction[]>([]);
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [hideInactive, setHideInactive] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(2025, 8, 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2025, 8, 6));

  // --- फिल्टर लॉजिक ---
  useEffect(() => {
    if (!itemNameFilter) {
      setTransactions([]); // अगर कोई आइटम नहीं चुना है तो टेबल खाली रखें
      return;
    }

    let data = sampleTransactions.filter(
      (item) => item.itemName.toLowerCase() === itemNameFilter.toLowerCase()
    );

    if (hideInactive) {
      data = data.filter(
        (item) =>
          item.saleQty !== 0 ||
          item.purchaseQty !== 0 ||
          item.adjustmentQty !== 0
      );
    }

    setTransactions(data);
  }, [itemNameFilter, hideInactive]);

  // --- रनिंग क्लोजिंग क्वांटिटी की गणना ---
  const processedData = useMemo(() => {
    const openingStock = 20; // एक सैंपल ओपनिंग स्टॉक मान लें
    let closingQty = openingStock;
    return transactions.map((item) => {
      closingQty =
        closingQty - item.saleQty + item.purchaseQty + item.adjustmentQty;
      return { ...item, closingQty };
    });
  }, [transactions]);

  // --- एक्सपोर्ट और प्रिंट फंक्शन ---
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
                {processedData.length > 0 ? (
                  processedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
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
