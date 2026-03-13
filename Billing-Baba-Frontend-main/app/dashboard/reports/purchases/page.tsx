"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Plus,
  Settings,
  TrendingDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { fetchPurchases } from "@/lib/api";
import { Transaction } from "@/lib/types";
import TransactionsTable from "@/app/dashboard/sales/component/TransactionsTable";

export default function PurchaseReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPurchases({ type: 'BILL' });
        const mappedPurchases: Transaction[] = data.map((p: any) => ({
          id: p._id,
          date: p.billDate ? format(new Date(p.billDate), "dd/MM/yyyy") : "-",
          invoiceNo: p.billNumber || "-",
          partyName: p.partyId?.name || "Unknown",
          transactionType: 'Purchase Bill',
          paymentType: p.paymentType || "Credit",
          amount: Number(p.grandTotal) || 0,
          balance: Number(p.balanceDue) || 0,
          isPaid: Number(p.balanceDue || 0) <= 0
        }));

        // Sort by date (descending)
        const sorted = mappedPurchases.sort((a, b) => {
          const parseDate = (dString: string) => {
            if (!dString || dString === '-') return new Date(0);
            const [d, m, y] = dString.split('/').map(Number);
            return new Date(y, m - 1, d);
          };
          return parseDate(b.date).getTime() - parseDate(a.date).getTime();
        });

        setTransactions(sorted);
      } catch (error) {
        console.error("Failed to load purchases", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = transactions.reduce((sum, t) => sum + t.balance, 0);
  const totalPaid = totalAmount - totalBalance;

  return (
    <div className="flex flex-col h-full space-y-6 bg-white p-6 rounded-lg">
      <header className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Purchase Bills Report</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/purchases/bills">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded">
              <Plus className="w-4 h-4 mr-2" /> Add Purchase Bill
            </Button>
          </Link>
          <Settings className="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>
      </header>

      {/* Filters */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 flex items-center xl:flex-row flex-col gap-4 text-sm">
          <span className="text-gray-600">Filter by :</span>
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[150px] bg-gray-50">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="w-[250px] justify-start text-left font-normal text-gray-500 bg-gray-50"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            01/09/2025 To 30/09/2025
          </Button>
          <Select defaultValue="all-firms">
            <SelectTrigger className="w-[150px] bg-gray-50">
              <SelectValue placeholder="Select firm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-firms">All Firms</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <div className="bg-[#f3f4f6] p-5 rounded-lg border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-600">Total Purchase Amount</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">₹ {totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="mt-4 sm:mt-0 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center">
            0% <TrendingDown className="w-3 h-3 ml-1" />
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <span>
            Paid: <span className="font-semibold text-gray-700">₹ {totalPaid.toLocaleString('en-IN')}</span>
          </span>
          <span className="mx-2">|</span>
          <span>
            Balance: <span className="font-semibold text-gray-700">₹ {totalBalance.toLocaleString('en-IN')}</span>
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="w-full overflow-hidden flex-1 mt-4 border rounded-lg">
          <TransactionsTable transactions={transactions} showToolbar={true} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white border-none rounded-lg mt-4 py-8">
          <Image
            src="https://www.cflowapps.com/wp-content/uploads/2024/04/purchase-requisition.jpg"
            alt="No Transactions"
            width={160}
            height={160}
          />
          <h2 className="text-lg font-semibold text-gray-800 mt-4">
            No Transactions to show
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            You haven't added any purchases yet.
          </p>
          <Link href="/dashboard/purchases/bills">
            <Button className="bg-red-600 hover:bg-red-700 text-white mt-6 font-semibold px-6 py-3 rounded-full text-base">
              <Plus className="w-5 h-5 mr-2" /> Add Purchase
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
