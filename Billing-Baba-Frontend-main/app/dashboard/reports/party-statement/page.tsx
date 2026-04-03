"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Printer, FileText, Filter, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fetchReport, fetchParties } from "@/lib/api";

export default function PartyStatementPage() {
  const [view, setView] = useState<"vyapar" | "accounting">("vyapar");
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [partySearch, setPartySearch] = useState("");
  const [parties, setParties] = useState<any[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [closingBalance, setClosingBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParties().then(setParties).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPartyId) { setTransactions([]); return; }
    setLoading(true);
    const f: any = { partyId: selectedPartyId };
    if (fromDate) f.startDate = format(fromDate, "yyyy-MM-dd");
    if (toDate) f.endDate = format(toDate, "yyyy-MM-dd");
    fetchReport("party-statement", f)
      .then(d => { setTransactions(d.transactions || []); setClosingBalance(d.closingBalance || 0); })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [selectedPartyId, fromDate, toDate]);

  const filtered = useMemo(() =>
    parties.filter(p => p.name?.toLowerCase().includes(partySearch.toLowerCase())),
    [parties, partySearch]
  );

  const summary = useMemo(() => transactions.reduce((acc, t) => {
    if (t.type === "Sale") acc.sale += t.total || 0;
    if (t.type === "Purchase") acc.purchase += t.total || 0;
    if (t.type === "Payment In") acc.moneyIn += t.total || 0;
    if (t.type === "Payment Out") acc.moneyOut += t.total || 0;
    return acc;
  }, { sale: 0, purchase: 0, moneyIn: 0, moneyOut: 0 }), [transactions]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-md border p-1 text-sm bg-gray-100">
                  <Button variant="ghost" size="sm" className="bg-white">Between</Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {fromDate ? format(fromDate, "dd/MM/yyyy") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} /></PopoverContent>
                  </Popover>
                  <span>To</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {toDate ? format(toDate, "dd/MM/yyyy") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} /></PopoverContent>
                  </Popover>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Select Party"
                    className="w-48"
                    value={selectedPartyId ? selectedPartyName : partySearch}
                    onChange={e => { setPartySearch(e.target.value); setSelectedPartyId(""); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  />
                  {showSuggestions && filtered.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded shadow w-48 max-h-48 overflow-y-auto">
                      {filtered.map((p: any) => (
                        <div key={p._id} className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                          onMouseDown={() => { setSelectedPartyId(p._id); setSelectedPartyName(p.name); setPartySearch(""); setShowSuggestions(false); }}>
                          {p.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground"><FileText className="w-5 h-5" /> Excel Report</Button>
                <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground"><Printer className="w-5 h-5" /> Print</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <Label>View :</Label>
              <RadioGroup value={view} onValueChange={(v) => setView(v as any)} className="flex items-center gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="vyapar" id="vyapar" /><Label htmlFor="vyapar">Vyapar</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="accounting" id="accounting" /><Label htmlFor="accounting">Accounting</Label></div>
              </RadioGroup>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead><div className="flex items-center">DATE <Filter className="h-3 w-3 ml-1" /></div></TableHead>
                    <TableHead><div className="flex items-center">TYPE <Filter className="h-3 w-3 ml-1" /></div></TableHead>
                    <TableHead><div className="flex items-center">REF NO. <Filter className="h-3 w-3 ml-1" /></div></TableHead>
                    <TableHead className="text-right">TOTAL</TableHead>
                    {view === "accounting" && <>
                      <TableHead className="text-right">DEBIT</TableHead>
                      <TableHead className="text-right">CREDIT</TableHead>
                    </>}
                    <TableHead className="text-right">BALANCE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="h-32 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></TableCell></TableRow>
                  ) : transactions.length > 0 ? (
                    transactions.map((t: any) => (
                      <TableRow key={t._id}>
                        <TableCell>{t.date ? format(new Date(t.date), "dd/MM/yyyy") : "-"}</TableCell>
                        <TableCell><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.type === "Sale" ? "bg-teal-100 text-teal-700" : t.type === "Purchase" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>{t.type}</span></TableCell>
                        <TableCell>{t.refNo || "-"}</TableCell>
                        <TableCell className="text-right">₹{(t.total || 0).toFixed(2)}</TableCell>
                        {view === "accounting" && <>
                          <TableCell className="text-right text-red-600">{t.debit > 0 ? `₹${t.debit.toFixed(2)}` : "-"}</TableCell>
                          <TableCell className="text-right text-teal-600">{t.credit > 0 ? `₹${t.credit.toFixed(2)}` : "-"}</TableCell>
                        </>}
                        <TableCell className={`text-right font-medium ${(t.balance || 0) >= 0 ? "text-teal-600" : "text-red-500"}`}>
                          ₹{Math.abs(t.balance || 0).toFixed(2)} {(t.balance || 0) >= 0 ? "Dr" : "Cr"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={7} className="h-48 text-center text-muted-foreground">{selectedPartyId ? "No transactions found for this party." : "Select a party to view statement."}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-auto pt-4">
        <Accordion type="single" collapsible defaultValue="summary">
          <AccordionItem value="summary" className="border-t border-b-0">
            <AccordionTrigger className="font-semibold bg-white p-4 shadow-sm rounded-t-md">Party Statement Summary</AccordionTrigger>
            <AccordionContent className="bg-white p-6 shadow-sm rounded-b-md">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                  <div><div className="font-semibold">Total Sale: ₹{summary.sale.toFixed(2)}</div><div className="text-xs text-muted-foreground">(Sale - Sale Return)</div></div>
                  <div><div className="font-semibold">Total Purchase: ₹{summary.purchase.toFixed(2)}</div></div>
                  <div><div className="font-semibold">Total Money-in: ₹{summary.moneyIn.toFixed(2)}</div></div>
                  <div><div className="font-semibold">Total Money-out: ₹{summary.moneyOut.toFixed(2)}</div></div>
                </div>
                <div className="border-l pl-6 ml-6 text-center">
                  <div className="text-sm font-medium text-muted-foreground">{closingBalance >= 0 ? "Total Receivable" : "Total Payable"}</div>
                  <div className={`text-2xl font-bold ${closingBalance >= 0 ? "text-teal-600" : "text-red-500"}`}>₹{Math.abs(closingBalance).toFixed(2)}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
