// components/AddMoreModal.tsx
"use client";

import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface AddMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuColumns = [
  {
    title: 'SALE',
    items: [
      { name: 'Sale Invoice', shortcut: 'ALT + S', highlighted: true },
      { name: 'Payment-In', shortcut: 'ALT + I' },
      { name: 'Sale Return', subtitle: 'Cr Note', shortcut: 'ALT + R' },
      { name: 'Sale Order', shortcut: 'ALT + F' },
      { name: 'Estimate/Quotation', shortcut: 'ALT + M' },
      { name: 'Proforma Invoice', shortcut: 'ALT + K' },
      { name: 'Delivery Challan', shortcut: 'ALT + D' },
    ],
  },
  {
    title: 'PURCHASE',
    items: [
      { name: 'Purchase Bill', shortcut: 'ALT + P' },
      { name: 'Payment-Out', shortcut: 'ALT + O' },
      { name: 'Purchase Return', subtitle: 'Dr Note', shortcut: 'ALT + L' },
      { name: 'Purchase Order', shortcut: 'ALT + G' },
    ],
  },
  {
    title: 'OTHERS',
    items: [
      { name: 'Expenses', shortcut: 'ALT + E' },
      { name: 'Party To Party Transfer', shortcut: 'ALT + J' },
    ],
  },
];

const AddMoreModal: FC<AddMoreModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20"
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-[70px] right-6 w-full max-w-4xl bg-white rounded-lg shadow-2xl border border-gray-200/80"
          >
            <div className="absolute -top-2 right-[72px] h-4 w-4 bg-white border-t border-l border-gray-200/80 rotate-45"></div>
            
            <div className="p-8">
              <div className="grid grid-cols-3 gap-x-8">
                {menuColumns.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{column.title}</h3>
                    <ul className="space-y-1">
                      {column.items.map((item) => (
                        <li key={item.name}>
                          <a href="#" className={`flex justify-between items-center p-2 rounded-md transition-colors ${item.highlighted ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-2">
                              <Play className={`h-3 w-3 ${item.highlighted ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div>
                                <span className={`text-sm font-medium ${item.highlighted ? 'text-blue-600' : 'text-gray-700'}`}>{item.name}</span>
                                {item.subtitle && <p className="text-xs text-gray-400">{item.subtitle}</p>}
                              </div>
                            </div>
                            <span className="text-xs font-mono text-gray-400">{item.shortcut}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-100 border-t border-yellow-200 px-8 py-3 rounded-b-lg">
              <p className="text-sm text-yellow-800">
                Shortcut to open this menu : 
                <kbd className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md">Ctrl</kbd> + 
                <kbd className="ml-1 inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md">Enter</kbd>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMoreModal;