"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreatePurchaseFAPage from '../component/CreatePurchaseFAPage';
import FilterBar from '@/app/dashboard/sales/component/FilterBar';
import TransactionsTable from '@/app/dashboard/sales/component/TransactionsTable';
import { fetchPurchases } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { InvoicePreview } from '@/app/dashboard/sales/component/InvoicePreview';
import { toast } from '@/components/ui/use-toast';

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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const { cancelPurchase } = await import('@/lib/api');
            await cancelPurchase(id);
            loadPurchases();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to cancel", variant: "destructive" });
        }
    };

    const handleEdit = (id: string) => {
        setIsCreating(true);
    };

    const handlePrint = (id: string) => {
        const t = transactions.find(t => String(t.id) === id);
        if (t) setPrintInvoiceData(t);
    };

    const handleDuplicate = (id: string) => {
        setIsCreating(true);
    };

    if (isCreating) {
        return (
            <div className="w-full bg-slate-50 min-h-screen">
                {/* The CreatePage component handles its own layout/padding usually, but let's wrap it to match others */}
                <CreatePurchaseFAPage onCancel={() => setIsCreating(false)} />
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
                        <FilterBar onFilterChange={setFilters} />
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
