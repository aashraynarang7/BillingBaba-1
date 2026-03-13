"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


// A simple SVG component for the empty state icon, inspired by the image
const NoInvoiceIcon = () => (
    <div className="bg-blue-100 rounded-full p-6 relative">
        <div className="bg-blue-200 p-5 rounded-full">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                <path d="M15 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V7L15 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <span className="absolute top-4 left-4 text-blue-400 font-bold text-xl">+</span>
        <span className="absolute bottom-5 right-3 text-blue-400 font-bold text-lg">*</span>
        <span className="absolute top-6 right-5 text-blue-400 font-bold">*</span>
    </div>
);


// --- Main Vyapar Network Page Component ---
export default function VyaparNetworkPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filterRef = useRef<HTMLDivElement>(null);

    const filterOptions = ['All', 'Sent', 'Received'];

    // --- Logic to close dropdown on outside click ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterRef]);


    return (
        <div className="bg-slate-100 min-h-screen w-full font-sans p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Vyapar Network</h1>

            <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]">

                {/* Left Column: User List */}
                <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search Network" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"/>
                        </div>
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center bg-gray-50 text-sm font-semibold text-gray-600">
                        <span>Connected Users</span>
                        <span>Balance</span>
                    </div>
                    <div className="flex-grow"></div>
                </aside>

                {/* Right Column: Main Content */}
                <main className="w-full md:w-2/3 lg:w-3/4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
                    <div className="p-3 border-b border-gray-200 flex items-center">
                        <span className="text-sm text-gray-600 mr-3">Filter By :</span>
                        
                        {/* --- Filter Dropdown --- */}
                        <div className="relative" ref={filterRef}>
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-200 transition"
                            >
                                {selectedFilter === 'All' ? 'All Invoices' : selectedFilter}
                                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 py-2 border border-gray-100"
                                    >
                                        {filterOptions.map(option => (
                                            <button 
                                                key={option} 
                                                onClick={() => {
                                                    setSelectedFilter(option);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full flex justify-between items-center text-left px-4 py-2 text-gray-700 hover:bg-blue-50 ${selectedFilter === option ? 'bg-blue-100/70' : ''}`}
                                            >
                                                <span>{option}</span>
                                                {selectedFilter === option && <Check className="h-4 w-4 text-blue-600" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Empty State Content */}
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                        <NoInvoiceIcon />
                        <h2 className="text-xl font-bold text-gray-800 mt-6">No Invoice Shared</h2>
                        <p className="text-sm text-gray-500 mt-2 max-w-xs">
                            You have not sent or received an invoice with this party yet
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}