"use client"

import React, { useState, useEffect, FC, ComponentType } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Plus, Square, CheckSquare, PlusCircle, X, LucideProps, ListOrdered, ListTodo, Loader2, Package, Landmark, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDashboardSummary } from '@/lib/api';
import { useRouter } from 'next/navigation';

// --- Types ---
interface Order { id: string; name: string; items: number; amount: number; status: 'Open' | 'Delivered' | 'Estimate'; }
interface Todo { id: number; text: string; done: boolean; }
interface StatCardProps { title: string; amount: string; subtitle: string; icon: ComponentType<LucideProps>; iconBgColor: string; iconTextColor: string; hasBorder: boolean; loading?: boolean; }
interface ReportLink { title: string; href: string; }
interface WidgetItemProps { title: string; value: string; subtitle?: string; }

interface DashboardData {
    totalReceivable: number;
    receivablePartyCount: number;
    totalPayable: number;
    payablePartyCount: number;
    todaySales: number;
    todayPurchases: number;
    stockValue: number;
    lowStockItems: { name: string; currentQuantity: number; minStock: number }[];
    totalBankBalance: number;
    totalPurchases: number;
    orders: { id: string; name: string; items: number; amount: number; status: string; date: string }[];
    recentSales: { id: string; invoiceNumber: string; partyName: string; amount: number; balance: number; status: string; date: string }[];
}

const reportLinks: ReportLink[] = [
    { title: "Sale Report", href: "/dashboard/reports/sale" },
    { title: "Purchase Report", href: "/dashboard/reports/purchases" },
    { title: "Daybook Report", href: "/dashboard/reports/day-book" },
    { title: "Party Statement", href: "/dashboard/reports/party-wise-profit-loss" },
];

const formatCurrency = (val: number) => `₹ ${val.toLocaleString('en-IN')}`;

// --- Components ---

const StatCard: FC<StatCardProps> = ({ title, amount, subtitle, icon: Icon, iconBgColor, iconTextColor, hasBorder, loading }) => (
    <div className={`p-3 ${hasBorder ? 'md:border-r md:border-slate-200/90' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                {loading ? (
                    <div className="h-7 w-24 bg-slate-100 rounded animate-pulse mt-1" />
                ) : (
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{amount}</p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
            <div className={`p-1.5 rounded-full ${iconBgColor}`}>
                <Icon className={`h-4 w-4 ${iconTextColor}`} />
            </div>
        </div>
    </div>
);

const OrderCard: FC<{ orders: Order[]; loading: boolean }> = ({ orders, loading }) => {
    const getStatusChip = (status: Order['status']) => {
        const styles: Record<string, string> = {
            Open: 'bg-blue-100 text-blue-700',
            Delivered: 'bg-green-100 text-green-700',
            Estimate: 'bg-yellow-100 text-yellow-700',
        };
        return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
    };

    return (
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-1.5 flex-shrink-0 border-b border-slate-100 pb-1.5">
                <div className="bg-blue-50 p-1.5 rounded-lg">
                    <ListOrdered className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800">Recent Orders</h3>
            </div>
            <div className="flex-grow overflow-y-auto thin-scrollbar -mr-1 pr-1">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                        <ListOrdered className="h-8 w-8 mb-2 opacity-40" />
                        <span>No recent orders</span>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-2 py-1.5">Customer</th>
                                <th scope="col" className="px-2 py-1.5 text-right">Amount</th>
                                <th scope="col" className="px-2 py-1.5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-200/60 hover:bg-slate-50/70">
                                    <td className="px-2 py-1.5 font-semibold text-slate-800 text-sm whitespace-nowrap">{order.name}</td>
                                    <td className="px-2 py-1.5 text-right font-medium text-sm">₹{order.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-2 py-1.5 text-center">{getStatusChip(order.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const TodoCard: FC = () => {
    const STORAGE_KEY = 'billingbaba_todos';

    const loadTodos = (): Todo[] => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch {}
        return [];
    };

    const [todos, setTodos] = useState<Todo[]>(loadTodos);
    const [newTodoText, setNewTodoText] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const toggleTodo = (id: number) => {
        setTodos(curr => curr.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const addTodo = () => {
        const text = newTodoText.trim();
        if (!text) return;
        setTodos(curr => [...curr, { id: Date.now(), text, done: false }]);
        setNewTodoText('');
        setIsAdding(false);
    };

    const removeTodo = (id: number) => {
        setTodos(curr => curr.filter(t => t.id !== id));
    };

    return (
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 h-full flex flex-col">
            <div className="flex justify-between items-center mb-1.5 flex-shrink-0 border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                        <ListTodo className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-800">To-Do List</h3>
                </div>
                <button onClick={() => setIsAdding(true)} className="p-1 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"><PlusCircle className="h-5 w-5" /></button>
            </div>
            <div className="flex-grow overflow-y-auto thin-scrollbar -mr-1.5 pr-1.5">
                {isAdding && (
                    <div className="flex items-center gap-2 p-1.5 mb-1">
                        <input
                            autoFocus
                            value={newTodoText}
                            onChange={e => setNewTodoText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addTodo(); if (e.key === 'Escape') setIsAdding(false); }}
                            placeholder="Add a task..."
                            className="flex-grow border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <button onClick={addTodo} className="text-blue-600 text-sm font-medium">Add</button>
                    </div>
                )}
                {todos.length === 0 && !isAdding ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                        <ListTodo className="h-8 w-8 mb-2 opacity-40" />
                        <span>No tasks yet</span>
                    </div>
                ) : (
                    <ul className="space-y-0.5">
                        {todos.map((todo) => (
                            <li key={todo.id} className="flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 group">
                                <div onClick={() => toggleTodo(todo.id)}>
                                    <AnimatePresence mode="wait">
                                        <motion.div key={todo.done ? 'checked' : 'unchecked'} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                                            {todo.done ? <CheckSquare className="h-4 w-4 text-green-500 flex-shrink-0" /> : <Square className="h-4 w-4 text-slate-300 flex-shrink-0" />}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <span onClick={() => toggleTodo(todo.id)} className={`flex-grow font-medium text-sm transition-colors ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{todo.text}</span>
                                <button onClick={() => removeTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"><X className="h-3.5 w-3.5" /></button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const ReportsCard: FC = () => {
    const router = useRouter();
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[15px] font-semibold text-slate-800">Most Used Reports</h3>
                <button onClick={() => router.push('/dashboard/reports')} className="text-sm font-medium text-blue-600 hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {reportLinks.map(report => (
                    <button onClick={() => router.push(report.href)} key={report.title} className="bg-white border border-slate-200/80 p-2 rounded-lg flex justify-between items-center hover:bg-slate-50 group text-left w-full">
                        <span className="font-semibold text-sm text-slate-700">{report.title}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                    </button>
                ))}
            </div>
        </div>
    );
};

