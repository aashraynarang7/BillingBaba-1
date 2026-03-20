"use client";

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, ChevronDown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { adjustStock } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UNITS = ['Pcs', 'Box', 'Kg', 'Gm', 'Ltr', 'Mtr', 'Ft', 'Dozen', 'Pack', 'Set'];
const GODOWNS = ['Main Godown'];

interface AdjustItemProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    itemName: string;
    itemUnit?: string;
    onSuccess?: () => void;
}

const AdjustItem = ({ isOpen, onClose, itemId, itemName, itemUnit, onSuccess }: AdjustItemProps) => {
    const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REDUCE'>('ADD');
    const [date, setDate] = useState<Date>(new Date());
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState(itemUnit || 'Pcs');
    const [price, setPrice] = useState('');
    const [details, setDetails] = useState('');
    const [godown, setGodown] = useState('Main Godown');
    const [isSaving, setIsSaving] = useState(false);

    // Reset form when opened for a new item
    useEffect(() => {
        if (isOpen) {
            setQty('');
            setPrice('');
            setDetails('');
            setAdjustmentType('ADD');
            setDate(new Date());
            setUnit(itemUnit || 'Pcs');
        }
    }, [isOpen, itemId, itemUnit]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!qty || Number(qty) <= 0) {
            toast({ title: 'Please enter a valid quantity', variant: 'destructive' });
            return;
        }
        setIsSaving(true);
        try {
            await adjustStock({
                itemId,
                adjustmentQty: Number(qty),
                type: adjustmentType,
                remarks: details || undefined,
            });
            toast({
                title: `Stock ${adjustmentType === 'ADD' ? 'added' : 'reduced'} successfully`,
                className: 'bg-green-500 text-white',
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            toast({ title: err.message || 'Failed to adjust stock', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-bold text-gray-800">Stock Adjustment</h2>

                        {/* Add / Reduce toggle */}
                        <div className="flex items-center gap-3 text-sm font-semibold">
                            <span
                                className={`cursor-pointer transition-colors ${adjustmentType === 'ADD' ? 'text-blue-600' : 'text-gray-400'}`}
                                onClick={() => setAdjustmentType('ADD')}
                            >
                                Add Stock
                            </span>
                            <button
                                type="button"
                                onClick={() => setAdjustmentType(prev => prev === 'ADD' ? 'REDUCE' : 'ADD')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${adjustmentType === 'ADD' ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${adjustmentType === 'ADD' ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <span
                                className={`cursor-pointer transition-colors ${adjustmentType === 'REDUCE' ? 'text-blue-600' : 'text-gray-400'}`}
                                onClick={() => setAdjustmentType('REDUCE')}
                            >
                                Reduce Stock
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pt-4 pb-2">
                    {/* Item Name + Godown + Date row */}
                    <div className="flex items-end justify-between pb-4 border-b border-gray-200">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Item Name</p>
                            <p className="text-base font-semibold text-gray-900">{itemName}</p>
                        </div>

                        <div className="flex items-end gap-3">
                            {/* Godown */}
                            <div className="relative">
                                <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 font-medium">Godown</label>
                                <Select value={godown} onValueChange={setGodown}>
                                    <SelectTrigger className="w-44 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GODOWNS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Adjustment Date */}
                            <div className="relative">
                                <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 font-medium z-10">Adjustment Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center gap-2 w-40 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <span className="flex-1 text-left">{format(date, 'dd/MM/yyyy')}</span>
                                            <CalendarIcon size={16} className="text-gray-400 flex-shrink-0" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                        <Calendar mode="single" selected={date} onSelect={d => d && setDate(d)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Qty + Unit + Price + Details */}
                    <div className="flex items-center gap-3 mt-5">
                        <Input
                            type="number"
                            placeholder="Total Qty"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                            className="w-36"
                            min={0}
                        />

                        {/* Unit selector */}
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger className="w-24 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="At Price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-36"
                            min={0}
                        />

                        <Input
                            type="text"
                            placeholder="Details"
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 font-semibold"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdjustItem;
