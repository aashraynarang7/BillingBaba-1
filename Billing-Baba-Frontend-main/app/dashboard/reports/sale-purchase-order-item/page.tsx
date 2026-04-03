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

type ItemRow = { itemName: string; quantity: number; amount: number };
const n2 = (v: number) => `₹ ${v.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function SalePurchaseOrderItemPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [partyFilter, setPartyFilter] = useState("");
  const [orderType, setOrderType] = useState("SALE ORDER");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allOrders, setAllOrders] = useState<any[]>([]);
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
      setAllOrders([
        ...sales.map((s: any) => ({ ...s, _type: "Sale Order" })),
        ...purchases.map((p: any) => ({ ...p, _type: "Purchase Order" })),
      ]);
    } catch (err) {
      console.error("Order item fetch error:", err);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, orderType, companyId]);

  useEffect(() => { loadData(); }, [loadData]);

  const rows: ItemRow[] = useMemo(() => {
    let orders = allOrders;
    if (partyFilter)
      orders = orders.filter(o =>
        (o.partyId?.name || o.partyName || "").toLowerCase().includes(partyFilter.toLowerCase())
      );
    if (statusFilter !== "all") orders = orders.filter(o => o.status === statusFilter);

    const map = new Map<string, ItemRow>();
    for (const order of orders) {
      if (order.status === "Cancelled") continue;
      for (const item of (order.items || [])) {
        const name = (item.name || "Unknown").trim();
        if (!map.has(name)) map.set(name, { itemName: name, quantity: 0, amount: 0 });
        const row = map.get(name)!;
        row.quantity += item.quantity ?? 0;
        row.amount += item.amount ?? 0;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [allOrders, partyFilter, statusFilter]);

  const totals = useMemo(
    () => rows.reduce((acc, r) => ({ qty: acc.qty + r.quantity, amt: acc.amt + r.amount }), { qty: 0, amt: 0 }),
    [rows]
  );

  const handleExportExcel = async () => {
    const xlsx: any = await import("xlsx");
    const data = [
      ...rows.map(r => ({ "Item Name": r.itemName, Quantity: r.quantity, Amount: r.amount })),
      { "Item Name": "Total", Quantity: totals.qty, Amount: totals.amt },
    ];
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "OrderItems");
    xlsx.writeFile(wb, `SalePurchaseOrderItems_${format(fromDate!, "MMM-yyyy")}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b">
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="all-firms">
            <SelectTrigger className="w-32 h-8 text-sm text-teal-600 font-semibold border-teal-300"><SelectValue /></SelectTrigger>
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
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all-users">ALL USERS</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleExportExcel}><FileSpreadsheet className="h-4 w-4 text-teal-600" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b bg-gray-50/50">
        <span className="text-xs font-semibold text-gray-500 uppercase">FILTERS</span>
        <Input placeholder="Party filter" className="w-40 h-8 text-sm" value={partyFilter} onChange={e => setPartyFilter(e.target.value)} />
        <Select value={orderType} onValueChange={setOrderType}>
          <SelectTrigger className="w-44 h-8 text-sm text-blue-600 border-blue-300"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="SALE ORDER">SALE ORDER</SelectItem>
            <SelectItem value="PURCHASE ORDER">PURCHASE ORDER</SelectItem>
            <SelectItem value="ALL">ALL</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Order Open</SelectItem>
            <SelectItem value="CLOSED">Order Completed</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-godown">
          <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
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
              <tr className="border-b border-gray-200 bg-white text-sm text-gray-700">
                <th className="px-4 py-3 text-left font-medium">Item Name</th>
                <th className="px-4 py-3 text-right font-medium">Quantity</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={3} className="py-16 text-center text-gray-400">No order items for the selected period.</td></tr>
              ) : (
                rows.map(row => (
                  <tr key={row.itemName} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-800">{row.itemName}</td>
                    <td className="px-4 py-2.5 text-right">{row.quantity}</td>
                    <td className="px-4 py-2.5 text-right">{n2(row.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-300 font-bold bg-gray-50">
                  <td className="px-4 py-2.5">Total</td>
                  <td className="px-4 py-2.5 text-right">{totals.qty}</td>
                  <td className="px-4 py-2.5 text-right">{n2(totals.amt)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-white flex justify-between text-sm font-semibold">
        <span className="text-teal-600">Total Quantity: {totals.qty}</span>
        <span className="text-teal-600">Total Amount: {n2(totals.amt)}</span>
      </div>
    </div>
  );
}
