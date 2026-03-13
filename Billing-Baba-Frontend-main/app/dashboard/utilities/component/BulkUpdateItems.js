"use client";

import React, { useState, useMemo } from 'react';
import { Icons } from './icons';

const initialItems = [
    { id: 1, itemName: 'Board', category: '--', purchasePrice: 100, purchaseTaxType: 'Excluded', salePrice: 100, saleTaxType: 'Excluded', discount: '--', discountType: 'Percentage', taxRate: 'None' },
    { id: 2, itemName: 'Keyboard', category: '--', purchasePrice: '---', purchaseTaxType: 'Excluded', salePrice: '---', saleTaxType: 'Excluded', discount: '--', discountType: 'Percentage', taxRate: 'None' },
];

const taxTypes = ['Excluded', 'Included'];
const discountTypes = ['Percentage', 'Amount'];
const taxRates = ['None', 'GST @5%', 'GST @12%', 'GST @18%'];
const categories = ['--', 'Hardware', 'Software', 'Accessories'];

const BulkUpdateItems = () => {
    const [activeView, setActiveView] = useState('pricing');
    const [items, setItems] = useState(initialItems);
    const [updatedFields, setUpdatedFields] = useState({});

    const handleUpdate = (id, field, value) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
        setUpdatedFields(prev => ({
            ...prev,
            [`${id}-${field}`]: value
        }));
    };

    const updateCounts = useMemo(() => {
        const pricingUpdates = Object.keys(updatedFields).filter(key => ['purchasePrice', 'salePrice', 'discount', 'discountType', 'taxRate'].some(field => key.endsWith(field))).length;
        // Aap yahan 'stock' aur 'itemInformation' ke liye bhi logic add kar sakte hain
        const stockUpdates = 0;
        const itemInfoUpdates = Object.keys(updatedFields).filter(key => ['itemName', 'category'].some(field => key.endsWith(field))).length;
        
        return { pricing: pricingUpdates, stock: stockUpdates, itemInformation: itemInfoUpdates };
    }, [updatedFields]);
    
    const totalUpdates = Object.keys(updatedFields).length > 0;

    const renderTableHeader = () => (
        <thead className="bg-secondary">
            <tr>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-10">#</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">Item Name* <Icons.Filter className="text-muted-foreground" /></div>
                </th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">Category <Icons.Filter className="text-muted-foreground" /></div>
                </th>
                {activeView === 'pricing' && (
                    <>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Purchase P... <Icons.Filter className="text-muted-foreground" /></div></th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Tax Type <Icons.Filter className="text-muted-foreground" /></div></th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Sale Price <Icons.Filter className="text-muted-foreground" /></div></th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Tax Type <Icons.Filter className="text-muted-foreground" /></div></th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Discount O... <Icons.Filter className="text-muted-foreground" /></div></th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Discount Type <Icons.Filter className="text-muted-foreground" /></div></th>
                        <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"><div className="flex items-center gap-2">Tax Rate <Icons.Filter className="text-muted-foreground" /></div></th>
                    </>
                )}
            </tr>
        </thead>
    );

    const renderTableBody = () => (
        <tbody>
            {items.map((item, index) => (
                <tr key={item.id} className="border-b border-border">
                    <td className="p-3 text-sm text-foreground">{index + 1}</td>
                    <td className="p-3 text-sm text-foreground">{item.itemName}</td>
                    <td className="p-3">
                        <SelectCell value={item.category} options={categories} onChange={(e) => handleUpdate(item.id, 'category', e.target.value)} />
                    </td>
                    {activeView === 'pricing' && (
                        <>
                            <td className="p-3"><InputCell value={item.purchasePrice} onChange={(e) => handleUpdate(item.id, 'purchasePrice', e.target.value)} /></td>
                            <td className="p-3"><SelectCell value={item.purchaseTaxType} options={taxTypes} onChange={(e) => handleUpdate(item.id, 'purchaseTaxType', e.target.value)} /></td>
                            <td className="p-3"><InputCell value={item.salePrice} onChange={(e) => handleUpdate(item.id, 'salePrice', e.target.value)} /></td>
                            <td className="p-3"><SelectCell value={item.saleTaxType} options={taxTypes} onChange={(e) => handleUpdate(item.id, 'saleTaxType', e.target.value)} /></td>
                            <td className="p-3"><InputCell value={item.discount} onChange={(e) => handleUpdate(item.id, 'discount', e.target.value)} isText={true} /></td>
                            <td className="p-3"><SelectCell value={item.discountType} options={discountTypes} onChange={(e) => handleUpdate(item.id, 'discountType', e.target.value)} /></td>
                            <td className="p-3"><SelectCell value={item.taxRate} options={taxRates} onChange={(e) => handleUpdate(item.id, 'taxRate', e.target.value)} /></td>
                        </>
                    )}
                </tr>
            ))}
        </tbody>
    );

    return (
        <div className="p-4 sm:p-6 bg-background-light min-h-screen">
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-foreground">Bulk Update Items</h1>
                    <div className="flex items-center gap-6 text-sm text-foreground">
                        {['Pricing', 'Stock', 'Item Information'].map(view => (
                            <label key={view} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="view"
                                    value={view.toLowerCase().replace(' ', '')}
                                    checked={activeView === view.toLowerCase().replace(' ', '')}
                                    onChange={(e) => setActiveView(e.target.value)}
                                    className="peer sr-only"
                                />
                                <span className="w-4 h-4 rounded-full border-2 border-muted-foreground mr-2 peer-checked:bg-primary peer-checked:border-primary"></span>
                                {view}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        {renderTableHeader()}
                        {renderTableBody()}
                    </table>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex justify-between items-center shadow-md">
                <div className="bg-secondary text-secondary-foreground text-sm py-2 px-4 rounded-md">
                    <span><strong>Pricing</strong> - {updateCounts.pricing} Updates, </span>
                    <span><strong>Stock</strong> - {updateCounts.stock} Updates, </span>
                    <span><strong>Item Information</strong> - {updateCounts.itemInfoUpdates} Updates</span>
                </div>
                <button
                    disabled={!totalUpdates}
                    className="bg-primary text-primary-foreground font-semibold px-8 py-2 rounded-md transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

const InputCell = ({ value, onChange, isText = false }) => (
    <div className="flex items-center gap-1 text-sm">
        {!isText && <span className="text-muted-foreground">₹</span>}
        <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full bg-transparent focus:outline-none p-1"
        />
    </div>
);

const SelectCell = ({ value, options, onChange }) => (
    <div className="relative w-full">
        <select
            value={value}
            onChange={onChange}
            className="w-full appearance-none bg-transparent text-sm p-1 pr-6 focus:outline-none cursor-pointer"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
            <Icons.ChevronDown />
        </div>
    </div>
);

export default BulkUpdateItems;