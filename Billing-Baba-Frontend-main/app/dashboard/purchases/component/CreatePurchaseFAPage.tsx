"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Plus,
    FileText,
    Upload,
    CheckCircle2,
    Share2,
    X,
    FileUp,
    ImageUp,
} from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fetchParties, fetchCompanies, createPurchase } from '@/lib/api';
import { Textarea } from "@/components/ui/textarea";
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { toast } from '@/components/ui/use-toast';

const indianStates = ["Andhra Pradesh", "Gujarat", "Karnataka", "Maharashtra", "Tamil Nadu", "Madhya Pradesh"];

type AssetLineItem = {
    id: number;
    name: string; // Asset Name
    description: string;
    qty: number;
    price: number;
    tax: string;
};

export default function CreatePurchaseFAPage({ onCancel }: { onCancel: () => void }) {
    const isCancelled = false;
    const [billDate, setBillDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
    const [billTime, setBillTime] = useState(format(new Date(), 'hh:mm a'));

    // API Data
    const [parties, setParties] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);

    // Form State
    const [selectedPartyId, setSelectedPartyId] = useState<string>('');
    const [billNumber, setBillNumber] = useState('');
    const [eWayBillNo, setEWayBillNo] = useState('');
    const [items, setItems] = useState<AssetLineItem[]>([
        { id: 1, name: '', description: '', qty: 0, price: 0, tax: 'NONE' }
    ]);
    const [roundOff, setRoundOff] = useState(0);
    const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(false);

    // Party Search State
    const [partyOpen, setPartyOpen] = useState(false);
    const [partySearch, setPartySearch] = useState("");

    // New Feature State
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const documentInputRef = React.useRef<HTMLInputElement>(null);

    // Add Party Modal
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

    // Helper: Find selected party object for displaying phone/balance
    const selectedParty = parties.find(p => p._id === selectedPartyId);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [partiesData, companiesData] = await Promise.all([
                    fetchParties(partySearch),
                    fetchCompanies()
                ]);
                setParties(partiesData);
                setCompanies(companiesData);

                // Typically FA bills might have their own numbering, but sticking to generic bill logic or manual entry
                if (!billNumber) {
                    // setBillNumber(`BILL-${Date.now().toString().slice(-6)}`); 
                }
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        const timer = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timer);
    }, [partySearch]);

    const refreshParties = async () => {
        try {
            const partiesData = await fetchParties();
            setParties(partiesData);
        } catch (error) {
            console.error("Failed to refresh parties", error);
        }
    };

    const addRow = () => setItems([...items, { id: items.length + 1, name: '', description: '', qty: 0, price: 0, tax: 'NONE' }]);

    const updateItem = (id: number, field: keyof AssetLineItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeRow = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const calculateItemAmount = (item: AssetLineItem) => {
        const base = (Number(item.qty) || 0) * (Number(item.price) || 0);
        // Parse Tax
        let taxRate = 0;
        // Simple parsing for strings like output "GST@18%" => 18
        if (item.tax && item.tax !== 'NONE') {
            const match = item.tax.match(/(\d+(\.\d+)?)%/);
            if (match) taxRate = parseFloat(match[1]);
        }

        const taxAmount = base * (taxRate / 100);
        return base + taxAmount;
    };

    const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    const subTotal = items.reduce((sum, item) => sum + calculateItemAmount(item), 0); // This includes tax based on calculation above
    // Wait, typical billing calculates subtotal (pre-tax) then tax. 
    // But the updated controller expects `amount` per item.
    // Let's assume price is without tax for now as per "Purchase Invoice" logic usually.

    const effectiveRoundOff = isRoundOffEnabled ? roundOff : 0;
    const totalAmount = subTotal + Number(effectiveRoundOff);

    const handleSave = async () => {
        if (!companies.length) {
            toast({ title: "No company found." });
            return;
        }

        const formData = new FormData();
        formData.append('companyId', companies[0]._id);
        if (selectedPartyId) formData.append('partyId', selectedPartyId);
        formData.append('partyName', selectedParty ? selectedParty.name : "Cash Purchase");
        formData.append('documentType', 'FA');
        formData.append('isBill', 'true');
        formData.append('billNumber', billNumber);
        if (billDate) formData.append('billDate', billDate.toISOString());
        if (dueDate) formData.append('dueDate', dueDate.toISOString());
        formData.append('eWayBillNo', eWayBillNo);

        const itemsPayload = items.filter(i => i.name).map(item => ({
            itemId: item.itemId,
            name: item.name,
            description: item.description,
            quantity: Number(item.qty),
            unit: 'PCS',
            priceUnit: {
                amount: Number(item.price),
                taxType: 'withoutTax'
            },
            tax: {
                rate: item.tax !== 'NONE' && item.tax.match(/(\d+(\.\d+)?)%/) ? parseFloat(item.tax.match(/(\d+(\.\d+)?)%/)![1]) : 0
            },
            amount: calculateItemAmount(item)
        }));
        formData.append('items', JSON.stringify(itemsPayload));

        formData.append('grandTotal', totalAmount.toString());
        formData.append('roundOff', effectiveRoundOff.toString());
        formData.append('paymentType', 'Cash');
        formData.append('balanceDue', totalAmount.toString());
        formData.append('description', description);

        // Append Files
        images.forEach((file) => formData.append('images', file));
        documents.forEach((file) => formData.append('documents', file));

        try {
            await createPurchase(formData);
            toast({ title: "Purchase FA Created Successfully!", className: "bg-green-500 text-white" });
            onCancel();
        } catch (error) {
            console.error("Error creating purchase FA", error);
            toast({ title: "Failed to create purchase FA", variant: "destructive" });
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-8" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Purchase FA</h1>
                    <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-5 w-5" /></Button>
                </div>

                {/* --- Header --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label className="text-xs text-blue-600 font-semibold mb-1 block">Party *</label>
                                <Popover open={partyOpen} onOpenChange={setPartyOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={partyOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedPartyId
                                                ? parties.find((party) => party._id === selectedPartyId)?.name
                                                : "Select Party"}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command shouldFilter={false}>
                                            <CommandInput
                                                placeholder="Search party..."
                                                value={partySearch}
                                                onValueChange={setPartySearch}
                                            />
                                            <CommandList>
                                                <CommandEmpty>No party found.</CommandEmpty>
                                                <CommandGroup>
                                                    {parties.map((party) => (
                                                        <CommandItem
                                                            key={party._id}
                                                            value={party.name}
                                                            onSelect={() => {
                                                                setSelectedPartyId(party._id);
                                                                setPartyOpen(false);
                                                            }}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span>{party.name}</span>
                                                                <span className="text-xs text-gray-400">{party.phone}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                    <CommandItem
                                                        onSelect={() => {
                                                            setIsPartyModalOpen(true);
                                                            setPartyOpen(false);
                                                        }}
                                                        className="bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 cursor-pointer"
                                                    >
                                                        <span className="flex items-center gap-2 w-full justify-center py-1">
                                                            <Plus className="h-4 w-4" /> Add New Party
                                                        </span>
                                                    </CommandItem>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        {selectedParty && <p className="text-xs text-gray-500">Party Balance: <span className={cn("font-medium", selectedParty.currentBalance > 0 ? "text-green-600" : "text-red-600")}>{selectedParty.currentBalance}</span></p>}
                    </div>

                    <div className="space-y-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Input placeholder="E-Way Bill No." className="w-48" value={eWayBillNo} onChange={e => setEWayBillNo(e.target.value)} />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <label className="text-sm text-gray-500 w-24">Bill Number</label>
                            <Input className="w-48" placeholder="Bill Number" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <label className="text-sm text-gray-500 w-24">Bill Date</label>
                            <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal")}><CalendarIcon className="mr-2 h-4 w-4" />{billDate ? format(billDate, "dd/MM/yyyy") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={billDate} onSelect={setBillDate} initialFocus /></PopoverContent></Popover>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <label className="text-sm text-gray-500 w-24">Time</label>
                            <div className="w-48 text-left text-sm text-gray-600">{billTime}</div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <label className="text-sm text-gray-500 w-24">Due Date</label>
                            <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal")}><CalendarIcon className="mr-2 h-4 w-4" />{dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent></Popover>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <label className="text-sm text-gray-500 w-24">State of supply</label>
                            <Select defaultValue="Madhya Pradesh"><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{indianStates.map(state => (<SelectItem key={state} value={state}>{state}</SelectItem>))}</SelectContent></Select>
                        </div>
                    </div>
                </div>

                {/* --- Assets Table --- */}
                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead className="w-1/4">ASSETS</TableHead>
                                <TableHead className="w-1/4">DESCRIPTION</TableHead>
                                <TableHead>QTY</TableHead>
                                <TableHead>PRICE/UNIT</TableHead>
                                <TableHead>TAX</TableHead>
                                <TableHead className="text-right">AMOUNT</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="Asset Name"
                                            value={item.name}
                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                            className="border-none focus-visible:ring-0 px-0"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            className="border-none focus-visible:ring-0 px-0"
                                        />
                                    </TableCell>
                                    <TableCell><Input type="number" className="w-20" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} /></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <Input type="number" className="w-24" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} />
                                            <span className="text-[10px] text-gray-400">Without Tax</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.tax} onValueChange={(val) => updateItem(item.id, 'tax', val)}>
                                            <SelectTrigger className="w-24 h-8"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">Select</SelectItem>
                                                <SelectItem value="IGST@18%">IGST 18%</SelectItem>
                                                <SelectItem value="GST@18%">GST 18%</SelectItem>
                                                <SelectItem value="IGST@12%">IGST 12%</SelectItem>
                                                <SelectItem value="GST@12%">GST 12%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{calculateItemAmount(item).toFixed(2)}</TableCell>
                                    <TableCell><Button variant="ghost" size="icon" onClick={() => removeRow(item.id)}><X className="h-4 w-4 text-red-500" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-2 bg-gray-50 border-t flex justify-between items-center">
                        <Button variant="outline" onClick={addRow} className="text-blue-600 border-blue-200 bg-blue-50">ADD ROW</Button>
                        <div className="flex gap-8 pr-12">
                            <div className="text-sm font-semibold">Total</div>
                            <div className="text-sm font-semibold">{totalQty}</div>
                            <div className="text-sm font-semibold">{totalAmount.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500">Payment Type</label>
                            <div className="flex gap-2">
                                <Select defaultValue="Cash">
                                    <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Cash">Cash</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button variant="link" className="p-0 h-auto text-blue-600"><Plus className="h-4 w-4 mr-1" />Add Payment type</Button>
                        {showDescription ? (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Description</label>
                                <Textarea
                                    placeholder="Add description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="max-w-md w-full"
                                />
                            </div>
                        ) : (
                            <div><Button variant="secondary" className="text-gray-600 w-full justify-start" onClick={() => setShowDescription(true)}><Plus className="h-4 w-4 mr-2" /> ADD DESCRIPTION</Button></div>
                        )}
                        <div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                ref={imageInputRef}
                                onChange={(e) => {
                                    if (e.target.files) setImages(prev => [...prev, ...Array.from(e.target.files!)]);
                                }}
                            />
                            <Button variant="secondary" className="text-gray-600 w-full justify-start" onClick={() => imageInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" /> ADD IMAGE</Button>
                            {images.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1 pl-2">
                                    {images.length} images attached
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                multiple
                                accept=".pdf, .doc, .docx, image/*"
                                className="hidden"
                                ref={documentInputRef}
                                onChange={(e) => {
                                    if (e.target.files) setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
                                }}
                            />
                            <Button variant="secondary" className="text-gray-600 w-full justify-start" onClick={() => documentInputRef.current?.click()}><FileUp className="h-4 w-4 mr-2" /> ADD DOCUMENT</Button>
                            {documents.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1 pl-2">
                                    {documents.length} docs attached
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-end gap-4"><label className="text-sm text-gray-500">Tax</label><Select defaultValue="NONE"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NONE">NONE</SelectItem></SelectContent></Select><span className="w-20 text-right">0</span></div>
                        <div className="flex items-center justify-end gap-4"><div className="flex items-center gap-2"><Checkbox id="roundOff" checked={isRoundOffEnabled} onCheckedChange={(c) => setIsRoundOffEnabled(!!c)} /><label htmlFor="roundOff" className="text-sm text-blue-600">Round Off</label></div><Input type="number" placeholder="0" className="w-20 text-right" value={roundOff} onChange={(e) => setRoundOff(Number(e.target.value))} disabled={!isRoundOffEnabled} /></div>
                        <div className="flex items-center justify-end gap-4 border-t pt-2"><label className="text-sm font-bold">Total</label><div className="bg-white border rounded px-3 py-2 w-48 font-bold text-right">{totalAmount.toFixed(2)}</div></div>
                    </div>
                </div>
            </div>

            {/* --- Footer --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-4 z-40">
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="text-blue-600">Share <ChevronDown className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Share</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                {!isCancelled && <Button className="bg-blue-600 text-white min-w-[100px]" onClick={handleSave}>Save</Button>}
            </div>
            <div className="h-20"></div> {/* Spacer for fixed footer */}

            <EditPartyModal
                isOpen={isPartyModalOpen}
                onClose={() => setIsPartyModalOpen(false)}
                mode="add"
                onSuccess={() => {
                    refreshParties();
                    setIsPartyModalOpen(false);
                }}
            />
        </div>
    );
}
