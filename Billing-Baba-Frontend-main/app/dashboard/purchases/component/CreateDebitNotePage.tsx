"use client";

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon, ChevronDown, Plus, FileText, Trash2, ImageUp, FileUp, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fetchParties, fetchItems, createPurchase } from '@/lib/api';
import { InvoicePreview } from '../../sales/component/InvoicePreview';
import AddItemModal from '../../items/component/AddItemModal';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { toast } from '@/components/ui/use-toast';

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const unitTypes = ["NONE", "BOTTLES", "BAGS", "BOXES", "CANS", "CARTONS", "KG", "LTR", "MTR", "PCS"];

const taxOptions = [
    "NONE", "IGST@0%", "GST@0%", "IGST@3%", "GST@3%",
    "IGST@5%", "GST@5%", "IGST@12%", "GST@12%",
    "IGST@18%", "GST@18%", "IGST@28%", "GST@28%", "EXEMPT"
];

type Item = {
    id: number;
    itemId?: string;
    name: string;
    description: string;
    qty: number | string;
    unit: string;
    price: number | string;
    taxRate: string;
    taxAmount: number;
    amount: number;
};

function getTaxRate(val: string | number): number {
    if (typeof val === 'number') return val;
    if (!val || val === 'NONE' || val === 'EXEMPT') return 0;
    const match = val.toString().match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
}

function calcItemAmount(item: Item, taxType: string): number {
    const base = (Number(item.qty) || 0) * (Number(item.price) || 0);
    const rate = getTaxRate(item.taxRate);
    if (taxType === 'Without Tax') {
        return base + (base * rate) / 100;
    }
    return base; // inclusive — base already contains tax
}

function calcTaxAmount(item: Item, taxType: string): number {
    const base = (Number(item.qty) || 0) * (Number(item.price) || 0);
    const rate = getTaxRate(item.taxRate);
    if (taxType === 'Without Tax') {
        return (base * rate) / 100;
    }
    return base - base / (1 + rate / 100);
}

