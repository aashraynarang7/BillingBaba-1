"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FilterBar from '@/app/dashboard/sales/component/FilterBar';
import TransactionsTable from '@/app/dashboard/sales/component/TransactionsTable';
import { fetchPurchases, fetchPurchaseById } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';

const CreatePurchaseFAPage = dynamic(() => import('../component/CreatePurchaseFAPage'), { ssr: false });
const InvoicePreview = dynamic(() => import('@/app/dashboard/sales/component/InvoicePreview').then(m => ({ default: m.InvoicePreview })), { ssr: false });

const PurchaseFAIllustration = () => (
    <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        {/* Placeholder SVG */}
        <svg viewBox="0 0 200 200" className="absolute h-full w-full">
            <path
                fill="#EBF8FF"
                d="M 50, 150 Q 20, 100 50, 50 Q 100, 0 150, 50 Q 180, 100 150, 150 Q 100, 200 50, 150 z"
            />
        </svg>
        <div className="relative z-10 text-4xl">🏢</div>
    </div>
);

export default function PurchaseFAPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
    const [editingData, setEditingData] = useState<any>(null);
    const [printInvoiceData, setPrintInvoiceData] = useState<any>(null);

    const loadPurchases = async () => {
        setIsLoading(true);
        try {
            const params = {
                type: 'FA', // Only FA
                ...filters
            };
            const data = await fetchPurchases(params);

            const mapped: Transaction[] = data.map((p: any) => ({
                id: p._id,
                date: p.billDate ? format(new Date(p.billDate), "dd/MM/yyyy") : "-",
                invoiceNo: p.billNumber || "-",
                partyName: p.partyId?.name || "Unknown",
                transactionType: 'Purchase FA',
                paymentType: p.paymentType || "Credit",
                amount: p.grandTotal || 0,
                balance: p.balanceDue || 0,
                isPaid: p.balanceDue <= 0
            }));

            setTransactions(mapped);
            if (!filters.status) {
                setAvailableStatuses([...new Set(mapped.map((t: any) => t.status).filter(Boolean))] as string[]);
            }
        } catch (error) {
            console.error("Failed to load purchases", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isCreating) {
            loadPurchases();
        }
    }, [isCreating, filters]);

    useEffect(() => {
        const preload = () => {
            import('../component/CreatePurchaseFAPage');
            import('@/app/dashboard/sales/component/InvoicePreview');
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
        if (!confirm("Permanently delete this Fixed Asset? This cannot be undone.")) return;
        try {
            const { deletePurchase } = await import('@/lib/api');
            await deletePurchase(id);
            loadPurchases();
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const handleEdit = async (id: string) => {
        try {
            const data = await fetchPurchaseById(id);
            setEditingData(data);
            setIsCreating(true);
        } catch (error) {
            toast({ title: "Failed to load details for editing.", variant: "destructive" });
        }
    };

    const handlePrint = (id: string) => {
        const t = transactions.find(t => String(t.id) === id);
        if (t) setPrintInvoiceData(t);
    };

    const handleDuplicate = async (id: string) => {
        try {
            const data = await fetchPurchaseById(id);
            setEditingData({ ...data, _id: undefined, billNumber: '', billDate: new Date() });
            setIsCreating(true);
        } catch (error) {
            toast({ title: "Failed to load details for duplication.", variant: "destructive" });
        }
    };

    if (isCreating) {
        return (
            <div className="w-full bg-slate-50 min-h-screen">
                <CreatePurchaseFAPage
                    onCancel={() => { setIsCreating(false); setEditingData(null); }}
                    initialData={editingData}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Purchase Fixed Assets</h1>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0 divide-y">
                    <div className="p-4 border-b flex justify-between items-center">
                        <FilterBar onFilterChange={setFilters} statusOptions={availableStatuses} />
                        <Button
                            className="bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white"
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus size={18} className="mr-2" /> Add Purchase FA
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {transactions.length > 0 || Object.keys(filters).length > 0 ? (
                <TransactionsTable
                    transactions={transactions}
                    showToolbar={true}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onView={handleEdit}
                    onPrint={handlePrint}
                    onDuplicate={handleDuplicate}
                />
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex min-h-[60vh] flex-col items-center justify-center p-16 text-center">
                        <PurchaseFAIllustration />
                        <p className="max-w-md text-gray-500">
                            Record your Fixed Asset purchases here.
                        </p>
                        <Button
                            className="mt-8 rounded-xl bg-gradient-to-b bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] px-6 py-3  text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
                            onClick={() => setIsCreating(true)}
                        >
                            Add Your First Fixed Asset Purchase
                        </Button>
                    </div>
                </div>
            )}

            {printInvoiceData && (
                <InvoicePreview
                    isOpen={!!printInvoiceData}
                    onClose={() => setPrintInvoiceData(null)}
                    data={printInvoiceData}
                    type="PURCHASE_FA"
                />
            )}
        </div>
    );
}
