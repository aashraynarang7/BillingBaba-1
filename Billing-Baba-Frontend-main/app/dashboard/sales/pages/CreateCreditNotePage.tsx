"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Plus, FileText, Share2, Printer, Save, Trash2 } from 'lucide-react';
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
import { fetchParties, fetchItems, createSale, updateSale } from '@/lib/api';
import AddItemModal from '../../items/component/AddItemModal';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { toast } from '@/components/ui/use-toast';

const unitTypes = ["NONE", "BOTTLES", "BAGS", "BOXES", "CANS", "CARTONS", "KG", "LTR", "MTR", "PCS"];

type Item = {
    itemId?: string;
    id: number;
    name: string;
    qty: number;
    unit: string;
    price: number;
    discountPercent: number;
    tax: string;
};

const getTaxRate = (val: string | number) => {
    if (typeof val === 'number') return val;
    if (!val || val === 'NONE' || val === 'EXEMPT') return 0;
    const match = val.toString().match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
};

export default function CreateCreditNotePage({ onCancel, initialData }: { onCancel: () => void, initialData?: any }) {
    const isCancelled = initialData?.status === 'Cancelled';
    const fromInvoice = !!initialData?.fromInvoice; // party is locked when converting from SI

    const mapInvoiceItems = (raw: any[]): Item[] => raw.map((i: any, idx: number) => ({
        id: idx + 1,
        itemId: i.itemId,
        name: i.name || '',
        qty: i.quantity ?? i.qty ?? 1,
        unit: i.unit || 'NONE',
        price: i.priceUnit?.amount ?? i.price ?? 0,
        discountPercent: i.discount?.percent ?? i.discountPercent ?? 0,
        tax: i.tax?.rate ? `GST@${i.tax.rate}%` : 'NONE',
    }));

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>();
    const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || '');
    const [returnNo, setReturnNo] = useState('');

    const [parties, setParties] = useState<any[]>([]);
    const [allItems, setAllItems] = useState<any[]>([]);

    // Form State
    const [selectedPartyId, setSelectedPartyId] = useState<string>(initialData?.partyId || '');
    const [selectedPhone, setSelectedPhone] = useState(initialData?.phone || '');
    const [partyOpen, setPartyOpen] = useState(false);
    const [partySearch, setPartySearch] = useState("");

    const [items, setItems] = useState<Item[]>(
        fromInvoice && initialData?.items?.length
            ? mapInvoiceItems(initialData.items)
            : [{ id: 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]
    );
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);

    // Add Item Modal
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    // Add Party Modal
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

    const refreshItems = async () => {
        try {
            const itemsData = await fetchItems();
            const flattenedItems = itemsData.map((item: any) => {
                const details = item.product || item.service || {};
                return { ...details, ...item, salePrice: details.salePrice || item.salePrice };
            });
            setAllItems(flattenedItems);
        } catch (error) {
            console.error("Failed to refresh items", error);
        }
    };

    const refreshParties = async () => {
        try {
            const partiesData = await fetchParties();
            setParties(partiesData);
        } catch (error) {
            console.error("Failed to refresh parties", error);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = () => { setActiveSearchIndex(null); setDropdownCoords(null); };
        if (activeSearchIndex !== null) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [activeSearchIndex]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [partiesData, itemsData] = await Promise.all([
                    fetchParties(partySearch),
                    fetchItems()
                ]);
                setParties(partiesData);

                const flattenedItems = itemsData.map((item: any) => {
                    const details = item.product || item.service || {};
                    return { ...details, ...item, salePrice: details.salePrice || item.salePrice };
                });
                setAllItems(flattenedItems);

                // Return number is auto-assigned sequentially by the backend
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, []);

    const handlePartyChange = (partyId: string) => {
        setSelectedPartyId(partyId);
        const party = parties.find(p => p._id === partyId);
        if (party) setSelectedPhone(party.phone || '');
    };

    const addRow = () => setItems([...items, { id: items.length + 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]);
    const removeRow = (id: number) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };

    const updateItem = (id: number, field: keyof Item, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleItemSelect = (index: number, itemData: any) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            itemId: itemData._id,
            name: itemData.name,
            unit: itemData.unit || 'PCS',
            price: itemData.salePrice?.amount || itemData.salePrice || 0,
            tax: 'NONE'
        };
        setItems(newItems);
        setActiveSearchIndex(null);
    };

    const calculateItemAmount = (item: Item) => {
        const base = (Number(item.qty) || 0) * (Number(item.price) || 0);
        const discountAmount = base * ((Number(item.discountPercent) || 0) / 100);
        const taxRate = getTaxRate(item.tax);
        const amountAfterDisc = base - discountAmount;
        const taxAmount = amountAfterDisc * (taxRate / 100);
        return amountAfterDisc + taxAmount;
    };

    const totalAmount = items.reduce((sum, item) => sum + calculateItemAmount(item), 0);

    // Refund/balance logic based on original SI status
    const siStatus = initialData?.siStatus;
    const siBalance = Number(initialData?.siBalance ?? 0);
    const refundAmount = fromInvoice
        ? (siStatus === 'Paid' ? 0 : siBalance)
        : 0;
    const creditBalance = fromInvoice ? totalAmount : 0;

    const handleSave = async () => {
        const payload = {
            partyId: selectedPartyId,
            partyName: fromInvoice
                ? (initialData?.partyName || 'Unknown')
                : (parties.find(p => p._id === selectedPartyId)?.name || 'Unknown'),
            phone: selectedPhone,
            returnNo,
            invoiceNumber,
            linkedInvoiceId: fromInvoice ? initialData?.invoiceId : undefined,
            creditNoteDate: date,
            invoiceDate: invoiceDate,
            refundAmount,
            balanceDue: creditBalance,
            items: items.filter(i => i.name).map(i => {
                const base = (Number(i.qty) || 0) * (Number(i.price) || 0);
                const discountAmount = base * ((Number(i.discountPercent) || 0) / 100);
                const afterDisc = base - discountAmount;
                const taxRate = getTaxRate(i.tax);
                const taxAmount = afterDisc * (taxRate / 100);

                return {
                    name: i.name,
                    quantity: Number(i.qty),
                    unit: i.unit,
                    priceUnit: { amount: Number(i.price) },
                    discount: { percent: Number(i.discountPercent), amount: discountAmount },
                    tax: { rate: taxRate, amount: taxAmount },
                    amount: afterDisc + taxAmount
                };
            }),
            grandTotal: totalAmount,
            documentType: 'CREDIT_NOTE',
        };

        try {
            await createSale(payload);
            toast({ title: "Credit Note Created Successfully", className: "bg-green-500 text-white" });
            onCancel();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to create Credit Note", variant: "destructive" });
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-md" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
            <div className="p-6 space-y-8">
                {/* --- Header Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4 flex-col">
                        <label className="text-sm font-medium">Party Name</label>
                        {fromInvoice ? (
                            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-800 font-medium text-sm">
                                {initialData?.partyName || 'Unknown Party'}
                                <span className="ml-2 text-xs text-gray-400 font-normal">(linked to invoice)</span>
                            </div>
                        ) : (
                            <Popover open={partyOpen} onOpenChange={setPartyOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between text-left font-normal">
                                        {selectedPartyId ? parties.find(p => p._id === selectedPartyId)?.name : <span className="text-gray-400">Search Party...</span>}
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search party..." onValueChange={setPartySearch} />
                                        <CommandList>
                                            <CommandEmpty>No party found.</CommandEmpty>
                                            <CommandGroup>
                                                {parties.map(p => (
                                                    <CommandItem key={p._id} onSelect={() => { handlePartyChange(p._id); setPartyOpen(false); }}>
                                                        {p.name}
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
                        )}
                        <Input placeholder="Phone No." value={selectedPhone} onChange={e => setSelectedPhone(e.target.value)} readOnly={fromInvoice} className={fromInvoice ? 'bg-gray-50' : ''} />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">Return No.</label><Input value={returnNo} onChange={e => setReturnNo(e.target.value)} className="w-48 bg-gray-50" /></div>
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">Original Inv. No.</label><Input className="w-48" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} /></div>
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">Invoice Date</label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !invoiceDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{invoiceDate ? format(invoiceDate, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus /></PopoverContent></Popover></div>
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">Date</label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent></Popover></div>
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">State of supply</label><Select><SelectTrigger className="w-48"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="state1">State 1</SelectItem></SelectContent></Select></div>
                    </div>
                </div>

                {/* --- आइटम की टेबल --- */}
                <div className="border rounded-lg relative min-h-[200px] overflow-visible" ref={tableWrapperRef}>
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow><TableHead className="w-12">#</TableHead><TableHead className="w-1/3">ITEM</TableHead><TableHead>QTY</TableHead><TableHead>UNIT</TableHead><TableHead>PRICE/UNIT</TableHead><TableHead>DISCOUNT</TableHead><TableHead>TAX</TableHead><TableHead className="text-right">AMOUNT</TableHead><TableHead><Button size="icon" variant="ghost"><Plus className="h-5 w-5 text-blue-600" /></Button></TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-400">{index + 1}</span>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-red-300 hover:text-red-500 p-0" onClick={() => removeRow(item.id)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={item.name}
                                            onChange={e => { updateItem(item.id, 'name', e.target.value); setActiveSearchIndex(index); }}
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
                                            placeholder="Item Name"
                                        />
                                    </TableCell>
                                    <TableCell><Input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} className="w-20" /></TableCell>
                                    <TableCell>
                                        <Select value={item.unit} onValueChange={v => updateItem(item.id, 'unit', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{unitTypes.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell><Input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} className="w-24" /></TableCell>
                                    <TableCell className="flex gap-1">
                                        <Input type="number" value={item.discountPercent} onChange={e => updateItem(item.id, 'discountPercent', e.target.value)} placeholder="%" className="w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.tax} onValueChange={(val) => updateItem(item.id, 'tax', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent className="h-48">
                                                <SelectItem value="NONE">NONE</SelectItem>
                                                <SelectItem value="IGST@0%">IGST@0%</SelectItem>
                                                <SelectItem value="GST@0%">GST@0%</SelectItem>
                                                <SelectItem value="IGST@0.25%">IGST@0.25%</SelectItem>
                                                <SelectItem value="GST@0.25%">GST@0.25%</SelectItem>
                                                <SelectItem value="IGST@3%">IGST@3%</SelectItem>
                                                <SelectItem value="GST@3%">GST@3%</SelectItem>
                                                <SelectItem value="IGST@5%">IGST@5%</SelectItem>
                                                <SelectItem value="GST@5%">GST@5%</SelectItem>
                                                <SelectItem value="IGST@12%">IGST@12%</SelectItem>
                                                <SelectItem value="GST@12%">GST@12%</SelectItem>
                                                <SelectItem value="IGST@18%">IGST@18%</SelectItem>
                                                <SelectItem value="GST@18%">GST@18%</SelectItem>
                                                <SelectItem value="IGST@28%">IGST@28%</SelectItem>
                                                <SelectItem value="GST@28%">GST@28%</SelectItem>
                                                <SelectItem value="EXEMPT">EXEMPT</SelectItem>
                                                <SelectItem value="IGST@40%">IGST@40%</SelectItem>
                                                <SelectItem value="GST@40%">GST@40%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{calculateItemAmount(item).toFixed(2)}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow><TableCell colSpan={2}><Button variant="outline" onClick={addRow}>ADD ROW</Button></TableCell><TableCell className="text-right font-bold">TOTAL</TableCell><TableCell className="font-bold"></TableCell><TableCell colSpan={4}></TableCell><TableCell className="text-right font-bold">{totalAmount.toFixed(2)}</TableCell><TableCell></TableCell></TableRow>
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
                            {allItems.filter(i => i.name.toLowerCase().includes((items[activeSearchIndex]?.name || '').toLowerCase())).map(i => (
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

                {/* --- निचला सेक्शन --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-4 border-t">
                    <div className="space-y-4">
                        <div><label className="text-xs text-gray-500">Payment Type</label><Select defaultValue="Cash"><SelectTrigger className="w-full md:w-1/2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem></SelectContent></Select></div>
                        <Button variant="link" className="p-0 h-auto"><Plus className="h-4 w-4 mr-1" />Add Payment type</Button>
                        <div><Button variant="outline" className="text-gray-600"><FileText className="h-4 w-4 mr-2" />ADD DESCRIPTION</Button></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-end gap-4"><div className="flex items-center gap-2"><Checkbox id="roundOff" /><label htmlFor="roundOff" className="text-sm font-medium">Round Off</label></div><Input type="number" placeholder="0" className="w-24" /></div>
                        <div className="flex items-center justify-end gap-4"><label className="text-sm font-bold">Total</label><Input value={totalAmount.toFixed(2)} className="w-48 font-bold text-lg h-11" disabled /></div>
                        {fromInvoice && (
                            <>
                                <div className="flex items-center justify-end gap-4">
                                    <label className="text-sm text-gray-500">Remaining Amount</label>
                                    <Input value={`₹ ${creditBalance.toFixed(2)}`} className="w-48 bg-gray-50 text-gray-700" disabled />
                                </div>
                                <div className="flex items-center justify-end gap-4">
                                    <label className="text-sm text-gray-500">Total Paid</label>
                                    <Input value={refundAmount.toFixed(2)} className="w-48 bg-gray-50" disabled />
                                </div>
                                {refundAmount > 0 && (
                                    <div className="flex items-center justify-end gap-4 text-xs text-gray-400">
                                        <span>Linked Amount: ₹ {refundAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-end gap-4">
                                    <label className="text-sm font-bold text-gray-800">Balance</label>
                                    <Input value={(creditBalance - refundAmount).toFixed(2)} className="w-48 font-bold" disabled />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- फुटर --- */}
            <div className="flex justify-end items-center gap-4 p-4 bg-gray-50 border-t rounded-b-lg">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Share <ChevronDown className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /><span>Share</span></DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                {!isCancelled && <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save</Button>}
            </div>
            <AddItemModal
                isOpen={isAddItemModalOpen}
                onClose={() => setIsAddItemModalOpen(false)}
                onSuccess={() => {
                    refreshItems();
                    setIsAddItemModalOpen(false);
                }}
            />

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