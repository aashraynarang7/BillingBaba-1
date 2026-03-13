"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, MoreVertical, Trash2, Edit, Copy, FileText, Eye, Printer, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CreateExpensePage from '../component/CreateExpensePage';
import {
    fetchPurchases, cancelPurchase, deletePurchase,
    fetchExpenseCategories, deleteExpenseCategory,
    fetchExpenseItems,
} from '@/lib/api';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

type Tab = 'category' | 'items';

type ExpenseRecord = {
    _id: string;
    category?: string;
    billDate?: string;
    billNumber?: string;
    partyName?: string;
    paymentType?: string;
    grandTotal: number;
    balanceDue: number;
    dueDate?: string;
    status?: string;
    items?: { name: string; amount: number }[];
};

type CategoryRecord = { _id: string; name: string; expenseType: string };
type ItemRecord = { _id: string; name: string; price: number };

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
    const s = status || 'Paid';
    const color =
        s === 'Paid' ? 'text-teal-500' :
        s === 'Unpaid' ? 'text-red-500' :
        s === 'Partial' ? 'text-orange-500' :
        s === 'Cancelled' ? 'text-gray-400' : 'text-teal-500';
    return <span className={`font-medium ${color}`}>{s}</span>;
}

// ─── Right panel table ─────────────────────────────────────────────────────────
function ExpenseTable({ expenses, search, onDelete }: { expenses: ExpenseRecord[]; search: string; onDelete: (id: string) => void }) {
    const filtered = expenses.filter(e => {
        const q = search.toLowerCase();
        return !q ||
            (e.billNumber || '').toLowerCase().includes(q) ||
            (e.partyName || '').toLowerCase().includes(q) ||
            (e.paymentType || '').toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-400 py-16">
                <p className="text-sm">No expenses found</p>
            </div>
        );
    }

    return (
        <div className="overflow-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-white">
                        {['DATE', 'EXP NO.', 'PARTY', 'PAYMENT TY...', 'AMOUNT', 'BALANCE', 'DUE DATE', 'STATUS'].map(col => (
                            <th key={col} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
                                <span className="flex items-center gap-1">{col} <span className="text-gray-300">▽</span></span>
                            </th>
                        ))}
                        <th className="w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(e => (
                        <tr key={e._id} className="border-b hover:bg-blue-50 cursor-pointer">
                            <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                {e.billDate ? format(new Date(e.billDate), "dd/MM/yyyy, HH:mm") + '...' : '-'}
                            </td>
                            <td className="px-3 py-2 text-gray-500">{e.billNumber || '-'}</td>
                            <td className="px-3 py-2 text-gray-500">{e.partyName || ''}</td>
                            <td className="px-3 py-2 text-gray-700">{e.paymentType || 'Cash'}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800">{(e.grandTotal || 0).toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-gray-600">{e.balanceDue ?? 0}</td>
                            <td className="px-3 py-2 text-gray-500">
                                {e.dueDate ? format(new Date(e.dueDate), "dd/MM/yyyy") : ''}
                            </td>
                            <td className="px-3 py-2"><StatusBadge status={e.status} /></td>
                            <td className="px-3 py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-3 w-3" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => toast({ title: 'Edit coming soon' })}><Edit className="mr-2 h-4 w-4" />View/Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => onDelete(e._id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: 'Duplicate coming soon' })}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: 'PDF coming soon' })}><FileText className="mr-2 h-4 w-4" />Open PDF</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: 'Preview coming soon' })}><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: 'View History coming soon' })}><History className="mr-2 h-4 w-4" />View History</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ExpensesPage() {
    const [tab, setTab] = useState<Tab>('category');
    const [isCreating, setIsCreating] = useState(false);

    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
    const [categories, setCategories] = useState<CategoryRecord[]>([]);
    const [expenseItems, setExpenseItems] = useState<ItemRecord[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [leftSearch, setLeftSearch] = useState('');
    const [rightSearch, setRightSearch] = useState('');

    const load = async () => {
        try {
            const [exps, cats, items] = await Promise.all([
                fetchPurchases({ type: 'EXPENSE' }),
                fetchExpenseCategories(),
                fetchExpenseItems(),
            ]);
            setExpenses(exps);
            setCategories(cats);
            setExpenseItems(items);

            // Auto-select first items
            if (cats.length > 0 && !selectedCategory) setSelectedCategory(cats[0].name);
            if (items.length > 0 && !selectedItem) setSelectedItem(items[0].name);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!isCreating) load();
    }, [isCreating]);

    // Category totals: sum grandTotal per category
    const categoryTotals = useMemo(() => {
        const map: Record<string, number> = {};
        expenses.forEach(e => {
            const cat = e.category || '';
            map[cat] = (map[cat] || 0) + (e.grandTotal || 0);
        });
        return map;
    }, [expenses]);

    // Item totals: sum item.amount for each item name across all expenses
    const itemTotals = useMemo(() => {
        const map: Record<string, number> = {};
        expenses.forEach(e => {
            (e.items || []).forEach(row => {
                if (row.name) map[row.name] = (map[row.name] || 0) + (row.amount || 0);
            });
        });
        return map;
    }, [expenses]);

    // Filtered left panel lists
    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(leftSearch.toLowerCase())
    );
    const filteredItems = expenseItems.filter(i =>
        i.name.toLowerCase().includes(leftSearch.toLowerCase())
    );

    // Right panel expenses
    const rightExpenses = useMemo(() => {
        if (tab === 'category' && selectedCategory) {
            return expenses.filter(e => e.category === selectedCategory);
        }
        if (tab === 'items' && selectedItem) {
            return expenses.filter(e =>
                (e.items || []).some(row => row.name === selectedItem)
            );
        }
        return [];
    }, [tab, selectedCategory, selectedItem, expenses]);

    // Right panel header info
    const selectedCategoryRecord = categories.find(c => c.name === selectedCategory);
    const rightTotal = rightExpenses.reduce((s, e) => s + (e.grandTotal || 0), 0);
    const rightBalance = rightExpenses.reduce((s, e) => s + (e.balanceDue || 0), 0);

    const handleDeleteExpense = async (id: string) => {
        if (!confirm('Delete this expense?')) return;
        try {
            await deletePurchase(id);
            toast({ title: 'Expense deleted', className: 'bg-green-500 text-white' });
            load();
        } catch {
            toast({ title: 'Failed to delete expense', variant: 'destructive' });
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}"?`)) return;
        try {
            await deleteExpenseCategory(id);
            setCategories(prev => prev.filter(c => c._id !== id));
            if (selectedCategory === name) setSelectedCategory(null);
        } catch {
            toast({ title: 'Failed to delete category', variant: 'destructive' });
        }
    };

    if (isCreating) {
        return (
            <div className="w-full bg-slate-50 min-h-screen">
                <CreateExpensePage onCancel={() => setIsCreating(false)} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-6">
                {(['category', 'items'] as Tab[]).map(t => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setLeftSearch(''); setRightSearch(''); }}
                        className={`px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                            tab === t
                                ? 'text-gray-800 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Body: Left + Right */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <div className="w-72 flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
                    {/* Search + Add */}
                    <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                            <Search className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                            <Input
                                value={leftSearch}
                                onChange={(e) => setLeftSearch(e.target.value)}
                                placeholder="Search..."
                                className="h-7 border-none shadow-none focus-visible:ring-0 px-0 text-sm"
                            />
                        </div>
                        <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-3 h-8 text-xs font-semibold"
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus className="h-3 w-3 mr-1" /> Add Expense
                        </Button>
                    </div>

                    {/* Column headers */}
                    <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                        <span className="flex items-center gap-1">{tab === 'category' ? 'Category' : 'Item'} <span className="text-gray-300">↑</span></span>
                        <span>Amount</span>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {tab === 'category' && (
                            filteredCategories.length === 0 ? (
                                <div className="px-4 py-6 text-sm text-gray-400 text-center">No categories</div>
                            ) : (
                                filteredCategories.map(cat => {
                                    const total = categoryTotals[cat.name] || 0;
                                    const isSelected = selectedCategory === cat.name;
                                    return (
                                        <div
                                            key={cat._id}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-50 group transition-colors ${
                                                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className={`text-sm ${isSelected ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                                                {cat.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm ${isSelected ? 'font-semibold' : 'text-gray-500'}`}>
                                                    {total > 0 ? total.toLocaleString() : '0'}
                                                </span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                                                            <MoreVertical className="h-3 w-3 text-gray-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteCategory(cat._id, cat.name)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}

                        {tab === 'items' && (
                            filteredItems.length === 0 ? (
                                <div className="px-4 py-6 text-sm text-gray-400 text-center">No expense items</div>
                            ) : (
                                filteredItems.map(item => {
                                    const total = itemTotals[item.name] || 0;
                                    const isSelected = selectedItem === item.name;
                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => setSelectedItem(item.name)}
                                            className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-50 group transition-colors ${
                                                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className={`text-sm ${isSelected ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                                                {item.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm ${isSelected ? 'font-semibold' : 'text-gray-500'}`}>
                                                    {total > 0 ? `₹ ${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ 0.00'}
                                                </span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                                                            <MoreVertical className="h-3 w-3 text-gray-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="text-red-500">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                    {(tab === 'category' && !selectedCategory) || (tab === 'items' && !selectedItem) ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                            <p className="text-sm">Select a {tab === 'category' ? 'category' : 'item'} to view expenses</p>
                        </div>
                    ) : (
                        <>
                            {/* Right header */}
                            <div className="flex items-start justify-between px-6 py-4 bg-white border-b border-gray-200">
                                <div>
                                    <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                        {tab === 'category' ? selectedCategory : selectedItem}
                                    </h2>
                                    {tab === 'category' && selectedCategoryRecord && (
                                        <p className="text-sm text-gray-500 mt-0.5">{selectedCategoryRecord.expenseType}</p>
                                    )}
                                </div>
                                <div className="text-right text-sm">
                                    <div>
                                        <span className="text-gray-500">Total : </span>
                                        <span className="text-red-500 font-semibold">₹ {rightTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Balance : </span>
                                        <span className="text-red-500 font-semibold">₹ {rightBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="px-4 py-3 bg-white border-b border-gray-100">
                                <div className="relative max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        value={rightSearch}
                                        onChange={(e) => setRightSearch(e.target.value)}
                                        placeholder=""
                                        className="pl-9 h-8 bg-gray-50 border-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-auto bg-white">
                                <ExpenseTable expenses={rightExpenses} search={rightSearch} onDelete={handleDeleteExpense} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
