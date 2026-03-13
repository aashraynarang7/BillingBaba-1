"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

// Custom SVG icon for the 'xls' file
const XlsIcon = () => (
    <div className="relative">
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <path d="M0 8C0 3.58172 3.58172 0 8 0H54L80 26V92C80 96.4183 76.4183 100 72 100H8C3.58172 100 0 96.4183 0 92V8Z" fill="#2563EB"/>
            <path d="M54 0L80 26H62C57.5817 26 54 22.4183 54 18V0Z" fill="#60A5FA"/>
        </svg>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-serif italic">xls</span>
    </div>
);

// Custom SVG icon for the upload area
const UploadIcon = () => (
    <div className="relative">
         <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H62L100 38V108C100 114.627 94.6274 120 88 120H12C5.37258 120 0 114.627 0 108V12Z" fill="#2563EB" fillOpacity="0.9"/>
            <path d="M62 0L100 38H74C67.3726 38 62 32.6274 62 26V0Z" fill="#93C5FD"/>
            <path d="M49.9999 48V84" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M38 60L50 48L62 60" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M42 92H58" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M42 84H58" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

export default function ImportExcelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Page Header */}
            <header className="bg-white p-4 border-b flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-semibold">Import Excel</h1>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={() => router.back()} // Navigates to the previous page
                >
                    <X className="h-5 w-5" />
                </Button>
            </header>

            {/* Main Content Area */}
            <main className="p-4 sm:p-8">
                <div className="bg-white rounded-lg shadow-md max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Column: Download */}
                        <div className="p-8 flex flex-col items-center justify-center text-center space-y-8">
                            <p className="font-semibold text-gray-700">Download .xls/.xlsx (excel sheet)<br/>template file to enter Data</p>
                            <XlsIcon />
                            <Button className="bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 px-10 py-6 text-base rounded-md">
                                Download
                            </Button>
                        </div>
                        
                        {/* Separator */}
                        <div className="relative hidden md:block">
                             <Separator orientation="vertical" className="absolute h-full top-0 left-1/2 -translate-x-1/2"/>
                        </div>

                        {/* Right Column: Upload */}
                        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                            <p className="font-semibold text-gray-700">Upload your .xls/.xlsx (excel sheet)</p>
                            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                                <UploadIcon />
                                <p className="text-muted-foreground mt-6">
                                    Drag and drop or{' '}
                                    <button className="text-blue-600 font-semibold hover:underline focus:outline-none">
                                        Click here to Browse
                                    </button>
                                    <br/>
                                    formatted excel file to continue
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}