"use client";

import React from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Contact } from 'lucide-react';

export interface Party {
    _id: string;
    name: string;
    currentBalance: number;
    phone?: string;
}

interface PartiesListProps {
    partiesData: Party[];
    selectedPartyId: string;
    onSelectParty: (id: string) => void;
}

export const PartiesList = ({ partiesData, selectedPartyId, onSelectParty }: PartiesListProps) => {
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-3 border-b border-gray-200 flex-shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search Party Name" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--text-link-active)] text-sm" />
                </div>
            </div>
            <div className="px-4 py-2 flex justify-between items-center bg-gray-50 text-xs font-medium text-gray-500 flex-shrink-0">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800"><span>Party Name</span><ArrowUpDown className="h-3 w-3" /></div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800"><Filter className="h-4 w-4" /><span>Amount</span></div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {partiesData.map(party => (
                    <div
                        key={party._id}
                        onClick={() => onSelectParty(party._id)}
                        className={`flex justify-between items-center px-4 py-3 cursor-pointer text-sm transition-colors ${selectedPartyId === party._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`font-medium ${selectedPartyId === party._id ? 'text-blue-700' : 'text-gray-700'}`}>{party.name}</span>
                            {party.phone && <span className="text-xs text-gray-400">{party.phone}</span>}
                        </div>
                        <span className={`font-semibold ${party.currentBalance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            ₹{Math.abs(party.currentBalance).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="p-3 mt-auto border-t border-gray-200 flex-shrink-0">
                <a href="#" className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center justify-between hover:bg-green-100 transition-colors group">
                    <div className="flex items-center gap-3"><Contact className="h-6 w-6 text-green-600" /><div><p className="text-sm">Easily convert your <span className="font-bold">Phone contacts</span> into parties</p></div></div>
                    <ChevronRight className="h-5 w-5 text-green-500 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </aside>
    );
};