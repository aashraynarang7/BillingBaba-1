"use client";

import React, { useState } from 'react';

interface ToggleSwitchProps {
    label: string;
    initialChecked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, initialChecked = false }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);

    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative">
                <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                />
                <div className={`block w-10 h-5 rounded-full transition-colors ${isChecked ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isChecked ? 'translate-x-5' : ''}`}></div>
            </div>
            <div className="ml-3 text-gray-700 font-medium">
                {label}
            </div>
        </label>
    );
};

export default ToggleSwitch;