// app/dashboard/reports/sac-report/page.tsx
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
import { ChevronDown, Printer, FileText, Search, Filter } from "lucide-react";

// --- डेटा की संरचना ---
type SacReportData = {
  id: number;
  sac: string;
  invoiceType: string;
  totalValue: number;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  addCess: number;
};

// --- सैंपल डेटा ---
const sampleData: SacReportData[] = [
  {
    id: 1,
    sac: "998311",
    invoiceType: "B2B",
    totalValue: 11800,
    taxableValue: 10000,
    igstAmount: 1800,
    cgstAmount: 0,
    sgstAmount: 0,
    addCess: 0,
  },
  {
    id: 2,
    sac: "998313",
    invoiceType: "B2B",
    totalValue: 23600,
    taxableValue: 20000,
    igstAmount: 0,
    cgstAmount: 1800,
    sgstAmount: 1800,
    addCess: 0,
  },
  {
    id: 3,
    sac: "998314",
    invoiceType: "B2C",
    totalValue: 5900,
    taxableValue: 5000,
    igstAmount: 900,
    cgstAmount: 0,
    sgstAmount: 0,
    addCess: 0,
  },
  {
    id: 4,
    sac: "998311",
    invoiceType: "B2B",
    totalValue: 17700,
    taxableValue: 15000,
    igstAmount: 2700,
    cgstAmount: 0,
    sgstAmount: 0,
    addCess: 0,
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

export default function SacReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("all-firms");
  const [filteredData, setFilteredData] = useState<SacReportData[]>(sampleData);

  // --- फिल्टर लॉजिक ---
  useEffect(() => {
    const data = searchTerm
      ? sampleData.filter((d) =>
          d.sac.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : sampleData;
    setFilteredData(data);
  }, [searchTerm]);

  // --- टेबल फुटर के लिए टोटल ---
  const totals = useMemo(() => {
    return {
      totalValue: filteredData.reduce((sum, item) => sum + item.totalValue, 0),
      totalItems: filteredData.length,
    };
  }, [filteredData]);

  // --- Excel एक्सपोर्ट फंक्शन ---
  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx") as any;
      const dataToExport = filteredData.map((item) => ({
        SAC: item.sac,
        "Invoice Type": item.invoiceType,
        "Total Value": item.totalValue,
        "Taxable Value": item.taxableValue,
        "IGST Amount": item.igstAmount,
        "CGST Amount": item.cgstAmount,
        "SGST Amount": item.sgstAmount,
        "Add. Cess": item.addCess,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SAC_Report");
      XLSX.writeFile(workbook, "SAC_Report.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  // --- प्रिंट फंक्शन ---
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
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

      {/* Table Card */}
      <Card className="flex flex-col flex-grow">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">SAC REPORT</h2>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border rounded-md flex-grow flex flex-col">
            <Table>
              <TableHeader className="bg-gray-50 text-xs">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      SAC <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      INVOICE TYPE <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      TOTAL VAL... <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      TAXABLE ... <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      IGST AMO... <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      CGST AMO... <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      SGST AMO... <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      ADD. CESS <Filter className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.sac}</TableCell>
                      <TableCell>{item.invoiceType}</TableCell>
                      <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                      <TableCell>{formatCurrency(item.taxableValue)}</TableCell>
                      <TableCell>{formatCurrency(item.igstAmount)}</TableCell>
                      <TableCell>{formatCurrency(item.cgstAmount)}</TableCell>
                      <TableCell>{formatCurrency(item.sgstAmount)}</TableCell>
                      <TableCell>{formatCurrency(item.addCess)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64">
                      <div className="flex flex-col items-center justify-center text-center">
                        <EmptyStateIcon />
                        <p className="mt-4 font-semibold text-gray-700">
                          No data is available for SAC Wise Summary Report.
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
        <CardFooter className="bg-gray-100 p-4 font-bold flex justify-between text-sm">
          <span>
            Total Value:{" "}
            <span className="text-green-600">
              {formatCurrency(totals.totalValue)}
            </span>
          </span>
          <span>Total Items: {totals.totalItems}</span>
        </CardFooter>
      </Card>
    </div>
  );
}
