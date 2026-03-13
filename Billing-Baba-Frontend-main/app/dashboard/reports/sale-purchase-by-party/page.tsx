// app/dashboard/reports/sale-purchase-by-party/page.tsx
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Printer, FileText, Search, Filter } from "lucide-react";

// --- डेटा की संरचना ---
type SalePurchaseData = {
  id: number;
  partyName: string;
  saleAmount: number;
  purchaseAmount: number;
};

// --- सैंपल डेटा ---
const sampleData: SalePurchaseData[] = [
  {
    id: 1,
    partyName: "Krishna Traders",
    saleAmount: 265000,
    purchaseAmount: 30000,
  },
  {
    id: 2,
    partyName: "Verma Supplies",
    saleAmount: 25000,
    purchaseAmount: 495000,
  },
  {
    id: 3,
    partyName: "Gupta & Sons",
    saleAmount: 75000,
    purchaseAmount: 120000,
  },
  {
    id: 4,
    partyName: "Sharma Solutions",
    saleAmount: 50000,
    purchaseAmount: 0,
  },
  {
    id: 5,
    partyName: "Global Enterprises",
    saleAmount: 0,
    purchaseAmount: 85000,
  },
];

// खाली स्टेट के लिए SVG आइकॉन
const EmptyStateIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-300"
  >
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#f1f5f9"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M16 17H8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 9H8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M18 13H16.5"
      stroke="#4a90e2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const formatCurrency = (val: number) => `₹ ${val.toFixed(2)}`;

export default function SalePurchaseByPartyPage() {
  const [filteredData, setFilteredData] =
    useState<SalePurchaseData[]>(sampleData);
  const [searchTerm, setSearchTerm] = useState("");

  // --- फिल्टर लॉजिक ---
  useEffect(() => {
    const data = searchTerm
      ? sampleData.filter((d) =>
          d.partyName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : sampleData;
    setFilteredData(data);
  }, [searchTerm]);

  // --- टेबल फुटर के लिए टोटल ---
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.saleAmount += item.saleAmount;
        acc.purchaseAmount += item.purchaseAmount;
        return acc;
      },
      { saleAmount: 0, purchaseAmount: 0 }
    );
  }, [filteredData]);

  // --- Excel एक्सपोर्ट फंक्शन ---
  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = filteredData.map((item) => ({
        "Party Name": item.partyName,
        "Sale Amount": item.saleAmount,
        "Purchase Amount": item.purchaseAmount,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            "",
            "Total Sale Amount:",
            totals.saleAmount,
            "Total Purchase Amount:",
            totals.purchaseAmount,
          ],
        ],
        { origin: -1 }
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SalePurchaseByParty");
      XLSX.writeFile(workbook, "SalePurchaseByParty.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Card */}
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
              <div className="flex items-center gap-2 rounded-md border p-1 text-sm bg-gray-100 dark:bg-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white dark:bg-gray-700"
                >
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
              <Select defaultValue="all-firms">
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
                onClick={() => window.print()}
              >
                <Printer className="w-5 h-5" /> Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="flex flex-col flex-grow">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Party..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="border rounded-md flex-grow flex flex-col">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      PARTY NAME <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      SALE AMOUNT <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      PURCHASE AMOUNT <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.partyName}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.saleAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.purchaseAmount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64">
                      <div className="flex flex-col items-center justify-center text-center">
                        <EmptyStateIcon />
                        <p className="mt-4 font-semibold text-gray-700">
                          No data is available for Sale Purchase by Party.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Please try again after making relevant changes.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-100 p-4 font-bold flex justify-between">
          <span>Total Sale Amount: {formatCurrency(totals.saleAmount)}</span>
          <span>
            Total Purchase Amount: {formatCurrency(totals.purchaseAmount)}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
