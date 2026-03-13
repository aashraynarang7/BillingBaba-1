"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Theme {
    name: string;
    image: string;
}

interface LayoutCarouselProps {
    themes: Theme[];
    selected: string;
    onSelect: (name: string) => void;
}

const ITEMS_PER_PAGE = 4;

const LayoutCarousel: React.FC<LayoutCarouselProps> = ({ themes, selected, onSelect }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(themes.length / ITEMS_PER_PAGE);

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const visibleThemes = themes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="mt-6">
            <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={currentPage === 0} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex-1 grid grid-cols-4 gap-4">
                    {visibleThemes.map(theme => (
                        <div key={theme.name} onClick={() => onSelect(theme.name)} className="cursor-pointer text-center">
                            <div className={`p-1 border-2 rounded-md transition-colors ${selected === theme.name ? 'border-blue-600' : 'border-transparent'}`}>
                                <div className="bg-gray-100 border border-gray-200 rounded h-20 w-full flex items-center justify-center">
                                    <Image src={theme.image} alt={theme.name} width={60} height={70} objectFit="contain" />
                                </div>
                            </div>
                            <span className={`mt-1.5 block text-xs font-medium ${selected === theme.name ? 'text-blue-600' : 'text-gray-600'}`}>{theme.name}</span>
                        </div>
                    ))}
                </div>
                 <button onClick={handleNext} disabled={currentPage >= totalPages - 1} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default LayoutCarousel;