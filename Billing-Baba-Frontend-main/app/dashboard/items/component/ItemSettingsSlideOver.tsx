"use client";

import React, { useState, FC } from 'react'; // Import FC for component types
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Info, Settings as SettingsIcon } from 'lucide-react';

// --- Type Definitions for Component Props ---

interface SettingRowProps {
    label: string;
    onClick?: () => void;
    hasCheckbox?: boolean;
    isChecked?: boolean;
    onToggle?: () => void;
}

interface CustomFieldRowProps {
    id: number;
    placeholder: string;
}

interface ItemSettingsSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
}


// --- Reusable Components with TypeScript Types ---

const SettingRow: FC<SettingRowProps> = ({ label, onClick, hasCheckbox = false, isChecked = false, onToggle = () => { } }) => (
    <div onClick={onClick} className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${onClick ? '' : 'cursor-default'}`}>
        <span className="text-sm text-gray-700">{label}</span>
        {hasCheckbox ? (
            <input type="checkbox" checked={isChecked} onChange={onToggle} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
        ) : (
            onClick && <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
    </div>
);

const CustomFieldRow: FC<CustomFieldRowProps> = ({ id, placeholder }) => (
    <div className="mb-4">
        <div className="flex items-center gap-3">
            <input type="checkbox" id={`cf-check-${id}`} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
            <div className="flex-grow">
                <label htmlFor={`cf-input-${id}`} className="text-sm font-semibold text-gray-700">Custom Field {id} *</label>
                <input type="text" id={`cf-input-${id}`} placeholder={placeholder} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm" />
            </div>
        </div>
        <div className="mt-2 ml-7 flex items-center">
            <button type="button" className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
            <span className="ml-2 text-sm text-gray-600">Show in print</span>
        </div>
    </div>
);


// --- Main Slide-Over Component ---

const ItemSettingsSlideOver: FC<ItemSettingsSlideOverProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<'main' | 'additional' | 'custom'>('main');

    const renderContent = () => {
        // Main Settings View
        if (view === 'main') {
            return (
                <div className="divide-y divide-gray-200">
                    <SettingRow label="Additional Item Fields" onClick={() => setView('additional')} />
                    <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50" onClick={() => setView('custom')}>
                        <div className="flex items-center gap-2"><span className="text-sm text-gray-700">Item Custom Fields</span><Info className="h-4 w-4 text-gray-400" /></div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <SettingRow label="Wholesale Price" hasCheckbox={true} />
                    <SettingRow label="Barcode Scan" hasCheckbox={true} />
                    <SettingRow label="Item Category" hasCheckbox={true} isChecked={true} />
                    <SettingRow label="Description" hasCheckbox={true} />
                </div>
            );
        }
        // Additional Fields View
        if (view === 'additional') {
            return (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold text-gray-800">MRP/Price</h3>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">MRP</label><div className="flex items-center gap-2"><input type="text" defaultValue="MRP" className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                    <h3 className="font-bold text-gray-800 pt-2 border-t mt-4">Serial No. Tracking</h3>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">Serial No. / IMEI etc.</label><div className="flex items-center gap-2"><input type="text" defaultValue="Serial No." className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                    <h3 className="font-bold text-gray-800 pt-2 border-t mt-4">Batch Tracking</h3>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">Batch No.</label><div className="flex items-center gap-2"><input type="text" defaultValue="Batch No." className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">Exp Date</label><div className="flex items-center gap-2"><select className="text-sm border-none"><option>mm/yy</option></select><input type="text" defaultValue="Exp. Date" className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">Mfg Date</label><div className="flex items-center gap-2"><select className="text-sm border-none"><option>dd/mm/yy</option></select><input type="text" defaultValue="Mfg. Date" className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">Model No.</label><div className="flex items-center gap-2"><input type="text" defaultValue="Model No." className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                    <div className="flex items-center justify-between"><label className="text-sm text-gray-600">Size</label><div className="flex items-center gap-2"><input type="text" defaultValue="Size" className="p-1 border rounded-md w-24 text-center text-sm" /><input type="checkbox" className="h-4 w-4 rounded" /></div></div>
                </div>
            );
        }
        // Custom Fields View
        if (view === 'custom') {
            return (
                <div className="p-4">
                    <CustomFieldRow id={1} placeholder="E.g: Colour" />
                    <CustomFieldRow id={2} placeholder="E.g: Material" />
                    <CustomFieldRow id={3} placeholder="E.g: Mfg. Date" />
                    <CustomFieldRow id={4} placeholder="E.g: Exp. Date" />
                    <CustomFieldRow id={5} placeholder="E.g: Size" />
                    <CustomFieldRow id={6} placeholder="E.g: Brand" />
                </div>
            );
        }
    };

    const getTitle = () => {
        if (view === 'additional') return "Additional Item Fields";
        if (view === 'custom') return "Item Custom Fields";
        return "Item Settings";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                            <div className="flex items-center gap-2">
                                {view !== 'main' && (
                                    <button onClick={() => setView('main')} className="p-1 rounded-full hover:bg-gray-100"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
                                )}
                                <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X className="h-5 w-5 text-gray-600" /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {renderContent()}
                        </div>
                        <div className="p-4 border-t flex-shrink-0">
                            {view === 'main' && (
                                <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold">
                                    <SettingsIcon className="h-4 w-4" /> More Settings
                                </button>
                            )}
                            {view === 'custom' && (
                                <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg">Save</button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default ItemSettingsSlideOver;