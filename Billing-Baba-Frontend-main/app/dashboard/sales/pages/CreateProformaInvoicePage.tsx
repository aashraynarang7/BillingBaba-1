"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Plus,
    Share2,
    Printer,
    Save,
    FileUp,
    ImageUp,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
    TableFooter,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fetchParties, fetchCompanies, createSaleOrder, fetchItems, updateSale } from '@/lib/api';
import AddItemModal from '../../items/component/AddItemModal';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { InvoicePreview } from '../component/InvoicePreview';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/components/ui/use-toast';

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];
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

export default function CreateProformaInvoicePage({ onCancel, initialData }: { onCancel: () => void, initialData?: any }) {
    const isCancelled = initialData?.status === 'Cancelled';
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(initialData?.invoiceDate ? new Date(initialData.invoiceDate) : new Date());
    const [invoiceTime, setInvoiceTime] = useState(initialData?.invoiceTime || format(new Date(), 'hh:mm a'));

    // Data from API
    const [parties, setParties] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);

    // Form State
    const [selectedPartyId, setSelectedPartyId] = useState<string>(initialData?.partyId?._id || initialData?.partyId || '');
    const [selectedPhone, setSelectedPhone] = useState(initialData?.phone || '');
    const [refNo, setRefNo] = useState(initialData?.refNo || '');
    const [items, setItems] = useState<Item[]>(
        initialData?.items?.map((i: any, idx: number) => ({
            id: idx + 1,
            name: i.name,
            itemId: i.itemId,
            qty: i.quantity,
            unit: i.unit,
            price: i.priceUnit?.amount || 0,
            discountPercent: i.discount?.percent || 0,
            tax: i.tax?.rate ? `GST@${i.tax.rate}%` : 'NONE'
        })) ||
        [{ id: 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]
    );
    const [roundOff, setRoundOff] = useState(initialData?.roundOff || 0);
    const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(!!initialData?.roundOff);
    const [stateOfSupply, setStateOfSupply] = useState(initialData?.stateOfSupply || '');

    // New Feature State
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const documentInputRef = React.useRef<HTMLInputElement>(null);

    // Party Search State
    const [partyOpen, setPartyOpen] = useState(false);
    const [partySearch, setPartySearch] = useState("");

    // Item Search State
    const [allItems, setAllItems] = useState<any[]>([]);
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = () => { setActiveSearchIndex(null); setDropdownCoords(null); };
        if (activeSearchIndex !== null) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [activeSearchIndex]);

    // Add Item Modal State
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    // Add Party Modal State
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

    // Preview State
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [savedData, setSavedData] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            // ... same loading logic ...
            try {
                const [partiesData, companiesData, itemsData] = await Promise.all([
                    fetchParties(partySearch),
                    fetchCompanies(),
                    fetchItems()
                ]);
                setParties(partiesData);
                setCompanies(companiesData);

                const flattenedItems = itemsData.map((item: any) => {
                    const details = item.product || item.service || {};
                    return {
                        ...details,
                        ...item,
                        unit: details.unit || item.unit,
                        salePrice: details.salePrice || item.salePrice,
                        purchasePrice: details.purchasePrice || item.purchasePrice,
                        taxRate: details.taxRate || item.taxRate,
                        product: item.product,
                        service: item.service
                    };
                });
                setAllItems(flattenedItems);

                if (!refNo) {
                    setRefNo(`PRO-${Date.now().toString().slice(-6)}`);
                }
                if (!stateOfSupply && companiesData[0]?.state) {
                    setStateOfSupply(companiesData[0].state);
                }
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        const timer = setTimeout(() => { loadData(); }, 300);
        return () => clearTimeout(timer);
    }, [partySearch]);

    const refreshItems = async () => {
        try {
            const itemsData = await fetchItems();
            const flattenedItems = itemsData.map((item: any) => {
                const details = item.product || item.service || {};
                return {
                    ...details,
                    ...item,
                    unit: details.unit || item.unit,
                    salePrice: details.salePrice || item.salePrice,
                    purchasePrice: details.purchasePrice || item.purchasePrice,
                    taxRate: details.taxRate || item.taxRate,
                    product: item.product,
                    service: item.service
                };
            });
            setAllItems(flattenedItems);
        } catch (e) {
            console.error("Failed to refresh items", e);
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

    const handlePartyChange = (partyId: string) => {
        setSelectedPartyId(partyId);
        const party = parties.find(p => p._id === partyId);
        if (party) setSelectedPhone(party.phone || '');
    };

    const addRow = () => {
        setItems([...items, { id: items.length + 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]);
    };

    const updateItem = (id: number, field: keyof Item, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const removeRow = (id: number) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };

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
        const taxRate = (item.tax === 'NONE' || item.tax === 'EXEMPT' || !item.tax) ? 0 : (parseFloat(item.tax.replace(/[^0-9.]/g, '')) || 0);
        const amountAfterDisc = base - discountAmount;
        const taxAmount = amountAfterDisc * (taxRate / 100);
        return amountAfterDisc + taxAmount;
    };

    const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    const subTotal = items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
    const effectiveRoundOff = isRoundOffEnabled ? roundOff : 0;
    const totalAmount = subTotal + Number(effectiveRoundOff);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('companyId', companies[0]?._id);
        if (selectedPartyId) formData.append('partyId', selectedPartyId);
        formData.append('partyName', selectedPartyId ? parties.find(p => p._id === selectedPartyId)?.name : "Cash Sale");
        formData.append('phone', selectedPhone);
        formData.append('documentType', 'PROFORMA');
        formData.append('refNo', refNo);
        if (invoiceDate) formData.append('invoiceDate', invoiceDate.toISOString());
        formData.append('invoiceTime', invoiceTime);
        formData.append('stateOfSupply', stateOfSupply);

        const itemsPayload = items.filter(i => i.name).map(item => ({
            itemId: item.itemId,
            name: item.name,
            quantity: Number(item.qty),
            unit: item.unit,
            priceUnit: { amount: Number(item.price) },
            discount: { percent: Number(item.discountPercent) },
            discountAmount: item.discountPercent ? 0 : 0,
            tax: { rate: item.tax === 'NONE' ? 0 : parseFloat(item.tax.replace(/[^0-9.]/g, '')) },
            amount: calculateItemAmount(item)
        }));
        formData.append('items', JSON.stringify(itemsPayload));

        formData.append('grandTotal', totalAmount.toString());
        formData.append('roundOff', effectiveRoundOff.toString());
        formData.append('subTotal', subTotal.toString());
        formData.append('totalTax', "0");
        formData.append('description', description);

        // Append Files
        images.forEach((file) => formData.append('images', file));
        documents.forEach((file) => formData.append('documents', file));

        try {
            let responseData;
            if (initialData && initialData._id) {
                responseData = await updateSale(initialData._id, formData);
            } else {
                responseData = await createSaleOrder(formData);
            }

            setSavedData(responseData);
            setIsPreviewOpen(true);

        } catch (error) {
            console.error("Error saving proforma", error);
            toast({ title: "Failed to save Proforma Invoice", variant: "destructive" });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md min-h-screen" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
            <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-bold">Proforma Invoice</h1>
                <Button variant="outline" size="sm">Godown: Main Godown</Button>
            </div>

            <div className="p-6 space-y-8">
                {/* --- Header --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-blue-600">Party *</label>
                        <Popover open={partyOpen} onOpenChange={setPartyOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={partyOpen} className="w-full justify-between border-blue-200">
                                    {selectedPartyId ? parties.find((p) => p._id === selectedPartyId)?.name : "Search Party Name"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search party..." onValueChange={setPartySearch} />
                                    <CommandList>
                                        <CommandGroup>
                                            {parties.map((party) => (
                                                <CommandItem key={party._id} value={party.name} onSelect={() => { handlePartyChange(party._id); setPartyOpen(false); }}>
                                                    {party.name}
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Ref No.</label>
                            <span className="text-gray-800 font-medium">{refNo}</span>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Invoice Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"ghost"} className={cn("w-32 justify-start text-left font-normal p-0 h-auto")}>
                                        {invoiceDate ? format(invoiceDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Time</label>
                            <span className="text-sm">{invoiceTime}</span>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">State of supply</label>
                            <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                                <SelectTrigger className="w-32 border-none p-0 h-auto justify-end"><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {indianStates.map(state => (<SelectItem key={state} value={state}>{state}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* --- Item Table --- */}
                <div className="overflow-visible border-t border-b py-2 relative" ref={tableWrapperRef}>
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead className="w-1/3">ITEM</TableHead>
                                <TableHead>QTY</TableHead>
                                <TableHead>UNIT</TableHead>
                                <TableHead>PRICE/UNIT</TableHead>
                                <TableHead>TAX</TableHead>
                                <TableHead className="text-right">AMOUNT</TableHead>
                            </TableRow>
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
                                            placeholder="Item Name"
                                            value={item.name}
                                            onChange={(e) => {
                                                updateItem(item.id, 'name', e.target.value);
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
                                    <TableCell><Input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} className="w-16" /></TableCell>
                                    <TableCell>
                                        <Select value={item.unit} onValueChange={(val) => updateItem(item.id, 'unit', val)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent>{unitTypes.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell><Input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="w-24" /></TableCell>
                                    <TableCell>
                                        <Select value={item.tax} onValueChange={(val) => updateItem(item.id, 'tax', val)}>
                                            <SelectTrigger className="w-20"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent><SelectItem value="NONE">NONE</SelectItem></SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">{calculateItemAmount(item).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
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
                    <div className="p-4">
                        <Button variant="outline" className="text-blue-600 border-blue-200 bg-blue-50" onClick={addRow}>ADD ROW</Button>
                        <span className="float-right font-bold mr-4">Total: {totalQty}</span>
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-3">
                        {showDescription ? (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Description</label>
                                <Textarea
                                    placeholder="Add description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="max-w-md bg-gray-50"
                                />
                            </div>
                        ) : (
                            <Button variant="outline" className="text-gray-500" onClick={() => setShowDescription(true)}>
                                <FileUp className="h-4 w-4 mr-2" />ADD DESCRIPTION
                            </Button>
                        )}

                        {/* File Uploads */}
                        <div className="flex gap-2 pt-2">
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
                            <Button variant="outline" size="sm" onClick={() => imageInputRef.current?.click()}>
                                <ImageUp className="h-4 w-4 mr-2" /> Add Image
                            </Button>

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
                            <Button variant="outline" size="sm" onClick={() => documentInputRef.current?.click()}>
                                <FileUp className="h-4 w-4 mr-2" /> Add Document
                            </Button>
                        </div>
                        {(images.length > 0 || documents.length > 0) && (
                            <div className="text-xs text-gray-500">
                                {images.length} images, {documents.length} docs attached
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-end gap-4">
                            <label className="text-sm">Tax</label>
                            <Select><SelectTrigger className="w-32"><SelectValue placeholder="NONE" /></SelectTrigger><SelectContent><SelectItem value="NONE">NONE</SelectItem></SelectContent></Select>
                            <span>0</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <Checkbox id="roundOff" checked={isRoundOffEnabled} onCheckedChange={(c) => setIsRoundOffEnabled(!!c)} />
                            <label htmlFor="roundOff" className="text-sm">Round Off</label>
                            <Input type="number" className="w-20" value={roundOff} onChange={(e) => setRoundOff(Number(e.target.value))} disabled={!isRoundOffEnabled} />
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <label className="font-bold">Total</label>
                            <Input value={totalAmount.toFixed(2)} disabled className="w-40 font-bold bg-gray-50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 p-4 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline">Share <ChevronDown className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent><DropdownMenuItem>Share</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
                {!isCancelled && <Button className="bg-blue-600" onClick={handleSave}>Save</Button>}
            </div>

            <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} onSuccess={() => {
                refreshItems();
                setIsAddItemModalOpen(false);
            }} />

            <EditPartyModal
                isOpen={isPartyModalOpen}
                onClose={() => setIsPartyModalOpen(false)}
                mode="add"
                onSuccess={() => {
                    refreshParties();
                    setIsPartyModalOpen(false);
                }}
            />

            {savedData && (
                <InvoicePreview
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                        onCancel();
                    }}
                    data={savedData}
                    type="PROFORMA"
                />
            )}
        </div>
    );
}
