"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import CheckboxWithLabel from './CheckboxWithLabel';
import AdditionalField from './AdditionalField';

const PartySettings = () => {
    const [enableReminder, setEnableReminder] = useState(true);

    return (
        <div className="max-w-7xl mx-auto text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-8">

                {/* Column 1: Party Settings */}
                <div>
                    <h3 className="font-bold text-base text-gray-800 mb-1">Party Settings</h3>
                    <hr className="mb-6"/>
                    <div className="space-y-5">
                        <CheckboxWithLabel id="party-grouping" label="Party Grouping" checked={false} onChange={()=>{}} info tooltipText="Organize parties into different groups for easier management." />
                        <CheckboxWithLabel id="shipping-address" label="Shipping Address" checked={false} onChange={()=>{}} info tooltipText="Add a separate shipping address for parties." />
                        <CheckboxWithLabel id="party-status" label="Manage Party Status" checked={false} onChange={()=>{}} info tooltipText="Set parties as active or inactive." />
                        
                        <div>
                            <CheckboxWithLabel id="payment-reminder" label="Enable Payment Reminder" checked={enableReminder} onChange={setEnableReminder} info tooltipText="Automatically remind parties about due payments." />
                            
                            {enableReminder && (
                                <div className="pl-8 mt-4 space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-700">Remind me for payment due in</span>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                defaultValue="1"
                                                className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                                <ChevronUp className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                                                <ChevronDown className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                                            </div>
                                        </div>
                                        <span className="text-gray-700">(days)</span>
                                    </div>
                                    <button className="px-4 py-1.5 bg-gray-100 text-[var(--text-link-active)] font-semibold rounded-md hover:bg-gray-200 transition-colors text-xs">
                                        Reminder Message &gt;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Additional Fields */}
                <div>
                    <h3 className="font-bold text-base text-gray-800 mb-1 flex items-center">
                        Additional fields
                        <span className="relative group flex items-center ml-1.5">
                            <CheckboxWithLabel id="info-icon" label="" checked={false} onChange={()=>{}} info tooltipText="Add custom fields to store extra information about your parties." />
                        </span>
                    </h3>
                    <hr className="mb-6"/>
                    <div className="space-y-6">
                        <AdditionalField id="1" label="Additional Field 1" />
                        <AdditionalField id="2" label="Additional Field 2" />
                        <AdditionalField id="3" label="Additional Field 3" />
                        <AdditionalField id="4" label="Additional Field 4" fieldType="date" />
                    </div>
                </div>

                {/* Column 3: Enable Loyalty Point */}
                <div>
                    <h3 className="font-bold text-base text-gray-800 mb-1">Enable Loyalty Point</h3>
                    <hr className="mb-6"/>
                    <CheckboxWithLabel id="loyalty-point" label="Enable Loyalty Point" checked={false} onChange={()=>{}} info tooltipText="Reward your loyal customers with points for their purchases." />
                </div>
            </div>
        </div>
    );
};

export default PartySettings;