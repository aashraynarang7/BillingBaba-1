// app/dashboard/reports/gstr-2/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileJson,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// --- Types ---
type Gstr2Row = {
  id: string;
  gstin: string;
  partyName: string;
  billNo: string;
  date: string;
  invoiceType: string;
  reverseCharge: "Y" | "N";
  value: number;
  taxRate: number;
  cessRate: number;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  placeOfSupply: string;
};

// --- Helpers ---
const formatCurrency = (val: number) =>
  val.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

const API_BASE = "http://localhost:5000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { "x-auth-token": token }),
    ...(companyId && { "x-company-id": companyId }),
  };
};

const getDominantTaxRate = (items: any[]): number => {
  if (!items || items.length === 0) return 0;
  const rates: Record<number, number> = {};
  items.forEach((item) => {
    const r = item.tax?.rate ?? 0;
    rates[r] = (rates[r] ?? 0) + 1;
  });
  const dominant = Object.entries(rates).sort((a, b) => b[1] - a[1])[0];
  return dominant ? Number(dominant[0]) : 0;
};

const toGstr2Row = (doc: any): Gstr2Row => {
  const totalTax = doc.totalTax ?? 0;
  const grandTotal = doc.grandTotal ?? doc.totalAmount ?? 0;
  const taxableValue = grandTotal - totalTax;
  const taxRate = getDominantTaxRate(doc.items || []);
  const gstin = doc.partyId?.gstin ?? "";
  const partyName = doc.partyName || doc.partyId?.name || "—";
  const billNo = doc.invoiceNo || doc.billNo || doc.debitNoteNumber || "—";
  const rawDate = doc.purchaseDate || doc.billDate || doc.createdAt;
  const date = rawDate ? format(new Date(rawDate), "dd/MM/yyyy") : "—";
  const placeOfSupply = doc.stateOfSupply || "—";

  const igst = 0;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;

  return {
    id: doc._id,
    gstin,
    partyName,
    billNo,
    date,
    invoiceType: "Regular",
    reverseCharge: "N" as "N",
    value: grandTotal,
    taxRate,
    cessRate: 0,
    taxableValue: Math.round(taxableValue * 100) / 100,
    igst,
    cgst,
    sgst,
    cess: 0,
    placeOfSupply,
  };
};

const computeTotals = (rows: Gstr2Row[]) => ({
  value: rows.reduce((s, r) => s + r.value, 0),
  taxableValue: rows.reduce((s, r) => s + r.taxableValue, 0),
  igst: rows.reduce((s, r) => s + r.igst, 0),
  cgst: rows.reduce((s, r) => s + r.cgst, 0),
  sgst: rows.reduce((s, r) => s + r.sgst, 0),
  cess: rows.reduce((s, r) => s + r.cess, 0),
});

