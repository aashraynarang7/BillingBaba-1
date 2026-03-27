"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
    Search,
    X,
    Settings,
    CalendarDays,
    ChevronDown,
    Receipt,
    Minus,
    Plus,
    Trash2,
    Loader2,
} from "lucide-react";
import { fetchItems, fetchParties, createSale } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface CartItem {
    itemId: string;
    name: string;
    itemCode?: string;
    hsn?: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    taxType: "withTax" | "withoutTax";
    discountPercent: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

interface PartyOption {
    _id: string;
    name: string;
    phone?: string;
}

const calculateLineItem = (
    pricePerUnit: number,
    quantity: number,
    taxRate: number,
    taxType: "withTax" | "withoutTax",
    discountPercent: number
): { discountAmount: number; taxAmount: number; total: number } => {
    let basePrice = pricePerUnit;
    if (taxType === "withTax") {
        basePrice = pricePerUnit / (1 + taxRate / 100);
    }
    const lineSubtotal = basePrice * quantity;
    const discountAmount = (lineSubtotal * discountPercent) / 100;
    const afterDiscount = lineSubtotal - discountAmount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + taxAmount;
    return { discountAmount: Math.round(discountAmount * 100) / 100, taxAmount: Math.round(taxAmount * 100) / 100, total: Math.round(total * 100) / 100 };
};

export default function PosPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [customerSearch, setCustomerSearch] = useState("");
    const [customerResults, setCustomerResults] = useState<PartyOption[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<PartyOption | null>(null);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    const [paymentMode, setPaymentMode] = useState("Cash");
    const [amountReceived, setAmountReceived] = useState("");
    const [billDiscount, setBillDiscount] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [billNumber, setBillNumber] = useState<string>("");

    const searchRef = useRef<HTMLInputElement>(null);
    const customerRef = useRef<HTMLInputElement>(null);
    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const customerDropdownRef = useRef<HTMLDivElement>(null);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target as Node)) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F1") { e.preventDefault(); searchRef.current?.focus(); }
            if (e.ctrlKey && e.key.toLowerCase() === "p") { e.preventDefault(); handleSaveAndPrint(); }
            if (e.key === "F11") { e.preventDefault(); customerRef.current?.focus(); }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cart]);

    // Item search
    const searchItems = useCallback(async (query: string) => {
        if (!query.trim()) { setSearchResults([]); return; }
        setIsSearching(true);
        try {
            const items = await fetchItems({ type: "product" });
            const q = query.toLowerCase();
            const filtered = items.filter((item: any) => {
                const p = item.product || {};
                return (
                    (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.itemCode && p.itemCode.toLowerCase().includes(q)) ||
                    (p.hsn && p.hsn.toLowerCase().includes(q))
                );
            });
            setSearchResults(filtered.slice(0, 15));
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => { if (searchQuery) searchItems(searchQuery); else setSearchResults([]); }, 300);
        return () => clearTimeout(t);
    }, [searchQuery, searchItems]);

    // Customer search
    useEffect(() => {
        const t = setTimeout(async () => {
            if (customerSearch.trim().length >= 2) {
                try {
                    const parties = await fetchParties(customerSearch);
                    setCustomerResults(parties.slice(0, 10));
                    setShowCustomerDropdown(true);
                } catch { setCustomerResults([]); }
            } else {
                setCustomerResults([]);
            }
        }, 300);
        return () => clearTimeout(t);
    }, [customerSearch]);

    // Add item to cart
    const addToCart = (item: any) => {
        const p = item.product || {};
        const existingIdx = cart.findIndex(c => c.itemId === item._id);

        if (existingIdx >= 0) {
            const updated = [...cart];
            updated[existingIdx].quantity += 1;
            const calc = calculateLineItem(
                updated[existingIdx].pricePerUnit,
                updated[existingIdx].quantity,
                updated[existingIdx].taxRate,
                updated[existingIdx].taxType,
                updated[existingIdx].discountPercent
            );
            updated[existingIdx] = { ...updated[existingIdx], ...calc };
            setCart(updated);
        } else {
            const pricePerUnit = Number(p.salePrice) || 0;
            const taxRate = Number(p.taxRate) || 0;
            const calc = calculateLineItem(pricePerUnit, 1, taxRate, "withoutTax", 0);

            setCart(prev => [...prev, {
                itemId: item._id,
                name: p.name || "Unknown",
                itemCode: p.itemCode || "",
                hsn: p.hsn || "",
                quantity: 1,
                unit: p.unit || "PCS",
                pricePerUnit,
                taxType: "withoutTax",
                discountPercent: 0,
                ...calc,
                taxRate,
            }]);
        }

        setSearchQuery("");
        setShowResults(false);
        searchRef.current?.focus();
    };

    // Update cart item quantity
    const updateQuantity = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const updated = [...cart];
        updated[index].quantity = newQty;
        const calc = calculateLineItem(
            updated[index].pricePerUnit,
            newQty,
            updated[index].taxRate,
            updated[index].taxType,
            updated[index].discountPercent
        );
        updated[index] = { ...updated[index], ...calc };
        setCart(updated);
    };

    // Update discount
    const updateDiscount = (index: number, percent: number) => {
        const updated = [...cart];
        updated[index].discountPercent = percent;
        const calc = calculateLineItem(
            updated[index].pricePerUnit,
            updated[index].quantity,
            updated[index].taxRate,
            updated[index].taxType,
            percent
        );
        updated[index] = { ...updated[index], ...calc };
        setCart(updated);
    };

    const removeItem = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));

    // Totals
    const subTotal = cart.reduce((s, c) => s + c.pricePerUnit * c.quantity, 0);
    const totalDiscount = cart.reduce((s, c) => s + c.discountAmount, 0) + billDiscount;
    const totalTax = cart.reduce((s, c) => s + c.taxAmount, 0);
    const grandTotal = Math.round(cart.reduce((s, c) => s + c.total, 0) - billDiscount);
    const totalItems = cart.length;
    const totalQty = cart.reduce((s, c) => s + c.quantity, 0);
    const receivedNum = Number(amountReceived) || 0;
    const changeToReturn = receivedNum > grandTotal ? receivedNum - grandTotal : 0;

    // Save & Print
    const handleSaveAndPrint = async () => {
        if (cart.length === 0) {
            toast({ title: "Add items to the cart first", variant: "destructive" });
            return;
        }
        setIsSaving(true);
        try {
            const received = receivedNum || grandTotal;
            const balanceDue = Math.max(0, grandTotal - received);

            const invoiceData: any = {
                documentType: "INVOICE",
                saleMode: "POS",
                invoiceDate: currentTime.toISOString(),
                invoiceTime: format(currentTime, "hh:mm a"),
                paymentType: balanceDue <= 0 ? "Cash" : "Credit",
                paymentMode,
                items: cart.map(c => ({
                    itemId: c.itemId,
                    name: c.name,
                    quantity: c.quantity,
                    unit: c.unit,
                    priceUnit: { amount: c.pricePerUnit, taxType: c.taxType },
                    discount: { percent: c.discountPercent, amount: c.discountAmount },
                    tax: { rate: c.taxRate, amount: c.taxAmount },
                    amount: c.total,
                })),
                subTotal: Math.round(subTotal * 100) / 100,
                totalDiscount: Math.round(totalDiscount * 100) / 100,
                totalTax: Math.round(totalTax * 100) / 100,
                grandTotal,
                receivedAmount: received,
                balanceDue,
                description: remarks || "POS Sale",
            };

            if (selectedCustomer) {
                invoiceData.partyId = selectedCustomer._id;
                invoiceData.partyName = selectedCustomer.name;
                invoiceData.phone = selectedCustomer.phone || "";
            } else {
                invoiceData.partyName = "Walk-in Customer";
            }

            const result = await createSale(invoiceData);
            const invNum = result.invoiceNumber || result._id;
            setBillNumber(invNum);

            toast({ title: `POS Invoice #${invNum} saved successfully!` });

            // Trigger print
            setTimeout(() => window.print(), 300);

            // Reset cart after print
            setTimeout(() => {
                setCart([]);
                setSelectedCustomer(null);
                setCustomerSearch("");
                setAmountReceived("");
                setBillDiscount(0);
                setRemarks("");
                setBillNumber("");
            }, 1000);
        } catch (error: any) {
            toast({ title: error.message || "Failed to save POS invoice", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="print:hidden flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans text-sm">
                {/* Top Bar */}
                <div className="flex justify-between items-center bg-white px-4 py-2 border-b h-12 text-gray-700">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-red-600">BillingBaba POS</h1>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">{format(currentTime, "EEEE, dd MMM yyyy")}</span>
                        <span className="text-xs text-gray-500">{format(currentTime, "hh:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-gray-700"><Settings size={16} /></button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden p-2 gap-2 bg-[#f4f6fa]">

                    {/* Left: Items Table */}
                    <div className="flex-1 flex flex-col bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b relative" ref={searchDropdownRef}>
                            <div className="relative">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                                    onFocus={() => searchQuery && setShowResults(true)}
                                    placeholder="Search by item name, item code, HSN... [F1]"
                                    className="w-full h-10 pl-4 pr-10 bg-white border rounded text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                />
                                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                            </div>

                            {showResults && (searchResults.length > 0 || isSearching) && (
                                <div className="absolute left-2 right-2 top-14 bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-4 text-gray-400">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
                                        </div>
                                    ) : (
                                        searchResults.map((item) => {
                                            const p = item.product || {};
                                            return (
                                                <button
                                                    key={item._id}
                                                    onClick={() => addToCart(item)}
                                                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex justify-between items-center border-b last:border-b-0"
                                                >
                                                    <div>
                                                        <span className="font-medium text-gray-800">{p.name}</span>
                                                        {p.itemCode && <span className="text-xs text-gray-400 ml-2">({p.itemCode})</span>}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-semibold text-gray-700">₹{(Number(p.salePrice) || 0).toFixed(2)}</span>
                                                        <span className="text-xs text-gray-400 ml-2">Stock: {Number(p.currentQuantity) || 0}</span>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Table Header */}
                        <div className="flex border-b bg-gray-50 text-gray-600 font-medium text-[11px] uppercase p-2 items-center">
                            <div className="w-8 px-2">#</div>
                            <div className="w-24 px-2">CODE</div>
                            <div className="flex-1 px-2 border-l border-gray-200">ITEM NAME</div>
                            <div className="w-20 px-2 border-l border-gray-200 text-center">QTY</div>
                            <div className="w-16 px-2 border-l border-gray-200">UNIT</div>
                            <div className="w-24 px-2 border-l border-gray-200 text-center">
                                PRICE(₹)
                            </div>
                            <div className="w-16 px-2 border-l border-gray-200 text-center">DISC%</div>
                            <div className="w-24 px-2 border-l border-gray-200 text-center">TAX(₹)</div>
                            <div className="w-28 px-2 border-l border-gray-200 text-right">TOTAL(₹)</div>
                            <div className="w-10 px-1"></div>
                        </div>

                        {/* Table Body */}
                        <div className="flex-1 overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Receipt size={48} className="mb-3 opacity-40" />
                                    <p className="text-sm">Search & add items to start billing</p>
                                    <p className="text-xs mt-1">Press F1 to focus search</p>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex items-center border-b hover:bg-blue-50/30 text-[13px] p-1.5">
                                        <div className="w-8 px-2 text-gray-500">{idx + 1}</div>
                                        <div className="w-24 px-2 text-gray-400 truncate">{item.itemCode || "-"}</div>
                                        <div className="flex-1 px-2 font-medium text-gray-800 truncate">{item.name}</div>
                                        <div className="w-20 px-1 flex items-center justify-center gap-1">
                                            <button onClick={() => updateQuantity(idx, item.quantity - 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                                <Minus size={12} />
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(idx, parseInt(e.target.value) || 1)}
                                                className="w-10 h-6 text-center border rounded text-sm outline-none"
                                                min={1}
                                            />
                                            <button onClick={() => updateQuantity(idx, item.quantity + 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <div className="w-16 px-2 text-gray-500">{item.unit}</div>
                                        <div className="w-24 px-2 text-center text-gray-700">{item.pricePerUnit.toFixed(2)}</div>
                                        <div className="w-16 px-1">
                                            <input
                                                type="number"
                                                value={item.discountPercent}
                                                onChange={(e) => updateDiscount(idx, parseFloat(e.target.value) || 0)}
                                                className="w-full h-6 text-center border rounded text-sm outline-none"
                                                min={0}
                                                max={100}
                                            />
                                        </div>
                                        <div className="w-24 px-2 text-center text-gray-500">{item.taxAmount.toFixed(2)}</div>
                                        <div className="w-28 px-2 text-right font-semibold text-gray-800">{item.total.toFixed(2)}</div>
                                        <div className="w-10 px-1 flex justify-center">
                                            <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-[380px] flex flex-col gap-2">
                        {/* Date/Time & Customer */}
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-3 flex flex-col gap-3">
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center justify-between border rounded px-3 h-9 text-gray-700">
                                    <span>{format(currentTime, "dd/MM/yyyy")}</span>
                                    <CalendarDays size={16} className="text-blue-500" />
                                </div>
                                <div className="w-[120px] flex items-center justify-between border rounded px-3 h-9 text-gray-700">
                                    <span>{format(currentTime, "hh:mm a")}</span>
                                </div>
                            </div>

                            {/* Customer Search */}
                            <div className="relative" ref={customerDropdownRef}>
                                {selectedCustomer ? (
                                    <div className="flex items-center justify-between border rounded px-3 h-9 bg-blue-50">
                                        <span className="font-medium text-gray-800">{selectedCustomer.name}</span>
                                        <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(""); }} className="text-gray-400 hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        ref={customerRef}
                                        type="text"
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                        onFocus={() => customerSearch.length >= 2 && setShowCustomerDropdown(true)}
                                        placeholder="Search customer by name, phone [F11]"
                                        className="w-full border rounded px-3 h-9 text-sm outline-none focus:border-blue-400"
                                    />
                                )}
                                {showCustomerDropdown && customerResults.length > 0 && (
                                    <div className="absolute left-0 right-0 top-10 bg-white border rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                                        {customerResults.map((p) => (
                                            <button
                                                key={p._id}
                                                onClick={() => { setSelectedCustomer(p); setCustomerSearch(p.name); setShowCustomerDropdown(false); }}
                                                className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b last:border-b-0 text-sm"
                                            >
                                                <span className="font-medium">{p.name}</span>
                                                {p.phone && <span className="text-xs text-gray-400 ml-2">{p.phone}</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total Card */}
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-3 flex justify-between items-center">
                            <div className="flex items-start gap-3">
                                <div className="bg-[#e7f1fc] p-2 rounded text-blue-500 mt-1">
                                    <Receipt size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-800 leading-tight">Total ₹ {grandTotal.toFixed(2)}</span>
                                    <span className="text-[11px] text-gray-500">Items: {totalItems}, Quantity: {totalQty}</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        {cart.length > 0 && (
                            <div className="bg-white rounded shadow-sm border border-gray-200 p-3 text-sm space-y-1.5">
                                <div className="flex justify-between text-gray-600">
                                    <span>Sub Total</span>
                                    <span>₹ {subTotal.toFixed(2)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>- ₹ {totalDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>₹ {totalTax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-1.5 flex justify-between font-bold text-gray-800">
                                    <span>Grand Total</span>
                                    <span>₹ {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {/* Payment Section */}
                        <div className="flex-1 bg-white rounded shadow-sm border border-gray-200 flex flex-col p-4">
                            <div className="flex gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-400 font-medium uppercase">Payment Mode</label>
                                    <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        className="border border-blue-200 rounded px-3 h-10 w-full text-gray-700 outline-none text-sm"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Card">Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-400 font-medium uppercase">Amount Received</label>
                                    <div className="flex items-center border rounded px-3 h-10 w-full">
                                        <span className="text-gray-500 font-medium mr-2">₹</span>
                                        <input
                                            type="number"
                                            value={amountReceived}
                                            onChange={(e) => setAmountReceived(e.target.value)}
                                            placeholder={grandTotal.toFixed(2)}
                                            className="w-full text-right outline-none bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-3">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-400 font-medium uppercase">Bill Discount (₹)</label>
                                    <div className="flex items-center border rounded px-3 h-10 w-full">
                                        <span className="text-gray-500 font-medium mr-2">₹</span>
                                        <input
                                            type="number"
                                            value={billDiscount || ""}
                                            onChange={(e) => setBillDiscount(Number(e.target.value) || 0)}
                                            placeholder="0"
                                            className="w-full text-right outline-none bg-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-400 font-medium uppercase">Change to Return</label>
                                    <div className="flex items-center border rounded px-3 h-10 w-full bg-gray-50">
                                        <span className="text-gray-500 font-medium mr-2">₹</span>
                                        <span className="w-full text-right font-bold text-green-700">{changeToReturn.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="text-[11px] text-gray-400 font-medium uppercase">Remarks</label>
                                <input
                                    type="text"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Optional remarks..."
                                    className="w-full border rounded px-3 h-9 text-sm outline-none mt-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="h-16 bg-white border-t p-2 flex gap-4">
                    <div className="flex-1 flex items-center gap-2 px-4">
                        <span className="text-gray-500 text-xs">Items: <strong>{totalItems}</strong></span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 text-xs">Qty: <strong>{totalQty}</strong></span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-700 font-bold">Grand Total: ₹ {grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="w-[380px] flex gap-2 h-full py-1">
                        <button
                            onClick={() => { setCart([]); setSelectedCustomer(null); setCustomerSearch(""); setAmountReceived(""); setBillDiscount(0); setRemarks(""); }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium border border-gray-300 text-sm"
                            disabled={isSaving}
                        >
                            Clear Bill
                        </button>
                        <button
                            onClick={handleSaveAndPrint}
                            disabled={isSaving || cart.length === 0}
                            className="flex-[2] bg-[#a8e6cf] hover:bg-[#96d7c1] text-green-900 rounded font-medium border border-green-300 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : "Save & Print Bill [Ctrl+P]"}
                        </button>
                    </div>
                </div>
            </div>

            {/* PRINT ONLY THERMAL RECEIPT */}
            <div className="hidden print:block font-sans text-black w-[80mm] mx-auto p-2">
                <style>{`@media print { @page { margin: 0; size: auto; } body { margin: 0; padding: 0; background: white; } }`}</style>
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold uppercase">BillingBaba</h1>
                    <p className="text-xs mt-1">POS Sale</p>
                    <div className="border-b border-dashed border-gray-400 my-2" />
                    <h2 className="text-sm font-bold uppercase">Tax Invoice</h2>
                </div>

                <div className="text-xs mb-3 flex justify-between">
                    <div>
                        <div><span className="font-semibold">Bill No:</span> {billNumber || "—"}</div>
                        <div><span className="font-semibold">Date:</span> {format(currentTime, "dd/MM/yyyy")}</div>
                    </div>
                    <div className="text-right">
                        <div><span className="font-semibold">Time:</span> {format(currentTime, "hh:mm a")}</div>
                        <div>{selectedCustomer ? selectedCustomer.name : "Walk-in"}</div>
                    </div>
                </div>

                <table className="w-full text-xs text-left mb-3">
                    <thead>
                        <tr className="border-y border-dashed border-gray-400">
                            <th className="py-1">ITEM</th>
                            <th className="py-1 text-center">QTY</th>
                            <th className="py-1 text-right">PRICE</th>
                            <th className="py-1 text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-1">{item.name}</td>
                                <td className="py-1 text-center">{item.quantity}</td>
                                <td className="py-1 text-right">{item.pricePerUnit.toFixed(2)}</td>
                                <td className="py-1 text-right">{item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-xs mb-3">
                    <div className="flex justify-between py-0.5">
                        <span>Subtotal</span>
                        <span>₹ {subTotal.toFixed(2)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className="flex justify-between py-0.5">
                            <span>Discount</span>
                            <span>- ₹ {totalDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between py-0.5">
                        <span>Tax</span>
                        <span>₹ {totalTax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-gray-400 my-1" />
                    <div className="flex justify-between py-1 text-sm font-bold">
                        <span>Grand Total</span>
                        <span>₹ {grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="border-b border-dashed border-gray-400 my-1" />
                    <div className="flex justify-between py-0.5">
                        <span>Paid ({paymentMode})</span>
                        <span>₹ {(receivedNum || grandTotal).toFixed(2)}</span>
                    </div>
                    {changeToReturn > 0 && (
                        <div className="flex justify-between py-0.5 font-semibold">
                            <span>Change</span>
                            <span>₹ {changeToReturn.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="text-xs text-center mt-4">
                    <p className="font-semibold">Thank You! Visit Again!</p>
                    <p className="text-[10px] mt-2">Powered by BillingBaba</p>
                </div>
            </div>
        </>
    );
}
