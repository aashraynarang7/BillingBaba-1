import React from 'react';
import { Info } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface CheckboxWithLabelProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    info?: boolean;
    tooltipText?: string;
    children?: React.ReactNode;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({ id, label, checked, onChange, info, tooltipText, children }) => {
    return (
        <label htmlFor={id} className="flex items-center cursor-pointer">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-400 text-[var(--text-link-active)] focus:ring-[var(--text-link-active)]/50"
            />
            <span className="ml-3 text-gray-800 font-medium">{label}</span>
            {info && tooltipText ? (
                <InfoTooltip text={tooltipText} />
            ) : info ? (
                <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
            ) : null}
            {children}
        </label>
    );
};

export default CheckboxWithLabel;