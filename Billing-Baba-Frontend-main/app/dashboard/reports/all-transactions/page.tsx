// app/dashboard/reports/all-transactions/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Printer,
  Search,
  Filter,
  FileText,
  MoreVertical,
} from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  refNo: string;
  partyName: string;
  category: string;
  type: string;
  total: number;
  received: number;
  balance: number;
};

// Sample data removed
const sampleTransactions: Transaction[] = [];

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

import { useEffect } from "react";
import { format } from "date-fns";
import {
  fetchSales,
  fetchPurchases,
  fetchPaymentIn,
  fetchSaleOrders,
  fetchEstimates,
  fetchCreditNotes
} from "@/lib/api";

// ... (imports remain similar)

export default function AllTransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Store full dataset
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]); // Store filtered dataset
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadData = async () => {
    setIsLoading(true);
    try {
      // ... (fetch logic same as before) ...
      const [sales, purchases, paymentsIn, orders, estimates, creditNotes] = await Promise.all([
        fetchSales(), fetchPurchases(), fetchPaymentIn(), fetchSaleOrders(), fetchEstimates(), fetchCreditNotes()
      ]);

      let allData: Transaction[] = [];

      const getStatus = (balance: number, total: number, due?: string) => {
        if (total > 0 && balance <= 0) return "Paid";
        if (balance > 0) return "Unpaid";
        return "Closed";
      };

      // Map Sales
      sales.forEach((s: any) => {
        allData.push({
          id: s._id,
          date: s.invoiceDate ? format(new Date(s.invoiceDate), "dd/MM/yyyy") : "-",
          refNo: s.invoiceNumber || "-",
          partyName: s.partyName || s.partyId?.name || "Unknown",
          category: "Sale",
          type: "Sale",
          total: s.grandTotal || 0,
          received: s.receivedAmount || 0,
          balance: s.balanceDue || 0,
          dueDate: s.dueDate ? format(new Date(s.dueDate), "dd/MM/yyyy") : "-",
          status: getStatus(s.balanceDue, s.grandTotal)
        });
      });

      // Map Purchases
      purchases.forEach((p: any) => {
        allData.push({
          id: p._id,
          date: p.purchaseDate ? format(new Date(p.purchaseDate), "dd/MM/yyyy") : "-",
          refNo: p.invoiceNo || "-",
          partyName: p.partyName || p.partyId?.name || "Unknown",
          category: "Purchase",
          type: "Purchase",
          total: p.totalAmount || 0,
          received: p.paidAmount || 0,
          balance: p.balanceDue || 0,
          dueDate: p.dueDate ? format(new Date(p.dueDate), "dd/MM/yyyy") : "-",
          status: getStatus(p.balanceDue, p.totalAmount)
        });
      });

      // Map Payments In
      paymentsIn.forEach((p: any) => {
        allData.push({
          id: p._id,
          date: p.date ? format(new Date(p.date), "dd/MM/yyyy") : "-",
          refNo: p.receiptNo || "-",
          partyName: p.partyId?.name || "Unknown",
          category: "Payment",
          type: "Payment In",
          total: p.amount || 0,
          received: p.amount || 0,
          balance: 0,
          dueDate: "-",
          status: "Used"
        });
      });

      // Map Sale Orders
      orders.forEach((o: any) => {
        allData.push({
          id: o._id,
          date: o.orderDate ? format(new Date(o.orderDate), "dd/MM/yyyy") : "-",
          refNo: o.orderNumber || "-",
          partyName: o.partyName || o.partyId?.name || "Unknown",
          category: "Order",
          type: "Sale Order",
          total: o.grandTotal || 0,
          received: o.receivedAmount || 0,
          balance: o.balanceDue || 0,
          dueDate: o.dueDate ? format(new Date(o.dueDate), "dd/MM/yyyy") : "-",
          status: "Open"
        });
      });

      // Map Estimates
      estimates.forEach((e: any) => {
        allData.push({
          id: e._id,
          date: e.invoiceDate ? format(new Date(e.invoiceDate), "dd/MM/yyyy") : "-",
          refNo: e.refNo || "-",
          partyName: e.partyName || e.partyId?.name || "Unknown",
          category: "Estimate",
          type: "Estimate/Quotation",
          total: e.grandTotal || 0,
          received: 0,
          balance: 0,
          dueDate: "-",
          status: "Open"
        });
      });

      // Map Credit Notes
      creditNotes.forEach((cn: any) => {
        allData.push({
          id: cn._id,
          date: cn.creditNoteDate ? format(new Date(cn.creditNoteDate), "dd/MM/yyyy") : "-",
          refNo: cn.returnNo || "-",
          partyName: cn.partyName || cn.partyId?.name || "Unknown",
          category: "Return",
          type: "Credit Note",
          total: cn.grandTotal || 0,
          received: 0,
          balance: cn.balanceDue || 0,
          dueDate: "-",
          status: "Closed"
        });
      });

      // Sort
      const parseDate = (d: string) => {
        if (!d || d === '-') return 0;
        const [day, month, year] = d.split('/');
        return new Date(`${year}-${month}-${day}`).getTime();
      };
      allData.sort((a, b) => parseDate(b.date) - parseDate(a.date));

      setAllTransactions(allData);
      setFilteredTransactions(allData);

    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = allTransactions;

    // Filter by Type
    if (typeFilter !== 'all') {
      // Determine type string matching
      const mapType: Record<string, string> = {
        'sale': 'Sale',
        'purchase': 'Purchase',
        'payment_in': 'Payment In',
        'sale_order': 'Sale Order',
        'estimate': 'Estimate/Quotation',
        'credit_note': 'Credit Note'
      };
      const targetType = mapType[typeFilter];
      if (targetType) {
        result = result.filter(t => t.type === targetType);
      }
    }

    // Filter by Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        t => t.partyName.toLowerCase().includes(lower) ||
          t.refNo.toLowerCase().includes(lower)
      );
    }

    setFilteredTransactions(result);
  }, [typeFilter, searchTerm, allTransactions]);

  return (
    <div className="space-y-4">
      {/* Filters Card */}
      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xl font-bold p-1">
                    This Month <ChevronDown className="w-5 h-5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Today</DropdownMenuItem>
                  <DropdownMenuItem>This Week</DropdownMenuItem>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                  <DropdownMenuItem>This Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2 rounded-md border p-1 text-sm bg-gray-100 dark:bg-gray-800">
                <Button variant="ghost" size="sm" className="bg-white dark:bg-gray-700">Between</Button>
                <Input type="text" defaultValue="01/09/2025" className="w-28 h-8 border-none bg-transparent" />
                <span>To</span>
                <Input type="text" defaultValue="30/09/2025" className="w-28 h-8 border-none bg-transparent" />
              </div>
              <Select defaultValue="all-firms">
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all-firms">ALL FIRMS</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-blue-100 text-blue-600 hover:bg-blue-200">Share With Accountant</Button>
              <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground"><FileText className="w-5 h-5" /> Excel Report</Button>
              <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground"><Printer className="w-5 h-5" /> Print</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transaction</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="payment_in">Payment In</SelectItem>
                <SelectItem value="sale_order">Sale Order</SelectItem>
                <SelectItem value="estimate">Estimate</SelectItem>
                <SelectItem value="credit_note">Credit Note</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead><div className="flex items-center">DATE <Filter className="h-3 w-3 ml-1" /></div></TableHead>
                  <TableHead><div className="flex items-center">REF NO. <Filter className="h-3 w-3 ml-1" /></div></TableHead>
                  <TableHead>PARTY NAME</TableHead>
                  <TableHead><div className="flex items-center">CATEGORY <Filter className="h-3 w-3 ml-1" /></div></TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead className="text-right">TOTAL</TableHead>
                  <TableHead className="text-right">RECEIVED</TableHead>
                  <TableHead className="text-right">BALANCE</TableHead>
                  <TableHead>DUE DATE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>PRINT</TableHead>
                </TableRow>
              </TableHeader>
              {filteredTransactions.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={12}>
                      <div className="flex flex-col items-center justify-center text-center py-20">
                        <EmptyStateIcon />
                        <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">No data available.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {filteredTransactions.map((tx, index) => (
                    <TableRow key={tx.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.refNo}</TableCell>
                      <TableCell className="font-medium">{tx.partyName}</TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className="text-right">{tx.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{tx.received.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">{tx.balance.toFixed(2)}</TableCell>
                      <TableCell>{tx.dueDate}</TableCell>
                      <TableCell>
                        <span className={`${tx.status === 'Paid' ? 'text-green-600' : tx.status === 'Unpaid' ? 'text-red-500' : 'text-blue-500'} font-medium`}>
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon"><Printer className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
