"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Building2, Printer, QrCode, MoreHorizontal, ChevronDown, Search, Filter } from 'lucide-react'
import AddBankAccountModal from '@/components/dashboard/AddBankAccountModal'
import { fetchBankAccounts, fetchBankTransactions } from '@/lib/api'
import { format } from 'date-fns'

interface BankAccount {
  _id: string;
  accountName: string;
  currentBalance: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  accountHolderName?: string;
  openingBalance: number;
}

interface Transaction {
  id: string;
  type: string;
  name: string;
  date: string;
  amount: number;
  isIn: boolean;
}

const BankAccountsPage = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(false)

  const loadAccounts = useCallback(async () => {
    const companyId = localStorage.getItem('activeCompanyId')
    if (!companyId) { setIsLoading(false); return; }
    try {
      const data = await fetchBankAccounts(companyId)
      setAccounts(data)
      if (data.length > 0) {
        setSelectedAccount(data[0])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadAccounts() }, [loadAccounts])

  useEffect(() => {
    if (!selectedAccount) return
    const load = async () => {
      setTxLoading(true)
      try {
        const data = await fetchBankTransactions(selectedAccount._id)
        setTransactions(data.transactions || [])
        // Refresh balance from server response
        setSelectedAccount(data.account)
      } catch (err) {
        console.error(err)
      } finally {
        setTxLoading(false)
      }
    }
    load()
  }, [selectedAccount?._id])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full p-12 text-gray-400">Loading...</div>
  }

  // --- EMPTY STATE ---
  if (accounts.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Banks</h1>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </Button>
        </div>
        <div className="border-t border-gray-200" />

        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Manage Multiple Bank Accounts
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            With Billing Baba you can manage multiple banks and payment types like UPI, Net Banking and Credit Card
          </p>

          <div className="mb-12">
            <div className="mx-auto w-64 h-40 relative">
              <img src="/dashboard/bank/bank.png" alt="Bank" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            {[
              { icon: <Printer className="h-6 w-6" />, title: 'Print Bank Details on Invoices', desc: 'Print account details on invoices and get payments via NEFT/RTGS/IMPS.' },
              { icon: <Building2 className="h-6 w-6" />, title: 'Unlimited Payment Types', desc: 'Record transactions by methods like Banks, UPI, Net Banking and Cards.' },
              { icon: <QrCode className="h-6 w-6" />, title: 'Print UPI QR Code on Invoices', desc: 'Print QR code on your invoices or send payment links to your customers.' },
            ].map((card) => (
              <div key={card.title} className="border rounded-xl p-6 text-center bg-white shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-50 text-blue-500">
                  {card.icon}
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>

          <AddBankAccountModal onSaved={loadAccounts}>
            <Button size="lg" className="text-white" style={{ backgroundColor: 'var(--primary-red)' }}>
              <Building2 className="h-5 w-5 mr-2" />
              + Add Bank Account
            </Button>
          </AddBankAccountModal>
        </div>
      </div>
    )
  }

  // --- DYNAMIC VIEW WITH ACCOUNTS ---
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Banks</h1>
        <AddBankAccountModal onSaved={loadAccounts}>
          <Button className="text-white bg-red-600 hover:bg-red-700">
            + Add Bank
          </Button>
        </AddBankAccountModal>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Account List */}
        <div className="w-72 border-r bg-white flex flex-col shrink-0">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search by Account/Amount"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* List Header */}
          <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
            <span className="flex items-center gap-1">Account Name <ChevronDown className="h-3 w-3" /></span>
            <span>Amount</span>
          </div>

          {/* Account Rows */}
          <div className="flex-1 overflow-y-auto">
            {accounts.map((acc) => (
              <div
                key={acc._id}
                onClick={() => setSelectedAccount(acc)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b hover:bg-blue-50 transition-colors ${selectedAccount?._id === acc._id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800">{acc.accountName}</p>
                  {acc.bankName && <p className="text-xs text-gray-400 mt-0.5">{acc.bankName}</p>}
                </div>
                <span className={`text-sm font-bold ${acc.currentBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {acc.currentBalance?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Account Detail + Transactions */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {selectedAccount ? (
            <>
              {/* Account Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedAccount.accountName}</h2>
                  {selectedAccount.bankName && (
                    <p className="text-sm text-gray-500">{selectedAccount.bankName}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-2 border-red-400 text-red-600 hover:bg-red-50">
                  Deposit / Withdraw <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Account Details Cards */}
              <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Current Balance', value: `₹ ${selectedAccount.currentBalance?.toFixed(2)}`, color: selectedAccount.currentBalance >= 0 ? 'text-green-600' : 'text-red-500' },
                  { label: 'Account Number', value: selectedAccount.accountNumber || '—', color: 'text-gray-800' },
                  { label: 'IFSC Code', value: selectedAccount.ifscCode || '—', color: 'text-gray-800' },
                  { label: 'Account Holder', value: selectedAccount.accountHolderName || '—', color: 'text-gray-800' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-lg border p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`font-semibold text-sm ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* UPI QR Code Section */}
              {selectedAccount.upiId && (
                <div className="px-6 pb-4">
                  <div className="bg-white border rounded-lg p-4 flex items-center gap-6 shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`upi://pay?pa=${selectedAccount.upiId}&pn=${encodeURIComponent(selectedAccount.accountName)}&cu=INR`)}`}
                      alt="UPI QR"
                      width={80}
                      height={80}
                      className="rounded border"
                    />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">UPI ID</p>
                      <p className="font-bold text-gray-800">{selectedAccount.upiId}</p>
                      <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded">
                        UPI SCAN TO PAY
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Table */}
              <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="font-semibold text-gray-700">Transactions</h3>
                    <button className="text-gray-400 hover:text-gray-600"><Search className="h-4 w-4" /></button>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 bg-gray-50 border-b">
                        <th className="text-left px-4 py-2 font-medium">
                          <span className="flex items-center gap-1">Type <Filter className="h-3 w-3" /></span>
                        </th>
                        <th className="text-left px-4 py-2 font-medium">
                          <span className="flex items-center gap-1">Name <Filter className="h-3 w-3" /></span>
                        </th>
                        <th className="text-left px-4 py-2 font-medium">
                          <span className="flex items-center gap-1">Date <ChevronDown className="h-3 w-3" /></span>
                        </th>
                        <th className="text-right px-4 py-2 font-medium">
                          <span className="flex items-center justify-end gap-1">Amount <Filter className="h-3 w-3" /></span>
                        </th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {txLoading ? (
                        <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
                      ) : transactions.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-8 text-gray-400">No transactions yet</td></tr>
                      ) : transactions.map((tx) => (
                        <tr key={tx.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-700">{tx.type}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{tx.name}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {tx.date ? format(new Date(tx.date), 'dd/MM/yyyy') : '—'}
                          </td>
                          <td className={`px-4 py-3 text-right font-semibold ${tx.isIn ? 'text-green-600' : 'text-red-500'}`}>
                            ₹ {tx.amount?.toFixed(2)}
                          </td>
                          <td className="px-2 py-3">
                            <button className="text-gray-300 hover:text-gray-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a bank account to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BankAccountsPage
