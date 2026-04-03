"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Smartphone, Usb, Camera, Keyboard, ArrowLeft, Loader2, Check,
    AlertCircle, Copy, RefreshCw, Zap, Plus, Search, X
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type ScanMethod = "mobile" | "scanner";
type ScannerSubMode = "hardware" | "camera" | "manual";
type ScannerStatus = "waiting" | "reading" | "processing";

export default function ScanSelectPage() {
    const router = useRouter();
    const [method, setMethod] = useState<ScanMethod>("mobile");

    // ── Shared scanned list ────────────────────────────────────────────
    const [barcodes, setBarcodes] = useState<string[]>([]);
    const barcodesRef = useRef<string[]>([]);
    useEffect(() => { barcodesRef.current = barcodes; }, [barcodes]);

    const addBarcode = useCallback((code: string) => {
        const trimmed = code.trim();
        if (!trimmed) return;
        if (barcodesRef.current.includes(trimmed)) {
            toast({ title: `${trimmed} already in list` });
            return;
        }
        setBarcodes(prev => [...prev, trimmed]);
    }, []);

    const removeBarcode = (code: string) => setBarcodes(prev => prev.filter(b => b !== code));

    // ── Mobile session state ───────────────────────────────────────────
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionUrl, setSessionUrl] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [mobileCopied, setMobileCopied] = useState(false);

    useEffect(() => {
        if (method !== "mobile") return;

        let cancelled = false;
        let pollInterval: ReturnType<typeof setInterval> | null = null;
        let sessionId: string | null = null;
        const processed = new Set<string>();

        async function init() {
            setSessionLoading(true);
            setQrDataUrl("");
            setSessionUrl("");
            try {
                const res = await fetch("/api/scan/session", { method: "POST" });
                const { sessionId: id } = await res.json();
                if (cancelled) { fetch(`/api/scan/${id}`, { method: "DELETE" }).catch(() => {}); return; }
                sessionId = id;

                const url = `${window.location.origin}/scan?session=${id}`;
                setSessionUrl(url);

                const QRCode = await import("qrcode");
                const dataUrl = await QRCode.toDataURL(url, { width: 260, margin: 2 });
                if (!cancelled) setQrDataUrl(dataUrl);

                pollInterval = setInterval(async () => {
                    try {
                        const r = await fetch(`/api/scan/${id}`);
                        if (!r.ok) return;
                        const { items } = await r.json();
                        for (const item of items as { barcode: string }[]) {
                            if (!processed.has(item.barcode)) {
                                processed.add(item.barcode);
                                addBarcode(item.barcode);
                            }
                        }
                    } catch { /* keep polling */ }
                }, 2000);
            } catch {
                if (!cancelled) toast({ title: "Could not start phone session", variant: "destructive" });
            } finally {
                if (!cancelled) setSessionLoading(false);
            }
        }

        init();
        return () => {
            cancelled = true;
            if (pollInterval) clearInterval(pollInterval);
            if (sessionId) fetch(`/api/scan/${sessionId}`, { method: "DELETE" }).catch(() => {});
            setQrDataUrl(""); setSessionUrl(""); setSessionLoading(false);
        };
    }, [method, addBarcode]);

    // ── Hardware scanner ───────────────────────────────────────────────
    const [scannerMode, setScannerMode] = useState<ScannerSubMode>("hardware");
    const [scannerStatus, setScannerStatus] = useState<ScannerStatus>("waiting");
    const scanBufferRef = useRef("");
    const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (method !== "scanner") return;
        const onKeyDown = (e: KeyboardEvent) => {
            const isManual = (e.target as HTMLElement)?.id === "manual-scan-input";
            const tag = (e.target as HTMLElement)?.tagName;
            if ((tag === "INPUT" || tag === "TEXTAREA") && !isManual) return;

            if (e.key === "Enter") {
                if (scanBufferRef.current.length >= 4) {
                    e.preventDefault();
                    addBarcode(scanBufferRef.current.trim());
                }
                scanBufferRef.current = "";
                if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
                setScannerStatus("waiting");
                return;
            }
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                scanBufferRef.current += e.key;
                setScannerStatus("reading");
                if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
                scanTimerRef.current = setTimeout(() => {
                    scanBufferRef.current = "";
                    setScannerStatus("waiting");
                }, 100);
            }
        };
        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [method, addBarcode]);

    // ── Camera scanner ─────────────────────────────────────────────────
    const scannerRef = useRef<any>(null);
    const cooldownRef = useRef(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const CONTAINER_ID = "scan-select-camera";

    const startCamera = useCallback(async () => {
        if (scannerRef.current) return;
        setCameraError(null); setCameraReady(false);
        if (!navigator?.mediaDevices?.getUserMedia) { setCameraError("Camera not available."); return; }
        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            const scanner = new Html5Qrcode(CONTAINER_ID);
            scannerRef.current = scanner;
            const w = document.getElementById(CONTAINER_ID)?.clientWidth || 320;
            const qrW = Math.min(Math.floor(w * 0.7), 260);
            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: qrW, height: Math.round(qrW * 0.5) } },
                (code: string) => {
                    if (cooldownRef.current) return;
                    cooldownRef.current = true;
                    addBarcode(code);
                    setTimeout(() => { cooldownRef.current = false; }, 2500);
                },
                () => {}
            );
            setCameraReady(true);
        } catch (err: any) {
            const msg = err?.message || "";
            if (msg.includes("NotAllowed") || msg.includes("Permission")) setCameraError("Camera permission denied.");
            else if (msg.includes("NotFound")) setCameraError("No camera found.");
            else setCameraError("Could not start camera.");
        }
    }, [addBarcode]);

    const stopCamera = useCallback(async () => {
        if (scannerRef.current) {
            try { await scannerRef.current.stop(); scannerRef.current.clear(); } catch {}
            scannerRef.current = null; setCameraReady(false);
        }
    }, []);

    useEffect(() => {
        if (method === "scanner" && scannerMode === "camera") {
            const t = setTimeout(startCamera, 400);
            return () => { clearTimeout(t); stopCamera(); };
        } else { stopCamera(); }
    }, [method, scannerMode, startCamera, stopCamera]);

    useEffect(() => () => { stopCamera(); }, [stopCamera]);

    // ── Manual entry ───────────────────────────────────────────────────
    const [manualCode, setManualCode] = useState("");
    const handleManual = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim()) return;
        addBarcode(manualCode.trim());
        setManualCode("");
    };

    // ── Continue to Add Items ──────────────────────────────────────────
    const handleContinue = () => {
        if (barcodes.length === 0) { toast({ title: "Scan at least one barcode first" }); return; }
        sessionStorage.setItem("import-barcodes", JSON.stringify(barcodes));
        router.push("/dashboard/utilities/import-items/add-items");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={() => router.push("/dashboard/utilities/import-items")} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-base font-bold text-gray-800">Select Scan Method</h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto w-full px-4 py-6 flex flex-col gap-6">

                {/* Method selector */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { key: "mobile" as ScanMethod, icon: Smartphone, label: "Mobile Device", desc: "Scan using your phone camera via QR code" },
                        { key: "scanner" as ScanMethod, icon: Usb, label: "Barcode Scanner", desc: "USB, Bluetooth or device camera" },
                    ].map(({ key, icon: Icon, label, desc }) => (
                        <button
                            key={key}
                            onClick={() => setMethod(key)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 text-center transition-all ${method === key ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${method === key ? "bg-blue-100" : "bg-gray-100"}`}>
                                <Icon className={`h-7 w-7 ${method === key ? "text-blue-600" : "text-gray-500"}`} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${method === key ? "text-blue-700" : "text-gray-700"}`}>{label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === key ? "border-blue-600" : "border-gray-300"}`}>
                                {method === key && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Scanner UI */}
                    <div className="flex flex-col gap-4">

                        {/* ── Mobile Mode ── */}
                        {method === "mobile" && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {sessionLoading ? (
                                    <div className="p-10 flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                        <p className="text-sm text-gray-500">Creating session…</p>
                                    </div>
                                ) : qrDataUrl ? (
                                    <>
                                        <div className="p-5 flex flex-col items-center gap-4">
                                            <p className="text-sm font-semibold text-gray-700 text-center">
                                                Open on your phone to scan barcodes
                                            </p>
                                            <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 bg-blue-50">
                                                <img src={qrDataUrl} alt="Scan QR" className="w-52 h-52 rounded-lg" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-xs text-gray-500 font-medium">Listening for scans…</span>
                                            </div>
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(sessionUrl).then(() => { setMobileCopied(true); setTimeout(() => setMobileCopied(false), 2000); }); }}
                                                className="flex items-center gap-1.5 text-xs text-blue-600 font-medium"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                                {mobileCopied ? "Copied!" : "Copy link instead"}
                                            </button>
                                        </div>
                                        <div className="px-5 py-3 bg-gray-50 border-t">
                                            <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                                                <li>Scan the QR code with your phone camera</li>
                                                <li>Allow camera permission when asked</li>
                                                <li>Point phone at product barcodes — they appear here</li>
                                            </ol>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 flex flex-col items-center gap-3 text-center">
                                        <AlertCircle className="h-8 w-8 text-red-400" />
                                        <p className="text-sm text-gray-600">Failed to create session.</p>
                                        <button onClick={() => { setMethod("scanner"); setTimeout(() => setMethod("mobile"), 50); }} className="flex items-center gap-1 text-sm text-blue-600 underline">
                                            <RefreshCw className="h-3.5 w-3.5" /> Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Barcode Scanner Mode ── */}
                        {method === "scanner" && (
                            <div className="flex flex-col gap-3">
                                {/* Sub-mode tabs */}
                                <div className="flex gap-2">
                                    {([
                                        { key: "hardware" as ScannerSubMode, icon: Usb, label: "USB" },
                                        { key: "camera" as ScannerSubMode, icon: Camera, label: "Camera" },
                                        { key: "manual" as ScannerSubMode, icon: Keyboard, label: "Type" },
                                    ] as const).map(({ key, icon: Icon, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setScannerMode(key)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${scannerMode === key ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                                        >
                                            <Icon className="h-3.5 w-3.5" /> {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Hardware */}
                                {scannerMode === "hardware" && (
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center gap-4">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                                            scannerStatus === "waiting" ? "bg-blue-50 border-2 border-blue-200" :
                                            scannerStatus === "reading" ? "bg-yellow-50 border-2 border-yellow-400 animate-pulse" :
                                            "bg-green-50 border-2 border-green-400"
                                        }`}>
                                            {scannerStatus === "waiting" && <Usb className="h-9 w-9 text-blue-500" />}
                                            {scannerStatus === "reading" && <Zap className="h-9 w-9 text-yellow-500 animate-pulse" />}
                                            {scannerStatus === "processing" && <Loader2 className="h-9 w-9 text-green-500 animate-spin" />}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-800">
                                                {scannerStatus === "waiting" ? "Ready to Scan" : scannerStatus === "reading" ? "Reading…" : "Processing…"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Connect USB/Bluetooth scanner and scan any product barcode</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs text-gray-500">Listener active</span>
                                        </div>
                                    </div>
                                )}

                                {/* Camera */}
                                {scannerMode === "camera" && (
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        {cameraError ? (
                                            <div className="p-6 flex flex-col items-center gap-3 text-center">
                                                <AlertCircle className="h-8 w-8 text-red-400" />
                                                <p className="text-sm text-red-600">{cameraError}</p>
                                                <button onClick={() => { setCameraError(null); setTimeout(startCamera, 300); }} className="text-sm text-blue-600 underline">Retry</button>
                                            </div>
                                        ) : (
                                            <div className="relative bg-black">
                                                <div id={CONTAINER_ID} className="w-full" style={{ minHeight: 240 }} />
                                                {!cameraReady && !cameraError && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                                        <Loader2 className="h-7 w-7 animate-spin text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-2 bg-gray-50 text-center">
                                            <p className="text-xs text-gray-500">Point at barcode — scans automatically</p>
                                        </div>
                                    </div>
                                )}

                                {/* Manual */}
                                {scannerMode === "manual" && (
                                    <form onSubmit={handleManual} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Barcode</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    id="manual-scan-input"
                                                    type="text"
                                                    inputMode="numeric"
                                                    autoFocus
                                                    value={manualCode}
                                                    onChange={e => setManualCode(e.target.value)}
                                                    placeholder="e.g. 8901058853100"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                            <button type="submit" disabled={!manualCode.trim()} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                                                <Plus className="h-4 w-4" /> Add
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Scanned list */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-700">Scanned Barcodes ({barcodes.length})</h3>
                            {barcodes.length > 0 && (
                                <button onClick={() => setBarcodes([])} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                                    <X className="h-3.5 w-3.5" /> Clear all
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-auto max-h-80 divide-y divide-gray-100">
                            {barcodes.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Usb className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No barcodes scanned yet</p>
                                </div>
                            ) : (
                                barcodes.map((code, i) => (
                                    <div key={code} className="flex items-center justify-between px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                                            <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                            <span className="text-sm font-mono text-gray-800">{code}</span>
                                        </div>
                                        <button onClick={() => removeBarcode(code)} className="p-1 text-gray-300 hover:text-red-400">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Continue button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleContinue}
                        disabled={barcodes.length === 0}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-opacity"
                    >
                        Continue to Add Items ({barcodes.length})
                    </button>
                </div>
            </div>
        </div>
    );
}
