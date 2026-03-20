"use client";

import { useState, useEffect, useMemo } from 'react';
import { X, Search, Loader2, Info } from 'lucide-react';
import { fetchInactiveItemData, bulkMarkActive } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BulkItem {
    _id: string;
    name: string;
    quantity: number;
}

interface BulkActiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const BulkActiveModal = ({ isOpen, onClose, onSuccess }: BulkActiveModalProps) => {
    const [items, setItems] = useState<BulkItem[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setSelected(new Set());
        setSearch('');
        setIsLoading(true);
        fetchInactiveItemData()
            .then(data => setItems(data))
            .catch(() => toast({ title: 'Failed to load items', variant: 'destructive' }))
            .finally(() => setIsLoading(false));
    }, [isOpen]);

    const filtered = useMemo(() =>
        items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())),
        [items, search]
    );

    const allSelected = filtered.length > 0 && filtered.every(i => selected.has(i._id));

    const toggleAll = () => {
        if (allSelected) {
            setSelected(prev => {
                const next = new Set(prev);
                filtered.forEach(i => next.delete(i._id));
                return next;
            });
        } else {
            setSelected(prev => {
                const next = new Set(prev);
                filtered.forEach(i => next.add(i._id));
                return next;
            });
        }
    };

    const toggle = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleMarkActive = async () => {
        if (selected.size === 0) {
            toast({ title: 'Please select at least one item', variant: 'destructive' });
            return;
        }
        setIsSaving(true);
        try {
            await bulkMarkActive(Array.from(selected));
            toast({ title: `${selected.size} item(s) marked as active`, className: 'bg-green-500 text-white' });
            onSuccess?.();
            onClose();
        } catch {
            toast({ title: 'Failed to mark items active', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Bulk Active</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={22} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-3 border-b">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search items..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="animate-spin text-blue-600" size={28} />
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Item Name</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 text-gray-400">No inactive items found</td>
                                    </tr>
                                ) : (
                                    filtered.map(item => (
                                        <tr key={item._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggle(item._id)}>
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(item._id)}
                                                    onChange={() => toggle(item._id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                            <td className="px-4 py-3 text-right text-green-600 font-semibold">{item.quantity}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl">
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                        <Info size={13} />
                        Showing only inactive items
                    </span>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleMarkActive}
                            disabled={isSaving || selected.size === 0}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Mark as Active {selected.size > 0 ? `(${selected.size})` : ''}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkActiveModal;
