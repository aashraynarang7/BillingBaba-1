"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Plus,
    FileText,
    Share2,
    Printer,
    Save,
    FileUp,
    ImageUp,
    Clock,
    Trash2,
    MoreVertical
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
import { fetchParties, fetchCompanies, createSaleOrder, fetchItems, updateSale, deleteSale } from '@/lib/api';
// For now assuming createSaleOrder sends payload to /api/sales, which my controller handles based on docType.

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];
const unitTypes = ["NONE", "BOTTLES", "BAGS", "BOXES", "CANS", "CARTONS", "KG", "LTR", "MTR", "PCS"];
import { InvoicePreview } from '../component/InvoicePreview';

import AddItemModal from '../../items/component/AddItemModal';
import { EditPartyModal } from '@/components/dashboard/party/EditPartyModal';
import { Switch } from '@/components/ui/switch'; // Assuming we have or use simple toggle

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

// Pure utility — resolve a saved DB item's tax field back to a dropdown string.
// Handles old invoices where tax.rate was 0 by inferring from stored amount.
function resolveTaxString(i: any): string {
    const savedRate = i.tax?.rate ?? 0;
    if (savedRate > 0) return `GST@${savedRate}%`;
    const base = (Number(i.priceUnit?.amount) || 0) * (Number(i.quantity) || 1);
    const discountAmt = base * ((Number(i.discount?.percent) || 0) / 100);
    const afterDisc = base - discountAmt;
    const storedAmt = Number(i.amount) || 0;
    if (afterDisc > 0 && storedAmt > afterDisc) {
        const impliedRate = Math.round(((storedAmt / afterDisc) - 1) * 100);
        const validRates = [0.25, 3, 5, 12, 18, 28];
        const matched = validRates.find(r => Math.abs(r - impliedRate) <= 1);
        if (matched) return `GST@${matched}%`;
        if (impliedRate > 0 && impliedRate <= 100) return `GST@${impliedRate}%`;
    }
    return 'NONE';
}

