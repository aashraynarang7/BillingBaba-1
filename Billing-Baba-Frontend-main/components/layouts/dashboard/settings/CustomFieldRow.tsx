"use client";

import React from 'react';
import CheckboxWithLabel from './CheckboxWithLabel';

interface CustomFieldRowProps {
    label: string;
    tooltipText?: string;
    placeholder: string;
    inputType?: 'text' | 'date';
}

const CustomFieldRow: React.FC<CustomFieldRowProps> = ({ label, tooltipText, placeholder, inputType = 'text' }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <CheckboxWithLabel 
                    id={`custom-field-${label.replace(/\s+/g, '-')}`}
                    label={label}
                    checked={false}
                    onChange={()=>{}}
                    info={!!tooltipText}
                    tooltipText={tooltipText}
                />
            </div>
            <div className="flex-1">
                <input
                    type="text"
                    placeholder={inputType === 'date' ? 'mm/yy' : placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]"
                />
            </div>
        </div>
    );
};

export default CustomFieldRow;