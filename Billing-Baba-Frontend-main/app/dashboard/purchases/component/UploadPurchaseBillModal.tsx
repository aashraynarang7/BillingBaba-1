"use client";

import React, { useState, useCallback, useRef } from 'react';
import { X, Upload, FileImage, Loader2, AlertCircle, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { parseBillImage, checkOllamaStatus, createItem } from '@/lib/api';

interface ParsedItem {
    name: string;
    quantity: number;
    unit: string;
    priceUnit: { amount: number; taxType: string };
    discount: { percent: number; amount: number };
    tax: { rate: number; amount: number };
    amount: number;
}

interface ParsedBillData {
    partyName: string;
    phone: string;
    billNumber: string;
    billDate: string;
    stateOfSupply: string;
    description: string;
    items: ParsedItem[];
    subTotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUseData: (data: ParsedBillData) => void;
}

type Step = 'upload' | 'processing' | 'review' | 'error';

export default function UploadPurchaseBillModal({ isOpen, onClose, onUseData }: Props) {
    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [error, setError] = useState('');
    const [parsedData, setParsedData] = useState<ParsedBillData | null>(null);
    const [editingItem, setEditingItem] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const reset = () => {
        setStep('upload');
        setFile(null);
        setPreview('');
        setError('');
        setParsedData(null);
        setEditingItem(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFile = useCallback((f: File) => {
        if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
            setError('Please upload an image (JPG, PNG) or PDF file.');
            return;
        }
        if (f.size > 10 * 1024 * 1024) {
            setError('File size must be under 10MB.');
            return;
        }
        setFile(f);
        setError('');
        if (f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(f);
        } else {
            setPreview('');
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const handleUploadAndParse = async () => {
        if (!file) return;
        setStep('processing');
        setError('');

        try {
            const result = await parseBillImage(file);
            if (result.success && result.data) {
                setParsedData(result.data);
                setStep('review');
            } else {
                setError(result.message || 'Failed to extract data from the bill.');
                setStep('error');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to process the bill image.');
            setStep('error');
        }
    };

    const updateField = (field: keyof ParsedBillData, value: any) => {
        if (!parsedData) return;
        setParsedData({ ...parsedData, [field]: value });
    };

    const updateItem = (index: number, field: string, value: any) => {
        if (!parsedData) return;
        const items = [...parsedData.items];
        const item = { ...items[index] };

        if (field === 'name' || field === 'unit') {
            (item as any)[field] = value;
        } else if (field === 'quantity' || field === 'amount') {
            (item as any)[field] = Number(value) || 0;
        } else if (field === 'pricePerUnit') {
            item.priceUnit = { ...item.priceUnit, amount: Number(value) || 0 };
        } else if (field === 'discountPercent') {
            item.discount = { ...item.discount, percent: Number(value) || 0 };
        } else if (field === 'taxRate') {
            item.tax = { ...item.tax, rate: Number(value) || 0 };
        }

        // Recalculate amount
        const base = item.priceUnit.amount * item.quantity;
        item.discount.amount = base * (item.discount.percent / 100);
        const afterDiscount = base - item.discount.amount;
        item.tax.amount = afterDiscount * (item.tax.rate / 100);
        item.amount = afterDiscount + item.tax.amount;

        items[index] = item;

        // Recalculate totals
        const subTotal = items.reduce((s, i) => s + (i.priceUnit.amount * i.quantity), 0);
        const totalDiscount = items.reduce((s, i) => s + i.discount.amount, 0);
        const totalTax = items.reduce((s, i) => s + i.tax.amount, 0);
        const grandTotal = subTotal - totalDiscount + totalTax;

        setParsedData({ ...parsedData, items, subTotal, totalDiscount, totalTax, grandTotal });
    };

    const removeItem = (index: number) => {
        if (!parsedData) return;
        const items = parsedData.items.filter((_, i) => i !== index);
        const subTotal = items.reduce((s, i) => s + (i.priceUnit.amount * i.quantity), 0);
        const totalDiscount = items.reduce((s, i) => s + i.discount.amount, 0);
        const totalTax = items.reduce((s, i) => s + i.tax.amount, 0);
        setParsedData({ ...parsedData, items, subTotal, totalDiscount, totalTax, grandTotal: subTotal - totalDiscount + totalTax });
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleUseData = async () => {
        if (!parsedData) return;
        setIsSaving(true);

        try {
            // Auto-create each item in the billing app's item catalog
            const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
            const itemsWithIds = await Promise.all(
                parsedData.items.map(async (item) => {
                    try {
                        const created = await createItem({
                            type: 'product',
                            name: item.name,
                            companyId,
                            unit: item.unit || 'PCS',
                            purchasePrice: {
                                amount: item.priceUnit.amount,
                                taxType: item.priceUnit.taxType || 'withoutTax',
                            },
                            taxRate: item.tax.rate || 0,
                            openingQuantity: 0,
                            currentQuantity: 0,
                        });
                        // Return item with the created itemId linked
                        return {
                            ...item,
                            itemId: created._id || created.product?._id,
                        };
                    } catch {
                        // If item creation fails (e.g. duplicate), still include the item without an ID
                        return item;
                    }
                })
            );

            onUseData({ ...parsedData, items: itemsWithIds });
            handleClose();
        } catch (err) {
            console.error('Failed to create items:', err);
            // Still pass data even if item creation fails
            onUseData(parsedData);
            handleClose();
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Upload Purchase Bill (AI Scanner)</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step: Upload */}
                    {step === 'upload' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                <p className="font-semibold mb-1">How it works</p>
                                <p>Upload a photo of your purchase bill or invoice. Our AI (powered by Ollama) will extract vendor details, items, quantities, prices and totals automatically. You can review and edit before creating the purchase bill.</p>
                            </div>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                                    dragOver ? 'border-blue-500 bg-blue-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                />
                                {file ? (
                                    <div className="space-y-3">
                                        {preview ? (
                                            <img src={preview} alt="Bill preview" className="max-h-48 mx-auto rounded-lg shadow" />
                                        ) : (
                                            <FileImage size={48} className="mx-auto text-green-500" />
                                        )}
                                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(''); }}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove and choose another
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Upload size={48} className="mx-auto text-gray-400" />
                                        <p className="text-gray-600 font-medium">Drag & drop your bill image here</p>
                                        <p className="text-sm text-gray-400">or click to browse (JPG, PNG, PDF — max 10MB)</p>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step: Processing */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <Loader2 size={48} className="animate-spin text-blue-500" />
                            <p className="text-lg font-medium text-gray-700">Analyzing your bill...</p>
                            <p className="text-sm text-gray-500">This may take 15-30 seconds depending on the image</p>
                            {preview && (
                                <img src={preview} alt="Processing" className="max-h-32 rounded-lg opacity-50 mt-4" />
                            )}
                        </div>
                    )}

                    {/* Step: Error */}
                    {step === 'error' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <AlertCircle size={48} className="text-red-500" />
                            <p className="text-lg font-medium text-gray-700">Extraction Failed</p>
                            <p className="text-sm text-red-600 text-center max-w-md">{error}</p>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={reset}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                                >
                                    Try Another Image
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step: Review */}
                    {step === 'review' && parsedData && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-medium">Data extracted successfully! Review and edit before creating the bill.</span>
                            </div>

                            {/* Vendor Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Vendor / Party Name</label>
                                    <input
                                        value={parsedData.partyName}
                                        onChange={(e) => updateField('partyName', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                                    <input
                                        value={parsedData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Bill Number</label>
                                    <input
                                        value={parsedData.billNumber}
                                        onChange={(e) => updateField('billNumber', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Bill Date</label>
                                    <input
                                        type="date"
                                        value={parsedData.billDate}
                                        onChange={(e) => updateField('billDate', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">State of Supply</label>
                                    <input
                                        value={parsedData.stateOfSupply}
                                        onChange={(e) => updateField('stateOfSupply', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Notes / Description</label>
                                    <input
                                        value={parsedData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-2">Items ({parsedData.items.length})</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">#</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Item Name</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
                                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Unit</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Price</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Disc%</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Tax%</th>
                                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Amount</th>
                                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {parsedData.items.map((item, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                                                    <td className="px-3 py-2">
                                                        {editingItem === i ? (
                                                            <input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" autoFocus />
                                                        ) : (
                                                            <span className="font-medium">{item.name}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        {editingItem === i ? (
                                                            <input type="number" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} className="w-16 border rounded px-2 py-1 text-sm text-right" />
                                                        ) : item.quantity}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {editingItem === i ? (
                                                            <input value={item.unit} onChange={(e) => updateItem(i, 'unit', e.target.value)} className="w-16 border rounded px-2 py-1 text-sm" />
                                                        ) : item.unit}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        {editingItem === i ? (
                                                            <input type="number" value={item.priceUnit.amount} onChange={(e) => updateItem(i, 'pricePerUnit', e.target.value)} className="w-20 border rounded px-2 py-1 text-sm text-right" />
                                                        ) : `₹${item.priceUnit.amount.toFixed(2)}`}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        {editingItem === i ? (
                                                            <input type="number" value={item.discount.percent} onChange={(e) => updateItem(i, 'discountPercent', e.target.value)} className="w-16 border rounded px-2 py-1 text-sm text-right" />
                                                        ) : `${item.discount.percent}%`}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        {editingItem === i ? (
                                                            <input type="number" value={item.tax.rate} onChange={(e) => updateItem(i, 'taxRate', e.target.value)} className="w-16 border rounded px-2 py-1 text-sm text-right" />
                                                        ) : `${item.tax.rate}%`}
                                                    </td>
                                                    <td className="px-3 py-2 text-right font-medium">₹{item.amount.toFixed(2)}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => setEditingItem(editingItem === i ? null : i)}
                                                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                                                title={editingItem === i ? "Done" : "Edit"}
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => removeItem(i)}
                                                                className="p-1 hover:bg-red-100 rounded text-red-500"
                                                                title="Remove"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Sub Total</span>
                                        <span>₹{parsedData.subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="text-red-500">-₹{parsedData.totalDiscount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tax</span>
                                        <span>₹{parsedData.totalTax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base border-t pt-2">
                                        <span>Grand Total</span>
                                        <span>₹{parsedData.grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                    {step === 'upload' && (
                        <>
                            <button onClick={handleClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadAndParse}
                                disabled={!file}
                                className="px-6 py-2.5 bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Upload size={16} className="inline mr-2" />
                                Scan with AI
                            </button>
                        </>
                    )}
                    {step === 'review' && (
                        <>
                            <button onClick={reset} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                                Upload Different Bill
                            </button>
                            <button
                                onClick={handleUseData}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <><Loader2 size={16} className="inline mr-2 animate-spin" /> Adding Items & Creating Bill...</>
                                ) : (
                                    <><CheckCircle2 size={16} className="inline mr-2" /> Create Purchase Bill</>
                                )}
                            </button>
                        </>
                    )}
                    {step === 'processing' && (
                        <p className="text-sm text-gray-500 w-full text-center">Processing... please wait</p>
                    )}
                </div>
            </div>
        </div>
    );
}
