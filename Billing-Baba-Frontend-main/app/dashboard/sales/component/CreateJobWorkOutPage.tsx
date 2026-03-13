"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Plus,
    X,
    Save,
    Share2,
    Printer,
    Camera,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const unitTypes = ["NONE", "BOTTLES", "BAGS", "BOXES", "CANS", "CARTONS", "KG", "LTR", "MTR", "PCS"];
const chargeTypes = ["Labor Charges", "Transport Charges", "Packaging Charges", "Loading/Unloading", "Other Charges"];


type RawMaterialItem = {
    id: number;
    name: string;
    qty: number;
    unit: string;
    purchasePrice: number;
    estimatedCost: number;
};

type AdditionalCostItem = {
    id: number;
    name: string;
    cost: number;
};

export default function CreateJobWorkOutPage({ onCancel }: { onCancel: () => void }) {
    const isCancelled = false;
    // Dates
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(new Date());

    // Header Fields
    const [jobId, setJobId] = useState("");

    // Data State
    const [parties, setParties] = useState<any[]>([]);
    const [allItems, setAllItems] = useState<any[]>([]);

    // Party State
    const [selectedPartyId, setSelectedPartyId] = useState("");
    const [partySearch, setPartySearch] = useState("");
    const [partyOpen, setPartyOpen] = useState(false);
    const selectedParty = parties.find(p => p._id === selectedPartyId);

    // Finished Good State
    const [finishedGoodName, setFinishedGoodName] = useState("");
    const [finishedGoodQty, setFinishedGoodQty] = useState(1);
    const [finishedGoodUnit, setFinishedGoodUnit] = useState("PCS");
    const [finishedGoodSearchOpen, setFinishedGoodSearchOpen] = useState(false);

    // Raw Material Table State
    const [rawMaterials, setRawMaterials] = useState<RawMaterialItem[]>([
        { id: 1, name: '', qty: 0, unit: 'NONE', purchasePrice: 0, estimatedCost: 0 },
        { id: 2, name: '', qty: 0, unit: 'NONE', purchasePrice: 0, estimatedCost: 0 }
    ]);

    // Additional Costs State
    const [additionalCosts, setAdditionalCosts] = useState<AdditionalCostItem[]>([]);
    const [showAdditionalCosts, setShowAdditionalCosts] = useState(false);

    // Description State
    const [description, setDescription] = useState("");

    // Raw Material Interaction State
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [partiesData, itemsData] = await Promise.all([
                    fetchParties(partySearch),
                    fetchItems()
                ]);
                setParties(partiesData);
                // Flatten items for search
                // Flatten items for search
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
        loadData();
    }, [partySearch]);

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

    // Add Item Modal
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    // Add Party Modal
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

    // Close Dropdowns on Click Outside
    useEffect(() => {
        const handleClick = () => {
            setFinishedGoodSearchOpen(false);
            setActiveSearchIndex(null);
        };

        if (finishedGoodSearchOpen || activeSearchIndex !== null) {
            document.addEventListener('click', handleClick);
        }
        return () => document.removeEventListener('click', handleClick);
    }, [finishedGoodSearchOpen, activeSearchIndex]);


    // Handlers
    const handleFinishedGoodSelect = (item: any) => {
        setFinishedGoodName(item.name);
        setFinishedGoodUnit(item.unit || "PCS");
        setFinishedGoodSearchOpen(false);
    };

    const addRow = () => {
        setRawMaterials([...rawMaterials, { id: Date.now(), name: '', qty: 0, unit: 'NONE', purchasePrice: 0, estimatedCost: 0 }]);
    };

    const updateRawMaterial = (index: number, field: keyof RawMaterialItem, value: any) => {
        const newItems = [...rawMaterials];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-calculate cost
        if (field === 'qty' || field === 'purchasePrice') {
            const qty = Number(newItems[index].qty) || 0;
            const price = Number(newItems[index].purchasePrice) || 0;
            newItems[index].estimatedCost = qty * price;
        }

        setRawMaterials(newItems);
    };

    const handleRawMaterialSelect = (index: number, item: any) => {
        const newItems = [...rawMaterials];
        newItems[index] = {
            ...newItems[index],
            name: item.name,
            unit: item.unit || "NONE",
            purchasePrice: item.purchasePrice?.amount || 0
        };
        // Recalculate cost
        const qty = Number(newItems[index].qty) || 0;
        const price = Number(newItems[index].purchasePrice) || 0;
        newItems[index].estimatedCost = qty * price;

        setRawMaterials(newItems);
        setActiveSearchIndex(null);
    };

    // Additional Costs Handlers
    const toggleAdditionalCosts = () => {
        const newState = !showAdditionalCosts;
        setShowAdditionalCosts(newState);
        if (newState && additionalCosts.length === 0) {
            setAdditionalCosts([{ id: Date.now(), name: '', cost: 0 }]);
        }
    };

    const addCostRow = () => {
        setAdditionalCosts([...additionalCosts, { id: Date.now(), name: '', cost: 0 }]);
    };

    const updateCostRow = (index: number, field: keyof AdditionalCostItem, value: any) => {
        const newCosts = [...additionalCosts];
        newCosts[index] = { ...newCosts[index], [field]: value };
        setAdditionalCosts(newCosts);
    };

    const removeCostRow = (index: number) => {
        const newCosts = additionalCosts.filter((_, i) => i !== index);
        setAdditionalCosts(newCosts);
        if (newCosts.length === 0) setShowAdditionalCosts(false);
    };

    const totalRawMaterialCost = rawMaterials.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalAdditionalCost = additionalCosts.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
    const grandTotal = totalRawMaterialCost + totalAdditionalCost;

    const handleSave = async () => {
        if (!selectedPartyId) {
            toast({ title: "Please select a party", variant: "destructive" });
            return;
        }
        if (!finishedGoodName) {
            toast({ title: "Please specify a finished good", variant: "destructive" });
            return;
        }

        const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
        const payload = {
            documentType: 'JOB_WORK_OUT',
            companyId,
            partyId: selectedPartyId,
            partyName: selectedParty?.name || '',
            phone: selectedParty?.phone || '',
            jobId: jobId || undefined,
            invoiceDate: invoiceDate,
            deliveryDate: deliveryDate,
            finishedGood: {
                name: finishedGoodName,
                quantity: finishedGoodQty,
                unit: finishedGoodUnit
            },
            items: rawMaterials.filter(i => i.name).map(i => ({
                name: i.name,
                quantity: Number(i.qty),
                unit: i.unit,
                priceUnit: {
                    amount: Number(i.purchasePrice),
                    taxType: 'withoutTax'
                },
                amount: i.estimatedCost
            })),
            additionalCharges: additionalCosts.filter(c => c.name && c.cost).map(c => ({
                name: c.name,
                amount: Number(c.cost)
            })),
            description: description,
            grandTotal: grandTotal,
            balanceDue: 0 // Usually job work challan doesn't have immediate payment but tracking
        };

        try {
            await createSale(payload); // Using createSale as generic endpoint
            toast({ title: "Job Work Out Challan Created!", className: "bg-green-500 text-white" });
            onCancel();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to save challan", variant: "destructive" });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md min-h-screen p-6 relative" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-xl font-semibold">Job Work Out (Challan)</h1>
                <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-5 w-5" /></Button>
            </div>

            <div className="space-y-8">
                {/* --- Header Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Party */}
                    <div className="flex gap-4">
                        <div className="w-2/3">
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
                                            : "Party Name *"}
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
                        <div className="w-1/3">
                            <Input placeholder="Phone No." value={selectedParty?.phone || ''} readOnly className="bg-gray-50 text-gray-500" />
                        </div>
                    </div>

                    {/* Right: Job Details */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-24">Job ID</label>
                            <Input value={jobId} onChange={e => setJobId(e.target.value)} className="w-48" />
                        </div>
                        <div className="flex items-center justify-end">
                            <label className="text-sm text-gray-500 w-24">Invoice Date</label>
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
                            <label className="text-sm text-gray-500 w-24">Delivery Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-48 justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deliveryDate ? format(deliveryDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* --- Finished Good Section --- */}
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h3 className="font-semibold text-gray-700 mb-3 block">Finished Good</h3>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px] relative">
                            <label className="text-xs text-gray-500 mb-1 block">Finished Good *</label>
                            <Input
                                value={finishedGoodName}
                                onChange={(e) => {
                                    setFinishedGoodName(e.target.value);
                                    setFinishedGoodSearchOpen(true);
                                }}
                                onFocus={() => setFinishedGoodSearchOpen(true)}
                                onClick={(e) => { e.stopPropagation(); setFinishedGoodSearchOpen(true); }}
                                placeholder="Item Name"
                                className="bg-white"
                            />
                            {finishedGoodSearchOpen && (
                                <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg min-w-[540px] max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-5 px-3 py-1.5 text-xs text-blue-500 bg-blue-50 border-b font-medium sticky top-0 cursor-pointer hover:bg-blue-100"
                                        onMouseDown={(e) => { e.preventDefault(); setIsAddItemModalOpen(true); }}>
                                        <div className="flex items-center gap-1"><Plus className="h-3 w-3" />Add Item</div>
                                        <div className="text-right">SALE PRICE</div>
                                        <div className="text-right">PURCHASE PRICE</div>
                                        <div className="text-right">MFG COST</div>
                                        <div className="text-right">STOCK</div>
                                    </div>
                                    {allItems.filter(i => i.name?.toLowerCase().includes(finishedGoodName.toLowerCase())).map(i => (
                                        <div key={i._id}
                                            className="grid grid-cols-5 items-center px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b last:border-0"
                                            onMouseDown={(e) => { e.preventDefault(); handleFinishedGoodSelect(i); }}>
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
                        <div className="w-32">
                            <label className="text-xs text-gray-500 mb-1 block">Quantity *</label>
                            <Input
                                type="number"
                                value={finishedGoodQty}
                                onChange={(e) => setFinishedGoodQty(Number(e.target.value))}
                                className="bg-white"
                            />
                        </div>
                        <div className="w-40">
                            <label className="text-xs text-gray-500 mb-1 block">Units</label>
                            <Select value={finishedGoodUnit} onValueChange={setFinishedGoodUnit}>
                                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>{unitTypes.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* --- Raw Material Table --- */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Raw material <span className="text-gray-400 text-sm font-normal">({finishedGoodQty} {finishedGoodUnit} {finishedGoodName || 'Item'})</span></h3>
                    <div className="overflow-visible border rounded-md relative" ref={tableWrapperRef}>
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead className="w-1/3">RAW MATERIAL</TableHead>
                                    <TableHead>QTY</TableHead>
                                    <TableHead>UNIT</TableHead>
                                    <TableHead>PURCHASE PRICE/UNIT</TableHead>
                                    <TableHead className="text-right">ESTIMATED COST</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rawMaterials.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Item Name"
                                                value={item.name}
                                                onChange={(e) => {
                                                    updateRawMaterial(index, 'name', e.target.value);
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
                                                className="border-none focus-visible:ring-0 px-0 shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => updateRawMaterial(index, 'qty', e.target.value)}
                                                className="w-24 border-gray-200"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select value={item.unit} onValueChange={(v) => updateRawMaterial(index, 'unit', v)}>
                                                <SelectTrigger className="w-24 border-none shadow-none focus:ring-0"><SelectValue /></SelectTrigger>
                                                <SelectContent>{unitTypes.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.purchasePrice}
                                                onChange={(e) => updateRawMaterial(index, 'purchasePrice', e.target.value)}
                                                className="w-32 border-gray-200"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right text-gray-600">
                                            {item.estimatedCost.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => {
                                                if (rawMaterials.length > 1) {
                                                    setRawMaterials(rawMaterials.filter((_, i) => i !== index));
                                                }
                                            }}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Button variant="link" className="text-blue-600 pl-0 hover:no-underline" onClick={addRow}>
                                            <Plus className="h-4 w-4 mr-1" /> Add Row
                                        </Button>
                                    </TableCell>
                                    <TableCell colSpan={3} className="text-right font-bold text-gray-600 text-xs uppercase tracking-wide">
                                        Total:
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        ₹ {totalRawMaterialCost.toFixed(2)}
                                    </TableCell>
                                    <TableCell></TableCell>
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
                                {allItems.filter(i => i.name?.toLowerCase().includes((rawMaterials[activeSearchIndex]?.name || '').toLowerCase())).map(i => (
                                    <div key={i._id}
                                        className="grid grid-cols-5 items-center px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b last:border-0"
                                        onMouseDown={(e) => { e.preventDefault(); handleRawMaterialSelect(activeSearchIndex, i); }}>
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
                </div>

                {/* --- Additional Cost Section --- */}
                <div className="pt-4">
                    {!showAdditionalCosts ? (
                        <div>
                            <Button variant="link" className="text-blue-600 pl-0 hover:no-underline font-semibold" onClick={toggleAdditionalCosts}>
                                <Plus className="h-4 w-4 mr-1" /> Additional Cost
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white border rounded-md overflow-hidden">
                            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
                                <h3 className="font-semibold text-gray-700">Additional Cost</h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowAdditionalCosts(false)}><X className="h-4 w-4" /></Button>
                            </div>
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>CHARGES</TableHead>
                                        <TableHead className="text-right">ESTIMATED COST</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {additionalCosts.map((cost, index) => (
                                        <TableRow key={cost.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={cost.name}
                                                    onValueChange={(val) => updateCostRow(index, 'name', val)}
                                                >
                                                    <SelectTrigger className="w-full border-gray-200">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {chargeTypes.map(type => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Input
                                                    type="number"
                                                    value={cost.cost}
                                                    onChange={(e) => updateCostRow(index, 'cost', e.target.value)}
                                                    className="w-40 ml-auto border-gray-200 text-right"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeCostRow(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <Button variant="link" className="text-blue-600 pl-0 hover:no-underline" onClick={addCostRow}>
                                                <Plus className="h-4 w-4 mr-1" /> Add Row
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            TOTAL: ₹ {totalAdditionalCost.toFixed(2)}
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    )}
                </div>

                {/* --- Description & Attachments --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Description</label>
                        <Textarea
                            placeholder="Write your description here"
                            className="bg-white min-h-[120px] resize-none border-gray-200"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Add Image</label>
                            <div className="border border-dashed border-gray-300 rounded-lg h-[120px] flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer bg-white">
                                <div className="p-2 rounded-full mb-2">
                                    <Camera className="h-6 w-6" />
                                </div>
                                <span className="text-xs">Upload Image</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Add Document</label>
                            <div className="border border-dashed border-gray-300 rounded-lg h-[120px] flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer bg-white">
                                <div className="p-2 rounded-full mb-2">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <span className="text-xs">Upload Document</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8 pb-2 space-x-4">
                <div className="text-right mr-4">
                    <p className="text-sm text-gray-500">Grand Total</p>
                    <p className="text-xl font-bold">₹ {grandTotal.toFixed(2)}</p>
                </div>
                {!isCancelled && <Button className="bg-blue-600 hover:bg-blue-700 px-8" onClick={handleSave}>Save</Button>}
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
        </div >
    );
}
