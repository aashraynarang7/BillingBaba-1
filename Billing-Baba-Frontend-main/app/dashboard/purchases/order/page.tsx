"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreatePurchaseOrderPage from '../component/CreatePurchaseOrderPage';
import FilterBar from '@/app/dashboard/sales/component/FilterBar';
import TransactionsTable from '@/app/dashboard/sales/component/TransactionsTable';
import { fetchPurchases, cancelPurchase, fetchPurchaseById } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

// --- Illustration Component ---
const PurchaseOrderIllustration = () => (
    <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
        <div className="absolute h-full w-full rounded-full bg-blue-100/50 blur-xl"></div>
        <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-md"
        >
            <g transform="translate(10, 0)">
                <path d="M66.4442 12.0001L81.9998 21.0001L72.9998 88.0001L57.4442 79.0001L66.4442 12.0001Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                <path d="M62 30H76" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" /><path d="M62 36H76" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" /><path d="M62 44H73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" /><path d="M62 50H70" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" /><path d="M62 56H73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" /><path d="M62 62H70" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" /><path d="M62 68H73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g stroke="#2563EB" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 25H20L28 65H75" /><path d="M22 35H72" /><path d="M30 45H70" /><path d="M38 55H68" />
                <circle cx="35" cy="78" r="5" /><circle cx="68" cy="78" r="5" />
            </g>
        </svg>
    </div>
);

// --- Main Page Component ---
export default function PurchaseOrderPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [editingData, setEditingData] = useState<any>(null); // State for editing


    const loadPurchases = async () => {
        setIsLoading(true);
        try {
            const params = {
                type: 'PO', // Filter for Purchase Orders
                ...filters
            };
            const data = await fetchPurchases(params);

            const mapped: Transaction[] = data.map((p: any) => ({
                id: p._id,
                date: p.orderDate ? format(new Date(p.orderDate), "dd/MM/yyyy") : "-",
                invoiceNo: p.orderNumber || "-",
                partyName: p.partyId?.name || "Unknown",
                transactionType: 'Purchase Order',
                paymentType: p.paymentType || "Credit",
                amount: p.grandTotal || 0,
                balance: p.balanceDue || 0,
                // For POs, they generally aren't "paid" in the accounting sense until converted to bills, 
                // but checking balanceDue <= 0 is a safe default if tracking partial payments on POs exists.
                isPaid: p.balanceDue <= 0
            }));

            setTransactions(mapped);
        } catch (error) {
            console.error("Failed to load purchase orders", error);
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
        if (!confirm("Are you sure you want to delete this Purchase Order?")) return;
        try {
            await cancelPurchase(id);
            loadPurchases();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to cancel", variant: "destructive" });
        }
    };

    const handleEdit = async (id: string) => {
        try {
            const data = await fetchPurchaseById(id);
            setEditingData(data);
            setIsCreating(true);
        } catch (error) {
            console.error("Failed to fetch purchase details", error);
            toast({ title: "Failed to load purchase details for editing.", variant: "destructive" });
        }
    };

    if (isCreating) {
        return (
            <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{editingData ? 'Edit Purchase Order' : 'Create Purchase Order'}</h1>
                <CreatePurchaseOrderPage
                    onCancel={() => {
                        setIsCreating(false);
                        setEditingData(null);
                    }}
                    initialData={editingData}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <Card className="shadow-sm">
                <CardContent className="p-0 divide-y">
                    <div className="p-4 border-b flex justify-between items-center">
                        <FilterBar onFilterChange={setFilters} />
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus size={18} className="mr-2" /> Add Purchase Order
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
                />
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex min-h-[60vh] flex-col items-center justify-center p-16 text-center">
                        <PurchaseOrderIllustration />
                        <p className="max-w-md text-gray-500">
                            Make & share purchase orders with your parties & convert them to purchase bill instantly.
                        </p>
                        <Button
                            className="mt-8 rounded-md bg-gradient-to-b from-amber-400 to-orange-500 px-6 py-3 font-semibold text-slate-900 shadow-md transition-all hover:shadow-lg hover:brightness-105"
                            onClick={() => setIsCreating(true)}
                        >
                            Add Your First Purchase Order
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}