export default function CreateSaleInvoicePage({ onCancel, initialData }: { onCancel: () => void, initialData?: any }) {
    const isCancelled = initialData?.status === 'Cancelled';
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(
        initialData?.invoiceDate ? new Date(initialData.invoiceDate) : new Date()
    );
    const [invoiceTime, setInvoiceTime] = useState(format(new Date(), 'hh:mm a'));
    const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate ? new Date(initialData.dueDate) : undefined);

    // Data from API
    const [parties, setParties] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);

    // Form State (Initialize with initialData if present)
    const [paymentType, setPaymentType] = useState<'Cash' | 'Credit'>(initialData?.paymentType || 'Cash');
    const [paymentMode, setPaymentMode] = useState(initialData?.paymentMode || 'Cash');
    const [selectedPartyId, setSelectedPartyId] = useState<string>(initialData?.partyId?._id || initialData?.partyId || '');
    const [selectedPhone, setSelectedPhone] = useState(initialData?.phone || '');
    const totalAmountFromInitial = (data: any) => {
        if (!data) return 0;
        return Number(data.grandTotal) || 0;
    };

    const [billingAddress, setBillingAddress] = useState(initialData?.billingAddress || initialData?.partyId?.billingAddress || '');
    const [shippingAddress, setShippingAddress] = useState(initialData?.shippingAddress || '');
    const [eWayBillNo, setEWayBillNo] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || '');
    const [stateOfSupply, setStateOfSupply] = useState(initialData?.stateOfSupply || 'Madhya Pradesh');

    const [items, setItems] = useState<Item[]>(
        initialData?.items?.map((i: any, idx: number) => ({
            id: idx + 1,
            name: i.name,
            itemId: i.itemId,
            qty: i.quantity,
            unit: i.unit,
            price: i.priceUnit?.amount || 0,
            discountPercent: i.discount?.percent || 0,
            tax: resolveTaxString(i)
        })) ||
        [{ id: 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]
    );
    const [roundOff, setRoundOff] = useState(initialData?.roundOff || 0);
    const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(!!initialData?.roundOff);
    // If initialData exists, pre-fill receivedAmount. For edit/view modes.
    const [receivedAmount, setReceivedAmount] = useState(initialData ? (totalAmountFromInitial(initialData) - Number(initialData.balanceDue || 0)) : 0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [savedData, setSavedData] = useState<any>(null);

    // New Feature State
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const documentInputRef = React.useRef<HTMLInputElement>(null);

    // ... (rest of state items are unchanged)

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
                    unit: details.unit || item.unit,
                    salePrice: details.salePrice || item.salePrice,
                    purchasePrice: details.purchasePrice || item.purchasePrice,
                    taxRate: details.taxRate || item.taxRate,
                    product: item.product,
                    service: item.service
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

                // Flatten Items logic ...
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

                // Invoice number is auto-assigned sequentially by the backend
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        const timer = setTimeout(() => { loadData(); }, 300);
        return () => clearTimeout(timer);
    }, [partySearch]);

    // ... (rest of helper functions)

    const handlePartyChange = (partyId: string) => {
        setSelectedPartyId(partyId);
        const party = parties.find(p => p._id === partyId);
        if (party) {
            setSelectedPhone(party.phone || '');
            if (party.billingAddress) setBillingAddress(party.billingAddress);
        }
    };

    const addRow = () => {
        setItems([...items, { id: items.length + 1, name: '', qty: 0, unit: 'NONE', price: 0, discountPercent: 0, tax: 'NONE' }]);
    };
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
        const taxRate = (item.tax === 'NONE' || item.tax === 'EXEMPT' || !item.tax) ? 0 : (parseFloat(item.tax.replace(/[^0-9.]/g, '')) || 0);
        const amountAfterDisc = base - discountAmount;
        const taxAmount = amountAfterDisc * (taxRate / 100);
        return amountAfterDisc + taxAmount;
    };

    const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    const subTotal = items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
    const effectiveRoundOff = isRoundOffEnabled ? roundOff : 0;
    const totalAmount = subTotal + Number(effectiveRoundOff);

    // Sync receivedAmount in Add Mode
    useEffect(() => {
        if (!initialData) {
            setReceivedAmount(paymentType === 'Cash' ? totalAmount : 0);
        }
    }, [totalAmount, paymentType, initialData]);

    // Challan Picker State
    const [isChallanPickerOpen, setIsChallanPickerOpen] = useState(false);
    const [availableChallans, setAvailableChallans] = useState<any[]>([]);

    const handleOpenChallanPicker = async () => {
        try {
            const { fetchSales } = await import('@/lib/api');
            const data = await fetchSales({ type: 'DELIVERY_CHALLAN' });
            // Filter only Open/Unconverted challans if possible, but backend might not filter status yet.
            setAvailableChallans(data.filter((c: any) => c.status !== 'CONVERTED'));
            setIsChallanPickerOpen(true);
        } catch (error) {
            console.error("Failed to fetch challans", error);
        }
    };

    const handleSelectChallan = (challan: any) => {
        // Map Challan to Invoice Form
        setSelectedPartyId(challan.partyId?._id || challan.partyId);

        // Items
        setItems(challan.items.map((i: any, idx: number) => ({
            id: idx + 1,
            name: i.name,
            qty: i.quantity,
            unit: i.unit,
            price: i.priceUnit?.amount || 0,
            discountPercent: i.discount?.percent || 0,
            tax: resolveTaxString(i)
        })));

        setInvoiceNumber(`INV-FROM-${challan.challanNumber}`);
        // Store reference
        initialData = {
            ...initialData,
            convertedFromChallanId: challan._id,
            challanNumber: challan.challanNumber
        };
        // Note: initialData prop is readonly, so we might need a state to track conversion source if we want to save it properly.
        // Better way: Add a state `conversionSource`
        setConversionSource({ type: 'DELIVERY_CHALLAN', id: challan._id });

        setIsChallanPickerOpen(false);
    };

    const [conversionSource, setConversionSource] = useState<{ type: string, id: string } | null>(
        initialData?.convertedFromChallanId ? { type: 'DELIVERY_CHALLAN', id: initialData.convertedFromChallanId } : null
    );

    const getFormattedData = () => {
        const mappedItems = items.map(i => {
            const taxRate = (i.tax === 'NONE' || i.tax === 'EXEMPT' || !i.tax) ? 0 : (parseFloat(i.tax.replace(/[^0-9.]/g, '')) || 0);
            const base = (Number(i.qty) || 0) * (Number(i.price) || 0);
            const discountAmount = base * ((Number(i.discountPercent) || 0) / 100);
            const amountAfterDisc = base - discountAmount;
            const taxAmount = amountAfterDisc * (taxRate / 100);
            return {
                name: i.name,
                quantity: Number(i.qty),
                unit: i.unit,
                priceUnit: { amount: Number(i.price) },
                discount: { percent: Number(i.discountPercent), amount: discountAmount },
                tax: { rate: taxRate, amount: taxAmount },
                amount: amountAfterDisc + taxAmount
            };
        });
        const previewSubTotal = mappedItems.reduce((s, i) => s + i.priceUnit.amount * i.quantity - (i.discount.amount || 0), 0);
        const previewTotalTax = mappedItems.reduce((s, i) => s + (i.tax.amount || 0), 0);

        return {
            _id: initialData?._id,
            invoiceNumber: invoiceNumber || initialData?.invoiceNumber || '',
            invoiceDate,
            dueDate,
            stateOfSupply,
            partyId: selectedPartyId ? parties.find(p => p._id === selectedPartyId) : { name: "Cash Sale" },
            partyName: selectedPartyId ? (parties.find(p => p._id === selectedPartyId)?.name || '') : 'Cash Sale',
            billingAddress,
            shippingAddress,
            items: mappedItems,
            subTotal: previewSubTotal,
            totalTax: previewTotalTax,
            totalDiscount: mappedItems.reduce((s, i) => s + (i.discount.amount || 0), 0),
            grandTotal: totalAmount,
            roundOff: effectiveRoundOff,
            receivedAmount,
            balanceDue: totalAmount - receivedAmount,
            companyId: companies[0],
            description,
            paymentType,
        };
    };

    const handlePreview = () => {
        setSavedData(getFormattedData());
        setIsPreviewOpen(true);
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleDelete = async () => {
        if (!initialData?._id) return;
        try {
            await deleteSale(initialData._id);
            toast({ title: "Invoice deleted successfully" });
            onCancel();
        } catch (error) {
            console.error("Error deleting invoice", error);
            toast({ title: "Failed to delete invoice", variant: "destructive" });
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        if (companies[0]?._id) {
            formData.append('companyId', companies[0]._id);
        } else if (initialData?.companyId) {
            formData.append('companyId', typeof initialData.companyId === 'string' ? initialData.companyId : initialData.companyId._id);
        }
        if (selectedPartyId) formData.append('partyId', selectedPartyId);
        formData.append('partyName', selectedPartyId ? parties.find(p => p._id === selectedPartyId)?.name : "Cash Sale");
        formData.append('phone', selectedPhone);
        formData.append('documentType', 'INVOICE');
        formData.append('invoiceNumber', invoiceNumber);
        if (invoiceDate) formData.append('invoiceDate', invoiceDate.toISOString());
        if (dueDate) formData.append('dueDate', dueDate.toISOString());
        formData.append('invoiceTime', invoiceTime);
        formData.append('billingAddress', billingAddress);
        formData.append('shippingAddress', shippingAddress);
        formData.append('eWayBillNo', eWayBillNo);
        formData.append('stateOfSupply', stateOfSupply);
        formData.append('paymentType', paymentType);
        formData.append('paymentMode', paymentMode);

        if (initialData?.convertedFromProformaId) formData.append('convertedFromProformaId', initialData.convertedFromProformaId);
        if (initialData?.convertedFromEstimateId) formData.append('convertedFromEstimateId', initialData.convertedFromEstimateId);

        const challanId = conversionSource?.type === 'DELIVERY_CHALLAN' ? conversionSource.id : initialData?.convertedFromChallanId;
        if (challanId) formData.append('convertedFromChallanId', challanId);

        if (initialData?.orderNumber) formData.append('orderId', initialData._id);
        if (challanId) formData.append('challanId', challanId);

        const itemsPayload = items.filter(i => i.name).map(item => {
            const taxRate = (item.tax === 'NONE' || item.tax === 'EXEMPT' || !item.tax)
                ? 0 : (parseFloat(item.tax.replace(/[^0-9.]/g, '')) || 0);
            const base = (Number(item.qty) || 0) * (Number(item.price) || 0);
            const discountAmount = base * ((Number(item.discountPercent) || 0) / 100);
            const afterDiscount = base - discountAmount;
            const taxAmount = afterDiscount * (taxRate / 100);
            return {
                itemId: item.itemId,
                name: item.name,
                quantity: Number(item.qty),
                unit: item.unit,
                priceUnit: { amount: Number(item.price) },
                discount: { percent: Number(item.discountPercent), amount: discountAmount },
                tax: { rate: taxRate, amount: taxAmount },
                amount: afterDiscount + taxAmount
            };
        });
        formData.append('items', JSON.stringify(itemsPayload));

        // Compute and send subTotal (pre-tax) and totalTax
        const computedSubTotal = itemsPayload.reduce((s, i) => {
            const base = i.priceUnit.amount * i.quantity;
            return s + base - (i.discount.amount || 0);
        }, 0);
        const computedTotalTax = itemsPayload.reduce((s, i) => s + (i.tax.amount || 0), 0);
        const computedTotalDiscount = itemsPayload.reduce((s, i) => s + (i.discount.amount || 0), 0);

        formData.append('subTotal', computedSubTotal.toString());
        formData.append('totalTax', computedTotalTax.toString());
        formData.append('totalDiscount', computedTotalDiscount.toString());
        formData.append('grandTotal', totalAmount.toString());
        formData.append('roundOff', effectiveRoundOff.toString());
        formData.append('receivedAmount', receivedAmount.toString());
        formData.append('balanceDue', (totalAmount - receivedAmount).toString());
        formData.append('description', description);

        // Append Files
        images.forEach((file) => formData.append('images', file));
        documents.forEach((file) => formData.append('documents', file));


        try {
            if (initialData && initialData._id && initialData.invoiceNumber) {
                await updateSale(initialData._id, formData);
                onCancel();
            } else {
                const response = await createSaleOrder(formData); // createSaleOrder alias for createSale
                setSavedData(response);
                setIsPreviewOpen(true);
            }
        } catch (error) {
            console.error("Error saving invoice", error);
            toast({ title: "Failed to save Invoice", variant: "destructive" });
        }
    };

    return (
        <>
            <div className="bg-slate-50 min-h-screen p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto space-y-6" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Sale {!!initialData && `(${paymentType})`}</h2>
                            {!initialData && (
                                <div className="flex bg-gray-100 p-1 rounded-full">
                                    <button
                                        className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${paymentType === 'Credit' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                        onClick={() => setPaymentType('Credit')}
                                    >
                                        Credit
                                    </button>
                                    <button
                                        className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${paymentType === 'Cash' ? 'bg-blue-600 shadow text-white' : 'text-gray-500'}`}
                                        onClick={() => setPaymentType('Cash')}
                                    >
                                        Cash
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleOpenChallanPicker} className="text-blue-600 border-blue-200 bg-blue-50">
                                <FileUp className="h-4 w-4 mr-2" /> Import Challan
                            </Button>
                            <span className="text-sm text-gray-500">Godown: Main Location</span>
                        </div>
                    </div>

                    {/* Challan Picker Modal (Simple Overlay) */}
                    {
                        isChallanPickerOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[80vh] flex flex-col" style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}>
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h3 className="font-bold text-lg">Select Delivery Challan</h3>
                                        <Button variant="ghost" size="sm" onClick={() => setIsChallanPickerOpen(false)}>X</Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2">
                                        {availableChallans.length === 0 ? (
                                            <div className="text-center p-8 text-gray-500">No Open Challans found.</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {availableChallans.map((c) => (
                                                    <div
                                                        key={c._id}
                                                        className="p-3 border rounded hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                                                        onClick={() => handleSelectChallan(c)}
                                                    >
                                                        <div>
                                                            <div className="font-bold">{c.challanNumber}</div>
                                                            <div className="text-sm text-gray-600">{c.partyName || c.partyId?.name}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold">₹ {c.grandTotal}</div>
                                                            <div className="text-xs text-gray-500">{format(new Date(c.challanDate || new Date()), "dd/MM/yyyy")}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Form Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <Popover open={partyOpen} onOpenChange={setPartyOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                                        {selectedPartyId ? parties.find(p => p._id === selectedPartyId)?.name : <span className="text-gray-400">Billing Name (Optional)</span>}
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

                            <Input placeholder="Billing Address" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} className="h-20 align-top" />
                        </div>

                        {/* Middle Column */}
                        <div className="space-y-4">
                            <Input placeholder="Phone No." value={selectedPhone} onChange={e => setSelectedPhone(e.target.value)} />
                            <Input placeholder="Shipping Address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} className="h-20" />
                        </div>

                        {/* Right Column (Meta) */}
                        <div className="space-y-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <label className="text-xs text-gray-500">Invoice Number</label>
                                <Input className="w-40 text-right" placeholder="Auto" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <label className="text-xs text-gray-500">Invoice Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-40 justify-start h-9 text-left font-normal">
                                            <CalendarIcon className="mr-2 h-3 w-3" /> {invoiceDate ? format(invoiceDate, "dd/MM/yyyy") : "Select"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0"><Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} /></PopoverContent>
                                </Popover>
                            </div>
                            {paymentType === 'Credit' && (
                                <div className="flex items-center justify-end gap-2">
                                    <label className="text-xs text-gray-500">Due Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-40 justify-start h-9 text-left font-normal text-red-600 border-red-200">
                                                <CalendarIcon className="mr-2 h-3 w-3" /> {dueDate ? format(dueDate, "dd/MM/yyyy") : "Select Date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} /></PopoverContent>
                                    </Popover>
                                </div>
                            )}
                            <div className="flex items-center justify-end gap-2">
                                <label className="text-xs text-gray-500">Time</label>
                                <div className="flex items-center border rounded-md px-2 w-40 h-9 bg-white">
                                    <Clock className="h-3 w-3 text-gray-400 mr-2" />
                                    <span className="text-sm">{invoiceTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <label className="text-xs text-gray-500">State of supply</label>
                                <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                                    <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <label className="text-xs text-gray-500">E-Way Bill No.</label>
                                <Input className="w-40 text-right h-9" value={eWayBillNo} onChange={e => setEWayBillNo(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Items Table - Simplified */}
                    <div className="border rounded-lg relative overflow-visible" ref={tableWrapperRef}>
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-10">#</TableHead>
                                    <TableHead>ITEM</TableHead>
                                    <TableHead>QTY</TableHead>
                                    <TableHead>UNIT</TableHead>
                                    <TableHead>PRICE/UNIT</TableHead>
                                    <TableHead>DISC %</TableHead>
                                    <TableHead>TAX</TableHead>
                                    <TableHead className="text-right">AMOUNT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-400 w-4">{index + 1}</span>
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
                                                className="w-full border-none focus-visible:ring-0 p-0 h-auto"
                                                placeholder="Item Name"
                                            />
                                        </TableCell>
                                        <TableCell><Input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} className="w-16 h-8" /></TableCell>
                                        <TableCell>
                                            <Select value={item.unit} onValueChange={v => updateItem(item.id, 'unit', v)}>
                                                <SelectTrigger className="h-8 border-none"><SelectValue /></SelectTrigger>
                                                <SelectContent>{unitTypes.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell><Input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} className="w-20 h-8" /></TableCell>
                                        <TableCell><Input type="number" value={item.discountPercent} onChange={e => updateItem(item.id, 'discountPercent', e.target.value)} className="w-12 h-8" /></TableCell>
                                        <TableCell>
                                            <Select value={item.tax} onValueChange={v => updateItem(item.id, 'tax', v)}>
                                                <SelectTrigger className="h-8 w-24 border-none"><SelectValue placeholder="Tax" /></SelectTrigger>
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
                        <div className="p-2 bg-gray-50 border-t">
                            <Button variant="ghost" size="sm" onClick={addRow} className="text-blue-600">+ ADD ROW</Button>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="w-full md:w-1/2 space-y-4">
                            {!initialData && (
                                <>
                                    <div className="flex items-center gap-4">
                                        <Select value={paymentMode} onValueChange={(v: any) => setPaymentMode(v)}>
                                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Cheque">Cheque</SelectItem>
                                                <SelectItem value="Bank">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {paymentType === 'Cash' && (
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                value={receivedAmount}
                                                onChange={e => setReceivedAmount(Number(e.target.value))}
                                                className="w-32"
                                            />
                                        )}
                                    </div>
                                    <Button variant="link" className="text-blue-600 pl-0">+ Add Payment type</Button>
                                </>
                            )}
                            {!!initialData && (
                                <div className="flex items-center gap-3 mt-2">
                                    <label className="text-sm text-gray-600 whitespace-nowrap">Received ₹</label>
                                    <Input
                                        type="number"
                                        value={receivedAmount}
                                        onChange={e => setReceivedAmount(Number(e.target.value))}
                                        className="w-32 h-8 text-right"
                                    />
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Balance: ₹{(totalAmount - receivedAmount).toFixed(2)}</span>
                                </div>
                            )}

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
                                <div onClick={() => setShowDescription(true)} className="cursor-pointer text-gray-500 text-sm hover:text-gray-700">
                                    + Add Description
                                </div>
                            )}

                            {/* File Uploads in Footer Left Column */}
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

                        <div className="w-full md:w-1/3 space-y-2 text-sm text-right">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Tax</span>
                                <span>0.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={isRoundOffEnabled} onCheckedChange={c => setIsRoundOffEnabled(!!c)} />
                                    <span className="text-gray-500">Round Off</span>
                                </div>
                                <Input type="number" value={roundOff} onChange={e => setRoundOff(Number(e.target.value))} disabled={!isRoundOffEnabled} className="w-20 h-8 text-right" />
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Loyalty Point Used</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-400">●</span> <Input className="w-16 h-8 text-right bg-white" placeholder="0" /> = ₹ 0
                                </div>
                            </div>

                            {paymentType === 'Credit' && !initialData ? (
                                <>
                                    <div className="flex justify-between items-center font-semibold text-gray-700 pt-2">
                                        <span>Remaining Amount</span>
                                        <span>₹ {totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox checked={receivedAmount > 0} onCheckedChange={(c) => { if (!c) setReceivedAmount(0); }} />
                                            <span className="text-gray-700 font-medium text-sm">Received</span>
                                        </div>
                                        <Input type="number" placeholder="0" value={receivedAmount || ''} onChange={e => setReceivedAmount(Number(e.target.value))} className="w-24 h-8 text-right bg-white focus-visible:ring-1" />
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-gray-800">
                                        <span>Balance</span>
                                        <span>{(totalAmount - receivedAmount).toFixed(2)}</span>
                                    </div>
                                    {selectedPartyId && parties.find(p => p._id === selectedPartyId) && (
                                        <div className="flex justify-between items-center font-bold text-gray-800 pt-2 border-t mt-2">
                                            <span className="text-gray-600">Party Credit Balance</span>
                                            <span>
                                                ₹ {Math.abs(parties.find(p => p._id === selectedPartyId)?.currentBalance || 0).toFixed(2)}
                                                <span className={(parties.find(p => p._id === selectedPartyId)?.currentBalance || 0) < 0 ? 'text-red-500 ml-1 font-medium text-xs' : 'text-green-500 ml-1 font-medium text-xs'}>
                                                    {(parties.find(p => p._id === selectedPartyId)?.currentBalance || 0) < 0 ? '(To Pay)' : '(To Receive)'}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-gray-400 text-xs pt-1">
                                        <span>Point Awarded</span>
                                        <div className="flex items-center gap-1"><span className="text-orange-400">●</span> 0</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center font-semibold text-gray-700 pt-2">
                                        <span>{paymentType === 'Cash' ? 'Received' : 'Balance Due'}</span>
                                        <span>{paymentType === 'Cash' ? `₹ ${receivedAmount.toFixed(2)}` : `₹ ${totalAmount.toFixed(2)}`}</span>
                                    </div>
                                    {paymentType === 'Credit' && selectedPartyId && parties.find(p => p._id === selectedPartyId) && (
                                        <div className="flex justify-between items-center font-bold text-gray-800 pt-2 border-t mt-2">
                                            <span className="text-gray-600">Party Credit Balance</span>
                                            <span>
                                                ₹ {Math.abs(parties.find(p => p._id === selectedPartyId)?.currentBalance || 0).toFixed(2)}
                                                <span className={(parties.find(p => p._id === selectedPartyId)?.currentBalance || 0) < 0 ? 'text-red-500 ml-1 font-medium text-xs' : 'text-green-500 ml-1 font-medium text-xs'}>
                                                    {(parties.find(p => p._id === selectedPartyId)?.currentBalance || 0) < 0 ? '(To Pay)' : '(To Receive)'}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between border-t pt-4" style={{ pointerEvents: 'auto' }}>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handlePreview}><Printer className="h-4 w-4 mr-2" /> Print / Preview</Button>
                            {initialData?._id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                            onClick={() => setShowDeleteConfirm(true)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Invoice
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onCancel}>Cancel</Button>
                            {!isCancelled && <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Save</Button>}
                        </div>
                    </div>

                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-80 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Delete Invoice?</p>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* <div className='fixed inset-0 z-[1000] flex items-center justify-center'>
                <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} onSuccess={() => { }} />            <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} onSuccess={() => { }} />
            </div> */}
            {savedData && (
                <InvoicePreview
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                        onCancel();
                    }}
                    data={savedData}
                    type="INVOICE"
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
        </>
    );
}
