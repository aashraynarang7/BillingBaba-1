"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data (आप इसे API से प्राप्त कर सकते हैं)
const businessCategories = [
    { name: "Real Estate", img: "/categories/real-estate.png" },
    { name: "Electrical", img: "/categories/electrical.png" },
    { name: "Personal", img: "/categories/personal.png" },
    { name: "Mobile Store", img: "/categories/mobile-store.png" },
    { name: "Education", img: "/categories/education.png" },
    { name: "Clothes", img: "/categories/clothes.png" },
    { name: "FMCG and Grocery", img: "/categories/grocery.png" },
    { name: "Tour and Travels", img: "/categories/travel.png" },
    { name: "Restaurant, Catering and Fast Food", img: "/categories/restaurant.png" },
    { name: "Hospital and Clinic", img: "/categories/clinic.png" },
    { name: "Automobile", img: "/categories/auto.png" },
    { name: "Jewellery", img: "/categories/jewellery.png" },
];

interface CategoryCardProps {
    name: string;
    img: string;
    isSelected: boolean;
    onSelect: () => void;
}

const CategoryCard = ({ name, img, isSelected, onSelect }: CategoryCardProps) => (
    <div
        onClick={onSelect}
        className={cn(
            "bg-white p-4 rounded-lg shadow-sm cursor-pointer transition-all border-2",
            isSelected ? "border-red-500 ring-2 ring-red-200" : "border-transparent hover:shadow-md"
        )}
    >
        <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <p className="text-center text-sm font-medium text-gray-700">{name}</p>
    </div>
);

export default function ChangeCategoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [selectedCategory, setSelectedCategory] = useState("Electrical");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = businessCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl bg-gray-50 p-0">
                <DialogHeader className="p-6 border-b bg-white rounded-t-lg">
                    <DialogTitle className="text-xl">Change business category</DialogTitle>
                    <DialogClose className="absolute right-6 top-6"><X className="h-5 w-5" /></DialogClose>
                </DialogHeader>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                            placeholder="Search your Business Category" 
                            className="pl-12 h-12 rounded-full bg-white border-gray-200 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredCategories.map(category => (
                            <CategoryCard 
                                key={category.name}
                                name={category.name}
                                img={category.img}
                                isSelected={selectedCategory === category.name}
                                onSelect={() => setSelectedCategory(category.name)}
                            />
                        ))}
                    </div>
                </div>

                <DialogFooter className="p-4 bg-white border-t rounded-b-lg">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onClose}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}