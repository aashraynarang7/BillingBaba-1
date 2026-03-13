"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Filter, MoreVertical, Search } from 'lucide-react'
import AdjustCashModal from '@/components/dashboard/AdjustCashModal'
import { fetchCashTransactions } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

interface Transaction {
  id: string;
  type: string;
  name: string;
  date: string;
  amount: number;
  isIn: boolean;
}

const CashInHandPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashInHand, setCashInHand] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchCashTransactions();
      setTransactions(data.transactions);
      setCashInHand(data.cashInHand);
    } catch (error) {
      console.error("Failed to load cash transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cash In Hand</h1>
          <div className="flex items-center mt-1">
            <span className={`text-2xl font-bold ${cashInHand >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(cashInHand)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <AdjustCashModal onSave={loadData}>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Adjust Cash
            </Button>
          </AdjustCashModal>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              placeholder="Search transactions..."
              className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <div className="rounded-md border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[150px]">Type <Filter className="inline h-3 w-3 ml-1" /></TableHead>
                  <TableHead>Name <Filter className="inline h-3 w-3 ml-1" /></TableHead>
                  <TableHead>Date <Filter className="inline h-3 w-3 ml-1" /></TableHead>
                  <TableHead className="text-right">Amount <Filter className="inline h-3 w-3 ml-1" /></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium text-gray-700">{tx.type}</TableCell>
                    <TableCell className="text-gray-600">{tx.name}</TableCell>
                    <TableCell className="text-gray-500">
                      {tx.date ? format(new Date(tx.date), 'dd/MM/yyyy, hh:mm a') : '-'}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${tx.isIn ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="mx-auto w-48 h-32 relative">
                <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center relative">
                  <span className="text-4xl">💸</span>
                </div>
              </div>
            </div>
            <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              No cash transactions found. Transactions will appear here when you make sales, purchases, or payments using Cash.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CashInHandPage