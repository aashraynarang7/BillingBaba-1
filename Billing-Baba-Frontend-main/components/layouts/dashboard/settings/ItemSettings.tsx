"use client";

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import CheckboxWithLabel from './CheckboxWithLabel';
import SettingsSelect from './SettingsSelect';
import SettingsLinkButton from './SettingsLinkButton';
import CustomFieldRow from './CustomFieldRow';

const ItemSettings = () => {
    return (
        <div className="max-w-7xl mx-auto text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-8">

                {/* Column 1: Item Settings */}
                <div>
                    <h3 className="font-bold text-base text-gray-800 mb-1">Item Settings</h3>
                    <hr className="mb-6"/>
                    <div className="space-y-5">
                        <CheckboxWithLabel id="enable-item" label="Enable Item" checked={true} onChange={()=>{}} />
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">What do you sell?</label>
                            <SettingsSelect options={['Product/Service', 'Products Only', 'Services Only']} />
                        </div>
                        <CheckboxWithLabel id="barcode-scan" label="Barcode Scan" checked={false} onChange={()=>{}} />
                        <CheckboxWithLabel id="stock-maintenance" label="Stock Maintenance" checked={true} onChange={()=>{}} info tooltipText="Track inventory levels for your items." />
                        <CheckboxWithLabel id="manufacturing" label="Manufacturing" checked={false} onChange={()=>{}} info tooltipText="Manage manufacturing processes and bill of materials." />
                        <CheckboxWithLabel id="show-low-stock" label="Show Low Stock Dialog" checked={true} onChange={()=>{}} info tooltipText="Get alerts when item stock is low." />
                        <CheckboxWithLabel id="items-unit" label="Items Unit" checked={true} onChange={()=>{}} info tooltipText="Define units for items like pcs, kg, etc." />
                        <CheckboxWithLabel id="default-unit" label="Default Unit" checked={false} onChange={()=>{}} info tooltipText="Set a default unit for all new items." />
                        <CheckboxWithLabel id="item-category" label="Item Category" checked={true} onChange={()=>{}} />
                        <CheckboxWithLabel id="party-wise-rate" label="Party Wise Item Rate" checked={false} onChange={()=>{}} info tooltipText="Set different item rates for different parties." />
                        <CheckboxWithLabel id="description" label="Description" checked={false} onChange={()=>{}} >
                            <span className="ml-1 text-xs text-gray-500">(Change Text)</span>
                        </CheckboxWithLabel>
                        <CheckboxWithLabel id="item-wise-tax" label="Item wise Tax" checked={true} onChange={()=>{}} />
                        <CheckboxWithLabel id="item-wise-discount" label="Item wise Discount" checked={true} onChange={()=>{}} />
                        <CheckboxWithLabel id="update-sale-price" label="Update Sale Price from Transaction" checked={false} onChange={()=>{}} info tooltipText="Automatically update an item's sale price based on the last transaction." />
                        <div>
                            <label htmlFor="quantity-decimal" className="flex items-center text-gray-700 font-medium mb-1">
                                Quantity <span className="text-xs text-gray-500 ml-1">(upto Decimal Places)</span>
                            </label>
                            <div className="flex items-center">
                                <div className="relative">
                                    <input id="quantity-decimal" type="number" defaultValue="2" className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                        <ChevronUp className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                                        <ChevronDown className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                                    </div>
                                </div>
                                <span className="ml-3 text-gray-500">e.g. 0.00</span>
                            </div>
                        </div>
                        <CheckboxWithLabel id="wholesale-price" label="Wholesale Price" checked={false} onChange={()=>{}} info tooltipText="Set a separate wholesale price for items." />
                    </div>
                </div>

                {/* Column 2: Additional Item Fields */}
                <div>
                    <h3 className="font-bold text-base text-gray-800 mb-1">Additional Item Fields</h3>
                    <hr className="mb-6"/>
                    <div className="space-y-5">
                        <div>
                            <h4 className="font-semibold text-gray-600 mb-2">MRP/Price</h4>
                            <CustomFieldRow label="MRP" tooltipText="Maximum Retail Price" placeholder="MRP" />
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-600 mb-2">Serial No. Tracking</h4>
                            <CustomFieldRow label="Serial No./ IMEI No. etc" tooltipText="Track items by their unique serial or IMEI numbers." placeholder="Serial No." />
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-600 mb-2">Batch Tracking</h4>
                            <div className="space-y-3">
                                <CustomFieldRow label="Batch No." tooltipText="Track items in batches." placeholder="Batch No." />
                                <CustomFieldRow label="Exp Date" tooltipText="Expiry Date for the batch." placeholder="Exp. Date" inputType="date" />
                                <CustomFieldRow label="Mfg Date" tooltipText="Manufacturing Date for the batch." placeholder="Mfg. Date" inputType="date" />
                                <CustomFieldRow label="Model No." tooltipText="Model number for the item." placeholder="Model No." />
                                <CustomFieldRow label="Size" tooltipText="Size of the item (e.g., XL, Medium)." placeholder="Size" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Item Custom Fields */}
                <div>
                    <h3 className="font-bold text-base text-gray-800 mb-1 flex items-center">
                        Item Custom Fields
                        <span className="relative group flex items-center ml-1.5">
                            <CheckboxWithLabel id="info-icon" label="" checked={false} onChange={()=>{}} info tooltipText="Create your own custom fields for items." />
                        </span>
                    </h3>
                    <hr className="mb-6"/>
                    <SettingsLinkButton>Add Custom Fields</SettingsLinkButton>
                </div>
            </div>
        </div>
    );
};

export default ItemSettings;