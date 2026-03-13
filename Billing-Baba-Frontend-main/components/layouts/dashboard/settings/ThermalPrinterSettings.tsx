"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import CheckboxWithLabel from './CheckboxWithLabel';
import LayoutCarousel from './LayoutCarousel';
import SettingsSection from './SettingsSection';

const thermalThemes = [
    { name: 'Theme 1', image: '/Logo1.png' },
    { name: 'Theme 2', image: '/Logo1.png' },
    { name: 'Theme 3', image: '/Logo1.png' },
    { name: 'Theme 4', image: '/Logo1.png' },
    { name: 'Theme 5', image: '/Logo1.png' },
];

const ThermalPrinterSettings = () => {
    const [selectedTheme, setSelectedTheme] = useState(thermalThemes[0].name);

     const getPreviewImagePath = () => {
        const theme = thermalThemes.find(t => t.name === selectedTheme);
        return theme ? theme.image : '/images/invoices/thermal/placeholder.png';
    };

    return (
        <div className="flex h-full">
            {/* Left Controls Column */}
            <div className="w-1/2 p-6 overflow-y-auto thin-scrollbar border-r border-gray-200">
                <LayoutCarousel themes={thermalThemes} selected={selectedTheme} onSelect={setSelectedTheme} />

                <div className="space-y-6 mt-6">
                    <SettingsSection title="Page Size">
                        {/* Page size buttons would go here */}
                    </SettingsSection>
                    <SettingsSection title="Printing Type">
                        <CheckboxWithLabel id="text-styling" label="Use Text Styling(Bold)" checked={true} onChange={()=>{}} />
                        <CheckboxWithLabel id="auto-cut" label="Auto Cut Paper After Printing" checked={false} onChange={()=>{}} />
                        <CheckboxWithLabel id="open-drawer" label="Open Cash Drawer After Printing" checked={false} onChange={()=>{}} info />
                    </SettingsSection>
                     <SettingsSection title="Vyapar Printer Setup">
                        {/* Download buttons would go here */}
                    </SettingsSection>
                </div>
            </div>

             {/* Right Preview Column */}
            <div className="w-1/2 p-6 bg-gray-50 flex items-center justify-center overflow-y-auto">
                 <div className="w-full max-w-sm shadow-lg">
                    <Image 
                        key={getPreviewImagePath()}
                        src={getPreviewImagePath()}
                        alt={`${selectedTheme} Thermal Preview`}
                        width={400}
                        height={800}
                        className="w-full h-auto border"
                    />
                 </div>
            </div>
        </div>
    );
};

export default ThermalPrinterSettings;