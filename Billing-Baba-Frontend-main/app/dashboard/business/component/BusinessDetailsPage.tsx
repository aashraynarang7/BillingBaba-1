"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Plus, Download, RefreshCw, Languages, Star } from 'lucide-react';

// सुनिश्चित करें कि ChangeCategoryModal कंपोनेंट का पाथ सही है
import ChangeCategoryModal from './ChangeCategoryModal'; 

export default function BusinessDetailsPage({ onBack }: { onBack: () => void }) {
    // Modal को नियंत्रित करने के लिए स्टेट
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                {/* --- हेडर --- */}
                <header className="flex items-center justify-between pb-4 border-b mb-6">
                    <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                        <ChevronLeft className="h-5 w-5" /> Back
                    </Button>
                    <div className="flex items-center gap-6 text-sm font-semibold">
                        <span className="text-gray-500">Dashboard</span>
                        <span className="text-red-500 border-b-2 border-red-500 pb-4">Account</span>
                    </div>
                    <Button className="bg-red-500 text-white font-bold rounded-md shadow-sm hover:bg-red-600">
                        <Plus size={18} className="mr-2" /> Create Design
                    </Button>
                </header>
                
                {/* --- मुख्य कंटेंट --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* साइडबार */}
                    <aside className="md:col-span-1">
                        <nav className="space-y-2">
                            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 font-semibold"><Star className="h-5 w-5" /> Business</a>
                            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"><Download className="h-5 w-5" /> Downloads</a>
                            {/* "Change business category" अब एक बटन है जो Modal खोलता है */}
                            <button 
                                onClick={() => setIsCategoryModalOpen(true)} 
                                className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <RefreshCw className="h-5 w-5" /> Change business category
                            </button>
                            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"><Languages className="h-5 w-5" /> Preferred Language</a>
                        </nav>
                    </aside>
                    
                    {/* फॉर्म */}
                    <main className="md:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-bold text-gray-800">Business Details</h2>
                             <div className="flex items-center gap-2 text-sm">
                                <span>Selected Category:</span>
                                <span className="bg-red-500 text-white font-semibold px-3 py-1 rounded-full">Electrical</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                <p className="font-semibold">My Company</p>
                                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">Logo</div>
                                <Button variant="outline">Change Logo</Button>
                                <Button variant="outline">Create Logo</Button>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className="text-sm font-medium">Email Id</label><Input value="Z2NWO6JO6R3D2JBW.trial@vyaparapp.in" disabled /></div>
                                <div><label className="text-sm font-medium">Business Name*</label><Input placeholder="My Company" /></div>
                                <div><label className="text-sm font-medium">Website</label><Input placeholder="Website" /></div>
                                <div><label className="text-sm font-medium">Phone Number*</label><Input placeholder="Mobile Number" /></div>
                                <div className="sm:col-span-2"><label className="text-sm font-medium">Address</label><Textarea placeholder="Address" /></div>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <Button className="bg-red-500 text-white font-bold px-8 hover:bg-red-600">Save</Button>
                        </div>
                    </main>
                </div>
            </div>

            {/* Modal को यहाँ रेंडर करें */}
            <ChangeCategoryModal 
                isOpen={isCategoryModalOpen} 
                onClose={() => setIsCategoryModalOpen(false)} 
            />
        </>
    );
}