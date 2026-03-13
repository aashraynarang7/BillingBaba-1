"use client";

import React, { useState } from 'react';
import CheckboxWithLabel from './CheckboxWithLabel';
import ToggleSwitch from './ToggleSwitch';
import SettingsSelect from './SettingsSelect';

interface AdditionalFieldProps {
    id: string;
    label: string;
    fieldType?: 'text' | 'date';
}

const AdditionalField: React.FC<AdditionalFieldProps> = ({ id, label, fieldType = 'text' }) => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="flex items-start gap-3">
            <div className="mt-1.5">
                <CheckboxWithLabel id={`af-check-${id}`} label="" checked={enabled} onChange={setEnabled} />
            </div>
            <div className={`flex-1 transition-opacity ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                {fieldType === 'text' ? (
                    <input
                        type="text"
                        placeholder={label}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]"
                    />
                ) : (
                    <div className="flex gap-3">
                         <input
                            type="text"
                            placeholder={label}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]"
                         />
                         <SettingsSelect options={['dd/mm/yy']} className="w-40" />
                    </div>
                )}
                <div className="mt-2">
                    <ToggleSwitch label="Show In Print" />
                </div>
            </div>
        </div>
    );
};

export default AdditionalField;