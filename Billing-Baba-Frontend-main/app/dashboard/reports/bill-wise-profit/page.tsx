"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Printer, FileSpreadsheet, Calendar as CalendarIcon, ListFilter, X, Loader2 } from "lucide-react";
import { fetchBillWiseProfit } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

type ItemBreakdown = {
  name: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
};

type BillProfit = {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  partyName: string;
  saleAmount: number;
  totalItemCost: number;
  taxPayable: number;
  tdsReceivable: number;
  profit: number;
  items: ItemBreakdown[];
};

const fmt = (n: number) => `₹ ${(n || 0).toFixed(2)}`;

export default function BillWiseProfitPage() {
  const now = new Date();
  const [fromDate, setFromDate] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
  const [toDate, setToDate] = useState<Date>(now);
  const [partyFilter, setPartyFilter] = useState("");
  const [data, setData] = useState<BillProfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BillProfit | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchBillWiseProfit({
        startDate: format(fromDate, "yyyy-MM-dd"),
        endDate: format(toDate, "yyyy-MM-dd"),
        party: partyFilter || undefined,
      });
      setData(result);
    } catch {
      toast({ title: "Failed to load report", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [fromDate, toDate]);

  // client-side party filter for instant feedback
  const filtered = useMemo(() =>
    partyFilter
      ? data.filter(r => r.partyName.toLowerCase().includes(partyFilter.toLowerCase()))
      : data,
    [data, partyFilter]
  );

  const totalSale = filtered.reduce((s, r) => s + r.saleAmount, 0);
  const totalProfit = filtered.reduce((s, r) => s + r.profit, 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2 p-1 border rounded-md">
          <span className="text-sm text-gray-500 pl-2">From</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-[130px] justify-start text-left font-normal p-2 h-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(fromDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={fromDate} onSelect={d => d && setFromDate(d)} />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-500">To</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-[130px] justify-start text-left font-normal p-2 h-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(toDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={toDate} onSelect={d => d && setToDate(d)} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <FileSpreadsheet className="w-4 h-4 text-blue-700" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 flex flex-col overflow-hidden">
        <h2 className="text-sm font-bold text-gray-800 uppercase mb-4">Profit on Sale Invoices</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-gray-500">FILTERS</span>
          <Input
            placeholder="Party filter"
            className="w-64 h-8"
            value={partyFilter}
            onChange={e => setPartyFilter(e.target.value)}
          />
        </div>

        <div className="border rounded-t-lg flex flex-col overflow-hidden flex-1">
          {/* Table Header */}
          <div className="grid grid-cols-[1.2fr_0.8fr_1.8fr_1.5fr_1.5fr_0.6fr] border-b bg-gray-50 flex-shrink-0">
            {["Date", "Invoice No", "Party", "Total Sale Amount", "Profit (+) / Loss (-)","Details"].map((h, i) => (
              <div key={i} className="flex items-center gap-1 p-3 text-xs font-semibold text-gray-500 uppercase">
                <span>{h}</span>
                {i < 5 && <ListFilter className="w-3 h-3 text-gray-400" />}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 py-16">
                No data for selected period
              </div>
            ) : (
              filtered.map((row, idx) => (
                <div
                  key={row._id}
                  className={`grid grid-cols-[1.2fr_0.8fr_1.8fr_1.5fr_1.5fr_0.6fr] border-b text-sm items-center ${idx === 0 ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className="p-3 text-gray-700">
                    {row.invoiceDate ? format(new Date(row.invoiceDate), "dd/MM/yyyy") : "-"}
                  </div>
                  <div className="p-3 text-gray-700">{row.invoiceNumber}</div>
                  <div className="p-3 font-medium text-gray-800">{row.partyName}</div>
                  <div className="p-3 text-gray-700">{fmt(row.saleAmount)}</div>
                  <div className={`p-3 font-semibold ${row.profit < 0 ? "text-red-500" : "text-teal-600"}`}>
                    {fmt(row.profit)}
                  </div>
                  <div className="p-3">
                    <button
                      onClick={() => setSelected(row)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Show &gt;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Summary Footer */}
      <footer className="p-4 border-t bg-white flex-shrink-0">
        <h3 className="font-bold text-gray-800 mb-1">Summary</h3>
        <div className="flex gap-8 text-sm">
          <p className="text-gray-600">
            Total Sale Amount: <span className="font-semibold text-gray-800">{fmt(totalSale)}</span>
          </p>
          <p className="text-gray-600">
            Total Profit(+)/Loss(-):
            <span className={`font-semibold ml-1 ${totalProfit < 0 ? "text-red-500" : "text-teal-600"}`}>
              {fmt(totalProfit)}
            </span>
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setSelected(null)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">
                  Invoice #{selected.invoiceNumber} - {selected.partyName}
                </h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-4">
                <h3 className="font-semibold text-gray-700">Cost Calculation</h3>

                {/* Item table */}
                <div className="border rounded-lg overflow-hidden text-sm">
                  <div className="grid grid-cols-4 bg-gray-50 border-b">
                    {["ITEM NAME", "QUANTITY", "PURCHASE PRICE", "TOTAL COST"].map(h => (
                      <div key={h} className="px-4 py-2 text-xs font-semibold text-gray-500">{h}</div>
                    ))}
                  </div>
                  {selected.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-4 border-b last:border-0">
                      <div className="px-4 py-2 text-gray-800">{item.name}</div>
                      <div className="px-4 py-2 text-gray-700">{item.quantity}</div>
                      <div className="px-4 py-2 text-gray-700">{fmt(item.purchasePrice)}</div>
                      <div className="px-4 py-2 text-gray-700">{fmt(item.totalCost)}</div>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-2 text-sm border-t pt-3">
                  {[
                    { label: "Sale Amount", value: selected.saleAmount },
                    { label: "Total Cost", value: selected.totalItemCost },
                    { label: "Tax Payable", value: selected.taxPayable },
                    { label: "TDS Receivable", value: selected.tdsReceivable },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-gray-700">
                      <span>{label}</span>
                      <span>{fmt(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
                    <span>Profit (Sale Amount - Total Cost - Tax Payable + TDS Receivable)</span>
                    <span className={selected.profit < 0 ? "text-red-500" : "text-teal-600"}>
                      {fmt(selected.profit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Profit (Excluding Additional Charges)</span>
                    <span className={selected.profit < 0 ? "text-red-500" : "text-teal-600"}>
                      {fmt(selected.profit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
