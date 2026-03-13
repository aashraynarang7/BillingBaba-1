"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, MessageSquare, Clock, Search, Printer, FileSpreadsheet, MoreVertical } from 'lucide-react';

const dropdownMenuItems = [
    'View/Edit', 'Cancel Invoice', 'Delete', 'Duplicate', 'Open PDF',
    'Preview', 'Print', 'Preview As Delivery Challan', 'Convert To Return',
    'Receive Payment', 'View History'
];

export interface Transaction {
    id: string;
    type: string;
    number: string;
    date: string;
    total: number;
    balance: number;
    status?: string; // e.g. PAID, UNPAID
}

interface TransactionDetailsProps {
    selectedParty: any; // Using any for now to hold the party object
    transactionsData: Transaction[];
    onEditParty: () => void;
    onShowOptions: () => void;
}

export const TransactionDetails = ({ selectedParty, transactionsData, onEditParty, onShowOptions }: TransactionDetailsProps) => {
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

    const toggleMenu = (index: number) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    if (!selectedParty) {
        return (
            <main className="w-full md:w-2/3 lg:w-3/4 bg-slate-50 p-6 flex items-center justify-center text-gray-400">
                Select a party to view details
            </main>
        );
    }

    return (
        <main className="w-full md:w-2/3 lg:w-3/4 bg-slate-50 p-4 sm:p-6 overflow-y-auto flex flex-col h-full">
            <div className="flex justify-between items-center pb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">{selectedParty.name}</h2>
                    <Edit className="h-4 w-4 text-blue-600 cursor-pointer" onClick={onEditParty} />
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 relative"><MessageSquare className="h-5 w-5 text-gray-500" /><span className="absolute top-1 right-1 h-2 w-2 bg-orange-400 rounded-full"></span></button>
                    <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" className="h-5 w-5 cursor-pointer" />
                    <button className="p-2 relative"><Clock className="h-5 w-5 text-gray-500" /><span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span></button>
                </div>
            </div>

            <div className="mt-4 bg-white rounded-xl shadow-md flex-grow flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 text-lg">Transactions</h3>
                        <div className="flex items-center gap-4">
                            <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
                            <Printer className="h-5 w-5 text-gray-500 cursor-pointer" />
                            <FileSpreadsheet className="h-5 w-5 text-green-600 cursor-pointer" onClick={onShowOptions} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-400 px-4 sm:px-6 py-2 border-b border-gray-200 bg-gray-50/50 flex-shrink-0">
                    <div className="col-span-3">TYPE</div><div className="col-span-2">NUMBER</div><div className="col-span-2">DATE</div><div className="col-span-2 text-right">TOTAL</div><div className="col-span-2 text-right">BALANCE</div><div className="col-span-1 text-right"></div>
                </div>
                <div className="text-sm overflow-y-auto flex-grow">
                    {transactionsData.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No transactions found</div>
                    ) : (
                        transactionsData.map((tx, index) => (
                            <div key={tx.id} className="grid grid-cols-12 gap-4 items-center px-4 sm:px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-3 font-medium text-gray-800">{tx.type}</div>
                                <div className="col-span-2 text-gray-600">{tx.number}</div>
                                <div className="col-span-2 text-gray-600">{tx.date}</div>
                                <div className="col-span-2 text-right font-semibold text-gray-800">₹{tx.total.toFixed(2)}</div>
                                <div className="col-span-2 text-right font-semibold text-gray-800">₹{tx.balance.toFixed(2)}</div>
                                <div className="col-span-1 flex justify-end relative">
                                    <button onClick={() => toggleMenu(index)}><MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" /></button>
                                    <AnimatePresence>
                                        {openMenuIndex === index && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 py-2 border border-gray-100">
                                                {dropdownMenuItems.map(item => (<a key={item} href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setOpenMenuIndex(null)}>{item}</a>))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};