"use client";

import { useState } from 'react';
import { MoreVertical, Printer, Edit, Trash2, Eye, Clock, ChevronDown } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { SharePopover } from '@/components/dashboard/SharePopover';

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

const CANCELLABLE_TYPES = new Set(['Sale', 'Sale Invoice', 'Purchase', 'Purchase Bill']);

interface TransactionTableRowProps {
    transaction: Transaction;
    onConvert?: (id: string) => void;
    onConvertToOrder?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onCancel?: (id: string) => void;
    onView?: (id: string) => void;
    onPrint?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    onConvertToReturn?: (id: string) => void;
    onReceivePayment?: (partyId: string, amount: number, invoiceId?: string) => void;
    onMakePayment?: (partyId: string, amount: number, invoiceId?: string) => void;
}

const TransactionTableRow = ({ transaction, onConvert, onConvertToOrder, onConvertToReturn, onDuplicate, onEdit, onDelete, onCancel, onView, onPrint, onReceivePayment, onMakePayment }: TransactionTableRowProps) => {
    const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);

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
                                {(transaction.transactionType === 'Estimate/Quotation' || transaction.transactionType === 'Proforma Invoice' || transaction.transactionType === 'Sale Order' || transaction.transactionType === 'Purchase Order') ? (
                                    <>
                                        {(onEdit || onView) && (
                                            <DropdownMenuItem onClick={() => onEdit ? onEdit(String(transaction.id)) : onView?.(String(transaction.id))}>
                                                <span className="text-[15px] py-1 text-slate-700">View/Edit</span>
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
                                        {onDelete && (
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => onDelete(String(transaction.id))}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        )}
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

                                        {transaction.status !== 'Cancelled' && (
                                            <>
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

                                            </>
                                        )}

                                        {/* Delete */}
                                        {onDelete && (
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => onDelete(String(transaction.id))}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        )}

                                        {/* Cancel */}
                                        {onCancel && CANCELLABLE_TYPES.has(transaction.transactionType || '') && transaction.status !== 'Cancelled' && (
                                            <DropdownMenuItem
                                                className="text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                                                onClick={() => onCancel(String(transaction.id))}
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