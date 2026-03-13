import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function RetailPricing() {
    const features = [
        "Track income, expenses and cash flow",
        "Send professional invoices and quotations",
        "Manage full stock inventory",
        "Generate critical business and tax reports",
        "Import item details from Excel",
        "Create purchase and sales orders",
        "Auto-backup feature for data safety",
        "Preferred customer support",
        "Share transaction with parties. Get 200 SMS Credits"
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
                    Retail Shop Pricing Plans
                </h2>
                
                <div className="max-w-md mx-auto">
                    <Card className="border-2 border-red-200 shadow-xl">
                        <CardHeader className="text-center pb-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="text-2xl line-through text-gray-500">₹350</span>
                                <Badge variant="destructive" className="text-lg px-3 py-1">₹283/month*</Badge>
                            </div>
                            <CardTitle className="text-2xl text-gray-800">Premium Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6">
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg">
                                    Check Pricing
                                </Button>
                                
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
