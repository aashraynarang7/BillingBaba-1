"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ChevronDown, Plus, FileText, Share2, Printer, X, FileUp, Image as ImageIcon, Search } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
    createPurchase, fetchCompanies,
    fetchExpenseCategories, createExpenseCategory,
    fetchExpenseItems, createExpenseItem
} from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const paymentTypes = ["Cash", "Cheque", "Bank Transfer", "UPI"];
const TAX_RATES = ["0", "5", "12", "18", "28"];

// ─── Types ───────────────────────────────────────────────────────────────────

type ExpenseRow = {
    id: number;
    name: string;
    description: string;
    qty: number;
    price: number;
    amount: number;
};

type ExpenseItemRecord = {
    _id: string;
    name: string;
    hsnSac?: string;
    description?: string;
    price: number;
    taxType: string;
    taxRate: number;
};

type ExpenseCategoryRecord = {
    _id: string;
    name: string;
    expenseType: string;
};

// ─── Add Expense Category Modal ───────────────────────────────────────────────

function AddExpenseCategoryModal({
    open,
    onClose,
    onSaved,
}: {
    open: boolean;
    onClose: () => void;
    onSaved: (cat: ExpenseCategoryRecord) => void;
}) {
    const [name, setName] = useState('');
    const [expenseType, setExpenseType] = useState('Indirect Expense');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            const created = await createExpenseCategory(name.trim(), expenseType);
            onSaved(created);
            setName('');
            setExpenseType('Indirect Expense');
        } catch (error: any) {
            toast({ title: error.message || 'Failed to add category', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Expense Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-blue-600">Expense Category</Label>
                        <Input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                            placeholder="e.g. Salary"
                            className="border-blue-400 focus-visible:ring-blue-400"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Expense Type</Label>
                        <Select value={expenseType} onValueChange={setExpenseType}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Direct Expense">Direct Expense</SelectItem>
                                <SelectItem value="Indirect Expense">Indirect Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={saving || !name.trim()}>
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Add Expense Item Modal ───────────────────────────────────────────────────

function AddExpenseItemModal({
    open,
    onClose,
    onSaved,
    initialName,
}: {
    open: boolean;
    onClose: () => void;
    onSaved: (item: ExpenseItemRecord) => void;
    initialName?: string;
}) {
    const [itemName, setItemName] = useState(initialName || '');
    const [hsnSac, setHsnSac] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [taxType, setTaxType] = useState('Tax Excluded');
    const [taxRate, setTaxRate] = useState('0');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) setItemName(initialName || '');
    }, [open, initialName]);

    const handleSave = async () => {
        if (!itemName.trim()) return;
        setSaving(true);
        try {
            const created = await createExpenseItem({
                name: itemName.trim(),
                hsnSac: hsnSac.trim() || undefined,
                description: description.trim() || undefined,
                price: Number(price) || 0,
                taxType,
                taxRate: Number(taxRate) || 0,
            });
            onSaved(created);
            setItemName(''); setHsnSac(''); setDescription('');
            setPrice(''); setTaxType('Tax Excluded'); setTaxRate('0');
        } catch (error: any) {
            toast({ title: error.message || 'Failed to add item', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Expense Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-blue-600">Item Name *</Label>
                            <Input
                                autoFocus
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="border-blue-400 focus-visible:ring-blue-400"
                                placeholder="Item Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Item HSN/ SAC</Label>
                            <div className="relative">
                                <Input
                                    value={hsnSac}
                                    onChange={(e) => setHsnSac(e.target.value)}
                                    placeholder="Item HSN/ SAC"
                                    className="pr-9"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-3">Pricing</p>
                        <div className="flex gap-3">
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Price"
                                className="w-32"
                            />
                            <Select value={taxType} onValueChange={setTaxType}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tax Excluded">Tax Excluded</SelectItem>
                                    <SelectItem value="Tax Included">Tax Included</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={taxRate} onValueChange={setTaxRate}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Tax Rate" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TAX_RATES.map(r => (
                                        <SelectItem key={r} value={r}>{r === '0' ? 'No Tax' : `${r}%`}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={saving || !itemName.trim()}>
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Item Name Cell with Autocomplete ─────────────────────────────────────────

function ItemNameCell({
    value,
    expenseItems,
    onSelect,
    onChange,
    onAddNew,
}: {
    value: string;
    expenseItems: ExpenseItemRecord[];
    onSelect: (item: ExpenseItemRecord) => void;
    onChange: (val: string) => void;
    onAddNew: (name: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const filtered = expenseItems.filter(i =>
        i.name.toLowerCase().includes(value.toLowerCase())
    );

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <Input
                value={value}
                onChange={(e) => { onChange(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                className="border-none shadow-none focus-visible:ring-0 px-0 h-8"
                placeholder="Item Name"
            />
            {open && (
                <div className="absolute left-0 top-full z-50 w-72 bg-white border border-gray-200 rounded shadow-lg">
                    <div
                        className="flex items-center gap-2 px-3 py-2 border-b cursor-pointer hover:bg-blue-50 text-blue-600"
                        onMouseDown={(e) => { e.preventDefault(); onAddNew(value); setOpen(false); }}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm font-medium">Add Expense Item</span>
                        <span className="ml-auto text-xs text-gray-400 uppercase">PRICE</span>
                    </div>
                    {filtered.length === 0 && value && (
                        <div className="px-3 py-2 text-xs text-gray-400">No matching items</div>
                    )}
                    {filtered.map(item => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                            onMouseDown={(e) => { e.preventDefault(); onSelect(item); setOpen(false); }}
                        >
                            <span>{item.name}</span>
                            <span className="text-gray-500">{item.price}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateExpensePage({ onCancel }: { onCancel: () => void }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time] = useState(format(new Date(), 'hh:mm a'));
    const [category, setCategory] = useState<string>('');
    const [expenseNo, setExpenseNo] = useState('');
    const [items, setItems] = useState<ExpenseRow[]>([{ id: 1, name: '', description: '', qty: 0, price: 0, amount: 0 }]);
    const [isGst, setIsGst] = useState(false);
    const [paymentType, setPaymentType] = useState('Cash');
    const [roundOff, setRoundOff] = useState(0);
    const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryRecord[]>([]);
    const [expenseItems, setExpenseItems] = useState<ExpenseItemRecord[]>([]);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [newItemInitialName, setNewItemInitialName] = useState('');
    const [pendingItemRowId, setPendingItemRowId] = useState<number | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [comps, cats, eitems] = await Promise.all([
                    fetchCompanies(),
                    fetchExpenseCategories(),
                    fetchExpenseItems(),
                ]);
                setCompanies(comps);
                setExpenseCategories(cats);
                setExpenseItems(eitems);
                setExpenseNo(`EXP-${Date.now().toString().slice(-6)}`);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, []);

    const addRow = () => setItems(prev => [...prev, { id: Date.now(), name: '', description: '', qty: 0, price: 0, amount: 0 }]);

    const updateRow = (id: number, field: keyof ExpenseRow, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const updated = { ...item, [field]: value };
            if (field === 'qty' || field === 'price') {
                updated.amount = (Number(updated.qty) || 0) * (Number(updated.price) || 0);
            }
            return updated;
        }));
    };

    const removeRow = (id: number) => {
        if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleSelectExpenseItem = (rowId: number, item: ExpenseItemRecord) => {
        setItems(prev => prev.map(r => {
            if (r.id !== rowId) return r;
            const qty = r.qty || 1;
            return { ...r, name: item.name, description: item.description || r.description, price: item.price, qty, amount: qty * item.price };
        }));
    };

    const handleOpenAddItem = (rowId: number, currentName: string) => {
        setPendingItemRowId(rowId);
        setNewItemInitialName(currentName);
        setShowItemModal(true);
    };

    const handleItemSaved = (newItem: ExpenseItemRecord) => {
        setExpenseItems(prev => [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name)));
        if (pendingItemRowId !== null) {
            handleSelectExpenseItem(pendingItemRowId, newItem);
        }
        setShowItemModal(false);
    };

    const handleCategorySaved = (cat: ExpenseCategoryRecord) => {
        setExpenseCategories(prev => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
        setCategory(cat.name);
        setShowCategoryModal(false);
    };

    const totalQty = items.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
    const subTotal = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const totalAmount = subTotal + (isRoundOffEnabled ? Number(roundOff) : 0);

    const handleSave = async () => {
        if (!category) {
            toast({ title: "Please select an Expense Category", variant: "destructive" });
            return;
        }
        const formData = new FormData();
        formData.append('companyId', companies[0]?._id || '');
        formData.append('documentType', 'EXPENSE');
        formData.append('category', category);
        formData.append('isGst', String(isGst));
        formData.append('billNumber', expenseNo);
        if (date) formData.append('billDate', date.toISOString());

        const itemsPayload = items.filter(i => i.name || i.amount > 0).map(i => ({
            name: i.name || category,
            description: i.description,
            quantity: Number(i.qty),
            priceUnit: { amount: Number(i.price) },
            amount: Number(i.amount),
        }));
        formData.append('items', JSON.stringify(itemsPayload));
        formData.append('grandTotal', totalAmount.toString());
        formData.append('roundOff', isRoundOffEnabled ? roundOff.toString() : '0');
        formData.append('paymentType', paymentType);
        formData.append('balanceDue', '0');
        formData.append('isBill', 'true');
        formData.append('paidAmount', totalAmount.toString());
        formData.append('description', description);
        images.forEach((file) => formData.append('images', file));
        documents.forEach((file) => formData.append('documents', file));

        try {
            await createPurchase(formData);
            toast({ title: "Expense Saved Successfully", className: "bg-green-500 text-white" });
            onCancel();
        } catch (error) {
            toast({ title: "Failed to save expense", variant: "destructive" });
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4">
            {/* Add Expense Category Modal */}
            <AddExpenseCategoryModal
                open={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onSaved={handleCategorySaved}
            />

            {/* Add Expense Item Modal */}
            <AddExpenseItemModal
                open={showItemModal}
                onClose={() => setShowItemModal(false)}
                onSaved={handleItemSaved}
                initialName={newItemInitialName}
            />

            <div className="bg-white rounded-lg shadow-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-gray-800">Expense</h1>
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                            <span className="text-sm font-medium text-gray-600">GST</span>
                            <Switch id="gst-toggle" checked={isGst} onCheckedChange={setIsGst} className="data-[state=checked]:bg-blue-600" />
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-red-500">
                        Close <X className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                {/* Top Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <label className="block text-xs font-medium text-red-500 mb-1">Expense Category *</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full md:w-72 border-gray-300 focus:ring-blue-500">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2 border-b">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-blue-600 h-8 px-2"
                                        onClick={() => setShowCategoryModal(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Expense Category
                                    </Button>
                                </div>
                                {expenseCategories.length === 0 && (
                                    <div className="px-2 py-3 text-sm text-gray-400 text-center">No categories yet</div>
                                )}
                                {expenseCategories.map(cat => (
                                    <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">Expense No</span>
                            <div className="border-b border-gray-300 w-32 pb-1 text-right text-sm">{expenseNo}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">Date</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className={cn("w-32 justify-end text-right font-normal h-8 p-0 hover:bg-transparent hover:text-blue-600", !date && "text-muted-foreground")}>
                                        {date ? format(date, "dd/MM/yyyy") : "Pick a date"}
                                        <CalendarIcon className="ml-2 h-4 w-4 text-blue-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">Time</span>
                            <div className="flex items-center justify-end w-32 text-sm text-gray-700">
                                {time} <span className="ml-2 text-gray-400">🕒</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-md overflow-hidden mb-6">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-slate-50">
                                <TableHead className="w-8 text-center">#</TableHead>
                                <TableHead className="w-1/3">ITEM</TableHead>
                                <TableHead className="w-1/4">DESCRIPTION</TableHead>
                                <TableHead className="w-20">QTY</TableHead>
                                <TableHead className="w-28">PRICE/UNIT</TableHead>
                                <TableHead className="text-right">AMOUNT</TableHead>
                                <TableHead className="w-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.id} className="group">
                                    <TableCell className="text-center text-gray-500 text-sm">{index + 1}</TableCell>
                                    <TableCell>
                                        <ItemNameCell
                                            value={item.name}
                                            expenseItems={expenseItems}
                                            onSelect={(ei) => handleSelectExpenseItem(item.id, ei)}
                                            onChange={(val) => updateRow(item.id, 'name', val)}
                                            onAddNew={(name) => handleOpenAddItem(item.id, name)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateRow(item.id, 'description', e.target.value)}
                                            className="border-none shadow-none focus-visible:ring-0 px-0 h-8"
                                            placeholder="Description"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.qty || ''}
                                            onChange={(e) => updateRow(item.id, 'qty', e.target.value)}
                                            className="border border-gray-200 h-8 w-16 px-2 text-center focus:border-blue-500"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.price || ''}
                                            onChange={(e) => updateRow(item.id, 'price', e.target.value)}
                                            className="border border-gray-200 h-8 w-full px-2 text-right focus:border-blue-500"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-gray-700">
                                        {item.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => removeRow(item.id)} className="opacity-0 group-hover:opacity-100 h-6 w-6 text-gray-400 hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter className="bg-white border-t">
                            <TableRow className="hover:bg-white">
                                <TableCell colSpan={2}>
                                    <Button variant="outline" size="sm" onClick={addRow} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        ADD ROW
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Total</TableCell>
                                <TableCell className="text-center font-bold text-gray-800">{totalQty}</TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right font-bold text-gray-800">{subTotal.toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500">Payment Type</label>
                            <Select value={paymentType} onValueChange={setPaymentType}>
                                <SelectTrigger className="w-40 border-gray-300 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 pt-2">
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
                                <Button variant="secondary" size="sm" className="w-48 justify-start text-gray-600 bg-gray-100 hover:bg-gray-200 h-9" onClick={() => setShowDescription(true)}>
                                    <FileText className="h-4 w-4 mr-2 text-gray-400" /> ADD DESCRIPTION
                                </Button>
                            )}

                            <div>
                                <input type="file" multiple accept="image/*" className="hidden" ref={imageInputRef}
                                    onChange={(e) => { if (e.target.files) setImages(prev => [...prev, ...Array.from(e.target.files!)]); }}
                                />
                                <Button variant="secondary" size="sm" className="w-48 justify-start text-gray-600 bg-gray-100 hover:bg-gray-200 h-9" onClick={() => imageInputRef.current?.click()}>
                                    <ImageIcon className="h-4 w-4 mr-2 text-gray-400" /> ADD IMAGE
                                </Button>
                                {images.length > 0 && <div className="text-xs text-gray-500 mt-1 pl-2">{images.length} images attached</div>}
                            </div>

                            <div>
                                <input type="file" multiple accept=".pdf,.doc,.docx,image/*" className="hidden" ref={documentInputRef}
                                    onChange={(e) => { if (e.target.files) setDocuments(prev => [...prev, ...Array.from(e.target.files!)]); }}
                                />
                                <Button variant="secondary" size="sm" className="w-48 justify-start text-gray-600 bg-gray-100 hover:bg-gray-200 h-9" onClick={() => documentInputRef.current?.click()}>
                                    <FileUp className="h-4 w-4 mr-2 text-gray-400" /> ADD DOCUMENT
                                </Button>
                                {documents.length > 0 && <div className="text-xs text-gray-500 mt-1 pl-2">{documents.length} docs attached</div>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-end gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="roundOff"
                                    checked={isRoundOffEnabled}
                                    onCheckedChange={(c) => setIsRoundOffEnabled(!!c)}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                                <label htmlFor="roundOff" className="text-sm text-gray-600 select-none cursor-pointer">Round Off</label>
                            </div>
                            <Input
                                type="number"
                                value={roundOff}
                                onChange={(e) => setRoundOff(Number(e.target.value))}
                                disabled={!isRoundOffEnabled}
                                className="w-24 text-right h-9"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <label className="text-sm font-bold text-gray-600 uppercase">Total</label>
                            <div className="w-48 h-10 border rounded bg-white flex items-center justify-end px-3 font-bold text-xl text-gray-800 shadow-sm">
                                {totalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end items-center gap-3 pt-8 pb-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                Share <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" />Share</DropdownMenuItem>
                            <DropdownMenuItem><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
