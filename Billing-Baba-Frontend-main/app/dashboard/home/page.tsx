"use client"

import React, { useState, FC, ComponentType } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Plus, Square, CheckSquare, PlusCircle, X, LucideProps, ListOrdered, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order { id: number; name: string; items: number; amount: number; status: 'Open' | 'Delivered' | 'Estimate'; }
interface Todo { id: number; text: string; done: boolean; }
interface StatCardProps { title: string; amount: string; subtitle: string; icon: ComponentType<LucideProps>; iconBgColor: string; iconTextColor: string; hasBorder: boolean; }
interface ReportLink { title: string; }
interface WidgetItemProps { title: string; value: string; subtitle?: string; }
interface WidgetSelectionPanelProps { onClose: () => void; }

const initialOrders: Order[] = [
    { id: 1, name: 'Naitik Shah', items: 17, amount: 4500, status: 'Open' },
    { id: 2, name: 'Rohit Bhatt', items: 5, amount: 1200, status: 'Delivered' },
    { id: 3, name: 'Ayush Sharma', items: 8, amount: 2300, status: 'Estimate' },
    { id: 4, name: 'Priya Mehta', items: 12, amount: 3100, status: 'Delivered' },
];

const initialTodos: Todo[] = [
    { id: 1, text: 'Call xyz regarding payment', done: false },
    { id: 2, text: 'Buy packaging material', done: true },
    { id: 3, text: 'Pay electricity bill', done: false },
    { id: 4, text: 'Finalize monthly report', done: false },
];

const reportLinks: ReportLink[] = [
    { title: "Sale Report" }, { title: "All Transactions" }, { title: "Daybook Report" }, { title: "Party Statement" },
];

const widgetListData = [
    { title: "Purchases", value: "₹ 0" },
    { title: "Expenses", value: "₹ 0" },
    { title: "Stock Value", value: "₹ 9,700" },
    { title: "Cash In Hand", value: "₹ 48,200" },
    { title: "Total Bank Balance", value: "₹ 2,000" },
    { title: "Low Stocks Items", value: "", subtitle: "View Items Low on Stock" },
];

