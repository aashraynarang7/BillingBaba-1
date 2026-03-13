import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface MessageTypeSelectorProps {
    icon: string;
    title: string;
    subtitle?: string;
    hasLogin?: boolean;
    isActive: boolean;
    onClick: () => void;
}

const MessageTypeSelector: React.FC<MessageTypeSelectorProps> = ({ icon, title, subtitle, hasLogin, isActive, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`relative flex-1 p-3 border rounded-lg cursor-pointer transition-all duration-200
            ${isActive ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
        >
            <div className="flex items-center gap-3">
                <Image src={icon} alt={title} width={28} height={28} />
                <div>
                    <p className="font-semibold text-gray-800 text-sm">{title}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
            </div>
            {hasLogin && (
                <button className="absolute top-1/2 right-3 -translate-y-1/2 bg-white border border-blue-500 text-blue-600 text-xs font-semibold px-4 py-1 rounded-md hover:bg-blue-50">
                    Login
                </button>
            )}
            {isActive && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-blue-500 fill-white" />}
        </div>
    );
};

export default MessageTypeSelector;