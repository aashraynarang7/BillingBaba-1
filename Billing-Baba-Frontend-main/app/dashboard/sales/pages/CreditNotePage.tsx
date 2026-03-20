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
import { InvoicePreview } from '../component/InvoicePreview';
import { toast } from '@/components/ui/use-toast';

export default function CreditNotePage() {
    const [isCreating, setIsCreating] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fullDocs, setFullDocs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [printInvoiceData, setPrintInvoiceData] = useState<any>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCreditNotes(filters);
            setFullDocs(data);
            const mapped: Transaction[] = data.map((d: any) => ({
                id: d._id,
                ...d,
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
        if (!isCreating && !editingDoc) loadData();
    }, [isCreating, editingDoc, filters]);

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

    const handleEdit = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) setEditingDoc(doc);
    };

    const handlePrint = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) setPrintInvoiceData(doc);
    };

    const handleDuplicate = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) setEditingDoc({ ...doc, _id: undefined, returnNo: '', creditNoteDate: new Date(), linkedInvoiceId: undefined });
    };

    if (isCreating || editingDoc) {
        return (
            <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <CreateCreditNotePage
                    onCancel={() => { setIsCreating(false); setEditingDoc(null); }}
                    initialData={editingDoc}
                />
            </div>
        );
    }

    return (
        <>
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
                onEdit={handleEdit}
                onView={handleEdit}
                onDelete={handleDelete}
                onPrint={handlePrint}
                onDuplicate={handleDuplicate}
            />
        </div>

        {printInvoiceData && (
            <InvoicePreview
                isOpen={!!printInvoiceData}
                onClose={() => setPrintInvoiceData(null)}
                data={printInvoiceData}
                type="INVOICE"
            />
        )}
        </>
    );
}
