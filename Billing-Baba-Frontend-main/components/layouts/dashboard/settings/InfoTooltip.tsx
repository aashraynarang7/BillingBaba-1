import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
    text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
    return (
        <div className="relative group flex items-center">
            <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs
                            bg-gray-800 text-white text-xs rounded-md py-1.5 px-3
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                            shadow-lg z-10">
                {text}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                border-x-4 border-x-transparent 
                                border-t-4 border-t-gray-800"></div>
            </div>
        </div>
    );
};

export default InfoTooltip;