"use client";

import React, { useState } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogOverlay, DialogTitle, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, ChevronDown, Plus, FileText, Camera, Calculator, Settings, X, Share2, Printer, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { fetchParties, createPaymentOut, fetchPurchases } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export default function CreatePaymentOutModal({ isOpen, onClose, initialPartyId, initialAmount, initialBillId }: { isOpen: boolean, onClose: () => void; initialPartyId?: string; initialAmount?: number; initialBillId?: string; }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [parties, setParties] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        partyId: '',
        receiptNo: '',
        amount: '',
        paymentMode: 'Cash',
        description: ''
    });

    // Unpaid Bills State
    const [unpaidBills, setUnpaidBills] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<Record<string, number>>({});

    // Load Parties on Open
    React.useEffect(() => {
        if (isOpen) {
            loadParties();
            setFormData(prev => ({
                ...prev,
                receiptNo: `VOU-${Date.now()}`,
                partyId: initialPartyId || prev.partyId,
                amount: initialAmount ? initialAmount.toString() : prev.amount
            }));

            // If we have an initial bill id, we want to auto-allocate it once bills load
            if (initialBillId && initialAmount) {
                setAllocations({ [initialBillId]: initialAmount });
            }
        }
    }, [isOpen, initialPartyId, initialAmount, initialBillId]);

    const loadParties = async () => {
        try {
            const data = await fetchParties();
            setParties(data);
        } catch (error) {
            console.error("Failed to load parties", error);
        }
    };

    // Load Unpaid Bills when Party Changes
    React.useEffect(() => {
        if (formData.partyId) {
            loadUnpaidBills(formData.partyId);
        } else {
            setUnpaidBills([]);
            setAllocations({});
        }
    }, [formData.partyId]);

    const loadUnpaidBills = async (partyId: string) => {
        try {
            const purchases = await fetchPurchases({ partyId, type: 'BILL' });
            // Filter where balanceDue > 0
            const unpaid = purchases.filter((p: any) => (p.balanceDue || 0) > 0);
            setUnpaidBills(unpaid);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Auto-Allocation
    const handleTotalAmountChange = (val: string) => {
        const total = Number(val);
        setFormData(prev => ({ ...prev, amount: val }));

        let remaining = total;
        const newAllocations: Record<string, number> = {};

        // Sort oldest first (FIFO)
        const sorted = [...unpaidBills].sort((a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime());

        for (const bill of sorted) {
            if (remaining <= 0) break;
            const allocate = Math.min(remaining, bill.balanceDue);
            newAllocations[bill._id] = allocate;
            remaining -= allocate;
        }
        setAllocations(newAllocations);
    };

    const handleAllocationChange = (id: string, val: string) => {
        const amount = Number(val);
        const newAllocations = { ...allocations, [id]: amount };
        if (amount <= 0) delete newAllocations[id];

        setAllocations(newAllocations);
        const total = Object.values(newAllocations).reduce((sum, v) => sum + v, 0);
        setFormData(prev => ({ ...prev, amount: total.toString() }));
    };

    const handleSave = async () => {
        if (!formData.partyId || !formData.amount) {
            toast({ title: "Please fill required fields", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const linkedPurchases = Object.entries(allocations).map(([purchaseId, amountSettled]) => ({
                purchaseId,
                amountSettled
            }));

            await createPaymentOut({
                ...formData,
                date: date,
                amount: Number(formData.amount),
                linkedPurchases
            });
            onClose();
            // You might want to refresh the parent list here if I pass an onSuccess prop
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to save payment", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                        "data-[state=close]:animate-out data-[state=close]:fade-out-0 data-[state=close]:zoom-out-95"
                    )}
                >
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle>Payment-Out</DialogTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon"><Calculator className="h-5 w-5 text-gray-500" /></Button>
                            <Button variant="ghost" size="icon"><Settings className="h-5 w-5 text-gray-500" /></Button>
                            {/* --- हमारा एकमात्र क्लोज बटन --- */}
                            <DialogPrimitive.Close asChild>
                                <Button variant="ghost" size="icon"><X className="h-5 w-5 text-gray-500" /></Button>
                            </DialogPrimitive.Close>
                        </div>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">Party *</label>
                                <Select onValueChange={(val) => handleChange('partyId', val)} value={formData.partyId}>
                                    <SelectTrigger><SelectValue placeholder="Select Party" /></SelectTrigger>
                                    <SelectContent>
                                        {parties.map(p => (
                                            <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Payment Type</label>
                                <Select value={formData.paymentMode} onValueChange={(val) => handleChange('paymentMode', val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Cheque">Cheque</SelectItem>
                                        <SelectItem value="Online">Online</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="link" className="p-0 h-auto text-blue-600"><Plus className="h-4 w-4 mr-1" />Add Payment type</Button>
                            <div className="flex flex-wrap gap-2 pt-4">
                                <Button variant="outline" className="text-gray-600"><FileText className="h-4 w-4 mr-2" />ADD DESCRIPTION</Button>
                                <Button variant="outline" className="text-gray-600"><Camera className="h-4 w-4 mr-2" />ADD IMAGE</Button>
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-end">
                                    <label className="text-sm text-gray-500 w-24">Receipt No</label>
                                    <Input
                                        className="w-48"
                                        value={formData.receiptNo}
                                        onChange={(e) => handleChange('receiptNo', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <label className="text-sm text-gray-500 w-24">Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <label className="text-sm font-medium text-gray-500 w-24">Paid</label>
                                <Input
                                    className="w-48 text-right font-bold"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleTotalAmountChange(e.target.value)}
                                />
                            </div>

                            {/* Unpaid Bills Table */}
                            {unpaidBills.length > 0 && (
                                <div className="mt-4 border rounded-md p-2 max-h-40 overflow-y-auto text-xs">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left bg-gray-50 border-b">
                                                <th className="p-1">Date</th>
                                                <th className="p-1">Bill #</th>
                                                <th className="p-1 text-right">Due</th>
                                                <th className="p-1 text-right">Paid</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unpaidBills.map(bill => (
                                                <tr key={bill._id} className="border-b">
                                                    <td className="p-1">{format(new Date(bill.billDate), 'dd/MM/yy')}</td>
                                                    <td className="p-1">{bill.billNumber}</td>
                                                    <td className="p-1 text-right">{bill.balanceDue}</td>
                                                    <td className="p-1 text-right">
                                                        <Input
                                                            className="h-6 w-16 text-right ml-auto text-xs p-1"
                                                            type="number"
                                                            value={allocations[bill._id] || ''}
                                                            onChange={(e) => handleAllocationChange(bill._id, e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="justify-end">
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Share <ChevronDown className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Share2 className="mr-2 h-4 w-4" />Share</DropdownMenuItem><DropdownMenuItem><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem><DropdownMenuItem><Save className="mr-2 h-4 w-4" />Save & New</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </Dialog>
    );
}