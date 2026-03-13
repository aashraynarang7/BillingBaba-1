"use client";

import React, { useState } from 'react';
import RegularPrinterSettings from './RegularPrinterSettings';
import ThermalPrinterSettings from './ThermalPrinterSettings';

const PrintSettings = () => {
    const [activePrinter, setActivePrinter] = useState<'regular' | 'thermal'>('regular');

    return (
        <div className="h-full w-full bg-white flex flex-col text-sm">
            <div className="px-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setActivePrinter('regular')}
                        className={`py-3 font-bold text-base border-b-2 transition-colors ${activePrinter === 'regular' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                    >
                        REGULAR PRINTER
                    </button>
                    <button 
                        onClick={() => setActivePrinter('thermal')}
                        className={`py-3 font-bold text-base border-b-2 transition-colors ${activePrinter === 'thermal' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                    >
                        THERMAL PRINTER
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {activePrinter === 'regular' ? <RegularPrinterSettings /> : <ThermalPrinterSettings />}
            </div>
        </div>
    );
};

export default PrintSettings;