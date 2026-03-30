"use client";

import React, { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Info, Settings as SettingsIcon } from 'lucide-react';
import { fetchItemSettings, updateItemSettings } from '@/lib/api';

// --- Types ---

interface AdditionalField {
    enabled: boolean;
    label: string;
    format?: string;
}

interface CustomField {
    id: number;
    enabled: boolean;
    label: string;
    showInPrint: boolean;
}

interface ItemSettingsData {
    wholesalePrice: boolean;
    barcodeScanning: boolean;
    itemCategory: boolean;
    description: boolean;
    additionalFields: {
        mrp:      AdditionalField;
        serialNo: AdditionalField;
        batchNo:  AdditionalField;
        expDate:  AdditionalField & { format: string };
        mfgDate:  AdditionalField & { format: string };
        modelNo:  AdditionalField;
        size:     AdditionalField;
    };
    customFields: CustomField[];
}

const DEFAULT_SETTINGS: ItemSettingsData = {
    wholesalePrice: false,
    barcodeScanning: false,
    itemCategory: true,
    description: false,
    additionalFields: {
        mrp:      { enabled: false, label: 'MRP' },
        serialNo: { enabled: false, label: 'Serial No.' },
        batchNo:  { enabled: false, label: 'Batch No.' },
        expDate:  { enabled: false, label: 'Exp. Date', format: 'mm/yy' },
        mfgDate:  { enabled: false, label: 'Mfg. Date', format: 'dd/mm/yy' },
        modelNo:  { enabled: false, label: 'Model No.' },
        size:     { enabled: false, label: 'Size' },
    },
    customFields: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, enabled: false, label: '', showInPrint: false })),
};

interface ItemSettingsSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- Sub-components ---

const Toggle: FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

// --- Main Component ---

