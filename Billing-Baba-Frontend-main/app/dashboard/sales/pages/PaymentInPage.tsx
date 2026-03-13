"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowUpRight,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Printer,
    Trash2 as Trash,
    Copy,
    FileText,
    Eye,
    History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FilterBar from '../component/FilterBar';
import { fetchPaymentIn, deletePaymentIn } from '@/lib/api';
import PaymentInModal from '../component/PaymentInModal';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const EmptyStateIllustration = () => (
    <div className="w-32 h-32 bg-blue-100/70 rounded-full flex items-center justify-center mb-6">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2V8H20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 13H8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 17H8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 9H8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
);

export default function PaymentInPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentInOpen, setIsPaymentInOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<any>(null);

    const [filters, setFilters] = useState<any>({});

    const loadPayments = async () => {
        try {
            // If status is 'Overdue' or 'Unpaid', PaymentIn doesn't apply.
            // So we either fetch nothing or clear the list.
            if (filters.status === 'Overdue' || filters.status === 'Unpaid') {
                setTransactions([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const data = await fetchPaymentIn(filters);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, [filters]);

    const hasTransactions = transactions.length > 0;
    const totalAmount = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this payment record? This will reverse any linked invoice balances.')) return;
        try {
            await deletePaymentIn(id);
            toast({ title: 'Payment deleted successfully', className: 'bg-green-500 text-white' });
            loadPayments();
        } catch (error) {
            toast({ title: 'Failed to delete payment', variant: 'destructive' });
        }
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardContent className="p-0 divide-y">
                    <div className="p-4 border-b flex justify-between items-center">
                        <FilterBar onFilterChange={handleFilterChange} />
                        <Button
                            onClick={() => setIsPaymentInOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        >
                            <Plus size={16} /> Add Payment
                        </Button>
                    </div>
                    <div className="p-4">
                        <div className="inline-block  bg-[var(--accent-orange)]/5 p-4 rounded-lg border border-purple-200 w-full max-w-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                                        0% <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                    <p className="text-xs text-gray-500">vs last month</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-purple-200 flex items-center text-sm">
                                <span className="text-gray-600">Received: <span className="font-semibold text-gray-800">₹ {totalAmount.toLocaleString('en-IN')}</span></span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {hasTransactions ? (
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-lg">Transactions</CardTitle>
                        <Button variant="ghost" size="icon"><Search className="h-5 w-5 text-gray-500" /></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Ref. No.</TableHead>
                                    <TableHead>Party Name</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Received</TableHead>
                                    <TableHead>Payment Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => {
                                    const isUsed = t.linkedInvoices && t.linkedInvoices.length > 0;
                                    return (
                                        <TableRow key={t._id}>
                                            <TableCell>{t.date ? format(new Date(t.date), "dd/MM/yyyy, hh:mm aa") : '-'}</TableCell>
                                            <TableCell>{t.receiptNo}</TableCell>
                                            <TableCell className="font-medium">{t.partyId?.name || 'Unknown'}</TableCell>
                                            <TableCell>₹ {t.amount?.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>₹ {t.amount?.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>{t.paymentMode}</TableCell>
                                            <TableCell>
                                                <span className={`text-sm font-semibold ${isUsed ? 'text-green-600' : 'text-red-500'}`}>
                                                    {isUsed ? 'Used' : 'Unused'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setEditingPayment(t); setIsPaymentInOpen(true); }}><Edit className="mr-2 h-4 w-4" /><span>View/Edit</span></DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500 hover:!text-red-500 focus:!text-red-500 focus:!bg-red-50" onClick={() => handleDelete(t._id)}><Trash className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'Duplicate coming soon' })}><Copy className="mr-2 h-4 w-4" /><span>Duplicate</span></DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'PDF coming soon' })}><FileText className="mr-2 h-4 w-4" /><span>Open PDF</span></DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'Preview coming soon' })}><Eye className="mr-2 h-4 w-4" /><span>Preview</span></DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /><span>Print</span></DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'View History coming soon' })}><History className="mr-2 h-4 w-4" /><span>View History</span></DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-sm">
                    <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                        <EmptyStateIllustration />
                        <h3 className="text-lg font-semibold text-gray-800">No Transactions to show</h3>
                        <p className="text-sm text-gray-500 mt-1">You haven't added any transactions yet.</p>
                        <Button onClick={() => setIsPaymentInOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-sm mt-6">
                            <Plus size={18} className="mr-2" /> Add Payment
                        </Button>
                    </CardContent>
                </Card>
            )}

            <PaymentInModal
                isOpen={isPaymentInOpen}
                onClose={() => setIsPaymentInOpen(false)}
                onSuccess={loadPayments}
            />
        </div>
    );
}