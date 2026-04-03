"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar as CalendarIcon, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { fetchReport } from "@/lib/api";

type BSItem = { name: string; debit: number; credit: number; children?: BSItem[] };

const fmt = (v: number) => v.toLocaleString("en-IN", { minimumFractionDigits: 2 });
const net = (item: BSItem) => Math.abs((item.credit || 0) - (item.debit || 0));

const BSAccordion = ({ items }: { items: BSItem[] }) => (
  <Accordion type="multiple" defaultValue={items.filter(i => i.children?.length).map(i => i.name)}>
    {items.map((item, i) => (
      <div key={i} className={`py-1 ${item.children ? "" : "pl-6"}`}>
        {item.children?.length ? (
          <AccordionItem value={item.name} className="border-none">
            <AccordionTrigger className="hover:no-underline p-2 text-sm font-normal text-blue-600">
              <div className="flex justify-between w-full">
                <span>{item.name}</span><span>{fmt(net(item))}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-6 pb-0"><BSAccordion items={item.children} /></AccordionContent>
          </AccordionItem>
        ) : (
          <div className="flex justify-between p-2 text-sm font-normal">
            <span className="flex items-center gap-3"><div className="w-1 h-1 bg-gray-500 rounded-full"></div>{item.name}</span>
            <span>{fmt(net(item))}</span>
          </div>
        )}
      </div>
    ))}
  </Accordion>
);

export default function BalanceSheetPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 3, 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<BSItem[]>([]);
  const [liabilities, setLiabilities] = useState<BSItem[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);

  useEffect(() => {
    setLoading(true);
    const f: any = {};
    if (fromDate) f.startDate = format(fromDate, "yyyy-MM-dd");
    if (toDate) f.endDate = format(toDate, "yyyy-MM-dd");
    fetchReport("balance-sheet", f)
      .then(d => {
        setAssets(d.assets?.items || []);
        setTotalAssets(d.assets?.total || 0);
        setLiabilities(d.liabilities?.items || []);
        setTotalLiabilities(d.liabilities?.total || 0);
      })
      .catch(() => { setAssets([]); setLiabilities([]); })
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  const AssetsBlock = () => (
    <div>
      <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-t-lg border-b">
        <h3 className="font-bold text-gray-700">Assets</h3>
        <p className="text-xs text-right text-gray-500">AMOUNT</p>
      </div>
      <BSAccordion items={assets} />
    </div>
  );

  const LiabilitiesBlock = () => (
    <div>
      <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-t-lg border-b">
        <h3 className="font-bold text-gray-700">Equities & Liabilities</h3>
        <p className="text-xs text-right text-gray-500">AMOUNT</p>
      </div>
      <BSAccordion items={liabilities} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <h1 className="text-2xl font-bold text-gray-800">Balance Sheet</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 px-2"><FileText className="w-4 h-4 mr-1 text-red-500" /> Pdf</Button>
            <Button variant="outline" className="h-8 px-2"><FileSpreadsheet className="w-4 h-4 mr-1 text-green-600" /> xls</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 p-1 border rounded-md">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-[140px] justify-start text-left font-normal p-1 h-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />{fromDate ? format(fromDate, "dd/MM/yyyy") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} /></PopoverContent>
            </Popover>
            <span className="text-sm text-gray-500">To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-[140px] justify-start text-left font-normal p-1 h-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />{toDate ? format(toDate, "dd/MM/yyyy") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} /></PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <Label>Horizontal</Label>
            <Switch checked={isHorizontal} onCheckedChange={setIsHorizontal} />
            <Label>Vertical</Label>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-600 mb-4 font-semibold">Balance Sheet as on {toDate ? format(toDate, "MMM dd, yyyy") : ""}</p>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        ) : isHorizontal ? (
          <div className="grid grid-cols-2 gap-8"><AssetsBlock /><LiabilitiesBlock /></div>
        ) : (
          <div className="space-y-8"><AssetsBlock /><LiabilitiesBlock /></div>
        )}
      </main>

      <footer className="grid grid-cols-2 bg-blue-600 text-white font-bold text-sm">
        <div className="flex justify-between p-3 border-r border-blue-500">
          <span>Total Assets</span><span>{fmt(totalAssets)}</span>
        </div>
        <div className="flex justify-between p-3">
          <span>Total Equities & Liabilities</span><span>{fmt(totalLiabilities)}</span>
        </div>
      </footer>
    </div>
  );
}
