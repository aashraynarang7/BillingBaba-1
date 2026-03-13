"use client";

import React, { useState } from 'react';
import { Info, ChevronUp, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import CheckboxWithLabel from './CheckboxWithLabel';

const GeneralSettings = () => {
    const [zoomLevel, setZoomLevel] = useState(100);

    return (
        <div className="max-w-7xl mx-auto text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
                
                {/* Column 1: Application & More Transactions */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Application</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="enable-passcode" label="Enable Passcode" checked={false} onChange={() => {}} info />
                            
                            <div className="flex justify-between items-center">
                                <label htmlFor="business-currency" className="flex items-center text-gray-700 font-medium">
                                    Business Currency
                                    <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
                                </label>
                                <div className="relative flex items-center">
                                    <span className="mr-2 font-semibold">₹</span>
                                    <ChevronRight className="h-4 w-4 text-gray-500 cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="amount-decimal" className="flex items-center text-gray-700 font-medium mb-1">
                                    Amount <span className="text-xs text-gray-500 ml-1">(upto Decimal Places)</span>
                                    <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
                                </label>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <input
                                            id="amount-decimal"
                                            type="number"
                                            defaultValue="2"
                                            className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                            <ChevronUp className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                                            <ChevronDown className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <span className="ml-3 text-gray-500">e.g. 0.00</span>
                                </div>
                            </div>
                            
                            <CheckboxWithLabel id="gstin" label="GSTIN Number" checked={true} onChange={() => {}} info />
                            <CheckboxWithLabel id="neg-stock" label="Stop Sale on Negative Stock" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="block-items" label="Block New Items from Txn Form" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="block-parties" label="Block New Parties from Txn Form" checked={false} onChange={() => {}} info />
                        </div>
                    </div>
                    
                    <hr />

                    <div className="space-y-4">
                        <h3 className="font-bold text-base text-gray-800">More Transactions</h3>
                        <CheckboxWithLabel id="estimate" label="Estimate/Quotation" checked={true} onChange={() => {}} info />
                        <CheckboxWithLabel id="proforma" label="Proforma Invoice" checked={true} onChange={() => {}} info />
                        <CheckboxWithLabel id="sale-order" label="Sale/Purchase Order" checked={true} onChange={() => {}} info />
                        <CheckboxWithLabel id="other-income" label="Other Income" checked={false} onChange={() => {}} info />
                        <CheckboxWithLabel id="fixed-assets" label="Fixed Assets (FA)" checked={false} onChange={() => {}} info />
                        <div>
                            <CheckboxWithLabel id="delivery-challan" label="Delivery Challan" checked={true} onChange={() => {}} info />
                            <div className="pl-8 mt-3 space-y-3">
                                <CheckboxWithLabel id="goods-return" label="Goods return on Delivery Challan" checked={true} onChange={() => {}} />
                                <CheckboxWithLabel id="print-amount" label="Print amount in Delivery Challan" checked={false} onChange={() => {}} info />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Multi Firm & Stock Transfer */}
                <div className="space-y-6 mt-6 lg:mt-0">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Multi Firm</h3>
                        <CheckboxWithLabel id="multi-firm" label="Multi Firm" checked={false} onChange={() => {}} />
                        <div className="mt-4 p-3 border border-gray-300 rounded-md flex justify-between items-center bg-white">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="firm" defaultChecked className="h-4 w-4 text-[var(--text-link-active)] focus:ring-[var(--text-link-active)]"/>
                                <span className="ml-3 font-medium text-gray-800">My Company</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500">DEFAULT</span>
                                <Pencil className="h-4 w-4 text-[var(--text-link-active)] cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800">Stock Transfer Between Godowns</h3>
                        <p className="text-gray-600 mt-1 mb-4 text-xs leading-relaxed">Manage all your stores/godowns and transfer stock seamlessly between them. Using this feature, you can transfer stock between stores/godowns and manage your inventory more efficiently.</p>
                        <CheckboxWithLabel id="godown-mgmt" label="Godown management & Stock transfer" checked={false} onChange={() => {}} info />
                    </div>
                </div>

                {/* Column 3: Backup & History, Customize View */}
                <div className="space-y-6 mt-6 lg:mt-0">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Backup & History</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="auto-backup" label="Auto Backup" checked={false} onChange={() => {}} info />
                            <div className="flex items-center text-gray-600 font-medium">
                                Last Backup 31/08/2025 | 12:08 PM
                                <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
                            </div>
                            <CheckboxWithLabel id="audit-trail" label="Audit Trail" checked={true} onChange={() => {}} info />
                        </div>
                    </div>
                    
                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800">Customize Your View</h3>
                        <p className="text-gray-600 mt-1 mb-4 text-xs leading-relaxed">You can use this setting to resize the Vyapar screen, making it larger or smaller to fit your preferences.</p>
                        <div className="bg-white p-4 rounded-lg border">
                           <label className="font-medium text-gray-700">Choose Your Screen Zoom/Scale</label>
                           <input 
                                type="range" 
                                min="70" 
                                max="130" 
                                step="5"
                                value={zoomLevel}
                                onChange={(e) => setZoomLevel(Number(e.target.value))}
                                className="w-full mt-4"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                                <span>70%</span><span>80%</span><span>90%</span><span>100%</span><span>110%</span><span>115%</span><span>120%</span><span>130%</span>
                            </div>
                           <button className="mt-4 float-right bg-blue-100 text-blue-700 font-semibold px-6 py-1.5 rounded-full hover:bg-blue-200 transition-colors">Apply</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GeneralSettings;