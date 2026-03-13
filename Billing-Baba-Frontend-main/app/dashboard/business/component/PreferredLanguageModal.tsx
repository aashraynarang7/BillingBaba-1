"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
    "ENGLISH", "हिंदी (Hindi)", "ગુજરાતી (Gujarati)", "मराठी (Marathi)",
    "বাংলা (Bengali)", "தமிழ் (Tamil)", "తెలుగు (Telugu)", "ಕನ್ನಡ (Kannada)",
    "മലയാളം (Malayalam)", "ਪੰਜਾਬੀ (Punjabi)", "ଓଡ଼ିଆ (Odia)"
];

// कस्टम क्लोज आइकॉन जो इमेज जैसा दिखता है
const CustomCloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3Z" stroke="#9CA3AF" strokeWidth="1.5"/>
    </svg>
);


export default function PreferredLanguageModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [selectedLanguage, setSelectedLanguage] = useState("ENGLISH");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
                <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white shadow-lg">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="text-lg font-semibold">Preferred Language</DialogTitle>
                        <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100">
                           <CustomCloseIcon />
                           <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                    </DialogHeader>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {languages.map(lang => (
                                <Button
                                    key={lang}
                                    variant="outline"
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={cn(
                                        "h-11 justify-center rounded-md border-gray-300",
                                        selectedLanguage === lang 
                                          ? "bg-red-500 text-white border-red-500 hover:bg-red-600" 
                                          : "bg-white text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {lang}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="p-4 bg-gray-50 border-t rounded-b-lg">
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onClose}>Submit</Button>
                    </DialogFooter>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </Dialog>
    );
}