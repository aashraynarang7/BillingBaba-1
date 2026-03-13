// src/component/StockAdjustmentModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

// Step 1: Define a type for the component's props
type StockAdjustmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
};

// Step 2: Apply the props type to your component's arguments
export default function StockAdjustmentModal({ isOpen, onClose, itemName }: StockAdjustmentModalProps) {
    const [isAddStock, setIsAddStock] = useState(true);
    const [adjustmentDate, setAdjustmentDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            setAdjustmentDate(`${month}/${day}/${year}`);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Stock Adjustment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        {/* Toggle Switch */}
                        <div className="flex items-center gap-4">
                             <span className={`cursor-pointer font-semibold ${isAddStock ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setIsAddStock(true)}>
                                Add Stock
                            </span>
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={!isAddStock}
                                    onChange={() => setIsAddStock(!isAddStock)}
                                    className="sr-only" 
                                    id="stock-toggle"
                                />
                                <div onClick={() => setIsAddStock(!isAddStock)} className={`w-12 h-6 rounded-full cursor-pointer ${isAddStock ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                     <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isAddStock ? 'transform translate-x-0' : 'transform translate-x-6'}`}></div>
                                </div>
                            </div>
                            <span className={`cursor-pointer font-semibold ${!isAddStock ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setIsAddStock(false)}>
                                Reduce Stock
                            </span>
                        </div>
                        {/* Adjustment Date */}
                        <div className="relative">
                            <label htmlFor="adjustmentDate" className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-500">Adjustment Date</label>
                            <input
                                type="text"
                                id="adjustmentDate"
                                value={adjustmentDate}
                                // Step 3: Add type for the event object 'e'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdjustmentDate(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                         <p className="text-sm text-gray-500">Item Name</p>
                         <p className="font-semibold text-gray-800 text-lg">{itemName}</p>
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="number" placeholder="Total Qty" className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input type="number" placeholder="At Price" className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input type="text" placeholder="Details" className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-1" />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}