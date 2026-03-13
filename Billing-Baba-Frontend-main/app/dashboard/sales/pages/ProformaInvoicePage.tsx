"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from 'date-fns';
import TransactionsTable from '../component/TransactionsTable';
import { fetchProformaInvoices, cancelSale, convertToInvoice } from '@/lib/api';
import CreateProformaInvoicePage from './CreateProformaInvoicePage';
import CreateSaleInvoicePage from './CreateSaleInvoicePage';
import CreateSaleOrderPage from './CreateSalesOrder';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/types';
import FilterBar from '../component/FilterBar';
import { InvoicePreview } from '../component/InvoicePreview';
import { toast } from '@/components/ui/use-toast';

// Illustration Component (Simplified reuse or placeholder)
const SaleOrderIllustration = () => (
    <div className="mb-6 flex h-48 w-48 items-center justify-center rounded-full bg-blue-50">
        <div className="h-32 w-32 rounded-lg bg-[var(--accent-orange)] opacity-20"></div>
    </div>
);

const TabButton = ({
    children,
    isActive,
    onClick,
}: {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "py-3 px-4 text-sm font-semibold tracking-wide transition-colors duration-300",
                isActive
                    ? "border-b-2 border-sky-500 text-slate-800"
                    : "text-gray-400 hover:text-gray-600"
            )}
        >
            {children}
        </button>
    );
};

export default function ProformaInvoicePage() {
    const [isCreating, setIsCreating] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [convertingDoc, setConvertingDoc] = useState<any>(null);
    const [convertingToOrderDoc, setConvertingToOrderDoc] = useState<any>(null);
    const [invoices, setInvoices] = useState<Transaction[]>([]);
    const [fullDocs, setFullDocs] = useState<any[]>([]); // Store full backend objects for edit/convert
    const [printInvoiceData, setPrintInvoiceData] = useState<any>(null);

    // Filters
    const [filters, setFilters] = useState<any>({});

    const loadData = async () => {
        try {
            const data = await fetchProformaInvoices(filters);
            setFullDocs(data);
            const mapped: Transaction[] = data.map((doc: any) => ({
                id: doc._id,
                date: doc.invoiceDate ? format(new Date(doc.invoiceDate), "dd/MM/yyyy") : "-",
                invoiceNo: doc.refNo || "-",
                partyName: doc.partyName || "Unknown",
                transactionType: 'Proforma Invoice',
                paymentType: "-",
                amount: doc.grandTotal || 0,
                balance: 0,
                isPaid: doc.status === 'CONVERTED',
                convertedRef: doc.convertedToInvoiceId?.invoiceNumber
                    ? `Invoice #${doc.convertedToInvoiceId.invoiceNumber}`
                    : doc.convertedToOrderId?.orderNumber
                    ? `Order #${doc.convertedToOrderId.orderNumber}` : undefined,
            }));
            setInvoices(mapped);
        } catch (error) {
            console.error("Failed to load proforma invoices", error);
        }
    };

    useEffect(() => {
        if (!isCreating && !editingDoc && !convertingDoc && !convertingToOrderDoc) {
            loadData();
        }
    }, [isCreating, editingDoc, convertingDoc, convertingToOrderDoc, filters]);

    const handleEdit = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) setEditingDoc(doc);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this Proforma Invoice?")) return;
        try {
            await cancelSale(id);
            loadData();
        } catch (error) {
            console.error("Delete failed", error);
            toast({ title: "Failed to cancel", variant: "destructive" });
        }
    };

    const handleConvert = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) setConvertingDoc(doc);
    };

    const handleConvertToOrder = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) setConvertingToOrderDoc(doc);
    };

    const handlePrintRow = (id: string) => {
        const doc = fullDocs.find(d => d._id === id);
        if (doc) {
            setPrintInvoiceData(doc);
        }
    };

    if (isCreating || editingDoc) {
        return <CreateProformaInvoicePage
            onCancel={() => { setIsCreating(false); setEditingDoc(null); }}
            initialData={editingDoc}
        />;
    }

    if (convertingDoc) {
        return <CreateSaleInvoicePage
            onCancel={() => setConvertingDoc(null)}
            initialData={{
                ...convertingDoc,
                convertedFromProformaId: convertingDoc._id,
                _id: undefined, // Create new
                invoiceNumber: '', // Reset
                invoiceDate: new Date(),
            }}
        />;
    }

    if (convertingToOrderDoc) {
        return <CreateSaleOrderPage
            onCancel={() => setConvertingToOrderDoc(null)}
            initialData={{
                ...convertingToOrderDoc,
                _id: undefined, // Force Create
                convertedFromProformaId: convertingToOrderDoc._id,
                orderDate: new Date(),
                orderNumber: '',
            }}
        />;
    }

    return (
        <div className="w-full bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <TabButton isActive={true} onClick={() => { }}>PROFORMA INVOICES</TabButton>
                </nav>
            </div>

            <div className="mt-[-1px] rounded-b-lg border border-t-0 border-gray-200 bg-white shadow-sm p-4">
                {(invoices.length > 0 || Object.keys(filters).length > 0) ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <FilterBar onFilterChange={setFilters} />
                            <Button
                                className="bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white"
                                onClick={() => setIsCreating(true)}
                            >
                                + Add Proforma Invoice
                            </Button>
                        </div>
                        {invoices.length > 0 ? (
                            <TransactionsTable
                                transactions={invoices}
                                showToolbar={true}
                                onConvert={handleConvert}
                                onConvertToOrder={handleConvertToOrder} // New Prop
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onView={handleEdit}
                                onPrint={handlePrintRow}
                            />
                        ) : (
                            <div className="text-center py-10 text-gray-500">No documents found matching filters.</div>
                        )}
                    </div>
                ) : (
                    <div className="flex min-h-[60vh] flex-col items-center justify-center p-16 text-center">
                        <SaleOrderIllustration />
                        <p className="max-w-md text-gray-500">Create estimates/proforma invoices easily.</p>
                        <Button
                            className="mt-8 rounded-lg bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] px-6 py-3 font-semibold text-white shadow-md"
                            onClick={() => setIsCreating(true)}
                        >
                            Create Proforma Invoice
                        </Button>
                    </div>
                )}
            </div>

            {printInvoiceData && (
                <InvoicePreview
                    isOpen={!!printInvoiceData}
                    onClose={() => setPrintInvoiceData(null)}
                    data={printInvoiceData}
                    type="PROFORMA"
                />
            )}
        </div>
    );
}