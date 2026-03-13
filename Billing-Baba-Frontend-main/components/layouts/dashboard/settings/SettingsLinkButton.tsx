import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SettingsLinkButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

const SettingsLinkButton: React.FC<SettingsLinkButtonProps> = ({ children, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center text-[var(--text-link-active)] font-semibold hover:underline"
        >
            <span>{children}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
        </button>
    );
};

export default SettingsLinkButton;