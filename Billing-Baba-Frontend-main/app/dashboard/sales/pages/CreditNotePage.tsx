"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fetchCreditNotes, deleteSale } from '@/lib/api';
import TransactionsTable from '../component/TransactionsTable';
import { Transaction } from '@/lib/types';
import FilterBar from '../component/FilterBar';
import { toast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';

const CreateCreditNotePage = dynamic(() => import('./CreateCreditNotePage'), { ssr: false });
const InvoicePreview = dynamic(() => import('../component/InvoicePreview').then(m => ({ default: m.InvoicePreview })), { ssr: false });

export default function CreditNotePage() {
    const [isCreating, setIsCreating] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fullDocs, setFullDocs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
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
            if (!filters.status) {
                setAvailableStatuses([...new Set(mapped.map((t: any) => t.status).filter(Boolean))] as string[]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isCreating && !editingDoc) loadData();
    }, [isCreating, editingDoc, filters]);

    useEffect(() => {
        const preload = () => {
            import('./CreateCreditNotePage');
            import('../component/InvoicePreview');
        };
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            const id = (window as any).requestIdleCallback(preload, { timeout: 2000 });
            return () => (window as any).cancelIdleCallback(id);
        } else {
            const t = setTimeout(preload, 1000);
            return () => clearTimeout(t);
        }
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Permanently delete this Credit Note? This cannot be undone.")) return;
        try {
            await deleteSale(id);
            loadData();
        } catch (e) {
            toast({ title: "Failed to delete", variant: "destructive" });
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
                    <FilterBar onFilterChange={setFilters} statusOptions={availableStatuses} />
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
