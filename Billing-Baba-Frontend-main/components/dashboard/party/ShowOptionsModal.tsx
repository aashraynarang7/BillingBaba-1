// components/ShowOptionsModal.tsx

"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShowOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShowOptionsModal = ({ isOpen, onClose }: ShowOptionsModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
             <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Show Options</h2>
                        <div className="space-y-4 text-gray-700">
                            {['Item Details', 'Description', 'Payment Info', 'Payment Status'].map(option => (
                                <label key={option} className="flex items-center justify-between cursor-pointer">
                                    <span>{option}</span>
                                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-[var(--text-link-active)] focus:ring-[var(--text-link-active)]" />
                                </label>
                            ))}
                        </div>
                    </div>
                     <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg gap-4">
                         <button onClick={onClose} className="text-[var(--text-link-active)] font-semibold px-4 py-2">CANCEL</button>
                         <button onClick={onClose} className="text-[var(--text-link-active)] font-semibold px-4 py-2">OK</button>
                    </div>
                </motion.div>
             </div>
        </AnimatePresence>
    )
};