"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Settings, MoreVertical, Users, List } from 'lucide-react';
import { PartiesList, Party } from '@/components/dashboard/party/PartiesList';
import { TransactionDetails, Transaction } from '@/components/dashboard/party/TransactionDetails';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { ShowOptionsModal } from '@/components/dashboard/party/ShowOptionsModal';
import { fetchParties, fetchSales, fetchPurchases } from '@/lib/api';
import { format } from 'date-fns';
import BulkWhatsAppModal from '@/components/dashboard/BulkWhatsAppModal';
import PartyGroupsView from '@/components/dashboard/party/PartyGroupsView';

export default function PartiesPage() {
    const [parties, setParties] = useState<Party[]>([]);
    const [selectedPartyId, setSelectedPartyId] = useState<string>('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
    const [isBulkWAOpen, setIsBulkWAOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [txReloadKey, setTxReloadKey] = useState(0);
    const [view, setView] = useState<'parties' | 'groups'>('parties');
    const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
    const viewDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target as Node)) {
                setViewDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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

    const reloadTransactions = () => setTxReloadKey(k => k + 1);

    // Fetch transactions when selectedPartyId changes
    useEffect(() => {
        if (!selectedPartyId) return;

        const loadTransactions = async () => {
            try {
                const partyId = selectedPartyId;

                const results = await Promise.allSettled([
                    fetchSales({ partyId, type: 'INVOICE' }),
                    fetchSales({ partyId, type: 'SO' }),
                    fetchSales({ partyId, type: 'PROFORMA' }),
                    fetchSales({ partyId, type: 'ESTIMATE' }),
                    fetchSales({ partyId, type: 'DELIVERY_CHALLAN' }),
                    fetchSales({ partyId, type: 'CREDIT_NOTE' }),
                    fetchPurchases({ partyId, type: 'BILL' }),
                    fetchPurchases({ partyId, type: 'PO' }),
                    fetchPurchases({ partyId, type: 'FA' }),
                    fetchPurchases({ partyId, type: 'EXPENSE' }),
                    fetchPurchases({ partyId, type: 'DEBIT_NOTE' }),
                ]);

                const safe = (r: PromiseSettledResult<any>): any[] => {
                    if (r.status !== 'fulfilled') return [];
                    return Array.isArray(r.value) ? r.value : (r.value?.data ?? []);
                };

                const [invoices, orders, proformas, estimates, challans, creditNotes,
                    bills, purchaseOrders, fixedAssets, expenses, debitNotes] = results;

                const mapSale = (sale: any, type: string): Transaction => {
                    const dateVal = sale.invoiceDate || sale.orderDate || sale.challanDate || sale.creditNoteDate || Date.now();
                    return {
                        id: sale._id,
                        type,
                        number: sale.invoiceNumber || sale.orderNumber || sale.challanNumber || sale.returnNo || sale.refNo || '-',
                        date: format(new Date(dateVal), 'dd/MM/yyyy'),
                        total: sale.grandTotal || 0,
                        balance: sale.balanceDue || 0,
                        status: sale.status,
                        rawDate: new Date(dateVal),
                    };
                };

                const mapPurchase = (po: any, type: string): Transaction => {
                    const dateVal = po.billDate || po.orderDate || po.debitNoteDate || Date.now();
                    return {
                        id: po._id,
                        type,
                        number: po.billNumber || po.orderNumber || po.returnNo || '-',
                        date: format(new Date(dateVal), 'dd/MM/yyyy'),
                        total: po.grandTotal || 0,
                        balance: po.balanceDue || 0,
                        status: po.status,
                        rawDate: new Date(dateVal),
                    };
                };

                const allTx: Transaction[] = [
                    ...safe(invoices).map((s: any)       => mapSale(s,     'Sale Invoice')),
                    ...safe(orders).map((s: any)          => mapSale(s,     'Sale Order')),
                    ...safe(proformas).map((s: any)       => mapSale(s,     'Proforma Invoice')),
                    ...safe(estimates).map((s: any)       => mapSale(s,     'Estimate')),
                    ...safe(challans).map((s: any)        => mapSale(s,     'Delivery Challan')),
                    ...safe(creditNotes).map((s: any)     => mapSale(s,     'Credit Note')),
                    ...safe(bills).map((p: any)           => mapPurchase(p, 'Purchase Bill')),
                    ...safe(purchaseOrders).map((p: any)  => mapPurchase(p, 'Purchase Order')),
                    ...safe(fixedAssets).map((p: any)     => mapPurchase(p, 'Fixed Asset')),
                    ...safe(expenses).map((p: any)        => mapPurchase(p, 'Expense')),
                    ...safe(debitNotes).map((p: any)      => mapPurchase(p, 'Debit Note')),
                ].sort((a: any, b: any) => b.rawDate - a.rawDate);

                setTransactions(allTx);
            } catch (error) {
                console.error("Failed to load transactions", error);
            }
        };

        loadTransactions();
    }, [selectedPartyId, txReloadKey]);

    const selectedParty = parties.find(p => p._id === selectedPartyId);

    return (
        <div className="bg-slate-50 min-h-screen w-full font-sans flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 h-16">
                <div className="relative flex items-center gap-2" ref={viewDropdownRef}>
                    <button
                        onClick={() => setViewDropdownOpen(v => !v)}
                        className="flex items-center gap-1.5 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                    >
                        <h1 className="text-xl font-bold text-gray-800">
                            {view === 'parties' ? 'Parties' : 'Groups'}
                        </h1>
                        <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${viewDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {viewDropdownOpen && (
                        <div className="absolute top-10 left-0 z-30 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                            <button
                                onClick={() => { setView('parties'); setViewDropdownOpen(false); }}
                                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-gray-50 ${view === 'parties' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                            >
                                <List className="h-4 w-4" />
                                Parties
                                {view === 'parties' && <span className="ml-auto text-blue-500">✓</span>}
                            </button>
                            <button
                                onClick={() => { setView('groups'); setViewDropdownOpen(false); }}
                                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-gray-50 ${view === 'groups' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                            >
                                <Users className="h-4 w-4" />
                                Groups
                                {view === 'groups' && <span className="ml-auto text-blue-500">✓</span>}
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setIsBulkWAOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-400 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors"
                        title="Send bulk WhatsApp reminders"
                    >
                        <svg viewBox="0 0 32 32" className="h-4 w-4 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" />
                        </svg>
                        <span className="hidden sm:inline">Send Reminders</span>
                    </button>
                    <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors" onClick={() => setAddModalOpen(true)}><Plus className="h-5 w-5" /><span className="hidden sm:inline">Add Party</span></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Settings className="h-5 w-5 text-gray-600" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="h-5 w-5 text-gray-600" /></button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {view === 'groups' ? (
                    <PartyGroupsView />
                ) : (
                    <>
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
                            onReload={reloadTransactions}
                        />
                    </>
                )}
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
            <BulkWhatsAppModal isOpen={isBulkWAOpen} onClose={() => setIsBulkWAOpen(false)} />
        </div>
    );
}