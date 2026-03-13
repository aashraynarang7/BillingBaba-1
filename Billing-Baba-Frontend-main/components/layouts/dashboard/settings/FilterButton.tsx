import React from 'react';

interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-1.5 rounded-full font-medium transition-colors
            ${isActive 
                ? 'bg-[var(--text-link-active)] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
            {label}
        </button>
    );
};

export default FilterButton;