export default function CreateDebitNotePage({ onCancel, initialData }: { onCancel: () => void; initialData?: any }) {
    const isCancelled = initialData?.status === 'Cancelled';

    // ── API data ──────────────────────────────────────────────────────────────
    const [parties, setParties] = useState<any[]>([]);
    const [allItems, setAllItems] = useState<any[]>([]);

    // ── Preview ───────────────────────────────────────────────────────────────
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [savedData, setSavedData] = useState<any>(null);

    // ── Header fields ─────────────────────────────────────────────────────────
    const [selectedPartyId, setSelectedPartyId] = useState(initialData?.partyId?._id || initialData?.partyId || '');
    const [selectedPhone, setSelectedPhone] = useState(initialData?.partyId?.phone || '');
    const [returnNo, setReturnNo] = useState('');
    const [billNumber, setBillNumber] = useState(initialData?.billNumber || '');
    const [billDate, setBillDate] = useState<Date | undefined>(
        initialData?.billDate ? new Date(initialData.billDate) : undefined
    );
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time] = useState(format(new Date(), 'hh:mm a'));
    const [stateOfSupply, setStateOfSupply] = useState(initialData?.stateOfSupply || 'Madhya Pradesh');
    const [godown] = useState('Main Godown');

    // ── Items ─────────────────────────────────────────────────────────────────
    const initItems: Item[] = initialData?.items?.map((i: any, idx: number) => ({
        id: idx + 1,
        itemId: i.itemId,
        name: i.name || '',
        description: i.description || '',
        qty: i.quantity || '',
        unit: i.unit || 'NONE',
        price: i.priceUnit?.amount || '',
        taxRate: i.tax?.rate ? `GST@${i.tax.rate}%` : 'NONE',
        taxAmount: i.tax?.amount || 0,
        amount: i.amount || 0,
    })) || [
        { id: 1, name: '', description: '', qty: '', unit: 'NONE', price: '', taxRate: 'NONE', taxAmount: 0, amount: 0 },
        { id: 2, name: '', description: '', qty: '', unit: 'NONE', price: '', taxRate: 'NONE', taxAmount: 0, amount: 0 },
    ];
    const [items, setItems] = useState<Item[]>(initItems);

    // ── Bottom fields ─────────────────────────────────────────────────────────
    const [taxType, setTaxType] = useState('Without Tax');
    const [paymentType, setPaymentType] = useState('Cash');
    const [roundOff, setRoundOff] = useState(0);
    const [isRoundOff, setIsRoundOff] = useState(false);
    const [description, setDescription] = useState(initialData?.description || '');
    const [showDescription, setShowDescription] = useState(!!initialData?.description);
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const documentInputRef = React.useRef<HTMLInputElement>(null);

    // ── Item search ───────────────────────────────────────────────────────────
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);

    // ── Modals ────────────────────────────────────────────────────────────────
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
    const [partyOpen, setPartyOpen] = useState(false);

    // ── Load data ─────────────────────────────────────────────────────────────
    React.useEffect(() => {
        const load = async () => {
            try {
                const [pData, iData] = await Promise.all([fetchParties(), fetchItems()]);
                setParties(pData);
                const flat = iData.map((item: any) => {
                    const d = item.product || item.service || {};
                    return { ...d, ...item, purchasePrice: d.purchasePrice || item.purchasePrice, unit: d.unit || item.unit };
                });
                setAllItems(flat);
                setReturnNo('DN-' + Date.now().toString().slice(-4));
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, []);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClick = () => { setActiveSearchIndex(null); setDropdownCoords(null); };
        if (activeSearchIndex !== null) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [activeSearchIndex]);

    // ── Item helpers ──────────────────────────────────────────────────────────
    const updateItem = (index: number, field: keyof Item, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        newItems[index].taxAmount = calcTaxAmount(newItems[index], taxType);
        newItems[index].amount = calcItemAmount(newItems[index], taxType);
        setItems(newItems);
    };

    const handleItemSelect = (index: number, product: any) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            itemId: product._id,
            name: product.name,
            unit: product.unit || 'NONE',
            price: product.purchasePrice?.amount || 0,
            taxRate: 'NONE',
        };
        newItems[index].taxAmount = calcTaxAmount(newItems[index], taxType);
        newItems[index].amount = calcItemAmount(newItems[index], taxType);
        setItems(newItems);
        setActiveSearchIndex(null);
        setDropdownCoords(null);
    };

    const addRow = () => setItems([...items, {
        id: items.length + 1, name: '', description: '', qty: '', unit: 'NONE',
        price: '', taxRate: 'NONE', taxAmount: 0, amount: 0
    }]);

    const removeRow = (index: number) => {
        if (items.length > 1) setItems(items.filter((_, i) => i !== index));
    };

    // ── Totals ────────────────────────────────────────────────────────────────
    const subTotal = items.reduce((s, i) => s + i.amount, 0);
    const totalTax = items.reduce((s, i) => s + i.taxAmount, 0);
    const totalAmount = subTotal + (isRoundOff ? Number(roundOff) : 0);

    const refreshItems = async () => {
        try {
            const iData = await fetchItems();
            const flat = iData.map((item: any) => {
                const d = item.product || item.service || {};
                return { ...d, ...item, purchasePrice: d.purchasePrice || item.purchasePrice, unit: d.unit || item.unit };
            });
            setAllItems(flat);
        } catch (e) { console.error(e); }
    };

    const refreshParties = async () => {
        try { setParties(await fetchParties()); } catch (e) { console.error(e); }
    };

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedPartyId) {
            toast({ title: "Select a party", variant: "destructive" });
            return;
        }
        const formData = new FormData();
        formData.append('partyId', selectedPartyId);
        formData.append('partyName', parties.find(p => p._id === selectedPartyId)?.name || '');
        formData.append('phone', selectedPhone);
        formData.append('returnNo', returnNo);
        formData.append('billNumber', billNumber);
        if (billDate) formData.append('billDate', billDate.toISOString());
        if (date) formData.append('debitNoteDate', date.toISOString());
        formData.append('stateOfSupply', stateOfSupply);
        formData.append('documentType', 'DEBIT_NOTE');
        formData.append('paymentType', paymentType);
        formData.append('description', description);
        formData.append('roundOff', isRoundOff ? roundOff.toString() : '0');
        formData.append('grandTotal', totalAmount.toString());
        formData.append('balanceDue', totalAmount.toString());

        const itemsPayload = items.filter(i => i.name).map(i => ({
            itemId: i.itemId,
            name: i.name,
            description: i.description,
            quantity: Number(i.qty),
            unit: i.unit,
            priceUnit: { amount: Number(i.price), taxType: taxType === 'Without Tax' ? 'withoutTax' : 'withTax' },
            tax: { rate: getTaxRate(i.taxRate), amount: i.taxAmount },
            amount: i.amount,
        }));
        formData.append('items', JSON.stringify(itemsPayload));
        images.forEach(f => formData.append('images', f));
        documents.forEach(f => formData.append('documents', f));

        try {
            const response = await createPurchase(formData);
            setSavedData(response);
            toast({ title: "Debit Note created", className: "bg-green-500 text-white" });
            setIsPreviewOpen(true);
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to create Debit Note", variant: "destructive" });
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div
            className="bg-white min-h-screen"
            style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}
        >
            {/* ── Header Bar ── */}
            <div className="flex justify-between items-center px-6 py-3 border-b">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-800">Debit Note</h1>
                </div>
                <div className="text-sm bg-blue-50 px-3 py-1 rounded border border-blue-200 text-blue-700 font-medium">
                    Godown: {godown}
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* ── Top Section ── */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Party */}
                    <div className="w-full md:w-1/3 space-y-2">
                        <div className="relative border rounded-md p-1">
                            <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-blue-600 font-medium">Party *</label>
                            <Select value={selectedPartyId} onValueChange={(val) => {
                                setSelectedPartyId(val);
                                const p = parties.find(p => p._id === val);
                                if (p) setSelectedPhone(p.phone || '');
                            }}>
                                <SelectTrigger className="border-none shadow-none focus:ring-0 h-9">
                                    <SelectValue placeholder="Search by Name/Phone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-1 border-b">
                                        <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600"
                                            onClick={() => setIsPartyModalOpen(true)}>
                                            <Plus className="h-3 w-3 mr-2" />Add New Party
                                        </Button>
                                    </div>
                                    {parties.map(p => (
                                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-gray-500 pl-1">
                            Base Currency: <span className="font-bold text-black">INR</span>
                        </p>
                    </div>

                    {/* Right: Fields Grid */}
                    <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-4">
                        {/* Row 1 */}
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-1">Return No.</label>
                            <Input value={returnNo} disabled
                                className="h-8 border-0 border-b rounded-none px-0 text-sm bg-transparent focus-visible:ring-0" />
                        </div>
                        <div /> {/* spacer */}
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-1">Bill Number</label>
                            <Input value={billNumber} onChange={e => setBillNumber(e.target.value)}
                                className="h-8 border-0 border-b rounded-none px-0 text-sm focus-visible:ring-0" />
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-1">Bill Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost"
                                        className={cn("h-8 justify-between px-0 border-b rounded-none text-sm font-normal hover:bg-transparent",
                                            !billDate && "text-muted-foreground")}>
                                        {billDate ? format(billDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
                                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={billDate} onSelect={setBillDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-1">Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost"
                                        className="h-8 justify-between px-0 border-b rounded-none text-sm font-normal hover:bg-transparent">
                                        {date ? format(date, "dd/MM/yyyy") : "DD/MM/YYYY"}
                                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-1">Time</label>
                            <div className="h-8 border-b flex items-center justify-between text-sm">
                                <span>{time}</span>
                                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500">L</div>
                            </div>
                        </div>

                        {/* Row 3: State of supply */}
                        <div className="col-span-3 flex items-center justify-end gap-2">
                            <label className="text-xs text-gray-400">State of supply</label>
                            <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                                <SelectTrigger className="w-44 h-8 border-none shadow-none focus:ring-0 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* ── Items Table ── */}
                <div className="border border-gray-200 rounded-sm relative overflow-visible" ref={tableWrapperRef}>
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-10 text-center text-xs">#</TableHead>
                                <TableHead className="text-xs w-[22%]">ITEM</TableHead>
                                <TableHead className="text-xs w-[14%]">DESCRIPTION</TableHead>
                                <TableHead className="text-xs w-16">QTY</TableHead>
                                <TableHead className="text-xs w-24">UNIT</TableHead>
                                <TableHead className="text-xs w-[14%]">
                                    <div>
                                        <div>PRICE/UNIT</div>
                                        <Select value={taxType} onValueChange={(val) => {
                                            setTaxType(val);
                                            // Recalculate all items with new tax type
                                            setItems(prev => prev.map(item => ({
                                                ...item,
                                                taxAmount: calcTaxAmount(item, val),
                                                amount: calcItemAmount(item, val),
                                            })));
                                        }}>
                                            <SelectTrigger className="h-5 text-[10px] border-none shadow-none p-0 focus:ring-0 text-blue-600 font-normal bg-transparent w-fit">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Without Tax">Without Tax</SelectItem>
                                                <SelectItem value="With Tax">With Tax</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableHead>
                                <TableHead className="text-xs w-28">TAX %</TableHead>
                                <TableHead className="text-xs w-20 text-right">AMOUNT</TableHead>
                                <TableHead className="text-xs w-24 text-right">AMOUNT</TableHead>
                                <TableHead className="w-10">
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={addRow}>
                                        <Plus className="h-4 w-4 text-blue-500" />
                                    </Button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.id} className="h-12">
                                    <TableCell className="text-center text-xs text-gray-500">
                                        <div className="flex items-center justify-center gap-1">
                                            <span>{index + 1}</span>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-red-300 hover:text-red-500 p-0" onClick={() => removeRow(index)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={item.name}
                                            placeholder="Item Name"
                                            className="h-8 border-none shadow-none focus-visible:ring-0 px-1 bg-transparent text-blue-600 text-sm"
                                            onChange={e => {
                                                updateItem(index, 'name', e.target.value);
                                                setActiveSearchIndex(index);
                                            }}
                                            onFocus={(e) => {
                                                if (tableWrapperRef.current) {
                                                    const ir = e.currentTarget.getBoundingClientRect();
                                                    const wr = tableWrapperRef.current.getBoundingClientRect();
                                                    setDropdownCoords({ top: ir.bottom - wr.top, left: ir.left - wr.left });
                                                }
                                                setActiveSearchIndex(index);
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (tableWrapperRef.current) {
                                                    const ir = e.currentTarget.getBoundingClientRect();
                                                    const wr = tableWrapperRef.current.getBoundingClientRect();
                                                    setDropdownCoords({ top: ir.bottom - wr.top, left: ir.left - wr.left });
                                                }
                                                setActiveSearchIndex(index);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input value={item.description} placeholder="Description"
                                            className="h-8 border-none shadow-none focus-visible:ring-0 px-1 bg-transparent text-sm"
                                            onChange={e => updateItem(index, 'description', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={item.qty} placeholder="0"
                                            className="h-8 w-16 border border-gray-200 text-sm text-center rounded"
                                            onChange={e => updateItem(index, 'qty', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.unit} onValueChange={val => updateItem(index, 'unit', val)}>
                                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {unitTypes.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={item.price} placeholder="0"
                                            className="h-8 border border-gray-200 text-sm rounded"
                                            onChange={e => updateItem(index, 'price', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.taxRate || 'NONE'} onValueChange={val => updateItem(index, 'taxRate', val)}>
                                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {taxOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right text-sm">{item.taxAmount.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-sm font-medium">{item.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-600"
                                            onClick={() => removeRow(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Button variant="outline" size="sm" onClick={addRow} className="text-blue-600 border-blue-200">
                                        ADD ROW
                                    </Button>
                                </TableCell>
                                <TableCell colSpan={4} />
                                <TableCell className="text-right text-xs font-bold text-gray-500">TOTAL</TableCell>
                                <TableCell className="text-right font-bold">{totalTax.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-bold">{subTotal.toFixed(2)}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    {activeSearchIndex !== null && dropdownCoords && (
                        <div className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg min-w-[540px] max-h-64 overflow-y-auto"
                            style={{ top: dropdownCoords.top + 2, left: dropdownCoords.left }}>
                            <div className="grid grid-cols-5 px-3 py-1.5 text-xs text-blue-500 bg-blue-50 border-b font-medium sticky top-0 cursor-pointer hover:bg-blue-100"
                                onMouseDown={(e) => { e.preventDefault(); setIsAddItemModalOpen(true); }}>
                                <div className="flex items-center gap-1"><Plus className="h-3 w-3" />Add Item</div>
                                <div className="text-right">SALE PRICE</div>
                                <div className="text-right">PURCHASE PRICE</div>
                                <div className="text-right">MFG COST</div>
                                <div className="text-right">STOCK</div>
                            </div>
                            {allItems.filter(i => i.name?.toLowerCase().includes((items[activeSearchIndex]?.name || '').toLowerCase())).map(i => (
                                <div key={i._id}
                                    className="grid grid-cols-5 items-center px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b last:border-0"
                                    onMouseDown={(e) => { e.preventDefault(); handleItemSelect(activeSearchIndex, i); }}>
                                    <div className="font-medium text-gray-800 truncate pr-2">{i.name}</div>
                                    <div className="text-right text-gray-600">{i.salePrice?.amount ?? '-'}</div>
                                    <div className="text-right text-gray-600">{i.purchasePrice?.amount ?? '-'}</div>
                                    <div className="text-right text-gray-600">{i.product?.mfgCost ?? '-'}</div>
                                    <div className="text-right text-green-600 font-medium">{i.type === 'product' && i.product ? i.product.currentQuantity : 'N/A'}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bottom Section ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                    {/* Left: Payment & extras */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500">Payment Type</label>
                            <Select value={paymentType} onValueChange={setPaymentType}>
                                <SelectTrigger className="w-40 mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {showDescription ? (
                            <div>
                                <label className="text-xs text-gray-500">Description</label>
                                <Textarea placeholder="Add description..." value={description}
                                    onChange={e => setDescription(e.target.value)} className="mt-1 max-w-md" />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" className="text-gray-600"
                                    onClick={() => setShowDescription(true)}>
                                    <FileText className="h-4 w-4 mr-1" />ADD DESCRIPTION
                                </Button>
                                <div>
                                    <input type="file" multiple accept=".pdf,.doc,.docx,image/*" className="hidden"
                                        ref={documentInputRef}
                                        onChange={e => { if (e.target.files) setDocuments(p => [...p, ...Array.from(e.target.files!)]); }} />
                                    <Button variant="outline" size="sm" className="text-gray-600"
                                        onClick={() => documentInputRef.current?.click()}>
                                        <FileUp className="h-4 w-4 mr-1" />ADD DOCUMENT
                                    </Button>
                                </div>
                                <div>
                                    <input type="file" multiple accept="image/*" className="hidden"
                                        ref={imageInputRef}
                                        onChange={e => { if (e.target.files) setImages(p => [...p, ...Array.from(e.target.files!)]); }} />
                                    <Button variant="outline" size="sm" className="text-gray-600"
                                        onClick={() => imageInputRef.current?.click()}>
                                        <ImageUp className="h-4 w-4 mr-1" />ADD IMAGE
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Totals */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-end gap-4">
                            <label className="text-sm text-gray-500">Tax</label>
                            <Select defaultValue="NONE">
                                <SelectTrigger className="w-28 h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NONE">NONE</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="w-12 text-right text-sm">{totalTax.toFixed(0)}</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox id="roundOff" checked={isRoundOff}
                                    onCheckedChange={c => setIsRoundOff(!!c)} />
                                <label htmlFor="roundOff" className="text-sm">Round Off</label>
                            </div>
                            <Input type="number" placeholder="0" className="w-24 h-8 text-sm text-right"
                                value={roundOff} onChange={e => setRoundOff(Number(e.target.value))}
                                disabled={!isRoundOff} />
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <label className="text-sm font-bold text-gray-700">Total</label>
                            <Input value={totalAmount.toFixed(2)} disabled
                                className="w-48 font-bold text-lg h-11 bg-gray-50 text-right" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Share <ChevronDown className="h-4 w-4 ml-1" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Print</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {!isCancelled && (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save</Button>
                )}
            </div>

            {savedData && (
                <InvoicePreview
                    isOpen={isPreviewOpen}
                    onClose={() => { setIsPreviewOpen(false); onCancel(); }}
                    data={savedData}
                    type="DEBIT_NOTE"
                />
            )}

            <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)}
                onSuccess={() => { refreshItems(); setIsAddItemModalOpen(false); }} />

            <EditPartyModal isOpen={isPartyModalOpen} onClose={() => setIsPartyModalOpen(false)}
                mode="add" onSuccess={() => { refreshParties(); setIsPartyModalOpen(false); }} />
        </div>
    );
}
