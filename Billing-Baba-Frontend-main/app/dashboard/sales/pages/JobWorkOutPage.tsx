"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CreateJobWorkOutPage from '../component/CreateJobWorkOutPage';
import JobWorkOutTable from '../component/JobWorkOutTable';
import ReceiveFinishedGoodsModal from '../component/ReceiveFinishedGoodsModal';
import { fetchSales, cancelSale, convertToInvoice } from '@/lib/api';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default function JobWorkOutPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChallan, setSelectedChallan] = useState<any>(null);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchSales({ type: 'JOB_WORK_OUT' });
            const mapped = data.map((item: any) => ({
                id: item._id,
                ...item,
                date: item.invoiceDate ? format(new Date(item.invoiceDate), "dd/MM/yyyy") : "-",
                deliveryDateFormatted: item.deliveryDate ? format(new Date(item.deliveryDate), "dd/MM/yyyy") : "-",
                convertedAtFormatted: item.convertedAt ? format(new Date(item.convertedAt), "dd/MM/yyyy") : undefined,
                partyName: item.partyName || item.partyId?.name || "Unknown",
                status: item.status || 'OPEN',
            }));
            setTransactions(mapped);
        } catch (error) {
            console.error("Failed to fetch job work out challans", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isCreating) loadData();
    }, [isCreating]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this challan?")) return;
        try {
            await cancelSale(id);
            loadData();
        } catch (error) {
            toast({ title: "Failed to delete challan", variant: "destructive" });
        }
    };

    const handleReceiveGoods = (id: string) => {
        const challan = transactions.find(t => t.id === id);
        if (challan) {
            setSelectedChallan(challan);
            setModalOpen(true);
        }
    };

    const handleConvert = async (id: string, updatedData?: any) => {
        try {
            await convertToInvoice(id, { targetType: 'SALE_INVOICE', ...updatedData });
            toast({ title: "Invoice created successfully!", className: "bg-green-500 text-white" });
            setModalOpen(false);
            loadData();
        } catch (error) {
            console.error("Conversion failed", error);
            toast({ title: "Failed to create invoice.", variant: "destructive" });
        }
    };

    if (isCreating) {
        return (
            <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                <CreateJobWorkOutPage onCancel={() => setIsCreating(false)} />
            </div>
        );
    }

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-40 text-gray-400">Loading...</div>
            ) : (
                <JobWorkOutTable
                    transactions={transactions}
                    onDelete={handleDelete}
                    onReceiveGoods={handleReceiveGoods}
                    onAddNew={() => setIsCreating(true)}
                />
            )}

            <ReceiveFinishedGoodsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                challan={selectedChallan}
                onSave={handleConvert}
            />
        </div>
    );
}
