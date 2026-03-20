"use client";

import { useEffect, useMemo, useState } from 'react';
import { X, Search, Loader2, CheckCircle2, XCircle, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchParties } from '@/lib/api';
import { getWhatsAppStatus, sendWhatsAppBulk } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface PartyRow {
    _id: string;
    name: string;
    phone: string;
    balance: number;
    message: string;
}

type SendResult = { partyName: string; phone: string; success: boolean; error?: string };

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function BulkWhatsAppModal({ isOpen, onClose }: Props) {
    const [rows, setRows] = useState<PartyRow[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [results, setResults] = useState<SendResult[] | null>(null);
    const [waConnected, setWaConnected] = useState(false);

    const companyName = typeof window !== 'undefined'
        ? (localStorage.getItem('activeCompanyName') || 'BillingBaba') : 'BillingBaba';

    useEffect(() => {
        if (!isOpen) return;
        setResults(null);
        setSearch('');
        setSelected(new Set());
        setIsLoading(true);

        Promise.all([
            fetchParties(),
            getWhatsAppStatus(),
        ]).then(([parties, waStatus]) => {
            setWaConnected(waStatus.status === 'CONNECTED');
            const mapped: PartyRow[] = parties
                .filter((p: any) => p.phone && p.currentBalance > 0)
                .map((p: any) => ({
                    _id: p._id,
                    name: p.name,
                    phone: p.phone,
                    balance: p.currentBalance,
                    message: `Dear Customer,\nThis is a gentle reminder regarding your payment of ₹${Number(p.currentBalance).toLocaleString('en-IN')} pending with us.\nIf you have already made the payment, kindly ignore this message.\n-\nThank You,\n${companyName}`,
                }));
            setRows(mapped);
        }).catch(() => {
            toast({ title: 'Failed to load parties', variant: 'destructive' });
        }).finally(() => setIsLoading(false));
    }, [isOpen]);

    const filtered = useMemo(() =>
        rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search)),
        [rows, search]
    );

    const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r._id));

    const toggleAll = () => {
        if (allSelected) {
            setSelected(prev => {
                const next = new Set(prev);
                filtered.forEach(r => next.delete(r._id));
                return next;
            });
        } else {
            setSelected(prev => {
                const next = new Set(prev);
                filtered.forEach(r => next.add(r._id));
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

    const updateMessage = (id: string, msg: string) => {
        setRows(prev => prev.map(r => r._id === id ? { ...r, message: msg } : r));
    };

    const handleSend = async () => {
        if (!waConnected) {
            toast({ title: 'WhatsApp not connected. Please connect first.', variant: 'destructive' });
            return;
        }
        const toSend = rows.filter(r => selected.has(r._id));
        if (toSend.length === 0) return;

        setIsSending(true);
        try {
            const { results: res } = await sendWhatsAppBulk(
                toSend.map(r => ({ phone: r.phone, message: r.message, partyName: r.name }))
            );
            setResults(res);
            const sent = res.filter((r: SendResult) => r.success).length;
            const failed = res.filter((r: SendResult) => !r.success).length;
            toast({
                title: `${sent} sent${failed > 0 ? `, ${failed} failed` : ''}`,
                className: sent > 0 ? 'bg-green-600 text-white' : undefined,
                variant: failed > 0 && sent === 0 ? 'destructive' : undefined,
            });
        } catch (e: any) {
            toast({ title: e.message || 'Failed to send', variant: 'destructive' });
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[88vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-green-50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.85a10.85 10.85 0 0 1-5.54-1.52l-.4-.24-4.1 1.06 1.08-3.94-.26-.41A10.85 10.85 0 1 1 16 26.85zm5.95-8.13c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.71.08-.33-.16-1.4-.52-2.66-1.65-.98-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.5.14-.67.15-.15.33-.38.5-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.38s-1.12 1.1-1.12 2.67 1.15 3.1 1.31 3.31c.16.22 2.27 3.46 5.5 4.85.77.33 1.37.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.93-.79 2.2-1.55.27-.76.27-1.4.19-1.55-.08-.14-.3-.22-.62-.38z" />
                        </svg>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">Bulk WhatsApp Reminders</h2>
                            <p className="text-xs text-gray-500">Send personalized payment reminders to multiple parties</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>

                {/* Status bar */}
                <div className="px-6 py-2 border-b flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${waConnected ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {waConnected ? '● WhatsApp Connected' : '● WhatsApp Not Connected'}
                    </span>
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search party..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 w-48"
                        />
                    </div>
                </div>

                {/* Results view */}
                {results ? (
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Send Results</h3>
                        <div className="flex flex-col gap-2">
                            {results.map((r, i) => (
                                <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-lg border ${r.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center gap-2">
                                        {r.success
                                            ? <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            : <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                        }
                                        <span className="text-sm font-medium text-gray-800">{r.partyName}</span>
                                        <span className="text-xs text-gray-500 flex items-center gap-0.5"><Phone size={11} />{r.phone}</span>
                                    </div>
                                    <span className={`text-xs font-semibold ${r.success ? 'text-green-700' : 'text-red-600'}`}>
                                        {r.success ? 'Sent' : r.error || 'Failed'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Party list */
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="animate-spin text-green-500 h-8 w-8" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                                <MessageCircle size={32} />
                                <p className="text-sm">No parties with outstanding balance and phone number</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0 border-b">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left w-10">
                                            <input type="checkbox" checked={allSelected} onChange={toggleAll}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                        </th>
                                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Party</th>
                                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Phone</th>
                                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Balance</th>
                                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600 w-40">Message Preview</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map(row => (
                                        <tr key={row._id}
                                            className={`hover:bg-gray-50 cursor-pointer ${selected.has(row._id) ? 'bg-green-50' : ''}`}
                                            onClick={() => toggle(row._id)}
                                        >
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <input type="checkbox" checked={selected.has(row._id)}
                                                    onChange={() => toggle(row._id)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{row.phone}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-red-600">
                                                ₹{row.balance.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <textarea
                                                    rows={2}
                                                    value={row.message}
                                                    onChange={e => updateMessage(row._id, e.target.value)}
                                                    className="w-full text-xs border border-gray-200 rounded p-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 py-3 border-t bg-gray-50 rounded-b-2xl flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {results
                            ? `${results.filter(r => r.success).length} / ${results.length} sent`
                            : `${selected.size} of ${filtered.length} selected`}
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onClose}>
                            {results ? 'Close' : 'Cancel'}
                        </Button>
                        {!results && (
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                                onClick={handleSend}
                                disabled={isSending || selected.size === 0 || !waConnected}
                            >
                                {isSending
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending...</>
                                    : <><svg viewBox="0 0 32 32" className="h-3.5 w-3.5 fill-white"><path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" /></svg>
                                      Send to {selected.size} {selected.size === 1 ? 'party' : 'parties'}</>
                                }
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
