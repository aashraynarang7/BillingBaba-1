'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, AlertCircle, Loader2, Camera, Keyboard, X } from 'lucide-react'

interface ScannedCode {
    barcode: string
    status: 'sending' | 'ok' | 'duplicate' | 'error'
    ts: number
}

function ScannerPage() {
    const params = useSearchParams()
    const sessionId = params.get('session')

    const [mode, setMode] = useState<'camera' | 'manual'>('camera')
    const [scanned, setScanned] = useState<ScannedCode[]>([])
    const [manualCode, setManualCode] = useState('')
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [cameraReady, setCameraReady] = useState(false)
    const [sessionError, setSessionError] = useState(false)

    const scannerRef = useRef<any>(null)
    const cooldownRef = useRef(false)
    const CONTAINER_ID = 'mobile-scan-container'

    async function sendBarcode(barcode: string) {
        if (!sessionId) return
        const trimmed = barcode.trim()
        if (!trimmed) return

        // Optimistic add
        const entry: ScannedCode = { barcode: trimmed, status: 'sending', ts: Date.now() }
        setScanned(prev => [entry, ...prev])

        try {
            const res = await fetch(`/api/scan/${sessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcode: trimmed }),
            })
            const data = await res.json()
            if (!res.ok) {
                if (res.status === 404) setSessionError(true)
                setScanned(prev => prev.map(s => s.ts === entry.ts ? { ...s, status: 'error' } : s))
            } else {
                // Check if it was already in session (total didn't grow means duplicate)
                setScanned(prev => prev.map(s => s.ts === entry.ts ? { ...s, status: 'ok' } : s))
            }
        } catch {
            setScanned(prev => prev.map(s => s.ts === entry.ts ? { ...s, status: 'error' } : s))
        }
    }

    const startCamera = useCallback(async () => {
        if (scannerRef.current) return
        setCameraError(null)
        setCameraReady(false)

        if (!navigator?.mediaDevices?.getUserMedia) {
            setCameraError('Camera not available on this browser.')
            return
        }

        try {
            const { Html5Qrcode } = await import('html5-qrcode')
            const scanner = new Html5Qrcode(CONTAINER_ID)
            scannerRef.current = scanner

            const container = document.getElementById(CONTAINER_ID)
            const w = container?.clientWidth || window.innerWidth - 32
            const qrW = Math.min(Math.floor(w * 0.75), 280)

            await scanner.start(
                { facingMode: 'environment' },
                { fps: 12, qrbox: { width: qrW, height: Math.round(qrW * 0.5) }, aspectRatio: 1.4 },
                (decoded: string) => {
                    if (cooldownRef.current) return
                    cooldownRef.current = true
                    sendBarcode(decoded)
                    // Haptic feedback on mobile
                    if (navigator.vibrate) navigator.vibrate(80)
                    setTimeout(() => { cooldownRef.current = false }, 2500)
                },
                () => {}
            )
            setCameraReady(true)
        } catch (err: any) {
            const msg = err?.message || ''
            if (msg.includes('NotAllowed') || msg.includes('Permission')) {
                setCameraError('Camera permission denied. Tap to retry.')
            } else if (msg.includes('NotFound') || msg.includes('Devices')) {
                setCameraError('No camera found on this device.')
            } else {
                setCameraError('Could not start camera. Try manual entry.')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId])

    const stopCamera = useCallback(async () => {
        if (scannerRef.current) {
            try { await scannerRef.current.stop(); scannerRef.current.clear() } catch {}
            scannerRef.current = null
            setCameraReady(false)
        }
    }, [])

    useEffect(() => {
        if (mode === 'camera') {
            const t = setTimeout(startCamera, 300)
            return () => { clearTimeout(t); stopCamera() }
        } else {
            stopCamera()
        }
    }, [mode, startCamera, stopCamera])

    useEffect(() => () => { stopCamera() }, [stopCamera])

    function handleManual(e: React.FormEvent) {
        e.preventDefault()
        if (!manualCode.trim()) return
        sendBarcode(manualCode.trim())
        setManualCode('')
    }

    if (!sessionId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center gap-4">
                <AlertCircle className="w-14 h-14 text-yellow-400" />
                <h1 className="text-xl font-bold">Invalid Scan Link</h1>
                <p className="text-gray-400 text-sm">This link doesn't have a session ID. Open it from BillingBaba barcode generator.</p>
            </div>
        )
    }

    if (sessionError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center gap-4">
                <AlertCircle className="w-14 h-14 text-red-400" />
                <h1 className="text-xl font-bold">Session Expired</h1>
                <p className="text-gray-400 text-sm">This scanning session has ended. Start a new one from BillingBaba.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
                <div>
                    <h1 className="text-base font-bold">BillingBaba Scanner</h1>
                    <p className="text-xs text-gray-400">Session: <span className="font-mono text-gray-300">{sessionId}</span></p>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
            </div>

            {/* Mode toggle */}
            <div className="flex px-4 pt-4 gap-2 shrink-0">
                <button
                    onClick={() => setMode('camera')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                    <Camera className="w-4 h-4" /> Camera
                </button>
                <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                    <Keyboard className="w-4 h-4" /> Type
                </button>
            </div>

            {/* Camera */}
            {mode === 'camera' && (
                <div className="mx-4 mt-3 rounded-2xl overflow-hidden bg-black border border-gray-800 shrink-0 relative">
                    <div id={CONTAINER_ID} className="w-full" style={{ minHeight: 260 }} />
                    {!cameraReady && !cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="text-sm text-gray-300">Starting camera…</p>
                        </div>
                    )}
                    {cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3 p-4 text-center">
                            <AlertCircle className="w-10 h-10 text-red-400" />
                            <p className="text-sm text-red-300">{cameraError}</p>
                            <button
                                onClick={() => { setCameraError(null); setTimeout(startCamera, 300) }}
                                className="text-sm text-blue-400 underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Manual */}
            {mode === 'manual' && (
                <form onSubmit={handleManual} className="mx-4 mt-3 flex gap-2 shrink-0">
                    <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        value={manualCode}
                        onChange={e => setManualCode(e.target.value)}
                        placeholder="Enter barcode number"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!manualCode.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-5 py-3 rounded-xl text-sm font-semibold"
                    >
                        Add
                    </button>
                </form>
            )}

            {/* Scanned list */}
            <div className="flex-1 overflow-auto px-4 mt-4 pb-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Scanned ({scanned.length})
                    </p>
                    {scanned.length > 0 && (
                        <button onClick={() => setScanned([])} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
                            <X className="w-3 h-3" /> Clear
                        </button>
                    )}
                </div>
                {scanned.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                        <Camera className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No barcodes scanned yet</p>
                        <p className="text-xs mt-1">Point your camera at a product barcode</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {scanned.map((s, i) => (
                            <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                                s.status === 'ok' ? 'bg-green-950 border-green-800' :
                                s.status === 'sending' ? 'bg-gray-800 border-gray-700 animate-pulse' :
                                s.status === 'duplicate' ? 'bg-yellow-950 border-yellow-800' :
                                'bg-red-950 border-red-800'
                            }`}>
                                <div>
                                    <p className="text-sm font-mono font-medium text-white">{s.barcode}</p>
                                    <p className="text-xs text-gray-400">{new Date(s.ts).toLocaleTimeString()}</p>
                                </div>
                                {s.status === 'ok' && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                                {s.status === 'sending' && <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />}
                                {s.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom tip */}
            <div className="px-4 pb-4 shrink-0">
                <p className="text-center text-xs text-gray-600">
                    Scanned codes appear instantly on the BillingBaba desktop
                </p>
            </div>
        </div>
    )
}

export default function MobileScanPage() {
    return (
        <Suspense>
            <ScannerPage />
        </Suspense>
    )
}
