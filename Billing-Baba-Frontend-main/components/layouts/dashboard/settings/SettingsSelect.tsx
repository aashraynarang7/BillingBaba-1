import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SettingsSelectProps {
    label?: string;
    options: string[];
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

const SettingsSelect: React.FC<SettingsSelectProps> = ({ label, options, value, onChange, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && <label className="block text-gray-600 mb-1 font-medium">{label}</label>}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className="w-full appearance-none bg-white p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)] pr-8"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
        </div>
    );
};

export default SettingsSelect;