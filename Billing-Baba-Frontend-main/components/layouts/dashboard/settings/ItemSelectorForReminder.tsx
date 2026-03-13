"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle, Search, FileText, Plus } from 'lucide-react';
import FilterButton from './FilterButton';
import CheckboxWithLabel from './CheckboxWithLabel';

interface Item {
    id: number;
    name: string;
    type: 'product' | 'service';
}

const allItemsData: Item[] = [
    { id: 1, name: 'Board', type: 'product' },
    { id: 2, name: 'Keyboard', type: 'product' },
];

const ItemSelectorForReminder = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'services'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const filteredItems = useMemo(() => {
        const items = allItemsData
            .filter(item => {
                if (activeFilter === 'products') return item.type === 'product';
                if (activeFilter === 'services') return item.type === 'service';
                return true;
            })
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return items;
    }, [activeFilter, searchTerm]);
    
    useEffect(() => {
        setSelectedItems([]);
    }, [activeFilter]);

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedItems(filteredItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    };

    const isAllSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <FileText className="h-20 w-20 text-gray-300 mb-4" strokeWidth={1} />
            <p className="font-semibold text-gray-700">Oops! You have not added any {activeFilter === 'all' ? 'items' : activeFilter} yet.</p>
            <p className="text-sm">Add your first item here by clicking on add below.</p>
            <button className="mt-4 bg-[var(--primary-red)] text-white font-semibold py-2 px-5 rounded-md flex items-center gap-2 hover:bg-[var(--primary-dark-red)] transition-colors">
                <Plus className="h-4 w-4" /> Add Item
            </button>
        </div>
    );

    return (
        <div className="h-full w-full bg-white flex flex-col text-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    Select Items for Reminder
                    <a href="#" className="ml-4 text-xs font-medium text-[var(--text-link-active)] flex items-center gap-1 hover:underline">
                        <PlayCircle className="h-4 w-4" /> See how it works
                    </a>
                </h2>
            </div>

            <div className="px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-600">Filter by:</span>
                    <div className="flex items-center gap-2">
                        <FilterButton label="All Items" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                        <FilterButton label="Products" isActive={activeFilter === 'products'} onClick={() => setActiveFilter('products')} />
                        <FilterButton label="Services" isActive={activeFilter === 'services'} onClick={() => setActiveFilter('services')} />
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search items" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--text-link-active)]"
                    />
                </div>
            </div>
            
            <div className="flex-1 px-6 overflow-y-auto thin-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">loading...</div>
                ) : filteredItems.length === 0 && searchTerm === '' ? (
                    <EmptyState />
                ) : (
                    <div className="border-t border-gray-200">
                         {filteredItems.length > 0 ? (
                            <>
                                <div className="py-3">
                                    <CheckboxWithLabel id="select-all" label="ALL ITEMS" checked={isAllSelected} onChange={handleSelectAll} />
                                </div>
                                <div className="space-y-3 border-t border-gray-200 pt-3">
                                    {filteredItems.map(item => (
                                        <CheckboxWithLabel 
                                            key={item.id}
                                            id={`item-${item.id}`}
                                            label={item.name}
                                            checked={selectedItems.includes(item.id)}
                                            onChange={(isChecked) => handleSelectItem(item.id, isChecked)}
                                        />
                                    ))}
                                </div>
                            </>
                         ) : (
                            <div className="pt-10 text-center text-gray-500">No items found for your search.</div>
                         )}
                    </div>
                )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
                <button 
                    disabled={selectedItems.length === 0}
                    className={`px-8 py-2 rounded-md font-semibold text-white transition-colors
                    ${selectedItems.length > 0 ? 'bg-[var(--primary-red)] hover:bg-[var(--primary-dark-red)]' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default ItemSelectorForReminder;