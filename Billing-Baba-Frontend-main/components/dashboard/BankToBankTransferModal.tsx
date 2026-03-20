"use client";

import { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBankTransfer } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface BankAccount {
    _id: string;
    accountName: string;
    currentBalance: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    accounts: BankAccount[];
    defaultFromAccount?: string;
    onSuccess?: () => void;
}

export default function BankToBankTransferModal({ isOpen, onClose, accounts, defaultFromAccount, onSuccess }: Props) {
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFromAccount(defaultFromAccount || (accounts[0]?.accountName ?? ''));
            setToAccount('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
        }
    }, [isOpen, defaultFromAccount, accounts]);

    if (!isOpen) return null;

    const companyId = typeof window !== 'undefined' ? (localStorage.getItem('activeCompanyId') || '') : '';

    const handleSave = async () => {
        if (!fromAccount || !toAccount) {
            toast({ title: 'Please select both accounts', variant: 'destructive' });
            return;
        }
        if (fromAccount === toAccount) {
            toast({ title: 'From and To accounts must be different', variant: 'destructive' });
            return;
        }
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) {
            toast({ title: 'Enter a valid amount', variant: 'destructive' });
            return;
        }

        setIsSaving(true);
        try {
            await createBankTransfer({ companyId, fromAccount, toAccount, amount: amt, date, description });
            toast({ title: 'Transfer saved successfully', className: 'bg-green-600 text-white' });
            onSuccess?.();
            onClose();
        } catch (e: any) {
            toast({ title: e.message || 'Failed to save transfer', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const fromAccountObj = accounts.find(a => a.accountName === fromAccount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-800">Bank To Bank Transfer</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {/* From / To row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">From:</label>
                            <div className="relative">
                                <select
                                    value={fromAccount}
                                    onChange={e => setFromAccount(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-8"
                                >
                                    <option value="">Select account</option>
                                    {accounts.map(a => (
                                        <option key={a._id} value={a.accountName}>{a.accountName}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                            </div>
                            {fromAccountObj && (
                                <p className="text-xs text-gray-400 mt-1">Balance: ₹{fromAccountObj.currentBalance?.toFixed(2)}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">To:</label>
                            <div className="relative">
                                <select
                                    value={toAccount}
                                    onChange={e => setToAccount(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-8"
                                >
                                    <option value="">Select account</option>
                                    {accounts.map(a => (
                                        <option key={a._id} value={a.accountName}>{a.accountName}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Amount</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Add description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
