"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';
import { ChevronDown, Plus, Settings, Printer, Share2, MoreVertical, Search, ArrowUpRight, Edit, Trash2, Copy, FileText, Eye, History } from 'lucide-react';
import CreatePaymentOutModal from '../component/CreatePaymentOutModal';
import PaymentOutSettings from '../component/PaymentOutSettings';
import { fetchPaymentOut, deletePaymentOut } from '@/lib/api';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

function getStatus(payment: any): 'Used' | 'Unused' {
    const linked = payment.linkedPurchases || [];
    const totalSettled = linked.reduce((s: number, l: any) => s + (l.amountSettled || 0), 0);
    return totalSettled > 0 ? 'Used' : 'Unused';
}

function getPaid(payment: any): number {
    const linked = payment.linkedPurchases || [];
    return linked.reduce((s: number, l: any) => s + (l.amountSettled || 0), 0);
}

export default function PaymentOutPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadPayments = async () => {
        setIsLoading(true);
        try {
            const data = await fetchPaymentOut();
            setPayments(data);
        } catch (error) {
            console.error('Failed to fetch payment-out', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this payment?')) return;
        try {
            await deletePaymentOut(id);
            toast({ title: 'Payment deleted' });
            loadPayments();
        } catch {
            toast({ title: 'Failed to delete', variant: 'destructive' });
        }
    };

    const now = new Date();
    const prevMonth = subMonths(now, 1);

    const thisMonthPayments = payments.filter(p => {
        const d = new Date(p.date);
        return d >= startOfMonth(now) && d <= endOfMonth(now);
    });
    const lastMonthPayments = payments.filter(p => {
        const d = new Date(p.date);
        return d >= startOfMonth(prevMonth) && d <= endOfMonth(prevMonth);
    });

    const totalAmount = thisMonthPayments.reduce((s, p) => s + (p.amount || 0), 0);
    const lastMonthTotal = lastMonthPayments.reduce((s, p) => s + (p.amount || 0), 0);
    const pctChange = lastMonthTotal === 0
        ? (totalAmount > 0 ? 100 : 0)
        : Math.round(((totalAmount - lastMonthTotal) / lastMonthTotal) * 100);
    const totalPaid = thisMonthPayments.reduce((s, p) => s + getPaid(p), 0);

    return (
        <>
            <div className="bg-white min-h-screen">
                {/* Header */}
                <div className="border-b px-6 py-3 flex justify-between items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 text-xl font-bold text-gray-800 p-0 hover:bg-transparent">
                                Payment-Out <ChevronDown className="h-5 w-5 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value="Payment-Out">
                                <DropdownMenuRadioItem value="Payment-Out">Payment-Out</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-red-500 text-white font-semibold rounded-full shadow-sm hover:bg-red-600 px-5">
                            <Plus size={16} className="mr-1" /> Add Payment-Out
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
                            <Settings className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Filter Bar */}
                    <div className="border rounded-lg p-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 bg-white shadow-sm">
                        <span className="font-medium">Filter by :</span>
                        <Button variant="outline" size="sm" className="rounded-full h-8 gap-1 font-normal">
                            This Month <ChevronDown className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1 border rounded-full px-3 h-8 text-xs text-gray-500">
                            <span className="text-gray-400">📅</span>
                            <span>{format(startOfMonth(now), 'dd/MM/yyyy')}</span>
                            <span>To</span>
                            <span>{format(endOfMonth(now), 'dd/MM/yyyy')}</span>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full h-8 gap-1 font-normal">
                            All Firms <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full h-8 gap-1 font-normal">
                            All Users <ChevronDown className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Summary Card */}
                    <div className="border rounded-lg bg-white shadow-sm p-4">
                        <div className="w-72 border rounded-lg p-4 space-y-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        ₹ {totalAmount.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full px-2 py-0.5">
                                    {pctChange}% <ArrowUpRight className="h-3 w-3" />
                                    <span className="text-gray-400 font-normal ml-1">vs last month</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                Paid: <span className="font-semibold text-gray-800">₹ {totalPaid.toLocaleString('en-IN')}</span>
                            </p>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-3 border-b">
                            <span className="font-semibold text-gray-800">Transactions</span>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Search className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Printer className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>
                        ) : payments.length === 0 ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                <p className="text-gray-500 font-medium">No Transactions to show</p>
                                <p className="text-sm text-gray-400 mt-1">You haven't added any transactions yet.</p>
                                <Button onClick={() => setIsModalOpen(true)} className="mt-4 rounded-full bg-red-500 text-white hover:bg-red-600">
                                    <Plus size={16} className="mr-1" /> Add Payment-Out
                                </Button>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        {['Date', 'Ref. no.', 'Party Name', 'Total Amount', 'Paid', 'Payment Type', 'Status', 'Actions'].map(col => (
                                            <th key={col} className="text-left p-3 text-gray-500 font-medium text-xs whitespace-nowrap">
                                                <span className="flex items-center gap-1">
                                                    {col}
                                                    {col !== 'Actions' && <span className="text-gray-300">▼</span>}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {payments.map((p) => {
                                        const status = getStatus(p);
                                        const paid = getPaid(p);
                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50">
                                                <td className="p-3 text-gray-700 whitespace-nowrap">
                                                    {p.date ? format(new Date(p.date), 'dd/MM/yyyy, HH:mm') : '-'}
                                                </td>
                                                <td className="p-3 text-gray-500">{p.receiptNo || '-'}</td>
                                                <td className="p-3 font-medium text-gray-800">{p.partyId?.name || '-'}</td>
                                                <td className="p-3 text-gray-700">
                                                    ₹ {(p.amount || 0).toLocaleString('en-IN')}
                                                </td>
                                                <td className="p-3 text-gray-700">
                                                    ₹ {paid.toLocaleString('en-IN')}
                                                </td>
                                                <td className="p-3 text-gray-700">{p.paymentMode || 'Cash'}</td>
                                                <td className="p-3">
                                                    <span className={`text-xs font-semibold ${status === 'Used' ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                                                            <Share2 className="h-4 w-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => setIsModalOpen(true)}><Edit className="mr-2 h-4 w-4" />View/Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => handleDelete(p._id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast({ title: 'Duplicate coming soon' })}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast({ title: 'PDF coming soon' })}><FileText className="mr-2 h-4 w-4" />Open PDF</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast({ title: 'Preview coming soon' })}><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast({ title: 'View History coming soon' })}><History className="mr-2 h-4 w-4" />View History</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <CreatePaymentOutModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); loadPayments(); }}
            />
            <PaymentOutSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}
