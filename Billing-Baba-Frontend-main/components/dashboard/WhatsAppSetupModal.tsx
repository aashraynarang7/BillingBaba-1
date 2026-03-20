"use client";

import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, Loader2, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connectWhatsApp, getWhatsAppQR, getWhatsAppStatus, logoutWhatsApp } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type WaStatus = 'DISCONNECTED' | 'INITIALIZING' | 'QR_PENDING' | 'CONNECTED' | 'ERROR';

export default function WhatsAppSetupModal({ isOpen, onClose }: Props) {
    const [status, setStatus] = useState<WaStatus>('DISCONNECTED');
    const [statusMsg, setStatusMsg] = useState('');
    const [qr, setQR] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const stopPolling = () => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };

    const poll = async () => {
        try {
            const s = await getWhatsAppStatus();
            setStatus(s.status);
            setStatusMsg(s.message || '');
            if (s.status === 'QR_PENDING') {
                const data = await getWhatsAppQR();
                if (data?.qr) setQR(data.qr);
            } else if (s.status === 'CONNECTED') {
                setQR(null);
                stopPolling();
            } else if (s.status === 'ERROR') {
                stopPolling();
            }
        } catch { /* ignore */ }
    };

    const startConnect = async () => {
        setIsConnecting(true);
        try {
            await connectWhatsApp();
            pollRef.current = setInterval(poll, 2000);
        } catch {
            toast({ title: 'Failed to start WhatsApp', variant: 'destructive' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleLogout = async () => {
        stopPolling();
        try {
            await logoutWhatsApp();
            setStatus('DISCONNECTED');
            setQR(null);
            toast({ title: 'WhatsApp disconnected' });
        } catch {
            toast({ title: 'Failed to disconnect', variant: 'destructive' });
        }
    };

    // On open: check current status
    useEffect(() => {
        if (!isOpen) { stopPolling(); return; }
        getWhatsAppStatus().then(s => {
            setStatus(s.status);
            if (s.status === 'QR_PENDING') {
                // already waiting for scan — resume polling
                pollRef.current = setInterval(poll, 2000);
            }
        });
        return () => stopPolling();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        {/* WhatsApp green icon */}
                        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.85a10.85 10.85 0 0 1-5.54-1.52l-.4-.24-4.1 1.06 1.08-3.94-.26-.41A10.85 10.85 0 1 1 16 26.85zm5.95-8.13c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.71.08-.33-.16-1.4-.52-2.66-1.65-.98-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.5.14-.67.15-.15.33-.38.5-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.38s-1.12 1.1-1.12 2.67 1.15 3.1 1.31 3.31c.16.22 2.27 3.46 5.5 4.85.77.33 1.37.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.93-.79 2.2-1.55.27-.76.27-1.4.19-1.55-.08-.14-.3-.22-.62-.38z" />
                        </svg>
                        <h2 className="text-lg font-bold text-gray-800">WhatsApp Setup</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 flex flex-col items-center gap-4 min-h-[260px] justify-center">
                    {status === 'CONNECTED' && (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <p className="text-lg font-semibold text-gray-800">WhatsApp Connected!</p>
                            <p className="text-sm text-gray-500 text-center">Messages will be sent directly from your WhatsApp account.</p>
                            <Button
                                variant="outline"
                                className="mt-2 gap-2 text-red-600 border-red-300 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" /> Disconnect
                            </Button>
                        </>
                    )}

                    {(status === 'INITIALIZING' || status === 'QR_PENDING') && (
                        <>
                            <p className="text-sm font-medium text-gray-700 text-center">
                                {status === 'INITIALIZING'
                                    ? 'Starting WhatsApp browser...'
                                    : 'Scan this QR code with your WhatsApp to link your account'}
                            </p>
                            {qr && status === 'QR_PENDING' ? (
                                <img src={qr} alt="WhatsApp QR" className="w-52 h-52 rounded-lg border border-gray-200 shadow-sm" />
                            ) : (
                                <div className="w-52 h-52 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin text-green-500 h-10 w-10" />
                                    {statusMsg && <p className="text-xs text-gray-500 text-center px-4">{statusMsg}</p>}
                                </div>
                            )}
                            {status === 'INITIALIZING' && (
                                <p className="text-xs text-gray-400 text-center">This may take 30–60 seconds on first launch</p>
                            )}
                            {status === 'QR_PENDING' && (
                                <p className="text-xs text-gray-400 text-center">
                                    Open WhatsApp → Linked Devices → Link a Device
                                </p>
                            )}
                        </>
                    )}

                    {status === 'ERROR' && (
                        <>
                            <span className="text-5xl">⚠️</span>
                            <p className="text-base font-semibold text-red-600">Failed to start</p>
                            <p className="text-xs text-gray-500 text-center">{statusMsg || 'WhatsApp client failed to initialize'}</p>
                            <Button variant="outline" onClick={startConnect} className="mt-1">Retry</Button>
                        </>
                    )}

                    {status === 'DISCONNECTED' && (
                        <>
                            <svg viewBox="0 0 32 32" className="h-16 w-16 fill-green-400" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.72A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.85a10.85 10.85 0 0 1-5.54-1.52l-.4-.24-4.1 1.06 1.08-3.94-.26-.41A10.85 10.85 0 1 1 16 26.85zm5.95-8.13c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.71.08-.33-.16-1.4-.52-2.66-1.65-.98-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.5.14-.67.15-.15.33-.38.5-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.38s-1.12 1.1-1.12 2.67 1.15 3.1 1.31 3.31c.16.22 2.27 3.46 5.5 4.85.77.33 1.37.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.93-.79 2.2-1.55.27-.76.27-1.4.19-1.55-.08-.14-.3-.22-.62-.38z" />
                            </svg>
                            <p className="text-base font-semibold text-gray-700 text-center">Link your WhatsApp</p>
                            <p className="text-sm text-gray-500 text-center">
                                Connect your WhatsApp to send payment reminders directly from BillingBaba.
                            </p>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8 mt-1"
                                onClick={startConnect}
                                disabled={isConnecting}
                            >
                                {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {isConnecting ? 'Starting...' : 'Connect WhatsApp'}
                            </Button>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        status === 'CONNECTED' ? 'bg-green-100 text-green-700' :
                        status === 'QR_PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        status === 'INITIALIZING' ? 'bg-blue-100 text-blue-700' :
                        status === 'ERROR' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                        {status === 'CONNECTED' ? 'Connected' :
                         status === 'QR_PENDING' ? 'Waiting for scan...' :
                         status === 'INITIALIZING' ? 'Initializing...' :
                         status === 'ERROR' ? 'Error' : 'Disconnected'}
                    </span>
                    {status === 'QR_PENDING' && (
                        <button onClick={poll} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                            <RefreshCw size={12} /> Refresh QR
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
