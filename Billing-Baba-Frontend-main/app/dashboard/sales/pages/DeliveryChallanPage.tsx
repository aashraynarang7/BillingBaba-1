"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CreateDeliveryChallanPage from '../component/CreateDeliveryChallanPage';
import TransactionsTable from '../component/TransactionsTable';
import { fetchSales, cancelSale } from '@/lib/api';
import { format } from 'date-fns';
import { Transaction } from '@/lib/types';
import FilterBar from '../component/FilterBar';
import { InvoicePreview } from '../component/InvoicePreview';
import { toast } from '@/components/ui/use-toast';

const DeliveryChallanIllustration = () => (
    <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        <div className="absolute h-full w-full rounded-full bg-sky-100/60 blur-xl"></div>
        <svg width="120" height="120" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-sm">

            <path d="M105 95H120V80C120 77.2386 117.761 75 115 75H105V95Z" fill="#FBBF24" />
            <path d="M105 95H45V65H95C100.523 65 105 69.4772 105 75V95Z" fill="#A7F3D0" />
            <circle cx="55" cy="95" r="10" fill="white" stroke="#4A5568" strokeWidth="3" />
            <circle cx="100" cy="95" r="10" fill="white" stroke="#4A5568" strokeWidth="3" />

            <g transform="translate(-10, -20) rotate(-15 50 50)">
                <path d="M40 20H80C82.7614 20 85 22.2386 85 25V75C85 77.7614 82.7614 80 80 80H40C37.2386 80 35 77.7614 35 75V25C35 22.2386 37.2386 20 40 20Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                <text x="50%" y="35" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4A5568">BILL</text>
                <path d="M45 45H75M45 52H75M45 59H65" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                <rect x="52" y="62" width="26" height="12" rx="2" fill="#FECACA" stroke="#F87171" strokeWidth="1.5" />
                <text x="50%" y="74" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#B91C1C">PAID</text>
            </g>

            <path d="M45 55L30 65C25 70 30 80 35 75L50 65L45 55Z" fill="#FFEDD5" />
            <path d="M50 65L35 75L40 80C45 85 55 75 50 70L55 60" stroke="#FDBA74" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);


export default function DeliveryChallanPage() {
    const [isCreatingChallan, setIsCreatingChallan] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [printInvoiceData, setPrintInvoiceData] = useState<any>(null);

    const loadChallans = async () => {
        try {
            setIsLoading(true);
            const data = await fetchSales({ type: 'DELIVERY_CHALLAN', ...filters });
            const mapped: Transaction[] = data.map((item: any) => ({
                id: item._id,
                ...item,
                date: item.challanDate ? format(new Date(item.challanDate), "dd/MM/yyyy") : "-",
                invoiceNo: item.challanNumber || "-",
                partyName: item.partyName || (item.partyId?.name) || "Unknown",
                transactionType: 'Delivery Challan',
                paymentType: item.paymentType || "-",
                amount: item.grandTotal || 0,
                balance: item.balanceDue || 0,
                status: item.status || 'OPEN'
            }));
            setTransactions(mapped);
        } catch (error) {
            console.error("Failed to fetch challans", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConvert = async (id: string) => {
        if (!confirm("Convert this Challan to Invoice?")) return;
        try {
            const { convertToInvoice } = await import('@/lib/api');
            await convertToInvoice(id);
            toast({ title: "Challan Converted to Invoice!" });
            loadChallans();
        } catch (error) {
            console.error("Failed to convert", error);
            toast({ title: "Failed to convert challan", variant: "destructive" });
        }
    };

    useEffect(() => {
        if (!isCreatingChallan) {
            loadChallans();
        }
    }, [isCreatingChallan, filters]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this challan?")) return;
        try {
            await cancelSale(id);
            loadChallans();
        } catch (error) {
            console.error("Failed to delete", error);
            toast({ title: "Failed to delete challan", variant: "destructive" });
        }
    };

    const handleEdit = (id: string) => {
        setIsCreatingChallan(true);
    };

    const handlePrint = (id: string) => {
        const t = transactions.find(t => String(t.id) === id);
        if (t) setPrintInvoiceData(t);
    };

    const handleDuplicate = (id: string) => {
        // Opens a new blank challan form (CreateDeliveryChallanPage doesn't support initialData yet)
        setIsCreatingChallan(true);
    };

    if (isCreatingChallan) {
        return (
            <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Delivery Challan</h1>
                <CreateDeliveryChallanPage onCancel={() => setIsCreatingChallan(false)} />
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen space-y-6">

            {/* If has transactions, show Table */}
            {transactions.length > 0 ? (
                <>
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                        <FilterBar onFilterChange={setFilters} />
                        <Button
                            className="bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white"
                            onClick={() => setIsCreatingChallan(true)}
                        >
                            + Add Challan
                        </Button>
                    </div>

                    <TransactionsTable
                        transactions={transactions}
                        showToolbar={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleEdit}
                        onConvert={handleConvert}
                        onPrint={handlePrint}
                        onDuplicate={handleDuplicate}
                    />
                </>
            ) : (
                /* Empty State */
                <div className="mt-[-1px] rounded-b-lg border border-t-0 border-gray-200 bg-white shadow-sm">
                    <div className="flex min-h-[60vh] flex-col items-center justify-center p-16 text-center">
                        <DeliveryChallanIllustration />
                        <p className="max-w-md text-gray-500">
                            Make & share delivery challan with your customers & convert it to sale whenever you want.
                        </p>
                        <Button
                            className="mt-8 rounded-lg bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
                            onClick={() => setIsCreatingChallan(true)}
                        >
                            Add Your First Delivery Challan
                        </Button>
                    </div>
                </div>
            )}

            {printInvoiceData && (
                <InvoicePreview
                    isOpen={!!printInvoiceData}
                    onClose={() => setPrintInvoiceData(null)}
                    data={printInvoiceData}
                    type="INVOICE"
                />
            )}
        </div>
    );
}