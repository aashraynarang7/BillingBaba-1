"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchParties, createPaymentIn, fetchSales } from '@/lib/api';
import { format } from 'date-fns';
import { Calculator, Settings, X, Plus, Clock, Camera, FileText, ChevronDown, HelpCircle, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';

interface PaymentInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialPartyId?: string;
    initialAmount?: number;
    initialInvoiceId?: string;
}

const PaymentInModal = ({ isOpen, onClose, onSuccess, initialPartyId, initialAmount, initialInvoiceId }: PaymentInModalProps) => {
    const [parties, setParties] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        partyId: '',
        receiptNo: '', // You might want to generate this or let user input
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        discount: '',
        paymentMode: 'Cash',
        description: '',
        godown: 'Main Location' // Default
    });

    // Invoices State
    const [unpaidInvoices, setUnpaidInvoices] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<Record<string, number>>({}); // invoiceId -> amount

    // UI State
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if (formData.partyId) {
            loadUnpaidInvoices(formData.partyId);
        } else {
            setUnpaidInvoices([]);
            setAllocations({});
        }
    }, [formData.partyId]);

    const loadUnpaidInvoices = async (partyId: string) => {
        try {
            const sales = await fetchSales({ partyId, type: 'INVOICE' });
            // Filter where balanceDue > 0
            const unpaid = sales.filter((s: any) => (s.balanceDue || 0) > 0);
            setUnpaidInvoices(unpaid);

            // Auto allocate initial amount if passed
            if (isOpen && initialAmount) {
                if (initialInvoiceId) {
                    setAllocations({ [initialInvoiceId]: Number(initialAmount) });
                } else {
                    handleTotalAmountChange(String(initialAmount), unpaid);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Auto-allocate amount to invoices (Oldest First) when main amount changes
    const handleTotalAmountChange = (val: string, invoicesToUse = unpaidInvoices) => {
        const total = Number(val);
        setFormData(prev => ({ ...prev, amount: val }));

        let remaining = total;
        const newAllocations: Record<string, number> = {};

        // 1. Give priority to the explicitly clicked invoice
        if (initialInvoiceId) {
            const prioritizedInv = invoicesToUse.find(i => i._id === initialInvoiceId);
            if (prioritizedInv) {
                const allocate = Math.min(remaining, prioritizedInv.balanceDue);
                newAllocations[prioritizedInv._id] = allocate;
                remaining -= allocate;
            }
        }

        // 2. Sort oldest first for the remaining
        const sorted = [...invoicesToUse].sort((a, b) => new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime());

        for (const inv of sorted) {
            if (remaining <= 0) break;
            if (newAllocations[inv._id]) {
                continue; // Skip if already handled by priority
            }
            const allocate = Math.min(remaining, inv.balanceDue);
            newAllocations[inv._id] = allocate;
            remaining -= allocate;
        }
        setAllocations(newAllocations);
    };

    // Handle manual allocation
    const handleAllocationChange = (id: string, val: string) => {
        const amount = Number(val);
        const newAllocations = { ...allocations, [id]: amount };
        if (amount <= 0) delete newAllocations[id];

        setAllocations(newAllocations);

        // Update total
        const total = Object.values(newAllocations).reduce((sum, v) => sum + v, 0);
        setFormData(prev => ({ ...prev, amount: total.toString() }));
    };

    useEffect(() => {
        if (isOpen) {
            loadParties();
            const initAmt = initialAmount ? String(initialAmount) : '';
            setFormData(prev => ({
                ...prev,
                receiptNo: `REC-${Date.now()}`,
                partyId: initialPartyId || '',
                amount: initAmt
            }));
        } else {
            // Reset form when closed to prevent stale data
            setFormData({
                partyId: '',
                receiptNo: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                amount: '',
                discount: '',
                paymentMode: 'Cash',
                description: '',
                godown: 'Main Location'
            });
            setUnpaidInvoices([]);
            setAllocations({});
        }
    }, [isOpen, initialPartyId, initialAmount]);

    const loadParties = async () => {
        try {
            const data = await fetchParties();
            setParties(data);
        } catch (error) {
            console.error("Failed to load parties", error);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.partyId || !formData.amount) {
            toast({ title: "Please fill required fields (Party, Amount)", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const companyId = localStorage.getItem("activeCompanyId") || "";
            const linkedInvoices = Object.entries(allocations).map(([invoiceId, amountSettled]) => ({
                invoiceId,
                amountSettled
            }));

            await createPaymentIn({
                ...formData,
                companyId,
                date: new Date(formData.date),
                amount: Number(formData.amount),
                linkedInvoices
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save payment", error);
            toast({ title: "Failed to save payment", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const selectedParty = parties.find((p: any) => p._id === formData.partyId);
    const partyBalance = selectedParty ? selectedParty.currentBalance || 0 : 0;
    const totalBalanceDue = unpaidInvoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);

    // Determine which balance to focus on for the right side
    const displayBalanceDue = initialInvoiceId && initialAmount !== undefined ? initialAmount : totalBalanceDue;
    const remainingBalance = Math.max(0, displayBalanceDue - Number(formData.amount || 0) - Number(formData.discount || 0));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-visible gap-0 rounded-xl bg-white shadow-2xl [&>button]:hidden">
                {/* Custom Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Payment-In</h2>
                    <div className="flex items-center gap-3 text-slate-500">
                        <Calculator className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                        <div className="relative">
                            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center cursor-pointer hover:bg-slate-500" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Party Selection */}
                        <div className="relative mt-2">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400 z-10 font-medium">Party <span className="text-red-500">*</span></label>
                            <Select value={formData.partyId} onValueChange={(val) => handleChange('partyId', val)}>
                                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-300 rounded-md focus:ring-1 focus:ring-slate-300">
                                    <SelectValue placeholder="Select Party" />
                                </SelectTrigger>
                                <SelectContent>
                                    {parties.map((party: any) => (
                                        <SelectItem key={party._id} value={party._id}>
                                            {party.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formData.partyId && (
                                <span className="text-[11px] text-red-500 font-semibold absolute -bottom-5 left-1">BAL: {partyBalance}</span>
                            )}
                        </div>

                        {/* Payment Type */}
                        <div className="relative mt-4 pt-2">
                            <label className="absolute -top-1 left-2 bg-white px-1 text-[11px] text-slate-400 z-10 font-medium">Payment Type</label>
                            <Select value={formData.paymentMode} onValueChange={(val) => handleChange('paymentMode', val)}>
                                <SelectTrigger className="w-40 h-10 border-slate-300 rounded focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="Bank">Bank Transfer</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Add Payment type link */}
                        <div>
                            <Button variant="link" className="p-0 h-auto text-blue-500 font-medium text-sm hover:no-underline hover:text-blue-600">
                                <Plus className="w-4 h-4 mr-1" /> Add Payment type
                            </Button>
                        </div>

                        {/* Description and Attachment */}
                        <div className="space-y-4">
                            {showDescription ? (
                                <Input
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Add notes..."
                                    className="border-slate-300"
                                />
                            ) : (
                                <Button variant="outline" className="w-[180px] justify-start text-slate-400 font-bold text-xs h-10 bg-white border-slate-200" onClick={() => setShowDescription(true)}>
                                    <FileText className="w-4 h-4 mr-2" /> ADD DESCRIPTION
                                </Button>
                            )}
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="w-10 h-10 -ml-2 text-slate-400 hover:text-slate-600">
                                    <Camera className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-end gap-6 h-10">
                            <span className="text-[13px] text-slate-400 font-medium">Receipt No</span>
                            <Input
                                value={formData.receiptNo}
                                onChange={(e) => handleChange('receiptNo', e.target.value)}
                                className="w-[140px] border-0 border-b border-slate-200 rounded-none px-1 h-8 focus-visible:ring-0 focus-visible:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-6 h-10">
                            <span className="text-[13px] text-slate-400 font-medium">Date</span>
                            <div className="w-[140px] flex items-center justify-between border-b border-slate-200 px-1 pb-1">
                                <span className="text-sm font-medium">{format(new Date(formData.date), 'dd/MM/yyyy')}</span>
                                <label className="cursor-pointer text-slate-400">
                                    <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className="opacity-0 absolute w-0 h-0" />
                                    <CalendarIcon className="w-4 h-4" />
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-6 h-10">
                            <span className="text-[13px] text-slate-400 font-medium">Time</span>
                            <div className="w-[140px] flex items-center justify-between text-slate-600">
                                <span className="text-sm">04:15 PM</span>
                                <Clock className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="pt-[72px] space-y-4 pr-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-bold">Balance Due</span>
                                <span className="text-sm text-blue-500 font-bold">{displayBalanceDue.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-bold">Received</span>
                                <Input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleTotalAmountChange(e.target.value)}
                                    className="w-40 text-right h-9 border-slate-300"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-bold">Discount</span>
                                <Input
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) => handleChange('discount', e.target.value)}
                                    className="w-40 text-right h-9 bg-white border-slate-300"
                                />
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-base text-slate-800 font-bold">Remaining Balance</span>
                                <span className="text-base text-blue-500 font-bold">{remainingBalance.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col bg-white rounded-b-xl border-t">
                    <div className="p-4 px-6 flex items-center justify-end w-full">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-blue-500 rounded p-0 text-blue-500 font-medium cursor-pointer overflow-hidden leading-none h-10">
                                <span className="px-4 border-r border-blue-500 flex items-center h-full hover:bg-blue-50 text-sm">Share</span>
                                <span className="px-2 flex items-center h-full hover:bg-blue-50"><ChevronDown className="w-4 h-4" /></span>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-10 rounded shadow-sm shadow-blue-500/30" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentInModal;