const StatCard: FC<StatCardProps> = ({ title, amount, subtitle, icon: Icon, iconBgColor, iconTextColor, hasBorder }) => (
    <div className={`p-3 ${hasBorder ? 'md:border-r md:border-slate-200/90' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{amount}</p>
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
            <div className={`p-1.5 rounded-full ${iconBgColor}`}>
                <Icon className={`h-4 w-4 ${iconTextColor}`} />
            </div>
        </div>
    </div>
);

const OrderCard: FC = () => {
    const getStatusChip = (status: Order['status']) => {
        const styles = {
            Open: 'bg-blue-100 text-blue-700',
            Delivered: 'bg-green-100 text-green-700',
            Estimate: 'bg-yellow-100 text-yellow-700',
        };
        return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-1.5 flex-shrink-0 border-b border-slate-100 pb-1.5">
                <div className="bg-blue-50 p-1.5 rounded-lg">
                    <ListOrdered className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800">Offline / Online Orders</h3>
            </div>
            <div className="flex-grow overflow-y-auto thin-scrollbar -mr-1 pr-1">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-2 py-1.5">Customer</th>
                            <th scope="col" className="px-2 py-1.5 text-right">Amount</th>
                            <th scope="col" className="px-2 py-1.5 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialOrders.map(order => (
                            <tr key={order.id} className="border-b border-slate-200/60 hover:bg-slate-50/70">
                                <td className="px-2 py-1.5 font-semibold text-slate-800 text-sm whitespace-nowrap">{order.name}</td>
                                <td className="px-2 py-1.5 text-right font-medium text-sm">₹{order.amount.toLocaleString()}</td>
                                <td className="px-2 py-1.5 text-center">{getStatusChip(order.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TodoCard: FC = () => {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const toggleTodo = (id: number) => {
        setTodos(currentTodos => currentTodos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
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
                <button className="p-1 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"><PlusCircle className="h-5 w-5" /></button>
            </div>
            <div className="flex-grow overflow-y-auto thin-scrollbar -mr-1.5 pr-1.5">
                <ul className="space-y-0.5">
                    {todos.map((todo) => (
                        <li key={todo.id} onClick={() => toggleTodo(todo.id)} className="flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-blue-50">
                             <AnimatePresence mode="wait">
                                <motion.div key={todo.done ? 'checked' : 'unchecked'} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    {todo.done ? <CheckSquare className="h-4 w-4 text-green-500 flex-shrink-0" /> : <Square className="h-4 w-4 text-slate-300 flex-shrink-0" />}
                                </motion.div>
                            </AnimatePresence>
                            <span className={`flex-grow font-medium text-sm transition-colors ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{todo.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ReportsCard: FC = () => (
    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-[15px] font-semibold text-slate-800">Most Used Reports</h3>
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {reportLinks.map(report => (
                <a href="#" key={report.title} className="bg-white border border-slate-200/80 p-2 rounded-lg flex justify-between items-center hover:bg-slate-50 group">
                    <span className="font-semibold text-sm text-slate-700">{report.title}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                </a>
            ))}
        </div>
    </div>
);

const EmptyState: FC = () => (
    <div className="bg-white border border-slate-200/80 p-2 rounded-xl text-center flex flex-col items-center justify-center flex-grow">
        <div className="relative">
            <div className="absolute -inset-6 bg-blue-200/30 rounded-full blur-2xl"></div>
            <img src="/dashboard/people-using-mobile-bank-remittance-money.png" alt="Shop Illustration" className="relative w-24 h-24" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mt-1 relative">Empty Here!</h3>
        <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto relative">Add widgets to get started.</p>
    </div>
);

const WidgetItem: FC<WidgetItemProps> = ({ title, value, subtitle }) => (
    <li className="flex justify-between items-center py-2 px-3 border-b border-slate-200/80">
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            {value && <p className="text-base font-bold text-slate-800">{value}</p>}
            {subtitle && <p className="text-sm font-bold text-slate-800">{subtitle}</p>}
        </div>
        <button className="text-blue-500 hover:text-blue-700"><Plus className="h-5 w-5" /></button>
    </li>
);

const WidgetSelectionPanel: FC<WidgetSelectionPanelProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute inset-0 bg-white z-50 rounded-xl border border-slate-300 shadow-2xl flex flex-col">
            <ul className="flex-grow overflow-y-auto thin-scrollbar">
                {widgetListData.map(item => <WidgetItem key={item.title} {...item} />)}
            </ul>
            <div className="flex-shrink-0 flex justify-between items-center p-3 bg-slate-50/70 border-t border-slate-200/80">
                <span className="font-semibold text-slate-600 text-sm">Add Widget of Your Choice</span>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800"> <X className="h-5 w-5" /> </button>
            </div>
        </motion.div>
    );
};

export default function Dashboard() {
    const [isWidgetPanelOpen, setWidgetPanelOpen] = useState(false);

    return (
        <div className="bg-slate-50 min-h-screen p-2 box-border">
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[calc(100vh-1rem)]">
                <div className="lg:col-span-2 flex flex-col gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl border border-slate-200/80">
                        <StatCard title="Total Receivable" amount="₹ 0" subtitle="You have no receivables." icon={ArrowDown} iconBgColor="bg-green-100" iconTextColor="text-green-600" hasBorder={true} />
                        <StatCard title="Total Payable" amount="₹ 7,900" subtitle="From 1 Party" icon={ArrowUp} iconBgColor="bg-red-100" iconTextColor="text-red-600" hasBorder={false} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 flex-grow min-h-0">
                        <OrderCard />
                        <TodoCard />
                    </div>
                    <ReportsCard />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-2 relative">
                    <EmptyState />
                    <button onClick={() => setWidgetPanelOpen(true)} className="bg-white border border-slate-200/80 p-2.5 rounded-xl transition-all hover:border-slate-300 hover:shadow-sm flex justify-between items-center group flex-shrink-0">
                        <span className="font-semibold text-slate-600 text-sm">Add Widget of Your Choice</span>
                        <div className="bg-slate-100 p-1.5 rounded-lg group-hover:bg-blue-600">
                            <Plus className="h-4 w-4 text-slate-600 group-hover:text-white" />
                        </div>
                    </button>
                    <AnimatePresence>
                        {isWidgetPanelOpen && (
                            <WidgetSelectionPanel onClose={() => setWidgetPanelOpen(false)} />
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}