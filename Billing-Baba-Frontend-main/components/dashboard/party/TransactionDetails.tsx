"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, MessageSquare, Clock, Search, Printer, FileSpreadsheet, MoreVertical, Eye, Trash2, XCircle, CreditCard } from 'lucide-react';
import WhatsAppPartyModal from '@/components/dashboard/WhatsAppPartyModal';
import dynamic from 'next/dynamic';
import { cancelSale, cancelPurchase, deleteSale, deletePurchase } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const InvoicePreview = dynamic(() => import('@/app/dashboard/sales/component/InvoicePreview').then(m => ({ default: m.InvoicePreview })), { ssr: false });
const PaymentInModal = dynamic(() => import('@/app/dashboard/sales/component/PaymentInModal'), { ssr: false });
const PaymentOutModal = dynamic(() => import('@/app/dashboard/purchases/component/CreatePaymentOutModal'), { ssr: false });

export interface Transaction {
    id: string;
    type: string;
    number: string;
    date: string;
    total: number;
    balance: number;
    status?: string;
    partyId?: string;
    rawDate?: Date;
}

interface TransactionDetailsProps {
    selectedParty: any;
    transactionsData: Transaction[];
    onEditParty: () => void;
    onShowOptions: () => void;
    onReload?: () => void;
}

const SALE_TYPES = new Set(['Sale Invoice', 'Sale Order', 'Credit Note', 'Estimate', 'Proforma Invoice', 'Delivery Challan']);
const PURCHASE_TYPES = new Set(['Purchase Bill', 'Purchase Order', 'Debit Note', 'Fixed Asset', 'Expense']);
const INVOICE_BILL_TYPES = new Set(['Sale Invoice', 'Purchase Bill']);

