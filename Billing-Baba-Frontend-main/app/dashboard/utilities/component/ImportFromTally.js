"use client";

import React, { useState } from 'react';
import { Icons } from './icons';

const slidesData = [
    {
        id: 1,
        image: '/tally-import-1.svg',
        title: 'Import Company from Tally to Vyapar',
        description: 'Migrate your data to Vyapar easily and safely with this utility.'
    },
    {
        id: 2,
        image: '/tally-import-2.svg',
        title: 'Easy, Fast and Secure',
        description: 'Just select the company you want to migrate.'
    }
];

const ImportFromTally = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const goToNext = () => {
        setActiveSlide((prev) => (prev + 1) % slidesData.length);
    };

    const goToPrev = () => {
        setActiveSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
    };

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    const currentSlide = slidesData[activeSlide];

    return (
        <div className="bg-settings-content-bg min-h-screen p-4 sm:p-8 flex items-center justify-center">
            <div className="bg-card rounded-lg border border-border shadow-sm w-full">
                <header className="flex justify-between items-center p-5 border-b border-border">
                    <h1 className="text-lg font-semibold text-foreground">Import from Tally</h1>
                    <button className="text-blue-500">
                        <Icons.Wifi />
                    </button>
                </header>

                <main className="p-8 sm:p-16 flex flex-col items-center text-center">
                    <div className="w-full max-w-md h-64 flex items-center justify-center mb-8">
                         <img src={currentSlide.image} alt={currentSlide.title} className="max-h-full object-contain" />
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {currentSlide.title}
                    </h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                        {currentSlide.description}
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <button onClick={goToPrev} className="p-2 rounded-md border border-border hover:bg-secondary transition-colors">
                            <Icons.ChevronLeft />
                        </button>
                        <div className="flex items-center gap-2">
                            {slidesData.map((_, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index ? 'w-4 bg-primary' : 'w-2 bg-border'}`}
                                />
                            ))}
                        </div>
                        <button onClick={goToNext} className="p-2 rounded-md border border-border hover:bg-secondary transition-colors">
                           <Icons.ChevronRight />
                        </button>
                    </div>

                    <button className="bg-primary-red text-white font-semibold px-16 py-3 rounded-full hover:bg-primary-dark-red transition-colors">
                        Import Company
                    </button>
                </main>
            </div>
        </div>
    );
};

export default ImportFromTally;