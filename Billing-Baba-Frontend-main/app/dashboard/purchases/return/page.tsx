"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, FileX2, Filter, Plus, Printer, Search, FileDown, MoreVertical, Edit, Trash2, Copy, FileText, Eye, History } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import CreateDebitNotePage from '../component/CreateDebitNotePage';
import { fetchDebitNotes, deletePurchase } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const transactionTypes = ["All Transaction", "Sale", "Purchase", "Payment-In", "Payment-Out", "Credit Note", "Debit Note", "Sale Order", "Purchase Order", "Estimate", "Proforma Invoice", "Delivery Challan", "Expense", "Party to Party [Received]", "Party to Party [Paid]", "Manufacture", "Sale FA", "Purchase FA", "Sale[Cancelled]", "Journal Entry"];
const EmptyStateIllustration = () => (
    <div className="text-center text-gray-500 py-16">
        <FileX2 className="mx-auto h-16 w-16 text-gray-300" />
        <p className="mt-4 font-semibold">No data is available for Debit Note.</p>
        <p className="text-sm">Please try again after making relevant changes.</p>
    </div>
);

const DatePicker = ({ initialDate }: { initialDate: Date }) => {
    const [date, setDate] = useState<Date | undefined>(initialDate);
    return (
        <Popover>
            <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-32 justify-start text-left font-normal", !date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}</Button></PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
        </Popover>
    );
};

export default function DebitNotePage() {
    const [isCreating, setIsCreating] = useState(false);
    const [dateRange, setDateRange] = useState('this-month');
    const [debitNotes, setDebitNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        loadDebitNotes();
    }, []);

    const loadDebitNotes = async () => {
        setLoading(true);
        try {
            const data = await fetchDebitNotes();
            setDebitNotes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh when returning from create
    const handleCancelCreate = () => {
        setIsCreating(false);
        loadDebitNotes();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this debit note?')) return;
        try {
            await deletePurchase(id);
            toast({ title: 'Debit note deleted', className: 'bg-green-500 text-white' });
            loadDebitNotes();
        } catch {
            toast({ title: 'Failed to delete', variant: 'destructive' });
        }
    };

    const totalAmount = debitNotes.reduce((sum, dn) => sum + (dn.grandTotal || 0), 0);
    const totalBalance = debitNotes.reduce((sum, dn) => sum + (dn.balanceDue || 0), 0);

    if (isCreating) {
        return (
            <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                return (
                <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
                    <CreateDebitNotePage onCancel={handleCancelCreate} />
                </div>
                );
            </div>
        );
    }

    return (
        <>
            <div className="bg-white p-4 sm:p-6 space-y-4 rounded-lg shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="this-month">This Month</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent>
                        </Select>
                        {dateRange === 'custom' && (
                            <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300">
                                <span className="text-sm text-gray-500">Between</span><DatePicker initialDate={new Date(2025, 8, 1)} />
                                <span className="text-sm text-gray-500">To</span><DatePicker initialDate={new Date(2025, 8, 30)} />
                            </div>
                        )}
                        <Select defaultValue="all-firms"><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all-firms">ALL FIRMS</SelectItem></SelectContent></Select>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-sm text-gray-600 gap-2"><FileDown className="h-5 w-5 text-green-600" /> Excel Report</Button>
                        <Button variant="ghost" className="text-sm text-gray-600 gap-2"><Printer className="h-5 w-5 text-gray-500" /> Print</Button>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <Select defaultValue="Debit Note">
                        <SelectTrigger className="w-full md:w-64"><SelectValue /></SelectTrigger>
                        <SelectContent>{transactionTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search..." className="pl-10" /></div>
                    <Button onClick={() => setIsCreating(true)} className="bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white gap-2"><Plus className="h-5 w-5" /> Add Debit Note</Button>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead><div className="flex items-center gap-1">DATE <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">REF NO. <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">PARTY NAME <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">CATEGORY NA... <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">TYPE <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">TOTAL <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">RECEIVED/PAID <Filter size={14} /></div></TableHead>
                                <TableHead><div className="flex items-center gap-1">BALANCE <Filter size={14} /></div></TableHead>
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={10} className="text-center py-4">Loading...</TableCell></TableRow>
                            ) : debitNotes.length === 0 ? (
                                <TableRow><TableCell colSpan={10}><EmptyStateIllustration /></TableCell></TableRow>
                            ) : (
                                debitNotes.map((dn, index) => (
                                    <TableRow key={dn._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{dn.debitNoteDate ? format(new Date(dn.debitNoteDate), 'dd/MM/yyyy') : '-'}</TableCell>
                                        <TableCell>{dn.returnNo}</TableCell>
                                        <TableCell className="font-medium text-blue-600 cursor-pointer">{dn.partyId?.name || 'Unknown'}</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>Debit Note</TableCell>
                                        <TableCell>₹ {dn.grandTotal}</TableCell>
                                        <TableCell>₹ {dn.paymentType === 'Cash' ? dn.grandTotal : 0}</TableCell>
                                        <TableCell>{dn.paymentType === 'Pending' ? `₹ ${dn.grandTotal}` : '₹ 0'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400" onClick={() => toast({ title: 'Download coming soon' })}><FileDown className="h-4 w-4" /></Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => toast({ title: 'Edit coming soon' })}><Edit className="mr-2 h-4 w-4" />View/Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => handleDelete(dn._id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'Duplicate coming soon' })}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'PDF coming soon' })}><FileText className="mr-2 h-4 w-4" />Open PDF</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'Preview coming soon' })}><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: 'View History coming soon' })}><History className="mr-2 h-4 w-4" />View History</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm font-semibold">
                    <p>Total Amount: <span className="text-green-600">₹ {totalAmount.toFixed(2)}</span></p>
                    <p>Balance: <span className="text-red-600">₹ {totalBalance.toFixed(2)}</span></p>
                </div>
            </div>
            {/* <OptionsModal
                isOpen={isPrintModalOpen} 
                onClose={() => setPrintModalOpen(false)} 
                title="Print Options" 
            />
            <OptionsModal 
                isOpen={isExcelModalOpen} 
                onClose={() => setExcelModalOpen(false)} 
                title="Excel Options" 
            /> */}
        </>
    );

}