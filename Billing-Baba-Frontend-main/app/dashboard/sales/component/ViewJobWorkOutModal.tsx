"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { convertToInvoice } from '@/lib/api';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';


interface ViewJobWorkOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    challan: any;
    onConvert: (id: string, updatedData?: any) => Promise<void>;
}

export default function ViewJobWorkOutModal({ isOpen, onClose, challan, onConvert }: ViewJobWorkOutModalProps) {
    const [isConverting, setIsConverting] = useState(false);
    const [receiveDate, setReceiveDate] = useState<Date | undefined>(new Date());
    const [remarks, setRemarks] = useState("");

    // Reset state when challan changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setReceiveDate(new Date());
            setRemarks("");
        }
    }, [isOpen, challan]);

    if (!challan) return null;

    const handleSaveAndCreateInvoice = async () => {
        setIsConverting(true);
        try {
            await onConvert(challan._id || challan.id, {
                receiveDate,
                remarks,
                targetType: 'SALE_INVOICE' // Explicitly passing target type
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Receive Goods
                        <span className="text-base font-normal text-gray-500 ml-auto">
                            Challan #{challan.invoiceNo}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8 my-4">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Party Details</p>
                        <p className="font-semibold text-lg">{challan.partyName}</p>
                        <p className="text-sm text-gray-500">Phone: {challan.partyId?.phone || '-'}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p><span className="text-gray-500 text-sm">Job ID:</span> <span className="font-medium">{challan.jobId}</span></p>
                        <p><span className="text-gray-500 text-sm">Sent Date:</span> <span className="font-medium">{challan.date}</span></p>
                        <p><span className="text-gray-500 text-sm">Expected Delivery:</span> <span className="font-medium">{challan.deliveryDateFormatted}</span></p>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
                    <h3 className="font-semibold text-blue-800 mb-2 text-sm uppercase">Recieving Finished Goods</h3>
                    <div className="flex gap-12 items-end">
                        <div className="flex-1">
                            <p className="text-xs text-blue-600 mb-1">Item Name</p>
                            <p className="font-medium text-lg">{challan.finishedGood?.name || '-'}</p>
                        </div>
                        <div className="w-32">
                            <p className="text-xs text-blue-600 mb-1">Expected Qty</p>
                            <p className="font-medium text-lg">{challan.finishedGood?.quantity || 0} <span className="text-sm text-gray-500">{challan.finishedGood?.unit}</span></p>
                        </div>
                        {/* Placeholder for actual received qty if needed later */}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Raw Materials Consumed</h3>
                    <div className="rounded-md border bg-gray-50/50">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Rate</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {challan.items?.map((item: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="text-right">{item.priceUnit?.amount}</TableCell>
                                        <TableCell className="text-right font-medium">{item.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Additional Charges View */}
                {challan.additionalCharges?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Additional Charges</h3>
                        <div className="rounded-md border bg-gray-50/50">
                            <Table>
                                <TableBody>
                                    {challan.additionalCharges.map((charge: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">{charge.name}</TableCell>
                                            <TableCell className="text-right">{charge.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}


                <div className="grid grid-cols-2 gap-8 pt-4 border-t mt-4">
                    {/* Input Section for Receiving */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Recieving Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !receiveDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {receiveDate ? format(receiveDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={receiveDate} onSelect={setReceiveDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Remarks / Notes</label>
                            <Textarea
                                placeholder="Any notes regarding the received goods..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="flex flex-col justify-end text-right space-y-2">
                        <div className="pt-4">
                            <p className="text-sm text-gray-500 uppercase">Estimated Total Cost</p>
                            <p className="text-3xl font-bold text-gray-900">₹ {challan.grandTotal?.toFixed(2) || challan.amount?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-8 pt-4 border-t gap-3 sm:justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-gray-500">Cancel</Button>
                    <div className="flex gap-3">
                        {/* Could add a 'Save as Draft' later */}
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                            onClick={handleSaveAndCreateInvoice}
                            disabled={isConverting}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isConverting ? "Creating Invoice..." : "Save & Create Invoice"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
