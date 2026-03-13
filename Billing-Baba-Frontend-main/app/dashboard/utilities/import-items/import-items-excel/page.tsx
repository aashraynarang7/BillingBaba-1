"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, MoreVertical, Upload, UploadCloud } from "lucide-react";
import Image from "next/image";

// Reusable component for the steps
const ImportStep = ({ number, children }: { number: number, children: React.ReactNode }) => (
    <div>
        <h3 className="text-sm font-bold text-red-500 mb-2">STEP {number}</h3>
        <div className="text-gray-700 space-y-2">
            {children}
        </div>
    </div>
);

export default function ImportItemsFromExcelPage() {
    const router = useRouter();

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header - This is a placeholder to match the layout context */}
            <header className="bg-white border-b sticky top-0 z-10 p-4 flex items-center justify-between">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Search Transactions" className="pl-10 bg-gray-100"/>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-red-100 text-red-600 hover:bg-red-200">
                        <Plus className="h-4 w-4 mr-2"/> Add Sale
                    </Button>
                    <Button className="bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <Plus className="h-4 w-4 mr-2"/> Add Purchase
                    </Button>
                    <Button variant="outline" size="icon" className="bg-gray-100"><Plus className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                </div>
            </header>

            <main className="p-4 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-bold">Import Items From Excel File</h1>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Steps */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold">Steps to Import</h2>
                            <ImportStep number={1}>
                                <p>Create an Excel file with the following format.</p>
                                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600">
                                    Download Sample
                                </Button>
                                <Image 
                                    src="/utilities/templateImage.png" 
                                    alt="Excel sample format" 
                                    width={600} 
                                    height={200}
                                    className="rounded-md border mt-2"
                                />
                            </ImportStep>
                            <ImportStep number={2}>
                                <p className="flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-gray-500"/>
                                    Upload the file .xlsx or .xls by clicking on the Upload File button below.
                                </p>
                            </ImportStep>
                            <ImportStep number={3}>
                                <p>Verify the items from the file & complete the import.</p>
                            </ImportStep>
                        </div>

                        {/* Right Column: File Upload */}
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
                            <h3 className="font-semibold mb-4">Upload your .xls/.xlsx (excel sheet)</h3>
                            <div className="w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                                <UploadCloud className="h-16 w-16 text-blue-300 mb-4"/>
                                <p className="text-lg text-gray-600">Drag & Drop files here</p>
                                <p className="text-muted-foreground my-4">or</p>
                                <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full text-base px-8 py-6">
                                    <Upload className="h-5 w-5 mr-2"/>
                                    Upload File
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}