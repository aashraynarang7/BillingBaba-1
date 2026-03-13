"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from '@/components/ui/use-toast';

const BarcodeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#E0F2FE"/>
        <path d="M23 29H21V35H23V29Z" fill="#3B82F6"/>
        <path d="M29 29H25V35H29V29Z" fill="#3B82F6"/>
        <path d="M35 29H31V35H35V29Z" fill="#3B82F6"/>
        <path d="M39 29H37V35H39V29Z" fill="#3B82F6"/>
        <path d="M43 29H41V35H43V29Z" fill="#3B82F6"/>
    </svg>
);

const ExcelIcon = () => (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#E0F2FE"/>
        <path d="M41 27L35 33" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M35 27L41 33" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 27H29" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 33H29" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ImportMethodCard = ({ id, title, description, icon, isSelected, isRecommended = false, children }: {
  id: string; title: string; description: string; icon: React.ReactNode; isSelected: boolean; isRecommended?: boolean; children: React.ReactNode;
}) => (
    <label htmlFor={id} className={cn(
        "relative flex-1 p-6 border rounded-lg cursor-pointer transition-all text-center",
        isSelected ? "border-blue-500 border-2 shadow-md bg-white" : "border-gray-200 bg-gray-50 hover:border-gray-300"
    )}>
        <div className="absolute top-4 right-4">{children}</div>
        {isRecommended && (
            <div className="absolute top-4 left-4 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                RECOMMENDED
            </div>
        )}
        <div className="flex flex-col items-center justify-center space-y-3">
            {icon}
            <h3 className="font-bold text-lg mt-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
        </div>
    </label>
);

const HorizontalImportMethod = ({ id, title, description, isSelected, children }: {
    id: string; title: string; description: string; isSelected: boolean; children: React.ReactNode;
}) => (
    <label htmlFor={id} className={cn(
        "relative flex w-full items-center justify-between p-6 border rounded-lg cursor-pointer transition-all",
        isSelected ? "border-blue-500 border-2 shadow-md bg-white" : "border-gray-200 bg-gray-50 hover:border-gray-300"
    )}>
        <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
    </label>
)

export default function ImportItemsPage() {
    const [selectedMethod, setSelectedMethod] = useState("barcode");
    const router = useRouter();

    // UPDATED: This function handles navigation based on the selected method
    const handleContinue = () => {
        if (selectedMethod === "barcode") {
            router.push('/dashboard/utilities/import-items/add-items');
        } else if (selectedMethod === "excel") {
            router.push('/dashboard/utilities/import-items/import-items-excel');
            
        } 
        else if(selectedMethod === "library"){
            router.push('/dashboard/utilities/import-items/import-items-library');
            }
        else {
            // Handle other cases if necessary
            toast({ title: "Navigation for this option is not implemented yet.", variant: "destructive" });
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
            <Card className="w-full max-w-4xl shadow-xl">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl">Import Items</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Select Import Method</h2>

                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <ImportMethodCard
                                id="barcode"
                                title="Import From Barcode"
                                description="Import item details by scanning barcodes. Vyapar uses a library of 100 Mn+ standard barcodes to fetch all details of your items in seconds."
                                icon={<BarcodeIcon />}
                                isSelected={selectedMethod === "barcode"}
                                isRecommended={true}
                            >
                               <RadioGroupItem value="barcode" id="barcode" />
                            </ImportMethodCard>
                             <ImportMethodCard
                                id="excel"
                                title="Import From Excel"
                                description="Import item data from excel files in your system"
                                icon={<ExcelIcon />}
                                isSelected={selectedMethod === "excel"}
                            >
                               <RadioGroupItem value="excel" id="excel" />
                            </ImportMethodCard>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 border-t"></div>
                            <span className="text-sm text-muted-foreground font-semibold">OR</span>
                            <div className="flex-1 border-t"></div>
                        </div>

                        <HorizontalImportMethod
                            id="library"
                            title="Import From Vyapar Library"
                            description="Import items from Vyapar's database"
                            isSelected={selectedMethod === "library"}
                        >
                           <RadioGroupItem value="library" id="library" />
                        </HorizontalImportMethod>
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-end p-4 border-t bg-gray-50/50">
                     <Button 
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full px-12 py-6 text-base font-bold"
                        onClick={handleContinue}
                     >
                        Continue
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