const WidgetItem: FC<WidgetItemProps> = ({ title, value, subtitle }) => (
    <li className="flex justify-between items-center py-2 px-3 border-b border-slate-200/80">
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            {value && <p className="text-base font-bold text-slate-800">{value}</p>}
            {subtitle && <p className="text-sm font-bold text-slate-800">{subtitle}</p>}
        </div>
    </li>
);

const WidgetPanel: FC<{ data: DashboardData | null; loading: boolean }> = ({ data, loading }) => {
    const widgets = [
        { title: "Today's Sales", value: formatCurrency(data?.todaySales ?? 0) },
        { title: "Today's Purchases", value: formatCurrency(data?.todayPurchases ?? 0) },
        { title: "Total Purchases", value: formatCurrency(data?.totalPurchases ?? 0) },
        { title: "Stock Value", value: formatCurrency(data?.stockValue ?? 0) },
        { title: "Total Bank Balance", value: formatCurrency(data?.totalBankBalance ?? 0) },
        { title: "Low Stock Items", value: "", subtitle: `${data?.lowStockItems?.length ?? 0} items low on stock` },
    ];

    return (
        <div className="bg-white border border-slate-200/80 rounded-xl flex flex-col flex-grow overflow-hidden">
            <div className="px-3 py-2.5 border-b border-slate-200/80 flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                <h3 className="text-[15px] font-bold text-slate-800">Business Overview</h3>
            </div>
            {loading ? (
                <div className="flex items-center justify-center flex-grow p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
            ) : (
                <ul className="flex-grow overflow-y-auto thin-scrollbar">
                    {widgets.map(item => <WidgetItem key={item.title} {...item} />)}

                    {/* Low stock details */}
                    {(data?.lowStockItems?.length ?? 0) > 0 && (
                        <li className="px-3 py-2">
                            <div className="space-y-1">
                                {data!.lowStockItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <AlertTriangle className="h-3 w-3 text-orange-500 shrink-0" />
                                        <span className="text-slate-700 font-medium">{item.name}</span>
                                        <span className="ml-auto text-slate-500">{item.currentQuantity}/{item.minStock}</span>
                                    </div>
                                ))}
                            </div>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

// --- Main Dashboard ---

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardSummary()
            .then(setData)
            .catch(err => console.error('Dashboard fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    const orders: Order[] = (data?.orders || []).map(o => ({
        id: o.id,
        name: o.name,
        items: o.items,
        amount: o.amount,
        status: (o.status === 'Delivered' ? 'Delivered' : o.status === 'Estimate' ? 'Estimate' : 'Open') as Order['status'],
    }));

    const receivableSub = data
        ? data.receivablePartyCount > 0
            ? `From ${data.receivablePartyCount} ${data.receivablePartyCount === 1 ? 'Party' : 'Parties'}`
            : 'You have no receivables.'
        : '';

    const payableSub = data
        ? data.payablePartyCount > 0
            ? `To ${data.payablePartyCount} ${data.payablePartyCount === 1 ? 'Party' : 'Parties'}`
            : 'You have no payables.'
        : '';

    return (
        <div className="bg-slate-50 min-h-screen p-2 box-border">
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[calc(100vh-1rem)]">
                <div className="lg:col-span-2 flex flex-col gap-2">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl border border-slate-200/80">
                        <StatCard
                            title="Total Receivable"
                            amount={formatCurrency(data?.totalReceivable ?? 0)}
                            subtitle={receivableSub}
                            icon={ArrowDown}
                            iconBgColor="bg-green-100"
                            iconTextColor="text-green-600"
                            hasBorder={true}
                            loading={loading}
                        />
                        <StatCard
                            title="Total Payable"
                            amount={formatCurrency(data?.totalPayable ?? 0)}
                            subtitle={payableSub}
                            icon={ArrowUp}
                            iconBgColor="bg-red-100"
                            iconTextColor="text-red-600"
                            hasBorder={false}
                            loading={loading}
                        />
                    </div>

                    {/* Orders + Todo */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 flex-grow min-h-0">
                        <OrderCard orders={orders} loading={loading} />
                        <TodoCard />
                    </div>

                    {/* Reports */}
                    <ReportsCard />
                </div>

                {/* Right Sidebar - Widget Panel */}
                <div className="lg:col-span-1 flex flex-col gap-2">
                    <WidgetPanel data={data} loading={loading} />
                </div>
            </main>
        </div>
    );
}
