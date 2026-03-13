"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Printer, Search, Filter, FileSpreadsheet,
  Calendar as CalendarIcon, Loader2,
} from "lucide-react";
import { format } from "date-fns";

// ── Types ─────────────────────────────────────────────────────────────────────

type Party = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  partyGroup: string;
  partyType: string;
  currentBalance: number;
  creditLimit: number;
  isCreditLimitEnabled: boolean;
};

// ── Constants ─────────────────────────────────────────────────────────────────

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

const n2 = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── TH helper ─────────────────────────────────────────────────────────────────

const TH = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center gap-1 p-3 text-xs font-bold text-gray-500 uppercase ${className}`}>
    <span>{children}</span>
    <Filter className="w-3 h-3 text-gray-400 cursor-pointer flex-shrink-0" />
  </div>
);

const GRID = "grid grid-cols-[56px_2.5fr_2fr_1.8fr_1.8fr_1.8fr_1.6fr]";

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AllPartiesPage() {
  const [allParties, setAllParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [partyTypeFilter, setPartyTypeFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchParties = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/parties?companyId=${companyId}`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch parties");
      const data = await res.json();
      setAllParties(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      console.error("All parties fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchParties(); }, [fetchParties]);

  // ── Unique groups ─────────────────────────────────────────────────────────────

  const uniqueGroups = useMemo(
    () => ["all", ...Array.from(new Set(allParties.map(p => p.partyGroup).filter(Boolean))).sort()],
    [allParties]
  );

  // ── Filtered parties ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let data = allParties;
    if (partyTypeFilter === "customer") data = data.filter(p => p.partyType === "customer");
    else if (partyTypeFilter === "supplier") data = data.filter(p => p.partyType === "supplier");
    if (groupFilter !== "all") data = data.filter(p => p.partyGroup === groupFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        (p.phone || "").includes(q)
      );
    }
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [allParties, partyTypeFilter, groupFilter, searchTerm]);

  // ── Totals ────────────────────────────────────────────────────────────────────

  const { totalReceivable, totalPayable } = useMemo(() => ({
    totalReceivable: filtered
      .filter(p => p.currentBalance > 0)
      .reduce((s, p) => s + p.currentBalance, 0),
    totalPayable: filtered
      .filter(p => p.currentBalance < 0)
      .reduce((s, p) => s + Math.abs(p.currentBalance), 0),
  }), [filtered]);

  // ── Select all ────────────────────────────────────────────────────────────────

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p._id));

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) setSelected(new Set(filtered.map(p => p._id)));
    else setSelected(new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const data = filtered.map(p => ({
      "Party Name": p.name,
      "Email": p.email || "---",
      "Phone No.": p.phone || "---",
      "Receivable Balance": p.currentBalance > 0 ? p.currentBalance : 0,
      "Payable Balance": p.currentBalance < 0 ? Math.abs(p.currentBalance) : 0,
      "Credit Limit": p.isCreditLimitEnabled ? p.creditLimit : "---",
    }));
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "AllParties");
    xlsx.writeFile(wb, "AllParties.xlsx");
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <main className="flex-1 p-4 flex flex-col overflow-hidden">
        <div className="border rounded-lg h-full flex flex-col bg-white overflow-hidden">

          {/* ── Filters Header ── */}
          <header className="flex justify-between items-center px-4 py-3 border-b flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Date Filter toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="date-filter"
                  checked={dateFilterEnabled}
                  onCheckedChange={v => setDateFilterEnabled(Boolean(v))}
                />
                <Label htmlFor="date-filter" className="font-semibold text-gray-700 cursor-pointer">
                  Date Filter
                </Label>
              </div>

              {/* Date pickers (shown only when enabled) */}
              {dateFilterEnabled && (
                <div className="flex items-center border rounded-md h-9 px-1 gap-0.5 bg-white">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                        {fromDate ? format(fromDate, "dd/MM/yyyy") : "From"}
                        <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-gray-400">–</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                        {toDate ? format(toDate, "dd/MM/yyyy") : "To"}
                        <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={toDate} onSelect={setToDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Party type filter */}
              <Select value={partyTypeFilter} onValueChange={setPartyTypeFilter}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All parties</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="supplier">Suppliers</SelectItem>
                </SelectContent>
              </Select>

              {/* Group filter */}
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uniqueGroups.map(g => (
                    <SelectItem key={g} value={g}>{g === "all" ? "All Groups" : g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
                onClick={handleExportExcel}
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-700" />
                <span>Excel Report</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center h-auto p-0 text-xs text-gray-600 gap-0.5"
                onClick={() => window.print()}
              >
                <Printer className="w-5 h-5 text-gray-700" />
                <span>Print</span>
              </Button>
            </div>
          </header>

          {/* ── Search ── */}
          <div className="px-4 py-2 border-b relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder=""
              className="pl-9 h-8 max-w-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ── Column headers ── */}
          <div className={`${GRID} border-b bg-gray-50 items-center shrink-0`}>
            {/* Checkbox + # */}
            <div className="flex items-center gap-2 p-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-xs font-bold text-gray-500">#</span>
            </div>
            <TH>Party Name</TH>
            <TH>Email</TH>
            <TH>Phone No.</TH>
            <TH>Receivable Bala...</TH>
            <TH>Payable Balance</TH>
            <TH>Credit Limit</TH>
          </div>

          {/* ── Rows ── */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center gap-1">
                <p className="text-gray-500 font-medium">No parties to display.</p>
                <p className="text-sm text-gray-400">Add parties to see them here.</p>
              </div>
            ) : (
              filtered.map((party, idx) => {
                const isChecked = selected.has(party._id);
                const receivable = party.currentBalance > 0 ? party.currentBalance : null;
                const payable = party.currentBalance < 0 ? Math.abs(party.currentBalance) : null;
                const isZeroReceivable = party.currentBalance === 0 && party.partyType === "customer";

                return (
                  <div
                    key={party._id}
                    className={`${GRID} border-b text-sm items-center hover:bg-blue-50/30 transition-colors ${isChecked ? "bg-blue-50/50" : ""}`}
                  >
                    {/* Checkbox + # */}
                    <div className="flex items-center gap-2 p-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={checked => handleSelectOne(party._id, Boolean(checked))}
                      />
                      <span className="text-gray-400 text-xs">{idx + 1}</span>
                    </div>

                    {/* Party Name */}
                    <div className="p-3 font-semibold text-gray-800 border-r text-sm">
                      {party.name}
                    </div>

                    {/* Email */}
                    <div className="p-3 text-gray-500 border-r text-xs">
                      {party.email || "---"}
                    </div>

                    {/* Phone */}
                    <div className="p-3 text-gray-700 border-r text-xs">
                      {party.phone || "---"}
                    </div>

                    {/* Receivable */}
                    <div className="p-3 border-r text-right text-xs">
                      {receivable !== null ? (
                        <span className="text-teal-600 font-medium">₹ {n2(receivable)}</span>
                      ) : isZeroReceivable ? (
                        <span className="text-teal-600 font-medium">₹ 0.00</span>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </div>

                    {/* Payable */}
                    <div className="p-3 border-r text-right text-xs">
                      {payable !== null ? (
                        <span className="text-red-500 font-medium">₹ {n2(payable)}</span>
                      ) : party.currentBalance === 0 && party.partyType === "supplier" ? (
                        <span className="text-teal-600 font-medium">₹ 0.00</span>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </div>

                    {/* Credit Limit */}
                    <div className="p-3 text-right text-xs">
                      {party.isCreditLimitEnabled && party.creditLimit > 0 ? (
                        <span className="text-gray-700">₹ {n2(party.creditLimit)}</span>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="flex justify-between px-6 py-3 border-t bg-white font-semibold text-sm shrink-0">
        <div className="text-gray-700">
          Total Receivable:{" "}
          <span className="text-teal-600">₹ {n2(totalReceivable)}</span>
        </div>
        <div className="text-gray-700">
          Total Payable:{" "}
          <span className="text-red-500">₹ {n2(totalPayable)}</span>
        </div>
      </footer>
    </div>
  );
}
