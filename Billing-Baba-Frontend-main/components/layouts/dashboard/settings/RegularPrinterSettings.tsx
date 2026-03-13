"use client";

import React, { useState } from 'react';
import CheckboxWithLabel from './CheckboxWithLabel';
import SettingsSection from './SettingsSection';
import SettingsLinkButton from './SettingsLinkButton';
import LayoutCarousel from './LayoutCarousel';
import ColorPicker from './ColorPicker';
import InvoicePreview from './invoice/InvoicePreview';

const regularThemes = [
    { name: 'Tally Theme', image: '/Logo1.png' },
    { name: 'Landscape Theme 1', image: '/Logo1.png' },
    { name: 'Landscape Theme 2', image: '/Logo1.png' },
    { name: 'GST Theme 1', image: '/Logo1.png' },
    { name: 'GST Theme 2', image: '/Logo1.png' },
    { name: 'GST Theme 3', image: '/Logo1.png' },
    { name: 'GST Theme 4', image: '/Logo1.png' },
];

const RegularPrinterSettings = () => {
    const [activeTab, setActiveTab] = useState<'layout' | 'colors'>('layout');
    const [selectedTheme, setSelectedTheme] = useState(regularThemes[3].name);
    const [selectedColor, setSelectedColor] = useState('#4A4A4A'); // Default dark gray

    return (
        <div className="flex h-full">
            {/* Left Controls Column */}
            <div className="w-1/2 pr-6 overflow-y-auto thin-scrollbar">
                <div className="flex items-center gap-1 border border-gray-300 rounded-md p-0.5 max-w-xs">
                    <button onClick={() => setActiveTab('layout')} className={`flex-1 py-1 rounded ${activeTab === 'layout' ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-100'}`}>CHANGE LAYOUT</button>
                    <button onClick={() => setActiveTab('colors')} className={`flex-1 py-1 rounded ${activeTab === 'colors' ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-100'}`}>CHANGE COLORS</button>
                </div>

                {activeTab === 'layout' ? (
                    <LayoutCarousel themes={regularThemes} selected={selectedTheme} onSelect={setSelectedTheme} />
                ) : (
                    <ColorPicker selected={selectedColor} onSelect={setSelectedColor} />
                )}

                <div className="space-y-6 mt-6">
                    <SettingsSection title="Print Company Info / Header">
                        <CheckboxWithLabel id="make-default" label="Make Regular Printer Default" checked={true} onChange={()=>{}} />
                        <CheckboxWithLabel id="repeat-header" label="Print repeat header in all pages" checked={true} onChange={()=>{}} info />
                        <CheckboxWithLabel id="company-name" label="Company Name" checked={true} onChange={()=>{}} info />
                        <input type="text" defaultValue="My Company" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                    </SettingsSection>
                </div>
            </div>

            {/* Right Preview Column - NOW A LIVE COMPONENT */}
            <div className="w-1/2 pl-6 bg-gray-50 flex items-start justify-center overflow-y-auto thin-scrollbar rounded-lg">
                 <div className="w-full my-4">
                    <InvoicePreview theme={selectedTheme} color={selectedColor} />
                 </div>
            </div>
        </div>
    );
};

export default RegularPrinterSettings;