"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreatePurchaseInvoicePage from '../component/CreatePurchaseInvoicePage';
import CreateDebitNotePage from '../component/CreateDebitNotePage';
import CreatePaymentOutModal from '../component/CreatePaymentOutModal';
import FilterBar from '@/app/dashboard/sales/component/FilterBar';
import TransactionsTable from '@/app/dashboard/sales/component/TransactionsTable';
import { fetchPurchases, cancelPurchase } from '@/lib/api'; // Ensure cancelPurchase is exported or import dynamically
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const PurchaseInvoiceIllustration = () => (
    <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute h-full w-full">
            <path
                fill="#EBF8FF"
                d="M 50, 150 Q 20, 100 50, 50 Q 100, 0 150, 50 Q 180, 100 150, 150 Q 100, 200 50, 150 z"
            />
        </svg>

        <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-md"
        >
            <g transform="translate(10, 0)">
                <path
                    d="M66.4442 12.0001L81.9998 21.0001L72.9998 88.0001L57.4442 79.0001L66.4442 12.0001Z"
                    fill="white"
                    stroke="#E2E8F0"
                    strokeWidth="2"
                />
                <path d="M62 30H76" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
                <path d="M62 36H76" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
                <path d="M62 44H73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M62 50H70" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M62 56H73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M62 62H70" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M62 68H73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M78 44H78.01" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                <path d="M75 50H75.01" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                <path d="M78 56H78.01" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                <path d="M75 62H75.01" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                <path d="M78 68H78.01" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            </g>

            <g stroke="#2563EB" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 25H20L28 65H75" />
                <path d="M22 35H72" />
                <path d="M30 45H70" />
                <path d="M38 55H68" />
                <circle cx="35" cy="78" r="5" />
                <circle cx="68" cy="78" r="5" />
            </g>
        </svg>
    </div>
);

export default function PurchaseBills() {
    const [isCreating, setIsCreating] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [rawPurchases, setRawPurchases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [initialDataForEdit, setInitialDataForEdit] = useState<any>(null);
    const [isConvertingToReturn, setIsConvertingToReturn] = useState(false);
    const [initialDataForReturn, setInitialDataForReturn] = useState<any>(null);

    // Payment Modal
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentModalData, setPaymentModalData] = useState<{ partyId?: string; amount?: number; invoiceId?: string; }>({});

    const loadPurchases = async () => {
        setIsLoading(true);
        try {
            const params = {
                type: 'BILL', // Only bills
                ...filters
            };
            const data = await fetchPurchases(params);

            setRawPurchases(data);
            const mapped: Transaction[] = data.map((p: any) => ({
                id: p._id,
                date: p.billDate ? format(new Date(p.billDate), "dd/MM/yyyy") : "-",
                invoiceNo: p.billNumber || "-",
                partyId: p.partyId?._id || p.partyId,
                partyName: p.partyId?.name || "Unknown",
                transactionType: 'Purchase Bill',
                paymentType: p.paymentType || "Credit",
                amount: p.grandTotal || 0,
                balance: p.balanceDue || 0,
                isPaid: p.balanceDue <= 0,
                status: p.status
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
            // Dynamic import if needed, or just assume it's there
            const { cancelPurchase } = await import('@/lib/api');
            await cancelPurchase(id);
            loadPurchases();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to cancel", variant: "destructive" });
        }
    };

    const handleEdit = (id: string) => {
        const rawPurchase = rawPurchases.find(p => String(p._id) === id);
        if (rawPurchase) {
            setInitialDataForEdit(rawPurchase);
            setIsCreating(true);
        }
    };

    const handleDuplicate = (id: string) => {
        const rawPurchase = rawPurchases.find(p => String(p._id) === id);
        if (rawPurchase) {
            setInitialDataForEdit({ ...rawPurchase, _id: undefined, billNumber: '', billDate: new Date() });
            setIsCreating(true);
        }
    };

    const handleMakePayment = (partyId: string, amount: number, invoiceId?: string) => {
        setPaymentModalData({ partyId, amount, invoiceId });
        setIsPaymentModalOpen(true);
    };

    const handleConvert = (id: string) => {
        const rawPurchase = rawPurchases.find(p => String(p._id) === id);
        if (rawPurchase) {
            setInitialDataForReturn(rawPurchase);
            setIsConvertingToReturn(true);
        }
    };

    if (isConvertingToReturn) {
        return (
            <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <CreateDebitNotePage
                    onCancel={() => {
                        setIsConvertingToReturn(false);
                        setInitialDataForReturn(null);
                        loadPurchases();
                    }}
                    initialData={initialDataForReturn}
                />
            </div>
        );
    }

    if (isCreating) {
        return (
            <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{initialDataForEdit ? 'Edit Purchase Invoice' : 'Create Purchase Invoice'}</h1>
                <CreatePurchaseInvoicePage
                    onCancel={() => {
                        setIsCreating(false);
                        setInitialDataForEdit(null);
                        loadPurchases();
                    }}
                    initialData={initialDataForEdit}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <Card className="shadow-sm">
                <CardContent className="p-0 divide-y">
                    <div className="p-4 border-b flex justify-between items-center">
                        <FilterBar onFilterChange={setFilters} />
                        <Button
                            className="bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white"
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus size={18} className="mr-2" /> Add Purchase Bill
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
                    onConvert={handleConvert}
                    onMakePayment={handleMakePayment}
                    onDuplicate={handleDuplicate}
                />
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex min-h-[60vh] flex-col items-center justify-center p-16 text-center">
                        <PurchaseInvoiceIllustration />
                        <p className="max-w-md text-gray-500">
                            Make Purchase invoices & Print or share with your customers directly.
                        </p>
                        <Button
                            className="mt-8 rounded-xl bg-gradient-to-b bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] px-6 py-3  text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
                            onClick={() => {
                                setInitialDataForEdit(null);
                                setIsCreating(true);
                            }}
                        >
                            Add Your First Purchase Invoice
                        </Button>
                    </div>
                </div>
            )}

            <CreatePaymentOutModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    loadPurchases();
                }}
                initialPartyId={paymentModalData.partyId}
                initialAmount={paymentModalData.amount}
                initialBillId={paymentModalData.invoiceId}
            />
        </div>
    );
}