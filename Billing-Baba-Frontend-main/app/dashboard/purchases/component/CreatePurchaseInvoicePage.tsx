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
    FileUp,
    ImageUp,
    Trash2,
} from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea";
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
import { fetchParties, fetchCompanies, fetchItems, createPurchase, updatePurchase } from '@/lib/api';
import { InvoicePreview } from '../../sales/component/InvoicePreview';
import AddItemModal from '../../items/component/AddItemModal';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { toast } from '@/components/ui/use-toast';

const indianStates = ["Andhra Pradesh", "Gujarat", "Karnataka", "Maharashtra", "Tamil Nadu"];
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

export default function CreatePurchaseInvoicePage({ onCancel, initialData }: { onCancel: () => void, initialData?: any }) {
    const isCancelled = initialData?.status === 'Cancelled';
    const [billDate, setBillDate] = useState<Date | undefined>(initialData?.billDate ? new Date(initialData.billDate) : new Date());

    // API Data
    const [parties, setParties] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [allItems, setAllItems] = useState<any[]>([]);

    // Form State
    const [selectedPartyId, setSelectedPartyId] = useState<string>(initialData?.partyId?._id || initialData?.partyId || '');
    const [billNumber, setBillNumber] = useState(initialData?.billNumber || '');
    const [items, setItems] = useState<Item[]>(
        initialData?.items?.map((i: any, idx: number) => ({
            id: idx + 1,
            name: i.name,
            itemId: i.itemId,
            qty: i.quantity,
            unit: i.unit,
            price: i.priceUnit?.amount || 0,
            discountPercent: i.discount?.percent || 0,
            tax: i.tax?.rate ? `GST@${i.tax.rate}%` : 'NONE' // Simplified mapping
        })) ||
        [{ id: 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]
    );
    const [roundOff, setRoundOff] = useState(initialData?.roundOff || 0);
    const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(!!initialData?.roundOff);
    const [paidAmount, setPaidAmount] = useState<number | string>(initialData ? ((Number(initialData.grandTotal) || 0) - Number(initialData.balanceDue || 0)) : '');

    // New Feature State
    const [description, setDescription] = useState(initialData?.description || '');
    const [showDescription, setShowDescription] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const documentInputRef = React.useRef<HTMLInputElement>(null);

    // Dropdown State
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);

    // Party Search State
    const [partyOpen, setPartyOpen] = useState(false);
    const [partySearch, setPartySearch] = useState("");

    // Preview State
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [savedData, setSavedData] = useState<any>(null);

    // Add Item Modal
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

    // Add Party Modal
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

    const refreshItems = async () => {
        try {
            const itemsData = await fetchItems();
            const flattenedItems = itemsData.map((item: any) => {
                const details = item.product || item.service || {};
                return {
                    ...details,
                    ...item,
                    purchasePrice: details.purchasePrice || item.purchasePrice,
                    salePrice: details.salePrice || item.salePrice,
                    taxRate: details.taxRate || item.taxRate,
                    unit: details.unit || item.unit,
                };
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

    // Helper: Find selected party object for displaying phone/balance
    const selectedParty = parties.find(p => p._id === selectedPartyId);

    useEffect(() => {
        const loadData = async () => {
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
                        purchasePrice: details.purchasePrice || item.purchasePrice,
                        salePrice: details.salePrice || item.salePrice,
                        taxRate: details.taxRate || item.taxRate,
                        unit: details.unit || item.unit,
                    };
                });
                setAllItems(flattenedItems);
                // bill number assigned sequentially by backend on save
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        const timer = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timer);
    }, [partySearch]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = () => { setActiveSearchIndex(null); setDropdownCoords(null); };
        if (activeSearchIndex !== null) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [activeSearchIndex]);

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
            price: itemData.purchasePrice?.amount || 0,
            tax: 'NONE'
        };
        setItems(newItems);
        setActiveSearchIndex(null);
        setDropdownCoords(null);
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

    const parsedPaidAmount = Number(paidAmount) || 0;
    const balanceDue = totalAmount - parsedPaidAmount;

    const handleSave = async () => {
        if (!companies.length) {
            toast({ title: "No company found." });
            return;
        }

        const formData = new FormData();
        formData.append('companyId', companies[0]._id);
        if (selectedPartyId) formData.append('partyId', selectedPartyId);
        formData.append('partyName', selectedParty ? selectedParty.name : "Cash Purchase");
        formData.append('documentType', 'BILL');
        formData.append('isBill', 'true');
        formData.append('billNumber', billNumber);
        if (billDate) formData.append('billDate', billDate.toISOString());
        formData.append('grandTotal', totalAmount.toString());
        formData.append('roundOff', effectiveRoundOff.toString());
        formData.append('paymentType', 'Cash');
        formData.append('paidAmount', parsedPaidAmount.toString());
        formData.append('balanceDue', balanceDue.toString());
        formData.append('isPaid', (balanceDue <= 0).toString());
        formData.append('description', description);

        // Stringify complex objects
        const itemsPayload = items.filter(i => i.name).map(item => ({
            itemId: item.itemId,
            name: item.name,
            quantity: Number(item.qty),
            unit: item.unit,
            priceUnit: {
                amount: Number(item.price),
                taxType: 'withoutTax'
            },
            discount: {
                percent: Number(item.discountPercent),
                amount: (Number(item.qty) * Number(item.price)) * (Number(item.discountPercent) / 100)
            },
            amount: calculateItemAmount(item)
        }));
        formData.append('items', JSON.stringify(itemsPayload));

        // Append Files
        images.forEach((file) => formData.append('images', file));
        documents.forEach((file) => formData.append('documents', file));


        try {
            if (initialData && initialData._id) {
                await updatePurchase(initialData._id, formData);
                onCancel();
            } else {
                const response = await createPurchase(formData);
                setSavedData(response);
                setIsPreviewOpen(true);
            }
        } catch (error) {
            console.error("Error creating purchase invoice", error);
            toast({ title: "Failed to create purchase invoice", variant: "destructive" });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
            <div className="p-6 space-y-8">
                {/* --- Header --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Purchase Invoice' : 'Create Purchase Invoice'}</h2>
                        </div>
                        <div className="flex items-start gap-4">
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
                                            : "Select Party *"}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0 w-[400px]">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Search party..."
                                            value={partySearch}
                                            onValueChange={(val) => {
                                                setPartySearch(val);
                                            }}
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
                            <Input placeholder="Phone No." className="w-1/2" value={selectedParty?.phone || ''} disabled />
                        </div>
                        {selectedParty && <p className="text-xs text-gray-500 pl-1">Party Balance: <span className={cn("font-medium", selectedParty.currentBalance > 0 ? "text-green-600" : "text-red-600")}>{selectedParty.currentBalance}</span></p>}
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">Bill Number</label><Input className="w-48" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} /></div>
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">Bill Date</label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !billDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{billDate ? format(billDate, "dd/MM/yyyy") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={billDate} onSelect={setBillDate} initialFocus /></PopoverContent></Popover></div>
                        <div className="flex items-center justify-end"><label className="text-sm text-gray-500 w-32">State of supply</label><Select><SelectTrigger className="w-48"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{indianStates.map(state => (<SelectItem key={state} value={state}>{state}</SelectItem>))}</SelectContent></Select></div>
                    </div>
                </div>

                {/* --- Item Table --- */}
                <div className="overflow-visible relative" ref={tableWrapperRef}>
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow><TableHead className="w-12">#</TableHead><TableHead className="w-1/3">ITEM</TableHead><TableHead>QTY</TableHead><TableHead>UNIT</TableHead><TableHead>PRICE/UNIT</TableHead><TableHead>DISCOUNT</TableHead><TableHead>TAX</TableHead><TableHead className="text-right">AMOUNT</TableHead><TableHead></TableHead></TableRow>
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
                                    <TableCell><Input type="number" className="w-20" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} /></TableCell>
                                    <TableCell><Select value={item.unit} onValueChange={(val) => updateItem(item.id, 'unit', val)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{unitTypes.map(unit => (<SelectItem key={unit} value={unit}>{unit}</SelectItem>))}</SelectContent></Select></TableCell>
                                    <TableCell><Input type="number" className="w-24" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} /></TableCell>
                                    <TableCell className="flex gap-1"><Input type="number" placeholder="%" className="w-16" value={item.discountPercent} onChange={(e) => updateItem(item.id, 'discountPercent', e.target.value)} /></TableCell>
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
                            <TableRow><TableCell colSpan={2}><Button variant="outline" onClick={addRow}>ADD ROW</Button></TableCell><TableCell className="text-right font-bold">TOTAL</TableCell><TableCell className="font-bold">{totalQty}</TableCell><TableCell colSpan={4}></TableCell><TableCell className="text-right font-bold">{totalAmount.toFixed(2)}</TableCell><TableCell></TableCell></TableRow>
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
                                    <div className="font-medium text-gray-800 truncate pr-2">{i.name}{i.barcode && <span className="text-gray-400 text-xs ml-1">({i.barcode})</span>}</div>
                                    <div className="text-right text-gray-600">{i.salePrice?.amount ?? '-'}</div>
                                    <div className="text-right text-gray-600">{i.purchasePrice?.amount ?? '-'}</div>
                                    <div className="text-right text-gray-600">{i.product?.mfgCost ?? '-'}</div>
                                    <div className="text-right text-green-600 font-medium">{i.type === 'product' && i.product ? i.product.currentQuantity : 'N/A'}</div>
                                </div>
                            ))}
                            {allItems.filter(i => i.name?.toLowerCase().includes((items[activeSearchIndex]?.name || '').toLowerCase())).length === 0 && (
                                <div className="px-3 py-3 text-sm text-gray-400 text-center">No items found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- Bottom Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-4 border-t">
                    <div className="space-y-4">
                        <div className="space-y-2"><label className="text-xs text-gray-500">Payment Type</label><Select defaultValue="Cash"><SelectTrigger className="w-full md:w-1/2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem></SelectContent></Select></div>
                        <Button variant="link" className="p-0 h-auto"><Plus className="h-4 w-4 mr-1" />Add Payment type</Button>

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
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" className="text-gray-600" onClick={() => setShowDescription(true)}>
                                    <FileText className="h-4 w-4 mr-2" />ADD DESCRIPTION
                                </Button>
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
                                    <Button variant="outline" className="text-gray-600" onClick={() => documentInputRef.current?.click()}>
                                        <FileUp className="h-4 w-4 mr-2" />ADD DOCUMENT
                                    </Button>
                                    {documents.length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {documents.length} docs attached
                                        </div>
                                    )}
                                </div>
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
                                    <Button variant="outline" className="text-gray-600" onClick={() => imageInputRef.current?.click()}>
                                        <ImageUp className="h-4 w-4 mr-2" />ADD IMAGE
                                    </Button>
                                    {images.length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {images.length} images attached
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-end gap-4"><div className="flex items-center gap-2"><Checkbox id="roundOff" checked={isRoundOffEnabled} onCheckedChange={(c) => setIsRoundOffEnabled(!!c)} /><label htmlFor="roundOff" className="text-sm font-medium">Round Off</label></div><Input type="number" placeholder="0" className="w-24" value={roundOff} onChange={(e) => setRoundOff(Number(e.target.value))} disabled={!isRoundOffEnabled} /></div>
                        <div className="flex items-center justify-end gap-4"><label className="text-sm font-bold text-gray-700 w-16 text-right">Total</label><Input value={totalAmount.toFixed(2)} className="w-48 font-bold text-lg h-11 bg-gray-50" disabled /></div>
                        <div className="flex items-center justify-end gap-4">
                            <label className="text-sm font-bold text-gray-700 w-16 text-right">Paid</label>
                            <div className="relative w-48">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="w-full pl-8 bg-gray-50 cursor-not-allowed"
                                    value={paidAmount}
                                    onChange={(e) => { if (!initialData) setPaidAmount(e.target.value); }}
                                    readOnly={!!initialData}
                                    title={initialData ? "Use 'Make Payment' to record payments against this bill" : undefined}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4"><label className="text-sm font-bold text-gray-700 w-16 text-right">Balance</label><div className="w-48 font-bold text-lg pt-1">₹ {balanceDue > 0 ? balanceDue.toFixed(2) : 0}</div></div>

                        {selectedParty && (
                            <div className="flex items-center justify-end gap-4 pt-2 border-t mt-2">
                                <label className="text-sm font-bold text-gray-700 w-32 text-right">Remaining Credit</label>
                                <div className="w-48 font-bold text-lg">
                                    <span className="text-gray-800">
                                        ₹ {Math.abs((selectedParty.currentBalance || 0) - balanceDue).toFixed(2)}
                                    </span>
                                    <span className={((selectedParty.currentBalance || 0) - balanceDue) < 0 ? 'text-red-500 ml-1 text-sm' : 'text-green-500 ml-1 text-sm'}>
                                        {((selectedParty.currentBalance || 0) - balanceDue) < 0 ? '(To Pay)' : '(To Receive)'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Footer --- */}
            <div className="flex justify-between items-center gap-4 p-4 bg-gray-50 border-t rounded-b-lg">
                <div></div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Share <ChevronDown className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Share</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                    {!isCancelled && <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save</Button>}
                </div>
            </div>
            {savedData && (
                <InvoicePreview
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                        onCancel();
                    }}
                    data={savedData}
                    type="PURCHASE_INVOICE"
                />
            )}

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
