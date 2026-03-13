import React from 'react';

const colors = [
    '#4A90E2', '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0',
    '#9013FE', '#4A4A4A', '#000000', '#FFFFFF', '#50E3C2', '#B8E986', '#9B9B9B', '#E02020',
];

interface ColorPickerProps {
    selected: string;
    onSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selected, onSelect }) => {
    return (
        <div className="mt-6 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-8 gap-3">
                {colors.map(color => (
                    <button 
                        key={color} 
                        onClick={() => onSelect(color)}
                        className={`w-8 h-8 rounded-full border border-gray-300 transition-transform hover:scale-110
                        ${selected.toUpperCase() === color.toUpperCase() ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;