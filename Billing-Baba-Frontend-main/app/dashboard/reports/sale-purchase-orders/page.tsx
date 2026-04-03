"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, FileSpreadsheet, Printer, Loader2 } from "lucide-react";
import { format } from "date-fns";

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

type OrderRow = {
  _id: string;
  date: string;
  orderNo: string;
  name: string;
  dueDate: string;
  status: string;
  type: "Sale Order" | "Purchase Order";
  total: number;
  advance: number;
  balance: number;
  godown: string;
};

const statusLabel = (s: string) => {
  if (s === "OPEN") return "Order Open";
  if (s === "CLOSED" || s === "CONVERTED") return "Order Completed";
  if (s === "Cancelled") return "Cancelled";
  return s;
};

const statusColor = (s: string) => {
  if (s === "OPEN") return "text-blue-600";
  if (s === "CLOSED" || s === "CONVERTED") return "text-green-600";
  if (s === "Cancelled") return "text-red-500";
  return "text-gray-600";
};

const n2 = (v: number) => `₹ ${v.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function SalePurchaseOrdersPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [partyFilter, setPartyFilter] = useState("");
  const [orderType, setOrderType] = useState("SALE ORDER");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allData, setAllData] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

  const loadData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const start = new Date(fromDate!); start.setHours(0, 0, 0, 0);
      const end = new Date(toDate!); end.setHours(23, 59, 59, 999);
      const qs = `companyId=${companyId}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`;

      const fetchSale = orderType === "SALE ORDER" || orderType === "ALL";
      const fetchPurchase = orderType === "PURCHASE ORDER" || orderType === "ALL";

      const [saleRes, purchRes] = await Promise.all([
        fetchSale ? fetch(`${API_BASE}/sales?type=SO&${qs}`, { headers: getHeaders() }) : Promise.resolve(null),
        fetchPurchase ? fetch(`${API_BASE}/purchases?type=PO&${qs}`, { headers: getHeaders() }) : Promise.resolve(null),
      ]);

      const toArr = async (r: Response | null) => {
        if (!r || !r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : d.data ?? [];
      };

      const [sales, purchases] = await Promise.all([toArr(saleRes), toArr(purchRes)]);

      const rows: OrderRow[] = [
        ...sales.map((s: any) => ({
          _id: s._id,
          date: s.orderDate || s.createdAt,
          orderNo: s.orderNumber || "-",
          name: s.partyId?.name || s.partyName || "-",
          dueDate: s.dueDate || "",
          status: s.status || "OPEN",
          type: "Sale Order" as const,
          total: s.grandTotal || 0,
          advance: s.receivedAmount || 0,
          balance: s.balanceDue ?? (s.grandTotal - (s.receivedAmount || 0)),
          godown: s.godown || "",
        })),
        ...purchases.map((p: any) => ({
          _id: p._id,
          date: p.billDate || p.orderDate || p.createdAt,
          orderNo: p.orderNumber || p.invoiceNo || "-",
          name: p.partyId?.name || p.partyName || "-",
          dueDate: p.dueDate || "",
          status: p.status || "OPEN",
          type: "Purchase Order" as const,
          total: p.grandTotal || 0,
          advance: p.receivedAmount || p.paidAmount || 0,
          balance: p.balanceDue ?? (p.grandTotal - (p.receivedAmount || 0)),
          godown: p.godown || "",
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAllData(rows);
    } catch (err) {
      console.error("Sale/Purchase Orders fetch error:", err);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, orderType, companyId]);

  useEffect(() => { loadData(); }, [loadData]);

  const rows = useMemo(() => {
    let d = allData;
    if (partyFilter) d = d.filter(r => r.name.toLowerCase().includes(partyFilter.toLowerCase()));
    if (statusFilter !== "all") d = d.filter(r => r.status === statusFilter);
    return d;
  }, [allData, partyFilter, statusFilter]);

  const totalAmount = useMemo(() => rows.reduce((s, r) => s + r.total, 0), [rows]);

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const data = rows.map(r => ({
      Date: r.date ? format(new Date(r.date), "dd/MM/yyyy") : "-",
      "Order No.": r.orderNo,
      Name: r.name,
      "Due Date": r.dueDate ? format(new Date(r.dueDate), "dd/MM/yyyy") : "-",
      Status: statusLabel(r.status),
      Type: r.type,
      Total: r.total,
      Advance: r.advance,
      Balance: r.balance,
    }));
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "SalePurchaseOrders");
    xlsx.writeFile(wb, `SalePurchaseOrders_${format(fromDate!, "MMM-yyyy")}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b">
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="all-firms">
            <SelectTrigger className="w-32 h-8 text-sm text-teal-600 font-semibold border-teal-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent><SelectItem value="all-firms">ALL FIRMS</SelectItem></SelectContent>
          </Select>

          <div className="flex items-center border rounded-md h-8 px-2 gap-1">
            <span className="text-xs text-gray-500">From</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-1 py-0.5 text-xs gap-1">
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : "-"}
                  <CalendarIcon className="h-3 w-3 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} /></PopoverContent>
            </Popover>
            <span className="text-xs text-gray-500">To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-1 py-0.5 text-xs gap-1">
                  {toDate ? format(toDate, "dd/MM/yyyy") : "-"}
                  <CalendarIcon className="h-3 w-3 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} /></PopoverContent>
            </Popover>
          </div>

          <Select defaultValue="all-users">
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent><SelectItem value="all-users">ALL USERS</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleExportExcel}><FileSpreadsheet className="h-4 w-4 text-teal-600" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b bg-gray-50/50">
        <span className="text-xs font-semibold text-gray-500 uppercase">FILTERS</span>
        <Input
          placeholder="Party filter"
          className="w-40 h-8 text-sm"
          value={partyFilter}
          onChange={e => setPartyFilter(e.target.value)}
        />
        <Select value={orderType} onValueChange={setOrderType}>
          <SelectTrigger className="w-44 h-8 text-sm text-blue-600 border-blue-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SALE ORDER">SALE ORDER</SelectItem>
            <SelectItem value="PURCHASE ORDER">PURCHASE ORDER</SelectItem>
            <SelectItem value="ALL">ALL</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue placeholder="All Orders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="OPEN">Order Open</SelectItem>
            <SelectItem value="CLOSED">Order Completed</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-godown">
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent><SelectItem value="all-godown">All Godown</SelectItem></SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-white text-xs text-gray-500 font-semibold uppercase">
                <th className="px-3 py-2.5 text-left">DATE</th>
                <th className="px-3 py-2.5 text-left">Order No.</th>
                <th className="px-3 py-2.5 text-left">NAME</th>
                <th className="px-3 py-2.5 text-left">Due Date</th>
                <th className="px-3 py-2.5 text-left">Status</th>
                <th className="px-3 py-2.5 text-left">TYPE</th>
                <th className="px-3 py-2.5 text-right">TOTAL</th>
                <th className="px-3 py-2.5 text-right">ADVANCE</th>
                <th className="px-3 py-2.5 text-right">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-gray-400">No orders found for the selected period.</td></tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row._id} className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                    <td className="px-3 py-2.5 text-gray-600 text-xs whitespace-nowrap">
                      {row.date ? format(new Date(row.date), "dd/MM/yyyy, hh:mm aa") : "-"}
                    </td>
                    <td className="px-3 py-2.5 font-medium">{row.orderNo}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-800">{row.name}</td>
                    <td className="px-3 py-2.5 text-gray-600">
                      {row.dueDate ? format(new Date(row.dueDate), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className={`px-3 py-2.5 font-medium ${statusColor(row.status)}`}>
                      {statusLabel(row.status)}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{row.type}</td>
                    <td className="px-3 py-2.5 text-right">{n2(row.total)}</td>
                    <td className="px-3 py-2.5 text-right text-gray-500">{n2(row.advance)}</td>
                    <td className="px-3 py-2.5 text-right">{n2(row.balance)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-white text-right text-sm font-semibold">
        Total Amount:{" "}
        <span className="text-teal-600">{n2(totalAmount)}</span>
      </div>
    </div>
  );
}
