"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, ChevronRight, FileText, Plus, ChevronDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import { ChangeQuantityModal } from '../component/pos/ChangeQuantityModal';
import { ItemDiscountModal } from '../component/pos/ItemDiscountModal';
import { InfoModal } from '../component/pos/InfoModal';
import { RemarksModal } from '../component/pos/RemarksModal';
import { FullBreakupModal } from '../component/pos/FullBreakupModal';
import { MultiPayModal } from '../component/pos/MultiPayModal';

import { fetchItems, fetchParties, fetchCompanies, createSale } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface ActionButtonProps {
    children: React.ReactNode;
    shortcut: string;
    onClick?: () => void;
}

const ActionButton = ({ children, shortcut, onClick }: ActionButtonProps) => (
    <Button
        variant="outline"
        className="flex-col h-auto bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
        onClick={onClick}
    >
        <span>{children}</span>
        <span className="text-xs text-gray-500">{shortcut}</span>
    </Button>
);

export default function BillingPage() {
    // API Data
    const [allItems, setAllItems] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);

    // UI State
    const [itemSearch, setItemSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedCartItemIndex, setSelectedCartItemIndex] = useState<number>(-1);

    // Customer Search State
    const [customerOpen, setCustomerOpen] = useState(false);
    const [customerSearch, setCustomerSearch] = useState("");

    const [modalState, setModalState] = useState({
        changeQuantity: false,
        itemDiscount: false,
        remarks: false,
        fullBreakup: false,
        multiPay: false,
        info: { isOpen: false, title: '', message: '', note: '' }
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [itemsData, partiesData, companiesData] = await Promise.all([
                    fetchItems(),
                    fetchParties(customerSearch),
                    fetchCompanies()
                ]);
                const flattenedItems = itemsData.map((item: any) => {
                    const details = item.product || item.service || {};
                    return {
                        ...details,
                        ...item,
                        unit: details.unit || item.unit,
                        salePrice: details.salePrice || item.salePrice,
                        purchasePrice: details.purchasePrice || item.purchasePrice,
                        taxRate: details.taxRate || item.taxRate,
                        itemCode: details.itemCode || item.itemCode,
                        product: item.product,
                        service: item.service
                    };
                });
                setAllItems(flattenedItems);
                setCustomers(partiesData);
                setCompanies(companiesData);
            } catch (err) {
                console.error("Error loading data", err);
            }
        };
        const timer = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timer);
    }, [customerSearch]);

    // Filter items for search
    const filteredItems = useMemo(() => {
        if (!itemSearch) return [];
        return allItems.filter(i =>
            i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
            (i.itemCode && i.itemCode.includes(itemSearch))
        );
    }, [allItems, itemSearch]);

    const addToCart = (item: any) => {
        const newItem = {
            id: item._id, // Store original ID
            code: item.itemCode || '-',
            name: item.name,
            qty: 1,
            unit: item.unit || 'NONE',
            price: item.salePrice?.amount || item.salePrice || 0,
            discount: 0,
            tax: item.taxRate || 0,
            taxAmount: 0 // Simplification
        };
        setCartItems(prev => [...prev, newItem]);
        setItemSearch(''); // Clear search
        setSelectedCartItemIndex(cartItems.length); // Select new item
    };

    const handleRemoveItem = () => {
        if (selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
            const newCart = [...cartItems];
            newCart.splice(selectedCartItemIndex, 1);
            setCartItems(newCart);
            setSelectedCartItemIndex(-1);
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.qty * item.price) - item.discount, 0); // Simplified

    const handleSave = async () => {
        if (cartItems.length === 0) {
            toast({ title: "Cart is empty", variant: "destructive" });
            return;
        }
        if (!companies.length) {
            toast({ title: "Please create a company first", variant: "destructive" });
            return;
        }

        const saleData = {
            companyId: companies[0]._id, // Use first company
            partyId: selectedCustomer || undefined,
            partyName: selectedCustomer ? customers.find(c => c._id === selectedCustomer)?.name : "Cash Sale",
            documentType: 'INVOICE',
            isInvoice: true,
            invoiceDate: new Date(),
            items: cartItems.map(item => ({
                itemId: item.id,
                name: item.name,
                quantity: item.qty,
                unit: item.unit,
                priceUnit: { amount: item.price, taxType: 'withoutTax' },
                discount: { amount: item.discount },
                amount: (item.qty * item.price) - item.discount
            })),
            grandTotal: cartTotal,
            subTotal: cartTotal, // Simplify
            paymentType: 'Cash',
            receivedAmount: cartTotal, // Assume full payment for POS
            balanceDue: 0
        };

        try {
            await createSale(saleData);
            toast({ title: "Invoice Saved Successfully!", className: "bg-green-500 text-white" });
            setCartItems([]);
            setSelectedCustomer('');
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to save invoice", variant: "destructive" });
        }
    };


    const openModal = (modalName: string, data?: any) => {
        if (modalName === 'info') setModalState(prev => ({ ...prev, info: { ...data, isOpen: true } }));
        else setModalState(prev => ({ ...prev, [modalName]: true }));
    };
    const closeModal = (modalName: string) => {
        if (modalName === 'info') setModalState(prev => ({ ...prev, info: { isOpen: false, title: '', message: '', note: '' } }));
        else setModalState(prev => ({ ...prev, [modalName]: false }));
    };

    const selectedItemData = selectedCartItemIndex >= 0 ? cartItems[selectedCartItemIndex] : null;

    return (
        <>
            <div className="h-screen w-full bg-slate-100 flex flex-col text-sm">

                <div className="flex-grow flex p-2 gap-2 overflow-hidden">
                    <div className="flex-grow flex flex-col bg-white rounded-md border">
                        <div className="p-2 border-b">
                            <div className="relative">
                                <Input
                                    placeholder="Scan or search by item code, model no or item name"
                                    className="pl-4 pr-10"
                                    value={itemSearch}
                                    onChange={(e) => setItemSearch(e.target.value)}
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                {filteredItems.length > 0 && (
                                    <div className="absolute top-10 w-full bg-white border z-50 max-h-60 overflow-auto shadow-lg">
                                        {filteredItems.map(item => (
                                            <div
                                                key={item._id}
                                                className="p-2 hover:bg-slate-100 cursor-pointer border-b"
                                                onClick={() => addToCart(item)}
                                            >
                                                {item.name} <span className="text-gray-400 text-xs">({item.itemCode})</span> - ₹{item.salePrice?.amount}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-grow overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-slate-100 z-10">
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>ITEM CODE</TableHead>
                                        <TableHead>ITEM NAME</TableHead>
                                        <TableHead>QTY</TableHead>
                                        <TableHead>UNIT</TableHead>
                                        <TableHead>PRICE/UNIT(₹)</TableHead>
                                        <TableHead>DISCOUNT(₹)</TableHead>
                                        <TableHead>TAX(%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            className={`cursor-pointer ${selectedCartItemIndex === index ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                                            onClick={() => setSelectedCartItemIndex(index)}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.code}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.qty.toFixed(2)}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell>{item.price.toFixed(2)}</TableCell>
                                            <TableCell>{item.discount.toFixed(2)}</TableCell>
                                            <TableCell>{item.tax}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="grid grid-cols-4 gap-2 p-2 border-t bg-slate-50">
                            <ActionButton shortcut="[F2]" onClick={() => selectedItemData && openModal('changeQuantity')}>Change Quantity</ActionButton>
                            <ActionButton shortcut="[F3]" onClick={() => selectedItemData && openModal('itemDiscount')}>Item Discount</ActionButton>
                            <ActionButton shortcut="[F4]" onClick={handleRemoveItem}>Remove Item</ActionButton>
                            <ActionButton shortcut="[F6]" onClick={() => openModal('info', { title: 'No Unit Added', message: 'The selected item does not have any defined unit(s).' })}>Change Unit</ActionButton>
                            <ActionButton shortcut="[F8]" onClick={() => openModal('info', { title: 'Additional Charges Disabled', message: 'Additional charges are not setup' })}>Additional Charges</ActionButton>
                            <ActionButton shortcut="[F9]" onClick={() => openModal('info', { title: 'Bill Discount Disabled', message: 'Bill discount is not enabled' })}>Bill Discount</ActionButton>
                            <ActionButton shortcut="[F10]" onClick={() => openModal('info', { title: 'Loyalty Points', message: 'Please enable loyalty points' })}>Loyalty Points</ActionButton>
                            <ActionButton shortcut="[F12]" onClick={() => openModal('remarks')}>Remarks</ActionButton>
                        </div>
                    </div>

                    <div className="w-80 flex-shrink-0 bg-white rounded-md border flex flex-col">
                        <div className="p-3 space-y-3 border-b">
                            <div><label className="text-xs">Invoice Date: <strong>{new Date().toLocaleDateString()}</strong></label></div>
                            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={customerOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedCustomer
                                            ? customers.find((c) => c._id === selectedCustomer)?.name
                                            : "Search for a customer [F11]"}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Search customer..."
                                            value={customerSearch}
                                            onValueChange={(val) => {
                                                setCustomerSearch(val);
                                            }}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No customer found.</CommandEmpty>
                                            <CommandGroup>
                                                {customers.map((c) => (
                                                    <CommandItem
                                                        key={c._id}
                                                        value={c.name}
                                                        onSelect={() => {
                                                            setSelectedCustomer(c._id);
                                                            setCustomerOpen(false);
                                                        }}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span>{c.name}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {c.phone && `(${c.phone})`}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="p-3 my-2 bg-blue-50 border-y">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <FileText size={24} className="text-blue-600" />
                                    <div>
                                        <p className="font-bold">Total ₹ {cartTotal.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Items: {cartItems.length}, Qty: {cartItems.reduce((a, b) => a + b.qty, 0)}</p>
                                    </div>
                                </div>
                                <Button variant="link" className="p-0 h-auto text-blue-600 text-right leading-tight" onClick={() => openModal('fullBreakup')}>Full Breakup<br />[Ctrl+F]<ChevronRight className="inline-block" /></Button>
                            </div>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-3 border-b">
                            <div><label className="font-medium">Payment Mode</label><Select defaultValue="Cash"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem></SelectContent></Select></div>
                            <div><label className="font-medium">Amount Received</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span><Input className="pl-7" value={cartTotal.toFixed(2)} disabled /></div></div>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="p-3 text-right border-t">
                            <p className="text-gray-500">Change to Return:</p>
                            <p className="font-bold text-lg">₹ 0.00</p>
                        </div>
                        <div className="p-2 grid gap-2 border-t bg-slate-50">
                            <Button className="w-full h-12 bg-green-200 text-green-800 hover:bg-green-300 font-bold" onClick={handleSave}>Save & Print Bill [Ctrl+P]</Button>
                            <Button variant="outline" className="w-full" onClick={() => openModal('multiPay')}>Other/Credit Payments [Ctrl+M]</Button>
                        </div>
                    </div>
                </div>
            </div>

            <ChangeQuantityModal
                isOpen={modalState.changeQuantity}
                onClose={() => closeModal('changeQuantity')}
                item={selectedItemData}
                onSave={(newQty) => {
                    if (selectedCartItemIndex >= 0) {
                        const newCart = [...cartItems];
                        newCart[selectedCartItemIndex] = { ...newCart[selectedCartItemIndex], qty: newQty };
                        setCartItems(newCart);
                    }
                }}
            />
            <ItemDiscountModal
                isOpen={modalState.itemDiscount}
                onClose={() => closeModal('itemDiscount')}
                item={selectedItemData}
            />
            <RemarksModal isOpen={modalState.remarks} onClose={() => closeModal('remarks')} />
            <FullBreakupModal isOpen={modalState.fullBreakup} onClose={() => closeModal('fullBreakup')} />
            <MultiPayModal isOpen={modalState.multiPay} onClose={() => closeModal('multiPay')} />
            <InfoModal isOpen={modalState.info.isOpen} onClose={() => closeModal('info')} title={modalState.info.title} message={modalState.info.message} note={modalState.info.note} />
        </>
    );
}