"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fetchCreditNotes, cancelSale } from '@/lib/api';
import CreateCreditNotePage from './CreateCreditNotePage';
import TransactionsTable from '../component/TransactionsTable';
import { Transaction } from '@/lib/types';
import FilterBar from '../component/FilterBar';
import { toast } from '@/components/ui/use-toast';

export default function CreditNotePage() {
    const [isCreating, setIsCreating] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCreditNotes(filters);
            const mapped: Transaction[] = data.map((d: any) => ({
                id: d._id,
                date: d.creditNoteDate ? format(new Date(d.creditNoteDate), 'dd/MM/yyyy') : '-',
                invoiceNo: d.returnNo || '-',
                partyName: d.partyName || d.partyId?.name || 'Unknown',
                transactionType: 'Credit Note',
                paymentType: d.paymentType || 'Cash',
                amount: d.grandTotal || 0,
                balance: d.balanceDue || 0,
                isPaid: true
            }));
            setTransactions(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isCreating) loadData();
    }, [isCreating, filters]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await cancelSale(id);
            loadData();
        } catch (e) {
            console.error(e);
            toast({ title: "Failed to cancel", variant: "destructive" });
        }
    };

    if (isCreating) {
        return (
            <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Credit Note</h1>
                <CreateCreditNotePage onCancel={() => setIsCreating(false)} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold hidden sm:block">Credit Notes</h1>
                    <FilterBar onFilterChange={setFilters} />
                </div>

                <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="h-5 w-5" /> Add Credit Note
                </Button>
            </div>

            <TransactionsTable
                transactions={transactions}
                showToolbar={true}
                onDelete={handleDelete}
            />
        </div>
    );
}