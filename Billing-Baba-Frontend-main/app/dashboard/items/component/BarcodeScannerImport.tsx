"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Camera, CameraOff, Keyboard, Trash2, Plus, Save, Loader2, Check, X, Search, Usb, Zap } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
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
    const [mode, setMode] = useState<'camera' | 'manual' | 'hardware'>('camera');
    const [scanning, setScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [items, setItems] = useState<ScannedItem[]>([]);
    const [lookingUp, setLookingUp] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingAll, setSavingAll] = useState(false);
    const [scannerStatus, setScannerStatus] = useState<'waiting' | 'reading' | 'processing'>('waiting');

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerContainerId = 'barcode-scanner-container';
    const lastScannedRef = useRef<string>('');
    const cooldownRef = useRef(false);

    // ── Hardware Barcode Scanner Detection ───────────────────────────────
    // Physical scanners act as keyboards: rapid keystrokes + Enter at the end.
    // We detect this by tracking inter-keystroke timing (<50ms = scanner, not human).
    const scanBufferRef = useRef('');
    const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleBarcodeRef = useRef<(code: string) => void>(() => {});

    // Keep a stable ref to handleBarcode so the global listener always calls the latest version
    useEffect(() => {
        handleBarcodeRef.current = (code: string) => handleBarcode(code);
    });

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // Don't intercept if user is typing in an input/textarea (edit fields, search, etc.)
            const tag = (e.target as HTMLElement)?.tagName;
            const isManualInput = (e.target as HTMLElement)?.id === 'manual-barcode-input';
            if ((tag === 'INPUT' || tag === 'TEXTAREA') && !isManualInput) return;

            if (e.key === 'Enter') {
                // End of scan — process buffer if it looks like a barcode (4+ digits)
                if (scanBufferRef.current.length >= 4) {
                    e.preventDefault();
                    const code = scanBufferRef.current.trim();
                    scanBufferRef.current = '';
                    setScannerStatus('processing');
                    handleBarcodeRef.current(code);
                    setTimeout(() => setScannerStatus('waiting'), 1500);
                }
                scanBufferRef.current = '';
                if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
                return;
            }

            // Only accept printable characters (digits, letters)
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                scanBufferRef.current += e.key;
                setScannerStatus('reading');

                // Clear buffer after 100ms of no input (human typing is much slower)
                if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
                scanTimerRef.current = setTimeout(() => {
                    scanBufferRef.current = '';
                    setScannerStatus('waiting');
                }, 100);
            }
        };

        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, []);

    // ── Camera Scanner ──────────────────────────────────────────────────

    const startScanner = useCallback(async () => {
        if (scannerRef.current) return;
        try {
            const scanner = new Html5Qrcode(scannerContainerId);
            scannerRef.current = scanner;
            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 280, height: 150 },
                    aspectRatio: 1.5,
                },
                (decodedText) => {
                    if (cooldownRef.current) return;
                    if (decodedText === lastScannedRef.current) return;
                    cooldownRef.current = true;
                    lastScannedRef.current = decodedText;
                    handleBarcode(decodedText);
                    setTimeout(() => { cooldownRef.current = false; }, 2000);
                },
                () => {} // ignore errors (no code found in frame)
            );
            setScanning(true);
        } catch (err) {
            console.error('Failed to start scanner:', err);
            toast({ title: 'Camera access denied or not available', variant: 'destructive' });
            setMode('manual');
        }
    }, []);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (e) { /* ignore */ }
            scannerRef.current = null;
            setScanning(false);
        }
    }, []);

    useEffect(() => {
        if (mode === 'camera') {
            // Small delay for DOM to render container
            const timer = setTimeout(startScanner, 300);
            return () => { clearTimeout(timer); stopScanner(); };
        } else {
            stopScanner();
        }
    }, [mode, startScanner, stopScanner]);

    // Clean up on unmount
    useEffect(() => {
        return () => { stopScanner(); };
    }, [stopScanner]);

    // ── Barcode Lookup ──────────────────────────────────────────────────

    const handleBarcode = async (code: string) => {
        // Skip if already scanned
        if (items.some(i => i.barcode === code)) {
            toast({ title: `Barcode ${code} already scanned` });
            return;
        }

        setLookingUp(true);
        try {
            const data = await lookupBarcode(code);
            const newItem: ScannedItem = {
                id: `${code}-${Date.now()}`,
                barcode: code,
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
                toast({ title: `Barcode ${code} not in database — fill details manually` });
                setEditingId(newItem.id);
            }
        } catch (err) {
            console.error(err);
            toast({ title: 'Lookup failed', variant: 'destructive' });
        } finally {
            setLookingUp(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = manualCode.trim();
        if (!code) return;
        handleBarcode(code);
        setManualCode('');
    };

    // ── Item Editing ────────────────────────────────────────────────────

    const updateItem = (id: string, field: keyof ScannedItem, value: any) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    // ── Save Items ──────────────────────────────────────────────────────

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
            try {
                await saveItem(item);
                success++;
            } catch { /* individual errors handled inside */ }
        }
        setSavingAll(false);
        toast({ title: `${success} of ${unsaved.length} items saved`, className: 'bg-green-500 text-white' });
    };

    const unsavedCount = items.filter(i => !i.saved).length;

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">Import From Barcode</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{items.length} scanned</span>
                        {unsavedCount > 0 && (
                            <button
                                onClick={saveAllUnsaved}
                                disabled={savingAll}
                                className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                            >
                                {savingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save All ({unsavedCount})
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Scanner Area */}
            <div className="max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
                {/* Mode toggle */}
                <div className="flex items-center gap-3 justify-center flex-wrap">
                    <button
                        onClick={() => setMode('hardware')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${mode === 'hardware' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                        <Usb className="h-4 w-4" /> Hardware Scanner
                    </button>
                    <button
                        onClick={() => setMode('camera')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${mode === 'camera' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                        <Camera className="h-4 w-4" /> Phone Camera
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${mode === 'manual' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                        <Keyboard className="h-4 w-4" /> Type Manually
                    </button>
                </div>

                {/* Hardware Scanner mode */}
                {mode === 'hardware' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-8 flex flex-col items-center text-center gap-4">
                            {/* Live status indicator */}
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                                scannerStatus === 'waiting'    ? 'bg-blue-50 border-2 border-blue-200' :
                                scannerStatus === 'reading'    ? 'bg-yellow-50 border-2 border-yellow-400 animate-pulse' :
                                                                 'bg-green-50 border-2 border-green-400'
                            }`}>
                                {scannerStatus === 'waiting' && <Usb className="h-10 w-10 text-blue-500" />}
                                {scannerStatus === 'reading' && <Zap className="h-10 w-10 text-yellow-500 animate-pulse" />}
                                {scannerStatus === 'processing' && <Loader2 className="h-10 w-10 text-green-500 animate-spin" />}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {scannerStatus === 'waiting' && 'Ready to Scan'}
                                    {scannerStatus === 'reading' && 'Reading barcode...'}
                                    {scannerStatus === 'processing' && 'Looking up product...'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {scannerStatus === 'waiting'
                                        ? 'Connect your USB/Bluetooth barcode scanner and scan any product.'
                                        : scannerStatus === 'reading'
                                        ? 'Receiving barcode data...'
                                        : 'Fetching product details from database...'}
                                </p>
                            </div>

                            {/* Status dot */}
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                    scannerStatus === 'waiting' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                                }`} />
                                <span className="text-xs text-gray-500 font-medium">
                                    {scannerStatus === 'waiting' ? 'Scanner listener active — scan anytime' : 'Processing...'}
                                </span>
                            </div>

                            {lookingUp && (
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg mt-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Looking up barcode...</span>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">How it works</h4>
                            <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
                                <li>Plug in your USB barcode scanner or pair via Bluetooth</li>
                                <li>Keep this page open — <strong>no need to click any input field</strong></li>
                                <li>Scan any barcode on a product — it auto-detects and looks up instantly</li>
                                <li>Edit details if needed, then Save</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* Camera view */}
                {mode === 'camera' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="relative">
                            <div id={scannerContainerId} className="w-full" style={{ minHeight: 300 }} />
                            {lookingUp && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg">
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                        <span className="text-sm font-medium">Looking up barcode...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-gray-50 text-center">
                            <p className="text-sm text-gray-500">Point your camera at a barcode. It will scan automatically.</p>
                        </div>
                    </div>
                )}

                {/* Manual entry */}
                {mode === 'manual' && (
                    <form onSubmit={handleManualSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Barcode Number</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="manual-barcode-input"
                                    type="text"
                                    autoFocus
                                    value={manualCode}
                                    onChange={e => setManualCode(e.target.value)}
                                    placeholder="e.g. 8901058853100"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!manualCode.trim() || lookingUp}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Lookup
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">You can also use a physical barcode scanner here — just focus this input and scan.</p>
                    </form>
                )}

                {/* Scanned Items List */}
                {items.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Scanned Items ({items.length})</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className={`p-4 ${item.saved ? 'bg-green-50/50' : ''}`}>
                                    {editingId === item.id && !item.saved ? (
                                        /* Edit mode */
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.barcode}</span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setEditingId(null)} className="text-xs text-blue-600 font-medium hover:underline">Done</button>
                                                    <button onClick={() => removeItem(item.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500">Name *</label>
                                                    <input value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Item name" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500">Brand</label>
                                                    <input value={item.brand} onChange={e => updateItem(item.id, 'brand', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Brand" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500">Sale Price</label>
                                                    <input type="number" value={item.salePrice} onChange={e => updateItem(item.id, 'salePrice', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500">Purchase Price</label>
                                                    <input type="number" value={item.purchasePrice} onChange={e => updateItem(item.id, 'purchasePrice', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500">Unit</label>
                                                    <input value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Pcs" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500">Opening Qty</label>
                                                    <input type="number" value={item.openingQuantity} onChange={e => updateItem(item.id, 'openingQuantity', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">Category</label>
                                                <input value={item.category} onChange={e => updateItem(item.id, 'category', e.target.value)} className="w-full mt-0.5 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Category" />
                                            </div>
                                        </div>
                                    ) : (
                                        /* Display mode */
                                        <div className="flex items-center gap-4">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs shrink-0">No img</div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {item.name || <span className="text-gray-400 italic">Unnamed — click edit</span>}
                                                    </p>
                                                    {item.found && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Auto-found</span>}
                                                    {item.saved && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Check className="h-3 w-3" /> Saved</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 font-mono">{item.barcode}{item.brand ? ` · ${item.brand}` : ''}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Sale: ₹{item.salePrice} · Purchase: ₹{item.purchasePrice} · Qty: {item.openingQuantity} {item.unit}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {!item.saved && (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingId(item.id)}
                                                            className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => saveItem(item)}
                                                            disabled={item.saving || !item.name.trim()}
                                                            className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {item.saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                            Save
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
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
                    <div className="text-center py-12 text-gray-400">
                        <Camera className="h-12 w-12 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No items scanned yet.</p>
                        <p className="text-xs mt-1">Scan a barcode with your camera or enter one manually.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarcodeScannerImport;