const ItemSettingsSlideOver: FC<ItemSettingsSlideOverProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<'main' | 'additional' | 'custom'>('main');
    const [settings, setSettings] = useState<ItemSettingsData>(DEFAULT_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchItemSettings()
                .then(data => setSettings({ ...DEFAULT_SETTINGS, ...data }))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    const save = async (patch: Partial<ItemSettingsData>) => {
        const updated = { ...settings, ...patch };
        setSettings(updated);
        try {
            await updateItemSettings(patch);
        } catch (e) {
            console.error('Failed to save item settings', e);
        }
    };

    const toggleMain = (key: keyof Pick<ItemSettingsData, 'wholesalePrice' | 'barcodeScanning' | 'itemCategory' | 'description'>) => {
        save({ [key]: !settings[key] });
    };

    const toggleAdditional = (key: keyof ItemSettingsData['additionalFields']) => {
        save({
            additionalFields: {
                ...settings.additionalFields,
                [key]: { ...settings.additionalFields[key], enabled: !settings.additionalFields[key].enabled }
            }
        });
    };

    const setAdditionalLabel = (key: keyof ItemSettingsData['additionalFields'], label: string) => {
        setSettings(s => ({
            ...s,
            additionalFields: { ...s.additionalFields, [key]: { ...s.additionalFields[key], label } }
        }));
    };

    const setAdditionalFormat = (key: 'expDate' | 'mfgDate', format: string) => {
        setSettings(s => ({
            ...s,
            additionalFields: { ...s.additionalFields, [key]: { ...s.additionalFields[key], format } }
        }));
    };

    const saveAdditional = () => {
        save({ additionalFields: settings.additionalFields });
    };

    const toggleCustomField = (id: number, key: 'enabled' | 'showInPrint') => {
        const updated = settings.customFields.map(f => f.id === id ? { ...f, [key]: !f[key] } : f);
        setSettings(s => ({ ...s, customFields: updated }));
    };

    const setCustomLabel = (id: number, label: string) => {
        const updated = settings.customFields.map(f => f.id === id ? { ...f, label } : f);
        setSettings(s => ({ ...s, customFields: updated }));
    };

    const saveCustomFields = async () => {
        setIsSaving(true);
        try {
            await updateItemSettings({ customFields: settings.customFields });
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="p-8 text-center text-sm text-gray-400">Loading...</div>;

        if (view === 'main') return (
            <div className="divide-y divide-gray-200">
                <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50" onClick={() => setView('additional')}>
                    <span className="text-sm text-gray-700">Additional Item Fields</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50" onClick={() => setView('custom')}>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Item Custom Fields</span>
                        <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                {([
                    { key: 'wholesalePrice', label: 'Wholesale Price' },
                    { key: 'barcodeScanning', label: 'Barcode Scan' },
                    { key: 'itemCategory',    label: 'Item Category' },
                    { key: 'description',     label: 'Description' },
                ] as const).map(({ key, label }) => (
                    <div key={key} className="flex justify-between items-center p-4">
                        <span className="text-sm text-gray-700">{label}</span>
                        <input
                            type="checkbox"
                            checked={settings[key]}
                            onChange={() => toggleMain(key)}
                            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        );

        if (view === 'additional') {
            const af = settings.additionalFields;
            return (
                <div className="p-4 space-y-4">
                    {/* MRP */}
                    <h3 className="font-bold text-gray-800">MRP/Price</h3>
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">MRP</label>
                        <div className="flex items-center gap-2">
                            <input type="text" value={af.mrp.label} onChange={e => setAdditionalLabel('mrp', e.target.value)} onBlur={saveAdditional} className="p-1 border rounded-md w-24 text-center text-sm" />
                            <input type="checkbox" checked={af.mrp.enabled} onChange={() => toggleAdditional('mrp')} className="h-4 w-4 rounded cursor-pointer" />
                        </div>
                    </div>

                    {/* Serial No. */}
                    <h3 className="font-bold text-gray-800 pt-2 border-t mt-4">Serial No. Tracking</h3>
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Serial No. / IMEI etc.</label>
                        <div className="flex items-center gap-2">
                            <input type="text" value={af.serialNo.label} onChange={e => setAdditionalLabel('serialNo', e.target.value)} onBlur={saveAdditional} className="p-1 border rounded-md w-24 text-center text-sm" />
                            <input type="checkbox" checked={af.serialNo.enabled} onChange={() => toggleAdditional('serialNo')} className="h-4 w-4 rounded cursor-pointer" />
                        </div>
                    </div>

                    {/* Batch Tracking */}
                    <h3 className="font-bold text-gray-800 pt-2 border-t mt-4">Batch Tracking</h3>
                    {([
                        { key: 'batchNo' as const, label: 'Batch No.' },
                        { key: 'modelNo' as const, label: 'Model No.' },
                        { key: 'size' as const,    label: 'Size' },
                    ]).map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">{label}</label>
                            <div className="flex items-center gap-2">
                                <input type="text" value={af[key].label} onChange={e => setAdditionalLabel(key, e.target.value)} onBlur={saveAdditional} className="p-1 border rounded-md w-24 text-center text-sm" />
                                <input type="checkbox" checked={af[key].enabled} onChange={() => toggleAdditional(key)} className="h-4 w-4 rounded cursor-pointer" />
                            </div>
                        </div>
                    ))}

                    {/* Exp Date */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Exp Date</label>
                        <div className="flex items-center gap-2">
                            <select value={af.expDate.format} onChange={e => setAdditionalFormat('expDate', e.target.value)} onBlur={saveAdditional} className="text-sm border rounded p-1">
                                <option value="mm/yy">mm/yy</option>
                                <option value="dd/mm/yy">dd/mm/yy</option>
                                <option value="mm/yyyy">mm/yyyy</option>
                            </select>
                            <input type="text" value={af.expDate.label} onChange={e => setAdditionalLabel('expDate', e.target.value)} onBlur={saveAdditional} className="p-1 border rounded-md w-24 text-center text-sm" />
                            <input type="checkbox" checked={af.expDate.enabled} onChange={() => toggleAdditional('expDate')} className="h-4 w-4 rounded cursor-pointer" />
                        </div>
                    </div>

                    {/* Mfg Date */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Mfg Date</label>
                        <div className="flex items-center gap-2">
                            <select value={af.mfgDate.format} onChange={e => setAdditionalFormat('mfgDate', e.target.value)} onBlur={saveAdditional} className="text-sm border rounded p-1">
                                <option value="dd/mm/yy">dd/mm/yy</option>
                                <option value="mm/yy">mm/yy</option>
                                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                            </select>
                            <input type="text" value={af.mfgDate.label} onChange={e => setAdditionalLabel('mfgDate', e.target.value)} onBlur={saveAdditional} className="p-1 border rounded-md w-24 text-center text-sm" />
                            <input type="checkbox" checked={af.mfgDate.enabled} onChange={() => toggleAdditional('mfgDate')} className="h-4 w-4 rounded cursor-pointer" />
                        </div>
                    </div>
                </div>
            );
        }

        if (view === 'custom') return (
            <div className="p-4">
                {settings.customFields.map(field => (
                    <div key={field.id} className="mb-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={field.enabled}
                                onChange={() => toggleCustomField(field.id, 'enabled')}
                                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <div className="flex-grow">
                                <label className="text-sm font-semibold text-gray-700">Custom Field {field.id} *</label>
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={e => setCustomLabel(field.id, e.target.value)}
                                    placeholder={['E.g: Colour', 'E.g: Material', 'E.g: Mfg. Date', 'E.g: Exp. Date', 'E.g: Size', 'E.g: Brand'][field.id - 1]}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-2 ml-7 flex items-center">
                            <Toggle checked={field.showInPrint} onChange={() => toggleCustomField(field.id, 'showInPrint')} />
                            <span className="ml-2 text-sm text-gray-600">Show in print</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getTitle = () => {
        if (view === 'additional') return 'Additional Item Fields';
        if (view === 'custom') return 'Item Custom Fields';
        return 'Item Settings';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000]">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40"
                    />
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                            <div className="flex items-center gap-2">
                                {view !== 'main' && (
                                    <button onClick={() => setView('main')} className="p-1 rounded-full hover:bg-gray-100">
                                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                                    </button>
                                )}
                                <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto">{renderContent()}</div>

                        <div className="p-4 border-t flex-shrink-0">
                            {view === 'main' && (
                                <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold">
                                    <SettingsIcon className="h-4 w-4" /> More Settings
                                </button>
                            )}
                            {view === 'custom' && (
                                <button
                                    onClick={saveCustomFields}
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg disabled:opacity-60"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ItemSettingsSlideOver;
