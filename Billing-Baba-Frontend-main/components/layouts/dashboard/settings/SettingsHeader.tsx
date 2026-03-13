import React from 'react';
import { X } from 'lucide-react';

interface SettingsHeaderProps {
    onClose: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onClose }) => {
    return (
        <header className="flex justify-end items-center bg-white px-6 py-3 border-b border-gray-200 flex-shrink-0">
            <button 
                onClick={onClose}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </header>
    );
};

export default SettingsHeader;