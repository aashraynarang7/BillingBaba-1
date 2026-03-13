"use client"; // ===== YEH LINE ADD KARNA ZAROORI HAI =====

import Link from "next/link";
import {
  Plus,
  Settings,
  TrendingUp,
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

export default function SaleInvoicesPage() {
  return (
    <div className="flex flex-col h-full space-y-6 bg-white p-6 rounded-lg">
      {/* Page Header */}
      <header className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sale Invoices</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/sales/add">
            <Button className="bg-primary-red hover:bg-red-700 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Add Sale
            </Button>
          </Link>
          <Settings className="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>
      </header>

      {/* Filters */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 flex items-center gap-4 text-sm">
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
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Total Sales Amount</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">₹ 0</p>
          </div>
          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center">
            0% <TrendingUp className="w-3 h-3 ml-1" />
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <span>
            Received: <span className="font-semibold text-gray-700">₹ 0</span>
          </span>
          <span className="mx-2">|</span>
          <span>
            Balance: <span className="font-semibold text-gray-700">₹ 0</span>
          </span>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white border-none rounded-lg mt-4">
        <img
          src="https://i.imgur.com/g0t4mJk.png"
          alt="No Data"
          className="w-36 h-36 opacity-80"
        />
        <h2 className="text-lg font-semibold text-gray-800 mt-4">
          No Transactions to show
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          You haven't added any transactions yet.
        </p>
        <Link href="/dashboard/sales/add">
          <Button className="bg-primary-red hover:bg-red-700 text-white mt-6 font-semibold px-6 py-3">
            <Plus className="w-4 h-4 mr-2" /> Add Sale
          </Button>
        </Link>
      </div>
    </div>
  );
}