// --- Table Component ---
const Gstr2Table = ({ data, loading }: { data: Gstr2Row[]; loading: boolean }) => {
  const totals = computeTotals(data);
  const COLS = 16;
  const stickyTh = "sticky bg-gray-100 z-10 border-r";

  return (
    <div className="block w-full max-w-full overflow-x-auto border rounded-md">
      <div style={{ minWidth: "1800px" }}>
        <Table>
          <TableHeader className="bg-gray-100">
            {/* Row 1 — group headers */}
            <TableRow>
              <TableHead rowSpan={2} className={`${stickyTh} left-0 w-10 text-center align-middle`}>#</TableHead>
              <TableHead rowSpan={2} className={`${stickyTh} left-10 min-w-[160px] align-middle`}>GSTIN/UIN</TableHead>
              <TableHead rowSpan={2} className={`${stickyTh} left-[200px] min-w-[150px] align-middle`}>Party Name</TableHead>

              {/* Bill Details — 5 sub-cols */}
              <TableHead colSpan={5} className="text-center border-b border-r font-semibold text-xs bg-blue-50">
                Bill Details
              </TableHead>

              {/* Taxable Value — standalone */}
              <TableHead rowSpan={2} className="align-middle text-right border-r whitespace-nowrap bg-gray-100 min-w-[130px] text-xs">
                Taxable Value
              </TableHead>

              {/* Amount — 4 sub-cols */}
              <TableHead colSpan={4} className="text-center border-b border-r font-semibold text-xs bg-green-50">
                Amount
              </TableHead>

              {/* Trailing cols */}
              <TableHead rowSpan={2} className="align-middle text-center border-r whitespace-nowrap bg-gray-100 min-w-[140px] text-xs">
                Place Of Supply<br />(Name Of State)
              </TableHead>
              <TableHead rowSpan={2} className="align-middle text-center border-r whitespace-nowrap bg-gray-100 min-w-[80px] text-xs">
                Reverse<br />Charge
              </TableHead>
              <TableHead rowSpan={2} className="align-middle text-center whitespace-nowrap bg-gray-100 min-w-[90px] text-xs">
                Invoice<br />Type
              </TableHead>
            </TableRow>

            {/* Row 2 — sub-headers */}
            <TableRow>
              <TableHead className="text-xs bg-blue-50 border-r whitespace-nowrap min-w-[120px]">Bill No.</TableHead>
              <TableHead className="text-xs bg-blue-50 border-r whitespace-nowrap min-w-[100px]">Date</TableHead>
              <TableHead className="text-xs bg-blue-50 border-r text-right whitespace-nowrap min-w-[120px]">Value (₹)</TableHead>
              <TableHead className="text-xs bg-blue-50 border-r text-center whitespace-nowrap min-w-[80px]">Tax Rate</TableHead>
              <TableHead className="text-xs bg-blue-50 border-r text-center whitespace-nowrap min-w-[80px]">Cess Rate</TableHead>

              <TableHead className="text-xs bg-green-50 border-r text-right whitespace-nowrap min-w-[120px]">Integrated Tax</TableHead>
              <TableHead className="text-xs bg-green-50 border-r text-right whitespace-nowrap min-w-[110px]">Central Tax</TableHead>
              <TableHead className="text-xs bg-green-50 border-r text-right whitespace-nowrap min-w-[110px]">State/UT Tax</TableHead>
              <TableHead className="text-xs bg-green-50 border-r text-right whitespace-nowrap min-w-[90px]">Cess</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={COLS} className="h-48 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              <>
                {data.map((row, idx) => (
                  <TableRow key={row.id} className="text-xs hover:bg-gray-50">
                    <TableCell className="sticky left-0 bg-white border-r text-center text-gray-400">{idx + 1}</TableCell>
                    <TableCell className="sticky left-10 bg-white border-r font-mono">{row.gstin || "—"}</TableCell>
                    <TableCell className="sticky left-[200px] bg-white border-r font-medium">{row.partyName}</TableCell>

                    <TableCell className="border-r whitespace-nowrap">{row.billNo}</TableCell>
                    <TableCell className="border-r whitespace-nowrap">{row.date}</TableCell>
                    <TableCell className="border-r text-right">{formatCurrency(row.value)}</TableCell>
                    <TableCell className="border-r text-center">{row.taxRate > 0 ? `${row.taxRate}%` : "—"}</TableCell>
                    <TableCell className="border-r text-center">{row.cessRate > 0 ? `${row.cessRate}%` : "—"}</TableCell>

                    <TableCell className="border-r text-right">{formatCurrency(row.taxableValue)}</TableCell>

                    <TableCell className="border-r text-right">{row.igst > 0 ? formatCurrency(row.igst) : "—"}</TableCell>
                    <TableCell className="border-r text-right">{row.cgst > 0 ? formatCurrency(row.cgst) : "—"}</TableCell>
                    <TableCell className="border-r text-right">{row.sgst > 0 ? formatCurrency(row.sgst) : "—"}</TableCell>
                    <TableCell className="border-r text-right">{row.cess > 0 ? formatCurrency(row.cess) : "—"}</TableCell>

                    <TableCell className="border-r text-center">{row.placeOfSupply || "—"}</TableCell>
                    <TableCell className="border-r text-center">{row.reverseCharge}</TableCell>
                    <TableCell className="text-center">{row.invoiceType}</TableCell>
                  </TableRow>
                ))}

                {/* Totals row */}
                <TableRow className="bg-orange-50 font-semibold border-t-2 border-orange-200 text-xs">
                  <TableCell className="sticky left-0 bg-orange-50 border-r text-center" />
                  <TableCell className="sticky left-10 bg-orange-50 border-r" />
                  <TableCell className="sticky left-[200px] bg-orange-50 border-r">Total ({data.length})</TableCell>
                  <TableCell className="border-r" colSpan={2} />
                  <TableCell className="border-r text-right">{formatCurrency(totals.value)}</TableCell>
                  <TableCell className="border-r" colSpan={2} />
                  <TableCell className="border-r text-right">{formatCurrency(totals.taxableValue)}</TableCell>
                  <TableCell className="border-r text-right">{totals.igst > 0 ? formatCurrency(totals.igst) : "—"}</TableCell>
                  <TableCell className="border-r text-right">{formatCurrency(totals.cgst)}</TableCell>
                  <TableCell className="border-r text-right">{formatCurrency(totals.sgst)}</TableCell>
                  <TableCell className="border-r text-right">{totals.cess > 0 ? formatCurrency(totals.cess) : "—"}</TableCell>
                  <TableCell className="border-r" colSpan={3} />
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={COLS} className="h-48 text-center text-muted-foreground">
                  No data to display for the selected period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// --- Main Page ---
export default function Gstr2ReportPage() {
  const [activeTab, setActiveTab] = useState<"purchase" | "purchase-return">("purchase");
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [purchaseRows, setPurchaseRows] = useState<Gstr2Row[]>([]);
  const [returnRows, setReturnRows] = useState<Gstr2Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [considerExempted, setConsiderExempted] = useState(false);

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  const fetchData = useCallback(async () => {
    if (!fromDate || !toDate || !companyId) return;
    setLoading(true);
    try {
      const startISO = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1).toISOString();
      const endISO = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const [billsRes, debitNotesRes] = await Promise.all([
        fetch(
          `${API_BASE}/purchases?type=BILL&companyId=${companyId}&startDate=${startISO}&endDate=${endISO}`,
          { headers: getHeaders() }
        ),
        fetch(
          `${API_BASE}/purchases?type=DEBIT_NOTE&companyId=${companyId}&startDate=${startISO}&endDate=${endISO}`,
          { headers: getHeaders() }
        ),
      ]);

      if (billsRes.ok) {
        const bills = await billsRes.json();
        const rows = (Array.isArray(bills) ? bills : bills.data ?? [])
          .filter((b: any) => b.status !== "Cancelled")
          .map(toGstr2Row);
        setPurchaseRows(rows);
      }

      if (debitNotesRes.ok) {
        const debitNotes = await debitNotesRes.json();
        const rows = (Array.isArray(debitNotes) ? debitNotes : debitNotes.data ?? [])
          .filter((d: any) => d.status !== "Cancelled")
          .map(toGstr2Row);
        setReturnRows(rows);
      }
    } catch (err) {
      console.error("GSTR-2 fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allActiveRows = activeTab === "purchase" ? purchaseRows : returnRows;
  const activeRows = considerExempted
    ? allActiveRows
    : allActiveRows.filter((r) => r.taxRate > 0 || r.igst > 0 || r.cgst > 0 || r.sgst > 0);

  const handleExport = async (formatType: "json" | "xls") => {
    const dataToExport = activeRows.map(({ id, ...rest }) => rest);
    if (formatType === "json") {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToExport, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `GSTR2_${activeTab}_${format(fromDate!, "MM-yyyy")}.json`;
      link.click();
    } else {
      try {
        const XLSX = (await import("xlsx")) as any;
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "GSTR-2");
        XLSX.writeFile(workbook, `GSTR2_${activeTab}_${format(fromDate!, "MM-yyyy")}.xlsx`);
      } catch (error) {
        console.error("Excel export error:", error);
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-52 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? `From: ${format(fromDate, "MM/yyyy")}` : "From Month/Year"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-52 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? `To: ${format(toDate, "MM/yyyy")}` : "To Month/Year"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} />
              </PopoverContent>
            </Popover>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exempted"
                checked={considerExempted}
                onCheckedChange={(v) => setConsiderExempted(!!v)}
              />
              <Label htmlFor="exempted" className="text-sm font-medium text-gray-600 cursor-pointer">
                Consider non-tax as exempted
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleExport("json")} title="Export JSON">
              <FileJson className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport("xls")} title="Export Excel">
              <FileSpreadsheet className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint} title="Print">
              <Printer className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && activeRows.length > 0 && (() => {
          const totals = computeTotals(activeRows);
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Bills", value: activeRows.length.toString() },
                { label: "Total Value", value: formatCurrency(totals.value) },
                { label: "Taxable Value", value: formatCurrency(totals.taxableValue) },
                { label: "Total Tax", value: formatCurrency(totals.cgst + totals.sgst + totals.igst) },
              ].map((card) => (
                <div key={card.label} className="border rounded-lg p-3 bg-blue-50/30">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="font-semibold text-sm mt-0.5">{card.value}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "purchase" | "purchase-return")}
        >
          <TabsList className="grid w-full grid-cols-2 sm:w-96">
            <TabsTrigger value="purchase">
              Purchase{purchaseRows.length > 0 ? ` (${purchaseRows.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="purchase-return">
              Purchase Return{returnRows.length > 0 ? ` (${returnRows.length})` : ""}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="purchase" className="mt-4">
            <Gstr2Table data={purchaseRows} loading={loading} />
          </TabsContent>
          <TabsContent value="purchase-return" className="mt-4">
            <Gstr2Table data={returnRows} loading={loading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
