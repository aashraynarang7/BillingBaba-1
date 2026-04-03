"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Camera, Keyboard, Trash2, Plus, Save, Loader2, Check, Search, Usb, Zap, AlertCircle, Smartphone, Copy, RefreshCw } from 'lucide-react';
import { lookupBarcode, createItem } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface ScannedItem {
    id: string;
    barcode: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    imageUrl: string;
    salePrice: number;
    purchasePrice: number;
    unit: string;
    openingQuantity: number;
    found: boolean;
    saved: boolean;
    saving: boolean;
}

interface BarcodeScannerImportProps {
    onBack: () => void;
}

const BarcodeScannerImport: React.FC<BarcodeScannerImportProps> = ({ onBack }) => {
    const [mode, setMode] = useState<'camera' | 'manual' | 'hardware' | 'mobile'>('hardware');
    const [manualCode, setManualCode] = useState('');
    const [items, setItems] = useState<ScannedItem[]>([]);
    const [lookingUp, setLookingUp] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingAll, setSavingAll] = useState(false);
    const [scannerStatus, setScannerStatus] = useState<'waiting' | 'reading' | 'processing'>('waiting');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);

    // ── Mobile session state ─────────────────────────────────────────────
    const [mobileSessionUrl, setMobileSessionUrl] = useState('');
    const [mobileQrDataUrl, setMobileQrDataUrl] = useState('');
    const [mobileSessionLoading, setMobileSessionLoading] = useState(false);
    const [mobileReceived, setMobileReceived] = useState(0);
    const [mobileCopied, setMobileCopied] = useState(false);

    const scannerRef = useRef<any>(null);
    const scannerContainerId = 'barcode-scanner-container';
    const cooldownRef = useRef(false);

    // Use refs for values accessed in callbacks to avoid stale closures
    const itemsRef = useRef<ScannedItem[]>([]);
    useEffect(() => { itemsRef.current = items; }, [items]);

    // ── Barcode Lookup (stable via ref) ──────────────────────────────────

    const handleBarcode = useCallback(async (code: string) => {
        const trimmed = code.trim();
        if (!trimmed) return;

        // Check duplicates using ref (always current)
        if (itemsRef.current.some(i => i.barcode === trimmed)) {
            toast({ title: `Barcode ${trimmed} already scanned` });
            return;
        }

        setLookingUp(true);
        setScannerStatus('processing');
        try {
            const data = await lookupBarcode(trimmed);
            const newItem: ScannedItem = {
                id: `${trimmed}-${Date.now()}`,
                barcode: trimmed,
                name: data.name || '',
                brand: data.brand || '',
                category: data.category || '',
                description: data.description || '',
                imageUrl: data.imageUrl || '',
                salePrice: data.mrp || 0,
                purchasePrice: 0,
                unit: data.unit || 'Pcs',
                openingQuantity: 1,
                found: data.found,
                saved: false,
                saving: false,
            };
            setItems(prev => [newItem, ...prev]);

            if (data.found) {
                toast({ title: `Found: ${data.name}`, className: 'bg-green-500 text-white' });
            } else {
                toast({ title: `Barcode ${trimmed} not in database — fill details manually` });
                setEditingId(newItem.id);
            }
        } catch (err) {
            console.error(err);
            toast({ title: 'Lookup failed — check your connection', variant: 'destructive' });
        } finally {
            setLookingUp(false);
            setScannerStatus('waiting');
        }
    }, []);

    // ── Hardware Scanner Detection (global keydown) ──────────────────────

    const scanBufferRef = useRef('');
    const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            const isManualInput = (e.target as HTMLElement)?.id === 'manual-barcode-input';
            if ((tag === 'INPUT' || tag === 'TEXTAREA') && !isManualInput) return;

            if (e.key === 'Enter') {
                if (scanBufferRef.current.length >= 4) {
                    e.preventDefault();
                    const code = scanBufferRef.current.trim();
                    scanBufferRef.current = '';
                    handleBarcode(code);
                }
                scanBufferRef.current = '';
                if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
                return;
            }

            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                scanBufferRef.current += e.key;
                setScannerStatus('reading');

                if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
                scanTimerRef.current = setTimeout(() => {
                    scanBufferRef.current = '';
                    setScannerStatus('waiting');
                }, 100);
            }
        };

        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [handleBarcode]);

    // ── Camera Scanner ──────────────────────────────────────────────────

    const startScanner = useCallback(async () => {
        if (scannerRef.current) return;
        setCameraError(null);
        setCameraReady(false);

        // Check HTTPS (camera requires secure context in production)
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            setCameraError('Camera requires HTTPS. Please access this page via HTTPS.');
            return;
        }

        // Check if camera API is available
        if (!navigator?.mediaDevices?.getUserMedia) {
            setCameraError('Camera API not available on this device/browser.');
            return;
        }

        try {
            // Dynamic import to avoid SSR issues
            const { Html5Qrcode } = await import('html5-qrcode');
            const scanner = new Html5Qrcode(scannerContainerId);
            scannerRef.current = scanner;

            // Responsive qrbox: 70% of container width, capped
            const container = document.getElementById(scannerContainerId);
            const containerWidth = container?.clientWidth || 320;
            const qrboxWidth = Math.min(Math.floor(containerWidth * 0.7), 300);
            const qrboxHeight = Math.min(Math.floor(qrboxWidth * 0.55), 160);

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: qrboxWidth, height: qrboxHeight },
                    aspectRatio: window.innerWidth < 768 ? 1.0 : 1.5,
                },
                (decodedText: string) => {
                    if (cooldownRef.current) return;
                    cooldownRef.current = true;
                    handleBarcode(decodedText);
                    setTimeout(() => { cooldownRef.current = false; }, 2500);
                },
                () => {}
            );
            setCameraReady(true);
        } catch (err: any) {
            console.error('Camera error:', err);
            const msg = err?.message || String(err);
            if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
                setCameraError('Camera permission denied. Please allow camera access in your browser settings and reload.');
            } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFound')) {
                setCameraError('No camera found on this device.');
            } else if (msg.includes('NotReadableError') || msg.includes('TrackStartError')) {
                setCameraError('Camera is in use by another app. Close it and try again.');
            } else {
                setCameraError(`Camera error: ${msg}`);
            }
        }
    }, [handleBarcode]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (e) { /* ignore */ }
            scannerRef.current = null;
            setCameraReady(false);
        }
    }, []);

    useEffect(() => {
        if (mode === 'camera') {
            const timer = setTimeout(startScanner, 400);
            return () => { clearTimeout(timer); stopScanner(); };
        } else {
            stopScanner();
        }
    }, [mode, startScanner, stopScanner]);

    useEffect(() => { return () => { stopScanner(); }; }, [stopScanner]);

    // ── Mobile Session (QR-code relay) ───────────────────────────────────

    useEffect(() => {
        if (mode !== 'mobile') return;

        let cancelled = false;
        let pollInterval: ReturnType<typeof setInterval> | null = null;
        let createdSessionId: string | null = null;
        const processedBarcodes = new Set<string>();

        async function init() {
            setMobileSessionLoading(true);
            setMobileReceived(0);
            setMobileQrDataUrl('');
            setMobileSessionUrl('');
            try {
                const res = await fetch('/api/scan/session', { method: 'POST' });
                const { sessionId } = await res.json();
                if (cancelled) { fetch(`/api/scan/${sessionId}`, { method: 'DELETE' }).catch(() => {}); return; }

                createdSessionId = sessionId;
                const url = `${window.location.origin}/scan?session=${sessionId}`;
                setMobileSessionUrl(url);

                const QRCode = await import('qrcode');
                const dataUrl = await QRCode.toDataURL(url, { width: 260, margin: 2 });
                if (!cancelled) setMobileQrDataUrl(dataUrl);

                pollInterval = setInterval(async () => {
                    try {
                        const r = await fetch(`/api/scan/${sessionId}`);
                        if (!r.ok) return;
                        const { items } = await r.json();
                        const fresh = (items as { barcode: string }[]).filter(i => !processedBarcodes.has(i.barcode));
                        for (const item of fresh) {
                            processedBarcodes.add(item.barcode);
                            setMobileReceived(processedBarcodes.size);
                            handleBarcode(item.barcode);
                        }
                    } catch { /* network blip — keep polling */ }
                }, 2000);
            } catch {
                if (!cancelled) toast({ title: 'Could not start phone session', variant: 'destructive' });
            } finally {
                if (!cancelled) setMobileSessionLoading(false);
            }
        }

        init();

        return () => {
            cancelled = true;
            if (pollInterval) clearInterval(pollInterval);
            if (createdSessionId) fetch(`/api/scan/${createdSessionId}`, { method: 'DELETE' }).catch(() => {});
            setMobileQrDataUrl('');
            setMobileSessionUrl('');
            setMobileReceived(0);
            setMobileSessionLoading(false);
        };
    }, [mode, handleBarcode]);

    // ── Manual submit ────────────────────────────────────────────────────

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = manualCode.trim();
        if (!code) return;
        handleBarcode(code);
        setManualCode('');
    };

    // ── Item CRUD ────────────────────────────────────────────────────────

    const updateItem = (id: string, field: keyof ScannedItem, value: any) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const saveItem = async (item: ScannedItem) => {
        if (!item.name.trim()) {
            toast({ title: 'Item name is required', variant: 'destructive' });
            return;
        }
        updateItem(item.id, 'saving', true);
        try {
            await createItem({
                type: 'product',
                name: item.name,
                description: item.description,
                category: item.category,
                unit: item.unit || 'Pcs',
                salePrice: { amount: Number(item.salePrice) || 0, taxType: 'Without Tax' },
                purchasePrice: { amount: Number(item.purchasePrice) || 0, taxType: 'Without Tax' },
                openingQuantity: Number(item.openingQuantity) || 0,
                itemCode: item.barcode,
            });
            updateItem(item.id, 'saved', true);
            updateItem(item.id, 'saving', false);
        } catch (err) {
            console.error(err);
            updateItem(item.id, 'saving', false);
            toast({ title: `Failed to save ${item.name}`, variant: 'destructive' });
        }
    };

    const saveAllUnsaved = async () => {
        const unsaved = items.filter(i => !i.saved && i.name.trim());
        if (unsaved.length === 0) {
            toast({ title: 'No unsaved items to save' });
            return;
        }
        setSavingAll(true);
        let success = 0;
        for (const item of unsaved) {
            try { await saveItem(item); success++; } catch { /* handled inside */ }
        }
        setSavingAll(false);
        toast({ title: `${success} of ${unsaved.length} items saved`, className: 'bg-green-500 text-white' });
    };

    const unsavedCount = items.filter(i => !i.saved).length;

    // ── Detect device type for default mode ─────────────────────────────

    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) setMode('camera');
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-base sm:text-lg font-bold text-gray-800">Import From Barcode</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">{items.length} scanned</span>
                        {unsavedCount > 0 && (
                            <button
                                onClick={saveAllUnsaved}
                                disabled={savingAll}
                                className="flex items-center gap-1.5 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                            >
                                {savingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save All ({unsavedCount})
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Scanner Area */}
            <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
                {/* Mode toggle */}
                <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
                    {[
                        { key: 'hardware' as const, icon: Usb, label: 'USB Scanner' },
                        { key: 'camera' as const, icon: Camera, label: 'Camera' },
                        { key: 'mobile' as const, icon: Smartphone, label: 'Phone' },
                        { key: 'manual' as const, icon: Keyboard, label: 'Type Code' },
                    ].map(({ key, icon: Icon, label }) => (
                        <button
                            key={key}
                            onClick={() => setMode(key)}
                            className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all ${mode === key ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >
                            <Icon className="h-4 w-4" /> {label}
                        </button>
                    ))}
                </div>

                {/* ── Hardware Scanner Mode ─────────────────────────────────── */}
                {mode === 'hardware' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                                scannerStatus === 'waiting'    ? 'bg-blue-50 border-2 border-blue-200' :
                                scannerStatus === 'reading'    ? 'bg-yellow-50 border-2 border-yellow-400 animate-pulse' :
                                                                 'bg-green-50 border-2 border-green-400'
                            }`}>
                                {scannerStatus === 'waiting' && <Usb className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />}
                                {scannerStatus === 'reading' && <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 animate-pulse" />}
                                {scannerStatus === 'processing' && <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 animate-spin" />}
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                                    {scannerStatus === 'waiting' && 'Ready to Scan'}
                                    {scannerStatus === 'reading' && 'Reading barcode...'}
                                    {scannerStatus === 'processing' && 'Looking up product...'}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {scannerStatus === 'waiting'
                                        ? 'Connect your USB/Bluetooth barcode scanner and scan any product.'
                                        : scannerStatus === 'reading'
                                        ? 'Receiving barcode data...'
                                        : 'Fetching product details...'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${scannerStatus === 'waiting' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                <span className="text-xs text-gray-500 font-medium">
                                    {scannerStatus === 'waiting' ? 'Listener active — scan anytime' : 'Processing...'}
                                </span>
                            </div>
                        </div>
                        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                            <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                                <li>Plug in USB scanner or pair Bluetooth scanner</li>
                                <li>Keep this page focused — <strong>no need to click any field</strong></li>
                                <li>Scan any barcode — auto-detects and looks up instantly</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* ── Camera Mode ──────────────────────────────────────────── */}
                {mode === 'camera' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {cameraError ? (
                            <div className="p-6 flex flex-col items-center text-center gap-3">
                                <AlertCircle className="h-10 w-10 text-red-400" />
                                <p className="text-sm text-red-600 font-medium">{cameraError}</p>
                                <button
                                    onClick={() => { setCameraError(null); setTimeout(startScanner, 300); }}
                                    className="text-sm text-blue-600 font-medium underline"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative bg-black">
                                    <div id={scannerContainerId} className="w-full" style={{ minHeight: 280 }} />
                                    {!cameraReady && !cameraError && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                            <div className="text-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                                                <p className="text-sm text-gray-300">Starting camera...</p>
                                            </div>
                                        </div>
                                    )}
                                    {lookingUp && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg">
                                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                                <span className="text-sm font-medium">Looking up barcode...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-gray-50 text-center">
                                    <p className="text-xs sm:text-sm text-gray-500">Point camera at a barcode. It scans automatically.</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── Mobile Phone Mode ────────────────────────────────────── */}
                {mode === 'mobile' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {mobileSessionLoading ? (
                            <div className="p-8 flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                <p className="text-sm text-gray-500">Creating scan session…</p>
                            </div>
                        ) : mobileQrDataUrl ? (
                            <>
                                <div className="p-5 sm:p-6 flex flex-col items-center gap-4">
                                    <div className="text-center">
                                        <h3 className="text-base font-bold text-gray-800">Scan with Your Phone</h3>
                                        <p className="text-xs text-gray-500 mt-1">Open the QR code on your phone — it will scan barcodes and send them here automatically.</p>
                                    </div>

                                    {/* QR Code */}
                                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 bg-blue-50">
                                        <img src={mobileQrDataUrl} alt="Scan QR code" className="w-52 h-52 rounded-lg" />
                                    </div>

                                    {/* Live indicator */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs text-gray-500 font-medium">Listening for scans…</span>
                                        </div>
                                        {mobileReceived > 0 && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                                {mobileReceived} received
                                            </span>
                                        )}
                                    </div>

                                    {/* Copy link */}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(mobileSessionUrl).then(() => {
                                                setMobileCopied(true);
                                                setTimeout(() => setMobileCopied(false), 2000);
                                            });
                                        }}
                                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        {mobileCopied ? 'Copied!' : 'Copy link instead'}
                                    </button>
                                </div>
                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                                    <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                                        <li>Open your phone camera and scan the QR code above</li>
                                        <li>Allow camera permission when prompted</li>
                                        <li>Point phone at product barcodes — they appear here instantly</li>
                                    </ol>
                                </div>
                            </>
                        ) : (
                            <div className="p-6 flex flex-col items-center gap-3 text-center">
                                <AlertCircle className="h-8 w-8 text-red-400" />
                                <p className="text-sm text-gray-600">Failed to create session.</p>
                                <button
                                    onClick={() => { setMode('hardware'); setTimeout(() => setMode('mobile'), 50); }}
                                    className="flex items-center gap-1.5 text-sm text-blue-600 font-medium underline"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" /> Retry
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Manual Entry Mode ────────────────────────────────────── */}
                {mode === 'manual' && (
                    <form onSubmit={handleManualSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Barcode Number</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="manual-barcode-input"
                                    type="text"
                                    inputMode="numeric"
                                    autoFocus
                                    value={manualCode}
                                    onChange={e => setManualCode(e.target.value)}
                                    placeholder="e.g. 8901058853100"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!manualCode.trim() || lookingUp}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                <span className="hidden sm:inline">Lookup</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Physical scanner also works here — focus the input and scan.</p>
                    </form>
                )}

                {/* ── Scanned Items List ───────────────────────────────────── */}
                {items.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-4 sm:px-5 py-3 border-b border-gray-200">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wide">Scanned Items ({items.length})</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className={`p-3 sm:p-4 ${item.saved ? 'bg-green-50/50' : ''}`}>
                                    {editingId === item.id && !item.saved ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.barcode}</span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setEditingId(null)} className="text-xs text-blue-600 font-semibold">Done</button>
                                                    <button onClick={() => removeItem(item.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { field: 'name' as const, label: 'Name *', placeholder: 'Item name', type: 'text' },
                                                    { field: 'brand' as const, label: 'Brand', placeholder: 'Brand', type: 'text' },
                                                    { field: 'salePrice' as const, label: 'Sale Price', placeholder: '0', type: 'number' },
                                                    { field: 'purchasePrice' as const, label: 'Purchase Price', placeholder: '0', type: 'number' },
                                                    { field: 'unit' as const, label: 'Unit', placeholder: 'Pcs', type: 'text' },
                                                    { field: 'openingQuantity' as const, label: 'Opening Qty', placeholder: '1', type: 'number' },
                                                ].map(({ field, label, placeholder, type }) => (
                                                    <div key={field}>
                                                        <label className="text-xs font-medium text-gray-500">{label}</label>
                                                        <input
                                                            type={type}
                                                            inputMode={type === 'number' ? 'decimal' : 'text'}
                                                            value={(item as any)[field]}
                                                            onChange={e => updateItem(item.id, field, e.target.value)}
                                                            placeholder={placeholder}
                                                            className="w-full mt-0.5 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">Category</label>
                                                <input value={item.category} onChange={e => updateItem(item.id, 'category', e.target.value)} placeholder="Category" className="w-full mt-0.5 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start sm:items-center gap-3">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="h-11 w-11 rounded-lg object-cover border border-gray-200 shrink-0" />
                                            ) : (
                                                <div className="h-11 w-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] shrink-0">No img</div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {item.name || <span className="text-gray-400 italic">Unnamed — tap edit</span>}
                                                    </p>
                                                    {item.found && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Found</span>}
                                                    {item.saved && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Check className="h-2.5 w-2.5" />Saved</span>}
                                                </div>
                                                <p className="text-[11px] text-gray-400 font-mono">{item.barcode}{item.brand ? ` · ${item.brand}` : ''}</p>
                                                <p className="text-[11px] text-gray-500">
                                                    ₹{item.salePrice} sale · ₹{item.purchasePrice} purchase · {item.openingQuantity} {item.unit}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {!item.saved && (
                                                    <>
                                                        <button onClick={() => setEditingId(item.id)} className="px-2.5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => saveItem(item)}
                                                            disabled={item.saving || !item.name.trim()}
                                                            className="px-2.5 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {item.saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                            Save
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {items.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <Camera className="h-10 w-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No items scanned yet.</p>
                        <p className="text-xs mt-1">
                            {mode === 'hardware' ? 'Scan a barcode with your USB/Bluetooth scanner.' :
                             mode === 'camera' ? 'Point your camera at a barcode.' :
                             'Type a barcode number and press Lookup.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarcodeScannerImport;
