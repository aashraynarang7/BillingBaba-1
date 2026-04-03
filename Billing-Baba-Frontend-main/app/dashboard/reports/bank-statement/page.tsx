"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Printer, FileSpreadsheet, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface BankAccount {
  _id: string;
  accountName: string;
  openingBalance: number;
  asOfDate?: string;
  currentBalance: number;
}

interface RawTransaction {
  id: string;
  type: string;
  name?: string;
  date: string;
  amount: number;
  isIn: boolean;
}

interface DisplayRow {
  id: string;
  date: Date;
  description: string;
  withdrawal: number;
  deposit: number;
  balance: number;
  isForward?: boolean;
}

export default function BankStatementPage() {
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [transactions, setTransactions] = useState<RawTransaction[]>([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);

  // Load bank accounts
  useEffect(() => {
    const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
    if (!companyId) return;
    setLoadingAccounts(true);
    fetch(`${API_BASE}/bank-accounts?companyId=${companyId}`, { headers: getHeaders() })
      .then((r) => r.json())
      .then((data: BankAccount[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setBankAccounts(data);
          setSelectedBankId(data[0]._id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAccounts(false));
  }, []);

  // Load transactions when bank or dates change
  const loadTransactions = useCallback(async () => {
    if (!selectedBankId) return;
    const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null;
    if (!companyId) return;
    setLoadingTx(true);
    try {
      const res = await fetch(
        `${API_BASE}/bank-accounts/${selectedBankId}/transactions?companyId=${companyId}`,
        { headers: getHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setOpeningBalance(Number(data.account?.openingBalance) || 0);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoadingTx(false);
    }
  }, [selectedBankId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const displayRows = useMemo((): DisplayRow[] => {
    // Filter to date range
    const filtered = transactions.filter((tx) => {
      const d = new Date(tx.date);
      return d >= fromDate && d <= toDate;
    });

    // Sort ascending by date
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const rows: DisplayRow[] = [];

    // Opening balance forward row
    rows.push({
      id: "forward",
      date: fromDate,
      description: "Bank balance forward",
      withdrawal: 0,
      deposit: 0,
      balance: openingBalance,
      isForward: true,
    });

    let runningBalance = openingBalance;
    sorted.forEach((tx) => {
      if (tx.isIn) {
        runningBalance += tx.amount;
        rows.push({
          id: tx.id,
          date: new Date(tx.date),
          description: tx.name || tx.type || "Transaction",
          withdrawal: 0,
          deposit: tx.amount,
          balance: runningBalance,
        });
      } else {
        runningBalance -= tx.amount;
        rows.push({
          id: tx.id,
          date: new Date(tx.date),
          description: tx.name || tx.type || "Transaction",
          withdrawal: tx.amount,
          deposit: 0,
          balance: runningBalance,
        });
      }
    });

    return rows;
  }, [transactions, fromDate, toDate, openingBalance]);

  const finalBalance = displayRows.length > 0 ? displayRows[displayRows.length - 1].balance : openingBalance;

  const handlePrint = () => window.print();

  const handleExcel = async () => {
    const xlsx = await import("xlsx");
    const rows = displayRows.map((row) => ({
      Date: format(row.date, "dd/MM/yyyy"),
      Description: row.description,
      "Withdrawal Amount": row.withdrawal || "",
      "Deposit Amount": row.deposit || "",
      "Balance Amount": row.balance,
    }));
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Bank Statement");
    xlsx.writeFile(wb, "bank-statement.xlsx");
  };

  const selectedAccount = bankAccounts.find((a) => a._id === selectedBankId);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-800">Bank Statement</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-blue-600 border-blue-300">
            <Share2 className="h-4 w-4" />
            Share With Accountant
          </Button>
          <Button variant="outline" size="sm" onClick={handleExcel} className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 py-3 border-b bg-gray-50 flex-wrap">
        {/* Bank selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Bank name</span>
          {loadingAccounts ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Select value={selectedBankId} onValueChange={setSelectedBankId}>
              <SelectTrigger className="w-52 h-8 text-sm">
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((acc) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* From Date */}
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              {format(fromDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(d) => { if (d) { setFromDate(d); setFromOpen(false); } }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-sm text-gray-500">to</span>

        {/* To Date */}
        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              {format(toDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(d) => { if (d) { setToDate(d); setToOpen(false); } }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Account info */}
      {selectedAccount && (
        <div className="px-6 py-2 bg-blue-50 border-b text-sm text-blue-800">
          Account: <strong>{selectedAccount.accountName}</strong> | Opening Balance:{" "}
          <strong>₹{selectedAccount.openingBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong> | Current Balance:{" "}
          <strong>₹{selectedAccount.currentBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
        </div>
      )}

      {/* Transactions heading */}
      <div className="px-6 py-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Transactions</h2>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loadingTx ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-medium text-gray-600">DATE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">DESCRIPTION</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">WITHDRAWAL AMOUNT</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">DEPOSIT AMOUNT</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">BALANCE AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No transactions found for the selected period.
                  </td>
                </tr>
              ) : (
                displayRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b ${row.isForward ? "bg-gray-50 font-medium" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-4 py-3 text-gray-600">{format(row.date, "dd/MM/yyyy")}</td>
                    <td className="px-4 py-3 text-gray-800">{row.description}</td>
                    <td className="px-4 py-3 text-right text-red-600">
                      {row.withdrawal > 0
                        ? `₹${row.withdrawal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600">
                      {row.deposit > 0
                        ? `₹${row.deposit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      ₹{row.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer balance */}
      <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-end text-sm font-semibold text-gray-700 gap-4">
        <span>Balance</span>
        <span className="text-gray-900 text-base">
          ₹{finalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
