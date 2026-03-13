"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ChevronDown, ChevronUp, ImagePlus, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const paymentTermsOptions = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60'];
const taxOptions = ['NONE', 'GST@5%', 'GST@12%', 'GST@18%', 'GST@28%'];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    challan: any;
    onSave: (id: string, data?: any) => Promise<void>;
}

export default function ReceiveFinishedGoodsModal({ isOpen, onClose, challan, onSave }: Props) {
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
    const [dueDate, setDueDate] = useState<Date>(new Date());
    const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
    const [finishedGoodName, setFinishedGoodName] = useState('');
    const [finishedGoodQty, setFinishedGoodQty] = useState(1);
    const [finishedGoodUnit, setFinishedGoodUnit] = useState('PCS');
    const [jobWorkCharges, setJobWorkCharges] = useState(0);
    const [jobWorkChargesType, setJobWorkChargesType] = useState('Total Amount');
    const [paymentType, setPaymentType] = useState('Cash');
    const [tax, setTax] = useState('NONE');
    const [roundOffEnabled, setRoundOffEnabled] = useState(false);
    const [roundOff, setRoundOff] = useState(0);
    const [description, setDescription] = useState('');

    // Collapsible sections
    const [showRawMaterial, setShowRawMaterial] = useState(false);
    const [showAdditionalCost, setShowAdditionalCost] = useState(false);

    useEffect(() => {
        if (isOpen && challan) {
            setInvoiceDate(challan.invoiceDate ? new Date(challan.invoiceDate) : new Date());
            setDueDate(challan.dueDate ? new Date(challan.dueDate) : new Date());
            setPaymentTerms(challan.paymentTerms || 'Due on Receipt');
            setFinishedGoodName(challan.finishedGood?.name || '');
            setFinishedGoodQty(challan.finishedGood?.quantity || 1);
            setFinishedGoodUnit(challan.finishedGood?.unit || 'PCS');
            setJobWorkCharges(challan.jobWorkCharges || 0);
            setPaymentType(challan.paymentType || 'Cash');
            setTax('NONE');
            setRoundOff(challan.roundOff || 0);
            setRoundOffEnabled(!!challan.roundOff);
            setDescription(challan.description || '');
            setShowRawMaterial(false);
            setShowAdditionalCost(false);
        }
    }, [isOpen, challan]);

    if (!challan) return null;

    const rawMaterialTotal = (challan.items || []).reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);
    const additionalTotal = (challan.additionalCharges || []).reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
    const effectiveRoundOff = roundOffEnabled ? Number(roundOff) : 0;
    const totalMfgCost = rawMaterialTotal + additionalTotal + Number(jobWorkCharges) + effectiveRoundOff;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(challan._id || challan.id, {
                invoiceDate,
                dueDate,
                paymentTerms,
                finishedGood: { name: finishedGoodName, quantity: finishedGoodQty, unit: finishedGoodUnit },
                jobWorkCharges: Number(jobWorkCharges),
                paymentType,
                taxRate: tax === 'NONE' ? 0 : parseFloat(tax.replace(/[^0-9.]/g, '')),
                roundOff: effectiveRoundOff,
                grandTotal: totalMfgCost,
                description,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const isClosed = challan.status === 'CONVERTED';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[95vh] flex flex-col">
                <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        Receive Finished Goods
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {/* Row 1: Party + Job Details */}
                    <div className="grid grid-cols-2 gap-6 px-6 pt-5 pb-4">
                        {/* Left: Party */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 z-10">Party Name *</label>
                                    <div className="flex items-center border rounded px-3 h-10 bg-white justify-between">
                                        <span className="text-sm font-medium text-gray-800">{challan.partyName}</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                    {challan.partyBalance !== undefined && (
                                        <p className="text-xs text-red-500 mt-0.5">BAL: {challan.partyBalance}</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 z-10">Phone No.</label>
                                    <Input
                                        value={challan.phone || ''}
                                        readOnly
                                        className="h-10 bg-gray-50 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Textarea
                                    placeholder="Billing Address"
                                    defaultValue={challan.billingAddress || ''}
                                    className="resize-none h-20 text-sm placeholder:text-gray-400"
                                />
                                <Textarea
                                    placeholder="Shipping Address"
                                    defaultValue={challan.shippingAddress || ''}
                                    className="resize-none h-20 text-sm placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Right: Job Details */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-end gap-3">
                                <span className="text-sm text-gray-500 w-32 text-right">Job ID</span>
                                <span className="text-sm font-medium w-40 text-right">{challan.jobId}</span>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <span className="text-sm text-gray-500 w-32 text-right">Invoice Date</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-40 h-9 justify-between text-sm font-normal" disabled={isClosed}>
                                            {format(invoiceDate, "dd/MM/yyyy")}
                                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={invoiceDate} onSelect={(d) => d && setInvoiceDate(d)} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <span className="text-sm text-gray-500 w-32 text-right">Payment Terms</span>
                                <Select value={paymentTerms} onValueChange={setPaymentTerms} disabled={isClosed}>
                                    <SelectTrigger className="w-40 h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentTermsOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <span className="text-sm text-gray-500 w-32 text-right">Due Date</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-40 h-9 justify-between text-sm font-normal" disabled={isClosed}>
                                            {format(dueDate, "dd/MM/yyyy")}
                                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={dueDate} onSelect={(d) => d && setDueDate(d)} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Finished Good Section */}
                    <div className="px-6 pb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Finished Good</h3>
                        <div className="grid grid-cols-[1fr_120px_160px_1fr] gap-3 items-end">
                            <div className="relative">
                                <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 z-10">Finished Good *</label>
                                <Input
                                    value={finishedGoodName}
                                    onChange={e => setFinishedGoodName(e.target.value)}
                                    className="h-10 text-sm"
                                    disabled={isClosed}
                                />
                            </div>
                            <div className="relative">
                                <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 z-10">Quantity *</label>
                                <Input
                                    type="number"
                                    value={finishedGoodQty}
                                    onChange={e => setFinishedGoodQty(Number(e.target.value))}
                                    className="h-10 text-sm"
                                    disabled={isClosed}
                                />
                            </div>
                            <div className="relative">
                                <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 z-10">Units</label>
                                <Select value={finishedGoodUnit} onValueChange={setFinishedGoodUnit} disabled={isClosed}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['PCS', 'KG', 'LTR', 'MTR', 'BOXES', 'BAGS'].map(u => (
                                            <SelectItem key={u} value={u}>PIECES ({u})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Job Work Charges</p>
                                <Select value={jobWorkChargesType} onValueChange={setJobWorkChargesType} disabled={isClosed}>
                                    <SelectTrigger className="h-10 text-sm">
                                        <span className="text-gray-400 text-xs mr-1">Total Amount</span>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Total Amount">Total Amount</SelectItem>
                                        <SelectItem value="Per Unit">Per Unit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Raw Material Collapsible */}
                    <div className="border-t border-b border-gray-100">
                        <button
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowRawMaterial(s => !s)}
                        >
                            <span className="text-sm font-semibold text-gray-700">
                                Raw material{' '}
                                <span className="font-normal text-gray-400 text-xs">
                                    ({finishedGoodQty} {finishedGoodUnit} {finishedGoodName || 'item'})
                                </span>
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                {showRawMaterial ? 'Hide' : 'Show'}
                                {showRawMaterial ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </span>
                        </button>
                        {showRawMaterial && (
                            <div className="px-6 pb-4 bg-gray-50/50">
                                {(challan.items || []).length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead className="text-right">Qty</TableHead>
                                                <TableHead>Unit</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(challan.items || []).map((item: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-sm">{item.name}</TableCell>
                                                    <TableCell className="text-right text-sm">{item.quantity}</TableCell>
                                                    <TableCell className="text-sm">{item.unit}</TableCell>
                                                    <TableCell className="text-right text-sm">{item.priceUnit?.amount ?? 0}</TableCell>
                                                    <TableCell className="text-right text-sm font-medium">₹ {Number(item.amount).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-gray-50">
                                                <TableCell colSpan={4} className="text-right text-xs font-semibold text-gray-500 uppercase">Total</TableCell>
                                                <TableCell className="text-right text-sm font-bold">₹ {rawMaterialTotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-gray-400 py-3 text-center">No raw materials added</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Additional Cost Collapsible */}
                    <div className="border-b border-gray-100">
                        <button
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowAdditionalCost(s => !s)}
                        >
                            <span className="text-sm font-semibold text-gray-700">
                                Additional Cost{' '}
                                <span className="font-normal text-gray-400 text-xs">
                                    ({finishedGoodQty} {finishedGoodUnit} {finishedGoodName || 'item'})
                                </span>
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                {showAdditionalCost ? 'Hide' : 'Show'}
                                {showAdditionalCost ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </span>
                        </button>
                        {showAdditionalCost && (
                            <div className="px-6 pb-4 bg-gray-50/50">
                                {(challan.additionalCharges || []).length > 0 ? (
                                    <Table>
                                        <TableBody>
                                            {(challan.additionalCharges || []).map((c: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="text-sm font-medium">{c.name}</TableCell>
                                                    <TableCell className="text-right text-sm">₹ {Number(c.amount).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-gray-50">
                                                <TableCell className="text-right text-xs font-semibold text-gray-500 uppercase">Total</TableCell>
                                                <TableCell className="text-right text-sm font-bold">₹ {additionalTotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-gray-400 py-3 text-center">No additional costs added</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description + Attachments */}
                    <div className="grid grid-cols-[1fr_120px_120px] gap-4 px-6 py-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Description</label>
                            <Textarea
                                placeholder="Write your description here"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="resize-none h-24 text-sm"
                                disabled={isClosed}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Add Image</label>
                            <div className="border border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                                <ImagePlus className="h-5 w-5 mb-1" />
                                <span className="text-xs">Upload Image</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Add Document</label>
                            <div className="border border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                                <FileText className="h-5 w-5 mb-1" />
                                <span className="text-xs">Upload Document</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment / Tax Row */}
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Payment Type</span>
                            <Select value={paymentType} onValueChange={setPaymentType} disabled={isClosed}>
                                <SelectTrigger className="h-8 text-sm bg-blue-50 text-blue-700 border-blue-200 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Credit">Credit</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Tax</span>
                            <Select value={tax} onValueChange={setTax} disabled={isClosed}>
                                <SelectTrigger className="h-8 text-sm w-32"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {taxOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={roundOffEnabled}
                                onCheckedChange={(v) => setRoundOffEnabled(!!v)}
                                disabled={isClosed}
                                className="border-blue-400 data-[state=checked]:bg-blue-500"
                            />
                            <span className="text-sm text-gray-500">Round Off</span>
                            <Input
                                type="number"
                                value={roundOff}
                                onChange={e => setRoundOff(Number(e.target.value))}
                                className="w-16 h-8 text-sm text-right"
                                disabled={!roundOffEnabled || isClosed}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                Total Job Work charges <Info className="h-3 w-3 text-gray-400" />
                            </span>
                            <Input
                                type="number"
                                value={jobWorkCharges}
                                onChange={e => setJobWorkCharges(Number(e.target.value))}
                                className="w-24 h-8 text-sm text-right bg-gray-50"
                                disabled={isClosed}
                            />
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="flex items-center justify-between px-6 py-3 bg-orange-50 border-t border-orange-100 flex-shrink-0">
                    <p className="text-sm text-gray-700">
                        Total MFG Cost (Raw Material + Additional Cost + Job Work Charges) ={' '}
                        <span className="font-semibold">₹ {totalMfgCost.toFixed(2)}</span>
                    </p>
                    {!isClosed ? (
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-9"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={onClose} className="px-8 h-9">Close</Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
