"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sample Data ---
const categories = [
    "Pain Analgesics", "Opthal", "Detergents and Washing Soaps",
    "Chocolates and Toffees", "Cold Drinks and Beverages", "Pooja Items",
    "Soaps, Shampoos and Bathroom Items", "Cooking Items", "Baby Food and Care",
    "Immunity and Health", "Anti Infectives"
];

const brands = [
    "All", "RPG Life Sciences Ltd", "Captab Biotec", "Neumec Healthcare Pvt Ltd",
    "Agron Remedies Pvt Ltd", "3D Healthcare", "Intas Pharmaceuticals Ltd",
    "Zoic Lifesciences", "Brochem Health Care Pvt Ltd", "Aeran Lab India Pvt Ltd",
    "Adventure Life Sciences Pvt Ltd", "Relax Pharma", "Biosans Lifecare",
    "Aan Pharma Pvt Ltd", "Aknil Biotech"
];

const allItems = [
    // Pain Analgesics
    { id: 1, name: 'Coxineb 120mg Tablet', price: 116.00, category: 'Pain Analgesics', brand: 'RPG Life Sciences Ltd' },
    { id: 2, name: 'Coxineb 90mg Tablet', price: 98.00, category: 'Pain Analgesics', brand: 'RPG Life Sciences Ltd' },
    { id: 3, name: 'Coxinip-TH Tablet', price: 211.00, category: 'Pain Analgesics', brand: 'Intas Pharmaceuticals Ltd' },
    { id: 4, name: 'Paracim 650mg Tablet', price: 20.00, category: 'Pain Analgesics', brand: 'Relax Pharma' },
    { id: 5, name: 'Paracin 1000mg Tablet', price: 22.12, category: 'Pain Analgesics', brand: 'Aan Pharma Pvt Ltd' },
    { id: 6, name: 'Paracin 125mg Tablet', price: 9.46, category: 'Pain Analgesics', brand: 'Aan Pharma Pvt Ltd' },
    // Chocolates
    { id: 7, name: 'Dairy Milk Silk', price: 80.00, category: 'Chocolates and Toffees', brand: 'Cadbury' },
    { id: 8, name: 'KitKat 4 Finger', price: 25.00, category: 'Chocolates and Toffees', brand: 'Nestle' },
    { id: 9, name: '5 Star', price: 10.00, category: 'Chocolates and Toffees', brand: 'Cadbury' },
];


export default function ImportFromLibraryPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("Pain Analgesics");
    const [activeBrand, setActiveBrand] = useState("All");

    // Filtering logic
    const filteredItems = useMemo(() => {
        let items = allItems.filter(item => item.category === activeCategory);
        if (activeBrand !== "All") {
            items = items.filter(item => item.brand === activeBrand);
        }
        return items;
    }, [activeCategory, activeBrand]);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-white z-20">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-bold">Import From Vyapar Library</h1>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Categories */}
                <aside className="w-1/4 max-w-xs border-r flex flex-col">
                    <div className="p-4 border-b space-y-4">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon"><Search className="h-5 w-5"/></Button>
                            <Button variant="link" className="text-base">Filter By Industry</Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <h2 className="p-4 text-sm font-semibold text-muted-foreground">CATEGORY</h2>
                        <ul>
                            {categories.map(category => (
                                <li key={category}>
                                    <button 
                                        className={cn(
                                            "w-full text-left p-4 text-sm font-medium border-r-2",
                                            activeCategory === category 
                                                ? "bg-blue-100 text-blue-700 border-blue-600" 
                                                : "border-transparent hover:bg-gray-100"
                                        )}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Right Content: Brands and Items */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <section>
                        <h2 className="text-sm font-semibold text-muted-foreground mb-2">SELECT BRAND</h2>
                        <div className="flex flex-wrap gap-2">
                            {brands.map(brand => (
                                <Button 
                                    key={brand}
                                    variant={activeBrand === brand ? "destructive" : "outline"}
                                    className="rounded-full"
                                    onClick={() => setActiveBrand(brand)}
                                >
                                    {brand}
                                </Button>
                            ))}
                             <Button variant="link">View More</Button>
                        </div>
                    </section>

                    <section className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Select Items to import</h2>
                            <div className="relative w-full max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input placeholder="Search Items" className="pl-10"/>
                            </div>
                        </div>
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"><Checkbox /></TableHead>
                                        <TableHead>ITEM NAME</TableHead>
                                        <TableHead className="text-right">SALE PRICE</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell><Checkbox /></TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-right">
                                                ₹ {item.price.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </section>
                </main>
            </div>
            
            {/* Footer */}
            <footer className="p-4 border-t flex justify-end bg-white sticky bottom-0 z-20">
                <Button size="lg">Import Items ({filteredItems.length})</Button>
            </footer>
        </div>
    );
}