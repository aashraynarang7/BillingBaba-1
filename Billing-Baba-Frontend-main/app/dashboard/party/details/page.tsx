"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Settings, MoreVertical } from 'lucide-react';
import { PartiesList, Party } from '@/components/dashboard/party/PartiesList';
import { TransactionDetails, Transaction } from '@/components/dashboard/party/TransactionDetails';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { ShowOptionsModal } from '@/components/dashboard/party/ShowOptionsModal';
import { fetchParties, fetchSales, fetchPurchases } from '@/lib/api';
import { format } from 'date-fns';

export default function PartiesPage() {
    const [parties, setParties] = useState<Party[]>([]);
    const [selectedPartyId, setSelectedPartyId] = useState<string>('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch parties on load
    useEffect(() => {
        loadParties();
    }, []);

    const loadParties = async () => {
        try {
            const data = await fetchParties();
            setParties(data);
            if (data.length > 0 && !selectedPartyId) {
                setSelectedPartyId(data[0]._id);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch parties", error);
            setIsLoading(false);
        }
    };

    // Fetch transactions when selectedPartyId changes
    useEffect(() => {
        if (!selectedPartyId) return;

        const loadTransactions = async () => {
            try {
                const [sales, purchases] = await Promise.all([
                    fetchSales({ partyId: selectedPartyId }),
                    fetchPurchases({ partyId: selectedPartyId })
                ]);

                // Map Sales to Transaction format
                const salesTx: Transaction[] = sales.map((sale: any) => ({
                    id: sale._id,
                    type: sale.documentType === 'INVOICE' ? 'Sale Invoice' : 'Sale Order',
                    number: sale.invoiceNumber || sale.orderNumber || '-',
                    date: format(new Date(sale.invoiceDate || sale.orderDate), 'dd/MM/yyyy'),
                    total: sale.grandTotal,
                    balance: sale.balanceDue || 0,
                    rawDate: new Date(sale.invoiceDate || sale.orderDate) // For sorting
                }));

                // Map Purchases to Transaction format
                const purchaseTx: Transaction[] = purchases.map((po: any) => ({
                    id: po._id,
                    type: po.documentType === 'BILL' ? 'Purchase Bill' : 'Purchase Order',
                    number: po.billNumber || po.orderNumber || '-',
                    date: format(new Date(po.billDate || po.orderDate), 'dd/MM/yyyy'),
                    total: po.grandTotal,
                    balance: po.balanceDue || 0,
                    rawDate: new Date(po.billDate || po.orderDate)
                }));

                const allTx = [...salesTx, ...purchaseTx].sort((a: any, b: any) => b.rawDate - a.rawDate);
                setTransactions(allTx);

            } catch (error) {
                console.error("Failed to load transactions", error);
            }
        };

        loadTransactions();
    }, [selectedPartyId]);

    const selectedParty = parties.find(p => p._id === selectedPartyId);

    return (
        <div className="bg-slate-50 min-h-screen w-full font-sans flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 h-16">
                <div className="flex items-center gap-2"><h1 className="text-xl font-bold text-gray-800">Parties</h1><ChevronDown className="h-5 w-5 text-gray-600 cursor-pointer" /></div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors" onClick={() => setAddModalOpen(true)}><Plus className="h-5 w-5" /><span className="hidden sm:inline">Add Party</span></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Settings className="h-5 w-5 text-gray-600" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="h-5 w-5 text-gray-600" /></button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                <PartiesList
                    partiesData={parties}
                    selectedPartyId={selectedPartyId}
                    onSelectParty={setSelectedPartyId}
                />
                <TransactionDetails
                    selectedParty={selectedParty}
                    transactionsData={transactions}
                    onEditParty={() => setEditModalOpen(true)}
                    onShowOptions={() => setOptionsModalOpen(true)}
                />
            </div>

            <EditPartyModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                mode={selectedParty ? 'edit' : 'add'}
                party={selectedParty}
                onSuccess={loadParties}
            />
            <EditPartyModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                mode="add"
                onSuccess={loadParties}
            />
            <ShowOptionsModal isOpen={isOptionsModalOpen} onClose={() => setOptionsModalOpen(false)} />
        </div>
    );
}