"use client";

import { useState, useEffect } from 'react';
import { MoreVertical, Printer, Edit, Trash2, Eye, Clock, ChevronDown, MessageCircle } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { SharePopover } from '@/components/dashboard/SharePopover';
import { getWhatsAppStatus, sendWhatsAppMessage } from '@/lib/api';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    TableRow,
    TableCell
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog";
import { FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TransactionTableRowProps {
    transaction: Transaction;
    onConvert?: (id: string) => void;
    onConvertToOrder?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
    onPrint?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    onConvertToReturn?: (id: string) => void;
    onReceivePayment?: (partyId: string, amount: number, invoiceId?: string) => void;
    onMakePayment?: (partyId: string, amount: number, invoiceId?: string) => void;
}

const TransactionTableRow = ({ transaction, onConvert, onConvertToOrder, onConvertToReturn, onDuplicate, onEdit, onDelete, onView, onPrint, onReceivePayment, onMakePayment }: TransactionTableRowProps) => {
    const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
    const [whatsAppMessage, setWhatsAppMessage] = useState('');
    const [isSendingWA, setIsSendingWA] = useState(false);
    const [waConnected, setWaConnected] = useState(false);

    useEffect(() => {
        getWhatsAppStatus().then(s => setWaConnected(s.status === 'CONNECTED')).catch(() => {});
    }, [isWhatsAppOpen]);

    const openWhatsApp = () => {
        const companyName = typeof window !== 'undefined' ? (localStorage.getItem('activeCompanyName') || 'BillingBaba') : 'BillingBaba';
        const msg = `Dear Customer,\nThis is a gentle reminder regarding your payment of ${transaction.balance.toLocaleString('en-IN')} pending with us.\nIf you have already made the payment, kindly ignore this message.\n-\nThank You,\n${companyName}`;
        setWhatsAppMessage(msg);
        setIsWhatsAppOpen(true);
    };

    const sendWhatsApp = async () => {
        const phone = (transaction as any).phone || '';
        if (waConnected && phone) {
            setIsSendingWA(true);
            try {
                await sendWhatsAppMessage(phone, whatsAppMessage);
                toast({ title: 'WhatsApp message sent!', className: 'bg-green-600 text-white' });
                setIsWhatsAppOpen(false);
            } catch (e: any) {
                toast({ title: e.message || 'Failed to send message', variant: 'destructive' });
            } finally {
                setIsSendingWA(false);
            }
        } else {
            // Fallback: open wa.me link
            const cleaned = phone.replace(/\D/g, '');
            const intlPhone = cleaned.startsWith('91') ? cleaned : cleaned ? `91${cleaned}` : '';
            const url = `https://wa.me/${intlPhone}?text=${encodeURIComponent(whatsAppMessage)}`;
            window.open(url, '_blank');
            setIsWhatsAppOpen(false);
        }
    };

    return (
        <>
            <TableRow>
                {/* Data Cells */}
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.invoiceNo}</TableCell>
                <TableCell className="font-medium text-gray-800">{transaction.partyName}</TableCell>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>{transaction.paymentType}</TableCell>
                <TableCell>
                    {(() => {
                        if (transaction.status === 'Cancelled') {
                            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 shadow-sm border border-gray-200">Cancelled</span>;
                        }

                        if (transaction.transactionType === 'Sale Order' || transaction.transactionType === 'Purchase Order' || transaction.transactionType === 'Proforma Invoice' || transaction.transactionType === 'Estimate/Quotation') {
                            if (transaction.isPaid) { // mapped to status === 'CONVERTED'
                                return (
                                    <span className="flex flex-col gap-0.5">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 w-fit">Converted</span>
                                        {transaction.convertedRef && (
                                            <span className="text-xs text-blue-600 font-medium pl-1">→ {transaction.convertedRef}</span>
                                        )}
                                    </span>
                                );
                            } else {
                                let label = 'Open';
                                if (transaction.transactionType === 'Sale Order' || transaction.transactionType === 'Purchase Order') label = 'Order Due';
                                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{label}</span>;
                            }
                        }

                        // Invoices Status Override based on backend
                        if (transaction.status === 'Overdue') {
                            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-900 shadow-sm border border-red-200">Overdue</span>;
                        }

                        // Logic for Invoices fallback:
                        const amount = transaction.amount || 0;
                        const balance = transaction.balance || 0;

                        if (balance <= 0.5) {
                            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Paid</span>;
                        } else if (balance >= amount - 0.5) {
                            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Unpaid</span>;
                        } else {
                            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Partial</span>;
                        }
                    })()}
                </TableCell>
                <TableCell className="text-right font-semibold text-gray-800">
                    ₹ {transaction.amount.toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-right font-semibold text-gray-800">
                    ₹ {transaction.balance.toLocaleString('en-IN')}
                </TableCell>

                {/* Actions Cell */}
                <TableCell>
                    <div className="flex items-center justify-center gap-1">
                        {/* --- Convert Button --- */}
                        {onConvert && !transaction.isPaid && !transaction.transactionType?.includes('Purchase') && transaction.status !== 'Cancelled' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 px-2 text-xs font-medium">
                                        Convert <ChevronDown className="ml-1 h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => onConvert(String(transaction.id))}>
                                        Convert to Sale
                                    </DropdownMenuItem>
                                    {onConvertToOrder && (
                                        <DropdownMenuItem onClick={() => onConvertToOrder(String(transaction.id))}>
                                            Convert to Sale Order
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* --- Direct Receive Payment Button Removed --- */}

                        {/* --- Print Button --- */}
                        {(!onConvert || transaction.isPaid) && (
                            <Button variant="ghost" size="icon" onClick={() => onPrint && onPrint(String(transaction.id))}>
                                <Printer className="h-5 w-5" />
                            </Button>
                        )}

                        {/* --- Reusable Share Popover Component --- */}
                        {(!onConvert || transaction.isPaid) && <SharePopover />}

                        {/* --- Actions Menu (More Options) --- */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {(transaction.transactionType === 'Estimate/Quotation' || transaction.transactionType === 'Proforma Invoice' || transaction.transactionType === 'Sale Order') ? (
                                    <>
                                        {(onEdit || onView) && (
                                            <DropdownMenuItem onClick={() => onEdit ? onEdit(String(transaction.id)) : onView?.(String(transaction.id))}>
                                                <span className="text-[15px] py-1 text-slate-700">View/Edit</span>
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && transaction.status !== 'Cancelled' && (
                                            <DropdownMenuItem
                                                className="focus:bg-slate-50"
                                                onClick={() => onDelete(String(transaction.id))}
                                            >
                                                <span className="text-[15px] py-1 text-slate-700">Delete</span>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => onDuplicate ? onDuplicate(String(transaction.id)) : toast({ title: "Duplicate coming soon!" })}>
                                            <span className="text-[15px] py-1 text-slate-700">Duplicate</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: "PDF Open coming soon!" })}>
                                            <span className="text-[15px] py-1 text-slate-700">Open PDF</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onView && onView(String(transaction.id))}>
                                            <span className="text-[15px] py-1 text-slate-700">Preview</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onPrint && onPrint(String(transaction.id))}>
                                            <span className="text-[15px] py-1 text-slate-700">Print</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* View/Edit */}
                                        {(onEdit || onView) && (
                                            <DropdownMenuItem onClick={() => onEdit ? onEdit(String(transaction.id)) : onView?.(String(transaction.id))}>
                                                {transaction.status === 'Cancelled' ? <Eye className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                                                <span>{transaction.status === 'Cancelled' ? 'View' : 'View/Edit'}</span>
                                            </DropdownMenuItem>
                                        )}

                                        {/* Print */}
                                        {onPrint && (
                                            <DropdownMenuItem onClick={() => onPrint(String(transaction.id))}>
                                                <Printer className="mr-2 h-4 w-4" />
                                                <span>Print</span>
                                            </DropdownMenuItem>
                                        )}

                                        {transaction.status !== 'Cancelled' && (
                                            <>
                                                {/* Generate e-Invoice (Placeholder) */}
                                                <DropdownMenuItem disabled>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    <span>Generate e-Invoice</span>
                                                </DropdownMenuItem>

                                                {/* Payment Action */}
                                                {(transaction.transactionType?.includes('Purchase') ? (onMakePayment && transaction.balance > 0 && transaction.partyId) : (onReceivePayment && transaction.balance > 0 && transaction.partyId)) && (
                                                    <DropdownMenuItem onClick={() => {
                                                        if (transaction.transactionType?.includes('Purchase')) {
                                                            onMakePayment!(transaction.partyId as string, transaction.balance, String(transaction.id));
                                                        } else {
                                                            onReceivePayment!(transaction.partyId as string, transaction.balance, String(transaction.id));
                                                        }
                                                    }}>
                                                        <span className="mr-2 h-4 w-4 text-center font-bold">₹</span>
                                                        <span className="font-medium text-slate-800">{transaction.transactionType?.includes('Purchase') ? 'Make Payment' : 'Receive Payment'}</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {/* Send WhatsApp */}
                                                {!transaction.transactionType?.includes('Purchase') && (
                                                    <DropdownMenuItem onClick={openWhatsApp}>
                                                        <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                                                        <span className="text-green-700 font-medium">Send WhatsApp</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {/* Convert To Return */}
                                                {(onConvertToReturn || onConvert || transaction.transactionType?.includes('Purchase')) && (
                                                    <DropdownMenuItem onClick={() => {
                                                        if (onConvertToReturn) onConvertToReturn(String(transaction.id));
                                                        else if (onConvert) onConvert(String(transaction.id));
                                                        else toast({ title: "Return conversion coming soon!" });
                                                    }}>
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        <span>Convert To Return</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {/* Delivery Challan Preview (Sales only) */}
                                                {!transaction.transactionType?.includes('Purchase') && (
                                                    <DropdownMenuItem onClick={() => toast({ title: "Challan preview coming soon!" })}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Preview Delivery Challan</span>
                                                    </DropdownMenuItem>
                                                )}
                                            </>
                                        )}

                                        {/* Cancel (formerly Delete) */}
                                        {onDelete && transaction.status !== 'Cancelled' && (
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => onDelete(String(transaction.id))}
                                            >
                                                <span className="mr-2 h-4 w-4">🚫</span>
                                                <span>Cancel</span>
                                            </DropdownMenuItem>
                                        )}

                                        {/* Duplicate */}
                                        <DropdownMenuItem onClick={() => onDuplicate ? onDuplicate(String(transaction.id)) : toast({ title: "Duplicate coming soon!" })}>
                                            <span className="mr-2 h-4 w-4">📄</span>
                                            <span>Duplicate</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        {/* Share/Print Options */}
                                        <DropdownMenuItem onClick={() => toast({ title: "PDF Open coming soon!" })}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            <span>Open PDF</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onView && onView(String(transaction.id))}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            <span>Preview</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onPrint && onPrint(String(transaction.id))}>
                                            <Printer className="mr-2 h-4 w-4" />
                                            <span>Print</span>
                                        </DropdownMenuItem>

                                        {/* View/Payment History */}
                                        {transaction.transactionType === 'Sale' ? (
                                            <DropdownMenuItem onClick={() => setIsPaymentHistoryOpen(true)}>
                                                <Clock className="mr-2 h-4 w-4" />
                                                <span>Payment History</span>
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem disabled>
                                                <Clock className="mr-2 h-4 w-4" />
                                                <span>View History</span>
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            </TableRow>

            {/* WhatsApp Message Dialog */}
            <Dialog open={isWhatsAppOpen} onOpenChange={setIsWhatsAppOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-700 border-b pb-4">
                            <MessageCircle className="h-5 w-5" /> Send WhatsApp Message
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-2 flex flex-col gap-3">
                        {waConnected ? (
                            <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 flex items-center gap-1.5">
                                <MessageCircle size={13} /> WhatsApp connected — message will be sent directly.
                            </p>
                        ) : (
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                                WhatsApp not connected. Will open wa.me link instead.
                            </p>
                        )}
                        {(transaction as any).phone && (
                            <p className="text-xs text-gray-500">To: <span className="font-semibold text-gray-800">{(transaction as any).phone}</span></p>
                        )}
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                            rows={7}
                            value={whatsAppMessage}
                            onChange={e => setWhatsAppMessage(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="border-t pt-3 gap-2 sm:justify-end">
                        <DialogClose asChild>
                            <Button variant="outline" size="sm">Cancel</Button>
                        </DialogClose>
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            onClick={sendWhatsApp}
                            disabled={isSendingWA}
                        >
                            {isSendingWA ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                            {waConnected ? 'Send Message' : 'Open in WhatsApp'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPaymentHistoryOpen} onOpenChange={setIsPaymentHistoryOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-blue-900 border-b pb-4">Payment History</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 flex flex-col gap-3 min-h-[100px] max-h-[300px] overflow-y-auto w-full">
                        {transaction.paymentHistory && transaction.paymentHistory.length > 0 ? (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Date</th>
                                        <th className="px-4 py-2 font-medium">Mode</th>
                                        <th className="px-4 py-2 font-medium">Notes</th>
                                        <th className="px-4 py-2 font-medium text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaction.paymentHistory.map((ph, idx) => (
                                        <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap">{ph.date}</td>
                                            <td className="px-4 py-2">{ph.paymentMode}</td>
                                            <td className="px-4 py-2 text-gray-500 text-xs">{ph.notes || '-'}</td>
                                            <td className="px-4 py-2 text-right font-medium">₹ {ph.amount.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-[16px] text-gray-800 text-center w-full">
                                {transaction.amount - transaction.balance > 0
                                    ? `Received during Sale : ₹ ${(transaction.amount - transaction.balance).toLocaleString('en-IN')}`
                                    : 'No payment history available'}
                            </p>
                        )}
                    </div>
                    <DialogFooter className="sm:justify-center w-full border-t pt-2 gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 mx-auto block px-8">
                                CLOSE
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TransactionTableRow;