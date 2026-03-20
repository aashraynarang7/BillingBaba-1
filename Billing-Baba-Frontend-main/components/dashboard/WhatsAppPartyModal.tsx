"use client";

import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, Loader2, LogOut, RefreshCw, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connectWhatsApp, getWhatsAppQR, getWhatsAppStatus, logoutWhatsApp, sendWhatsAppMessage } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    partyName?: string;
    partyPhone?: string;
    /** If provided, after connecting the modal will offer to send this message */
    paymentMessage?: string;
}

type Step = 'phone' | 'qr' | 'connected';
type WaStatus = 'DISCONNECTED' | 'INITIALIZING' | 'QR_PENDING' | 'CONNECTED' | 'ERROR';

export default function WhatsAppPartyModal({ isOpen, onClose, partyName, partyPhone, paymentMessage }: Props) {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [waStatus, setWaStatus] = useState<WaStatus>('DISCONNECTED');
    const [statusMsg, setStatusMsg] = useState('');
    const [qr, setQR] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const stopPolling = () => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };

    const poll = async () => {
        try {
            const s = await getWhatsAppStatus();
            setWaStatus(s.status);
            setStatusMsg(s.message || '');
            if (s.status === 'QR_PENDING') {
                const data = await getWhatsAppQR();
                if (data?.qr) setQR(data.qr);
            } else if (s.status === 'CONNECTED') {
                setQR(null);
                stopPolling();
                setStep('connected');
            } else if (s.status === 'ERROR') {
                stopPolling();
            }
        } catch { /* ignore */ }
    };

    // On open: pre-fill phone + build message, check current WA status
    useEffect(() => {
        if (!isOpen) { stopPolling(); return; }

        setPhone(partyPhone || '');
        const companyName = typeof window !== 'undefined' ? (localStorage.getItem('activeCompanyName') || 'BillingBaba') : 'BillingBaba';
        setMessage(paymentMessage || `Dear Customer,\nThis is a gentle reminder regarding your outstanding payment.\nIf you have already made the payment, kindly ignore this message.\n-\nThank You,\n${companyName}`);

        getWhatsAppStatus().then(s => {
            setWaStatus(s.status);
            setStatusMsg(s.message || '');
            if (s.status === 'CONNECTED') {
                setStep('connected');
            } else if (s.status === 'QR_PENDING' || s.status === 'INITIALIZING') {
                setStep('qr');
                pollRef.current = setInterval(poll, 2000);
            } else {
                setStep('phone');
            }
        });

        return () => stopPolling();
    }, [isOpen]);

    const handleProceedToQR = async () => {
        if (!phone.trim()) {
            toast({ title: 'Please enter a phone number', variant: 'destructive' });
            return;
        }
        setIsConnecting(true);
        setStep('qr');
        try {
            await connectWhatsApp();
            pollRef.current = setInterval(poll, 2000);
        } catch {
            toast({ title: 'Failed to start WhatsApp', variant: 'destructive' });
            setStep('phone');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleSend = async () => {
        if (!phone.trim()) {
            toast({ title: 'Phone number is required', variant: 'destructive' });
            return;
        }
        setIsSending(true);
        try {
            await sendWhatsAppMessage(phone.trim(), message);
            toast({ title: 'WhatsApp message sent!', className: 'bg-green-600 text-white' });
            onClose();
        } catch (e: any) {
            toast({ title: e.message || 'Failed to send', variant: 'destructive' });
        } finally {
            setIsSending(false);
        }
    };

    const handleLogout = async () => {
        stopPolling();
        await logoutWhatsApp().catch(() => {});
        setWaStatus('DISCONNECTED');
        setQR(null);
        setStep('phone');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-green-50">
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.85a10.85 10.85 0 0 1-5.54-1.52l-.4-.24-4.1 1.06 1.08-3.94-.26-.41A10.85 10.85 0 1 1 16 26.85zm5.95-8.13c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.71.08-.33-.16-1.4-.52-2.66-1.65-.98-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.5.14-.67.15-.15.33-.38.5-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.38s-1.12 1.1-1.12 2.67 1.15 3.1 1.31 3.31c.16.22 2.27 3.46 5.5 4.85.77.33 1.37.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.93-.79 2.2-1.55.27-.76.27-1.4.19-1.55-.08-.14-.3-.22-.62-.38z" />
                        </svg>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">WhatsApp</h2>
                            {partyName && <p className="text-xs text-gray-500">{partyName}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-1 px-5 pt-3 pb-1">
                    {['phone', 'qr', 'connected'].map((s, i) => (
                        <div key={s} className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full transition-colors ${step === s ? 'bg-green-500' : ((['phone','qr','connected'].indexOf(step) > i) ? 'bg-green-300' : 'bg-gray-200')}`} />
                            {i < 2 && <div className="h-px w-6 bg-gray-200" />}
                        </div>
                    ))}
                    <span className="ml-2 text-xs text-gray-400">
                        {step === 'phone' ? 'Step 1: Enter Number' : step === 'qr' ? 'Step 2: Scan QR' : 'Connected'}
                    </span>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex flex-col gap-4 min-h-[280px]">

                    {/* ── Step 1: Phone ── */}
                    {step === 'phone' && (
                        <>
                            <p className="text-sm text-gray-600">Enter the party's WhatsApp number to send a payment reminder.</p>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="Party Number (e.g. 9876543210)"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Message</label>
                                <textarea
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                        </>
                    )}

                    {/* ── Step 2: QR ── */}
                    {step === 'qr' && (
                        <div className="flex flex-col items-center gap-3 py-2">
                            {waStatus === 'ERROR' ? (
                                <>
                                    <div className="w-48 h-48 flex flex-col items-center justify-center border rounded-lg bg-red-50 gap-3">
                                        <span className="text-3xl">⚠️</span>
                                        <p className="text-xs text-red-600 text-center px-3">{statusMsg || 'Failed to start WhatsApp'}</p>
                                    </div>
                                    <button
                                        onClick={() => { setStep('phone'); setWaStatus('DISCONNECTED'); setQR(null); }}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Try again
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-700 text-center">
                                        {waStatus === 'INITIALIZING'
                                            ? 'Starting WhatsApp browser...'
                                            : 'Scan this QR code with your WhatsApp to link your account'}
                                    </p>
                                    {qr && waStatus === 'QR_PENDING' ? (
                                        <img src={qr} alt="WhatsApp QR" className="w-48 h-48 rounded-lg border border-gray-200 shadow" />
                                    ) : (
                                        <div className="w-48 h-48 flex flex-col items-center justify-center border rounded-lg bg-gray-50 gap-2">
                                            <Loader2 className="animate-spin text-green-500 h-10 w-10" />
                                            {statusMsg && (
                                                <p className="text-xs text-gray-500 text-center px-3">{statusMsg}</p>
                                            )}
                                        </div>
                                    )}
                                    {waStatus === 'QR_PENDING' && (
                                        <>
                                            <p className="text-xs text-gray-400 text-center">
                                                WhatsApp → Linked Devices → Link a Device
                                            </p>
                                            <button onClick={poll} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                                <RefreshCw size={11} /> Refresh QR
                                            </button>
                                        </>
                                    )}
                                    {waStatus === 'INITIALIZING' && (
                                        <p className="text-xs text-gray-400 text-center">
                                            This may take 30–60 seconds on first launch
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Step 3: Connected ── */}
                    {step === 'connected' && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <CheckCircle2 className="h-14 w-14 text-green-500" />
                            <p className="text-base font-semibold text-gray-800">WhatsApp Connected!</p>
                            <p className="text-xs text-gray-500 text-center">
                                Sending to: <span className="font-semibold text-gray-700">{phone || 'N/A'}</span>
                            </p>
                            <div className="w-full">
                                <label className="text-xs text-gray-500 mb-1 block">Message</label>
                                <textarea
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t bg-gray-50 flex items-center justify-between gap-3">
                    {step === 'connected' && (
                        <button onClick={handleLogout} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                            <LogOut size={12} /> Disconnect
                        </button>
                    )}
                    {step !== 'connected' && <div />}

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>

                        {step === 'phone' && (
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                                onClick={handleProceedToQR}
                                disabled={isConnecting}
                            >
                                {isConnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                                {isConnecting ? 'Starting...' : 'Connect WhatsApp'}
                            </Button>
                        )}

                        {step === 'qr' && (
                            <Button size="sm" variant="outline" disabled className="text-gray-500 gap-1.5">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-green-500" /> Waiting for scan...
                            </Button>
                        )}

                        {step === 'connected' && (
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                                onClick={handleSend}
                                disabled={isSending}
                            >
                                {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                                    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5 fill-white"><path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" /></svg>
                                )}
                                Send Message
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