export const TransactionDetails = ({ selectedParty, transactionsData, onEditParty, onShowOptions, onReload }: TransactionDetailsProps) => {
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [paymentInData, setPaymentInData] = useState<{ partyId: string; amount: number; invoiceId: string } | null>(null);
    const [paymentOutData, setPaymentOutData] = useState<{ partyId: string; amount: number; invoiceId: string } | null>(null);

    const totalBalance = selectedParty?.currentBalance ?? transactionsData.reduce((sum, t) => sum + (t.balance || 0), 0);

    const isSale = (tx: Transaction) => SALE_TYPES.has(tx.type);

    const handlePreview = (tx: Transaction) => {
        setOpenMenuIndex(null);
        const type = isSale(tx) ? 'INVOICE' : 'PURCHASE_BILL';
        setPreviewData({ ...tx, _preview: true, type });
    };

    const handleDelete = async (tx: Transaction) => {
        setOpenMenuIndex(null);
        if (!confirm(`Permanently delete ${tx.type} #${tx.number}? This cannot be undone.`)) return;
        try {
            if (isSale(tx)) await deleteSale(tx.id);
            else await deletePurchase(tx.id);
            toast({ title: `${tx.type} deleted`, className: 'bg-green-600 text-white' });
            onReload?.();
        } catch (e: any) {
            toast({ title: e.message || 'Failed to delete', variant: 'destructive' });
        }
    };

    const handleCancel = async (tx: Transaction) => {
        setOpenMenuIndex(null);
        if (!confirm(`Cancel ${tx.type} #${tx.number}? It will be marked as Cancelled.`)) return;
        try {
            if (isSale(tx)) await cancelSale(tx.id);
            else await cancelPurchase(tx.id);
            toast({ title: `${tx.type} cancelled`, className: 'bg-green-600 text-white' });
            onReload?.();
        } catch (e: any) {
            toast({ title: e.message || 'Failed to cancel', variant: 'destructive' });
        }
    };

    const handleReceivePayment = (tx: Transaction) => {
        setOpenMenuIndex(null);
        if (!selectedParty?._id) return;
        setPaymentInData({ partyId: selectedParty._id, amount: tx.balance, invoiceId: tx.id });
    };

    const handleMakePayment = (tx: Transaction) => {
        setOpenMenuIndex(null);
        if (!selectedParty?._id) return;
        setPaymentOutData({ partyId: selectedParty._id, amount: tx.balance, invoiceId: tx.id });
    };

    if (!selectedParty) {
        return (
            <main className="w-full md:w-2/3 lg:w-3/4 bg-slate-50 p-6 flex items-center justify-center text-gray-400">
                Select a party to view details
            </main>
        );
    }

    return (
        <main className="w-full md:w-2/3 lg:w-3/4 bg-slate-50 p-4 sm:p-6 overflow-y-auto flex flex-col h-full">
            <div className="flex justify-between items-center pb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">{selectedParty.name}</h2>
                    <Edit className="h-4 w-4 text-blue-600 cursor-pointer" onClick={onEditParty} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Net Balance</p>
                        {(() => {
                            const isSupplier = selectedParty.partyType === 'supplier';
                            const isReceivable = isSupplier ? totalBalance < 0 : totalBalance > 0;
                            const label = totalBalance === 0 ? '' : isReceivable ? 'to receive' : 'to pay';
                            const color = totalBalance === 0 ? 'text-gray-500' : isReceivable ? 'text-green-600' : 'text-red-500';
                            return (
                                <p className={`text-lg font-bold ${color}`}>
                                    ₹{Math.abs(totalBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    {label && <span className="text-xs font-normal ml-1">{label}</span>}
                                </p>
                            );
                        })()}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 relative"><MessageSquare className="h-5 w-5 text-gray-500" /><span className="absolute top-1 right-1 h-2 w-2 bg-orange-400 rounded-full"></span></button>
                    <button
                        onClick={() => setIsWhatsAppOpen(true)}
                        className="p-1.5 rounded-full hover:bg-green-50 transition-colors"
                        title="Send WhatsApp payment reminder"
                    >
                        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.85a10.85 10.85 0 0 1-5.54-1.52l-.4-.24-4.1 1.06 1.08-3.94-.26-.41A10.85 10.85 0 1 1 16 26.85zm5.95-8.13c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.71.08-.33-.16-1.4-.52-2.66-1.65-.98-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.5.14-.67.15-.15.33-.38.5-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.38s-1.12 1.1-1.12 2.67 1.15 3.1 1.31 3.31c.16.22 2.27 3.46 5.5 4.85.77.33 1.37.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.93-.79 2.2-1.55.27-.76.27-1.4.19-1.55-.08-.14-.3-.22-.62-.38z" />
                        </svg>
                    </button>
                    <button className="p-2 relative"><Clock className="h-5 w-5 text-gray-500" /><span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span></button>
                </div>
            </div>

            <div className="mt-4 bg-white rounded-xl shadow-md flex-grow flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 text-lg">Transactions</h3>
                        <div className="flex items-center gap-4">
                            <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
                            <Printer className="h-5 w-5 text-gray-500 cursor-pointer" />
                            <FileSpreadsheet className="h-5 w-5 text-green-600 cursor-pointer" onClick={onShowOptions} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 px-4 sm:px-6 py-2 border-b border-gray-200 bg-gray-50/50 flex-shrink-0">
                    <div className="col-span-3">TYPE</div><div className="col-span-2">NUMBER</div><div className="col-span-2">DATE</div><div className="col-span-1 text-center">STATUS</div><div className="col-span-2 text-right">TOTAL</div><div className="col-span-1 text-right">BALANCE</div><div className="col-span-1 text-right"></div>
                </div>
                <div className="text-sm overflow-y-auto flex-grow">
                    {transactionsData.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No transactions found</div>
                    ) : (
                        transactionsData.map((tx, index) => (
                            <div key={tx.id} className="grid grid-cols-12 gap-2 items-center px-4 sm:px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-3 font-medium text-gray-800 text-xs leading-tight">{tx.type}</div>
                                <div className="col-span-2 text-gray-600 text-xs">{tx.number}</div>
                                <div className="col-span-2 text-gray-600 text-xs">{tx.date}</div>
                                <div className="col-span-1 flex justify-center">
                                    {tx.status && (
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                                            tx.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                            tx.status === 'Unpaid' ? 'bg-red-100 text-red-600' :
                                            tx.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                                            tx.status === 'Overdue' ? 'bg-orange-100 text-orange-700' :
                                            tx.status === 'Cancelled' ? 'bg-gray-100 text-gray-500' :
                                            tx.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                                            tx.status === 'CONVERTED' ? 'bg-purple-100 text-purple-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>{tx.status}</span>
                                    )}
                                </div>
                                <div className="col-span-2 text-right font-semibold text-gray-800 text-xs">₹{tx.total.toFixed(2)}</div>
                                <div className="col-span-1 text-right font-semibold text-gray-800 text-xs">₹{tx.balance.toFixed(2)}</div>
                                <div className="col-span-1 flex justify-end relative">
                                    <button onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}>
                                        <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
                                    </button>
                                    <AnimatePresence>
                                        {openMenuIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-20 py-2 border border-gray-100"
                                            >
                                                {/* Preview / Print */}
                                                <button
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                                                    onClick={() => handlePreview(tx)}
                                                >
                                                    <Eye className="h-4 w-4" /> Preview / Print
                                                </button>

                                                {/* Receive Payment (sales) */}
                                                {isSale(tx) && tx.balance > 0 && tx.status !== 'Cancelled' && (
                                                    <button
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                                                        onClick={() => handleReceivePayment(tx)}
                                                    >
                                                        <CreditCard className="h-4 w-4 text-green-600" /> Receive Payment
                                                    </button>
                                                )}

                                                {/* Make Payment (purchases) */}
                                                {!isSale(tx) && tx.balance > 0 && tx.status !== 'Cancelled' && (
                                                    <button
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                                                        onClick={() => handleMakePayment(tx)}
                                                    >
                                                        <CreditCard className="h-4 w-4 text-blue-600" /> Make Payment
                                                    </button>
                                                )}

                                                {/* Delete — always available */}
                                                <button
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                                                    onClick={() => handleDelete(tx)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>

                                                {/* Cancel — only for Invoice / Bill */}
                                                {INVOICE_BILL_TYPES.has(tx.type) && tx.status !== 'Cancelled' && (
                                                    <button
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 text-left"
                                                        onClick={() => handleCancel(tx)}
                                                    >
                                                        <XCircle className="h-4 w-4" /> Cancel
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modals */}
            <WhatsAppPartyModal
                isOpen={isWhatsAppOpen}
                onClose={() => setIsWhatsAppOpen(false)}
                partyName={selectedParty?.name}
                partyPhone={selectedParty?.phone}
                paymentMessage={
                    totalBalance > 0
                        ? `Dear Customer,\nThis is a gentle reminder regarding your payment of ₹${totalBalance.toLocaleString('en-IN')} pending with us.\nIf you have already made the payment, kindly ignore this message.\n-\nThank You,\n${typeof window !== 'undefined' ? (localStorage.getItem('activeCompanyName') || 'BillingBaba') : 'BillingBaba'}`
                        : undefined
                }
            />

            {previewData && (
                <InvoicePreview
                    isOpen={!!previewData}
                    onClose={() => setPreviewData(null)}
                    data={previewData}
                    type={previewData.type || 'INVOICE'}
                />
            )}

            {paymentInData && (
                <PaymentInModal
                    isOpen={!!paymentInData}
                    onClose={() => { setPaymentInData(null); onReload?.(); }}
                    onSuccess={() => { setPaymentInData(null); onReload?.(); }}
                    initialPartyId={paymentInData.partyId}
                    initialAmount={paymentInData.amount}
                    initialInvoiceId={paymentInData.invoiceId}
                />
            )}

            {paymentOutData && (
                <PaymentOutModal
                    isOpen={!!paymentOutData}
                    onClose={() => { setPaymentOutData(null); onReload?.(); }}
                    initialPartyId={paymentOutData.partyId}
                    initialAmount={paymentOutData.amount}
                    initialBillId={paymentOutData.invoiceId}
                />
            )}
        </main>
    );
};
