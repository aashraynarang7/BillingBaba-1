'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

// --- SVG Icons ---
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12m-9 4h6" />
  </svg>
);
const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);
const TallyLogo = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#E53935"/>
    <path d="M24.0002 4.8C13.4023 4.8 4.80017 13.4021 4.80017 24C4.80017 34.5979 13.4023 43.2 24.0002 43.2C34.598 43.2 43.2002 34.5979 43.2002 24C43.2002 13.4021 34.598 4.8 24.0002 4.8ZM24.0002 38.4C16.0527 38.4 9.60017 31.9474 9.60017 24C9.60017 16.0526 16.0527 9.6 24.0002 9.6C31.9476 9.6 38.4002 16.0526 38.4002 24C38.4002 31.9474 31.9476 38.4 24.0002 38.4Z" fill="white"/>
    <path d="M24 36C16.268 36 10 29.732 10 22V20H38V22C38 29.732 31.732 36 24 36Z" fill="white"/>
  </svg>
);
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

// --- Sample Data ---
const transactionsData = [
  { id: 1, date: '03/09/2025', invoiceNo: 1, partyName: 'adarsh', transactionType: 'Sale', paymentType: 'Cash', amount: '1000', balance: '112' },
  { id: 2, date: '05/09/2025', invoiceNo: 2, partyName: 'manish', transactionType: 'Sale', paymentType: 'Cash', amount: '165', balance: '165' },
];
const periodOptions = ["All", "This Month", "Last Month", "This Quarter", "This Year", "Custom"];

// --- Page Component ---
const TransactionsPage: NextPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  return (
    <>
      <Head>
        <title>Transactions Report</title>
      </Head>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="bg-white rounded-lg shadow w-full">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Period Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="border rounded-md px-4 py-2 flex items-center justify-between w-40 bg-white"
                >
                  <span>{selectedPeriod}</span>
                  <svg className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                    {periodOptions.map(option => (
                      <a
                        key={option}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedPeriod(option);
                          setIsDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {option}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Between</span>
                <input type="text" defaultValue="01/09/2025" className="border rounded-md p-2 w-28 text-center" />
                <span className="text-gray-500">To</span>
                <input type="text" defaultValue="30/09/2025" className="border rounded-md p-2 w-28 text-center" />
              </div>
            </div>
            <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md flex items-center hover:bg-red-700">
              <TallyLogo />
              Export To Tally
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-gray-500 text-sm">TRANSACTIONS</h3>
              <Checkbox label="Sale" defaultChecked />
              <Checkbox label="Credit Note" defaultChecked />
              <Checkbox label="Purchase" defaultChecked />
              <Checkbox label="Debit Note" defaultChecked />
              <Checkbox label="Sale[Cancelled]" defaultChecked />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon/>
              </div>
              <input type="text" className="border rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Invoice No.</TableHeader>
                  <TableHeader>Party Name</TableHeader>
                  <TableHeader>Transaction Type</TableHeader>
                  <TableHeader>Payment Type</TableHeader>
                  <TableHeader align="right">Amount</TableHeader>
                  <TableHeader align="right">Balance</TableHeader>
                </tr>
              </thead>
              <tbody>
                {transactionsData.map((tx, index) => (
                  <tr key={tx.id} className={`border-b hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}>
                    <td className="p-3">{tx.date}</td>
                    <td className="p-3">{tx.invoiceNo}</td>
                    <td className="p-3">{tx.partyName}</td>
                    <td className="p-3">{tx.transactionType}</td>
                    <td className="p-3">{tx.paymentType}</td>
                    <td className="p-3 text-right">{tx.amount}</td>
                    <td className="p-3 text-right">{tx.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Footer Banner */}
        <div className="fixed bottom-5 right-5 bg-blue-500 bg-opacity-10 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center gap-4">
          <p className="text-sm text-white">Learn how to export Vyapar data to Tally.</p>
          <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
            <PlayIcon />
            Watch Video
          </button>
        </div>
      </div>
    </>
  );
};

// --- Helper Components ---
type CheckboxProps = { label: string } & React.InputHTMLAttributes<HTMLInputElement>;
const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
  <div className="flex items-center">
    <input type="checkbox" id={label} {...props} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
    <label htmlFor={label} className="ml-2 text-sm text-gray-700">{label}</label>
  </div>
);

type TableHeaderProps = { children: React.ReactNode; align?: 'left' | 'right' };
const TableHeader: React.FC<TableHeaderProps> = ({ children, align = 'left' }) => (
  <th className={`p-3 text-${align} font-semibold text-gray-600 uppercase tracking-wider`}>
    <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
      <span>{children}</span>
      <FilterIcon />
    </div>
  </th>
);

export default TransactionsPage;
