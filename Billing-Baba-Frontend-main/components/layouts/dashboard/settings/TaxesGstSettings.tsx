"use client";

import React from 'react';
import { Youtube } from 'lucide-react';
import CheckboxWithLabel from './CheckboxWithLabel';
import SettingsLinkButton from './SettingsLinkButton';

const TaxesGstSettings = () => {
    return (
        <div className="max-w-xl text-sm">
            <h3 className="font-bold text-base text-gray-800 mb-1">GST Settings</h3>
            <hr className="mb-6"/>

            <div className="space-y-5">
                <CheckboxWithLabel 
                    id="enable-gst" 
                    label="Enable GST" 
                    checked={true} 
                    onChange={() => {}} 
                    info 
                    tooltipText="Enable this to apply GST rates to your transactions."
                />
                <CheckboxWithLabel 
                    id="enable-hsn" 
                    label="Enable HSN/SAC Code" 
                    checked={true} 
                    onChange={() => {}} 
                    info
                    tooltipText="Show HSN/SAC codes for items on your invoices."
                />
                <CheckboxWithLabel 
                    id="additional-cess" 
                    label="Additional Cess On Item" 
                    checked={false} 
                    onChange={() => {}} 
                    info
                    tooltipText="Apply additional cess charges on specific items."
                />
                <CheckboxWithLabel 
                    id="reverse-charge" 
                    label="Reverse Charge" 
                    checked={false} 
                    onChange={() => {}} 
                    info
                    tooltipText="Enable reverse charge mechanism for applicable transactions."
                />
                <CheckboxWithLabel 
                    id="place-of-supply" 
                    label="Enable Place of Supply" 
                    checked={true} 
                    onChange={() => {}} 
                    info
                    tooltipText="Specify the place of supply for accurate GST calculation."
                />
                <CheckboxWithLabel 
                    id="composite-scheme" 
                    label="Composite Scheme" 
                    checked={false} 
                    onChange={() => {}} 
                    info
                    tooltipText="Enable this if your business is registered under the GST Composite Scheme."
                />
                <CheckboxWithLabel 
                    id="enable-tcs" 
                    label="Enable TCS" 
                    checked={false} 
                    onChange={() => {}} 
                    info
                    tooltipText="Enable Tax Collected at Source (TCS) for relevant sales."
                />
                <CheckboxWithLabel 
                    id="enable-tds" 
                    label="Enable TDS" 
                    checked={false} 
                    onChange={() => {}} 
                    info
                    tooltipText="Enable Tax Deducted at Source (TDS) for relevant payments."
                >
                    <Youtube className="h-4 w-4 text-red-500 ml-1.5 cursor-pointer"/>
                </CheckboxWithLabel>
            </div>
            
            <div className="mt-8">
                 <button className="px-5 py-2 bg-gray-100 text-[var(--text-link-active)] font-semibold rounded-md hover:bg-gray-200 transition-colors">
                    Tax List &gt;
                </button>
            </div>
        </div>
    );
};

export default TaxesGstSettings;