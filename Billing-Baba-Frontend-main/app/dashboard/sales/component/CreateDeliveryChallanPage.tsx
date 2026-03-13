"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Plus,
    FileText,
    Image as ImageIcon,
    Share2,
    Printer,
    Save,
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fetchParties, fetchItems, createSale } from '@/lib/api';
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
const godowns = ["Main Godown", "Warehouse 1", "Shop Floor"];

type Item = {
    id: number;
    itemId?: string; // Backend ID
    name: string;
    qty: number;
    unit: string;
    price: number;
    tax: string;
};

export default function CreateDeliveryChallanPage({ onCancel }: { onCancel: () => void }) {
    const isCancelled = false;
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
    const [challanNo, setChallanNo] = useState("1");
    const [
        godown,
        setGodown
    ] = useState("Main Godown");
    const [selectedState, setSelectedState] = useState("");

    // Data State
    const [parties, setParties] = useState<any[]>([]);
    const [allItems, setAllItems] = useState<any[]>([]);

    // Party Search
    const [partyOpen, setPartyOpen] = useState(false);
    const [selectedPartyId, setSelectedPartyId] = useState("");
    const [partySearch, setPartySearch] = useState("");

    // Form State
    const [items, setItems] = useState<Item[]>([{ id: 1, name: '', qty: 0, unit: 'NONE', price: 0, tax: 'NONE' }]);
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);
    const [roundOff, setRoundOff] = useState(false);

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
            } catch (err) {
                console.error("Error loading data", err);
            }
        };
        const timer = setTimeout(loadData, 300);
        return () => clearTimeout(timer);
    }, [partySearch]);

    const addRow = () => {
        setItems([...items, { id: items.length + 1, name: '', qty: 0, unit: 'NONE', price: 0, tax: 'NONE' }]);
    };

    const updateItem = (index: number, field: keyof Item, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };
    const removeRow = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

    const handleItemSelect = (index: number, itemData: any) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            itemId: itemData._id,
            name: itemData.name,
            price: itemData.salePrice?.amount || 0,
            unit: itemData.unit || 'NONE',
            tax: 'NONE'
        };
        setItems(newItems);
        setActiveSearchIndex(null);
    };

    // Calculations
    // Calculations
    const calculateItemAmount = (item: Item) => {
        const base = (Number(item.qty) || 0) * (Number(item.price) || 0);
        const taxRate = (item.tax === 'NONE' || item.tax === 'EXEMPT' || !item.tax) ? 0 : (parseFloat(item.tax.replace(/[^0-9.]/g, '')) || 0);
        const taxAmount = base * (taxRate / 100);
        return base + taxAmount;
    };

    const totalQty = items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
    const subTotal = items.reduce((sum, i) => sum + calculateItemAmount(i), 0);

    // Simple Round Off Logic
    let grandTotal = subTotal;
    let roundOffAmount = 0;
    if (roundOff) {
        grandTotal = Math.round(subTotal);
        roundOffAmount = grandTotal - subTotal;
    }

    const handleSave = async () => {
        if (!selectedPartyId) {
            toast({ title: "Please select a party", variant: "destructive" });
            return;
        }
        if (items.length === 0 || !items[0].name) {
            toast({ title: "Please add at least one item", variant: "destructive" });
            return;
        }

        const payload = {
            documentType: 'DELIVERY_CHALLAN',
            partyId: selectedPartyId,
            challanNumber: challanNo, // Might be overridden by backend if logic exists, but we pass it
            challanDate: invoiceDate,
            dueDate: dueDate,
            stateOfSupply: selectedState,
            godown: godown,

            items: items.filter(i => i.name).map(i => {
                const base = (Number(i.qty) || 0) * (Number(i.price) || 0);
                const taxRate = (i.tax === 'NONE' || i.tax === 'EXEMPT' || !i.tax) ? 0 : (parseFloat(i.tax.replace(/[^0-9.]/g, '')) || 0);
                const taxAmount = base * (taxRate / 100);
                return {
                    itemId: i.itemId,
                    name: i.name,
                    quantity: Number(i.qty),
                    unit: i.unit,
                    priceUnit: {
                        amount: Number(i.price),
                        taxType: 'withoutTax' // Default
                    },
                    tax: { rate: taxRate, amount: taxAmount },
                    amount: base + taxAmount
                };
            }),

            subTotal: subTotal,
            totalDiscount: 0,
            totalTax: 0,
            roundOff: roundOffAmount,
            grandTotal: grandTotal,

            balanceDue: grandTotal, // Assuming standard flow
        };

        try {
            await createSale(payload);
            toast({ title: "Delivery Challan Created Successfully!", className: "bg-green-500 text-white" });
            onCancel();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to create challan", variant: "destructive" });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
            <div className="p-6 space-y-8">
                {/* --- Top Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Party */}
                    <div>
                        <Popover open={partyOpen} onOpenChange={setPartyOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={partyOpen}
                                    className="w-full md:w-2/3 justify-between"
                                >
                                    {selectedPartyId
                                        ? parties.find((party) => party._id === selectedPartyId)?.name
                                        : "Search by Name/Phone *"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command shouldFilter={false}>
                                    <CommandInput placeholder="Search party..." value={partySearch} onValueChange={setPartySearch} />
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

                    {/* Right: Challan Details */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Godown</label>
                            <Select value={godown} onValueChange={setGodown}>
                                <SelectTrigger className="w-48 bg-blue-50/50 border-blue-100">
                                    <SelectValue placeholder="Select Godown" />
                                </SelectTrigger>
                                <SelectContent>
                                    {godowns.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Challan No.</label>
                            <Input value={challanNo} onChange={e => setChallanNo(e.target.value)} className="w-48 bg-gray-50" />
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Invoice Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !invoiceDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {invoiceDate ? format(invoiceDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Time</label>
                            <div className="w-48 flex items-center gap-2 text-sm text-gray-600">
                                {format(new Date(), "hh:mm a")}
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">Due Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-32">State of supply</label>
                            <Select value={selectedState} onValueChange={setSelectedState}>
                                <SelectTrigger className="w-48"><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    {indianStates.map(state => (<SelectItem key={state} value={state}>{state}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* --- Item Table --- */}
                <div className="overflow-visible relative" ref={tableWrapperRef}>
                    <Table>
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
                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-red-300 hover:text-red-500 p-0" onClick={() => removeRow(index)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="Item Name"
                                            value={item.name}
                                            onChange={(e) => {
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
                                        <Input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => updateItem(index, 'qty', e.target.value)}
                                            className="w-20"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={item.unit}
                                            onValueChange={(val) => updateItem(index, 'unit', val)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{unitTypes.map(unit => (<SelectItem key={unit} value={unit}>{unit}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                                            className="w-24"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={item.tax} onValueChange={(val) => updateItem(index, 'tax', val)}>
                                            <SelectTrigger><SelectValue placeholder="Tax" /></SelectTrigger>
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
                                    <TableCell className="text-right font-medium">
                                        {calculateItemAmount(item).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={2}><Button variant="outline" onClick={addRow}>ADD ROW</Button></TableCell>
                                <TableCell className="font-bold">{totalQty}</TableCell>
                                <TableCell colSpan={3}></TableCell>
                                <TableCell className="text-right font-bold">{subTotal.toFixed(2)}</TableCell>
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

                {/* --- Bottom Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="text-gray-600"><FileText className="h-4 w-4 mr-2" />ADD DESCRIPTION</Button>
                        <Button variant="outline" className="text-gray-600"><ImageIcon className="h-4 w-4 mr-2" />ADD IMAGE</Button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-end gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox id="roundOff" checked={roundOff} onCheckedChange={(c) => setRoundOff(!!c)} />
                                <label htmlFor="roundOff" className="text-sm font-medium">Round Off</label>
                            </div>
                            <span className="w-24 text-right text-gray-500">{roundOffAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <label className="text-sm font-bold">Total</label>
                            <Input value={grandTotal.toFixed(2)} className="w-48 font-bold text-lg h-11" disabled />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Footer --- */}
            <div className="flex justify-end items-center gap-4 p-4 bg-gray-50 border-t rounded-b-lg">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline">Share <ChevronDown className="h-4 w-4 ml-2" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /><span>Share</span></DropdownMenuItem>
                        <DropdownMenuItem><Printer className="mr-2 h-4 w-4" /><span>Print</span></DropdownMenuItem>
                        <DropdownMenuItem><Save className="mr-2 h-4 w-4" /><span>Save and New</span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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