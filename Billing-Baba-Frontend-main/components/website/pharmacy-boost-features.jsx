"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
    LayoutGrid,
    ScanLine,
    FileText,
    Building2,
    UserCheck,
    Calculator,
    MessageCircle,
    TrendingUp,
    Shield,
    Package
} from "lucide-react";

export default function PharmacyBoostFeatures() {
    const features = [
        {
            icon: LayoutGrid,
            title: "Rack Management"
        },
        {
            icon: ScanLine,
            title: "Barcode Scanning"
        },
        {
            icon: FileText,
            title: "Drug License Number"
        },
        {
            icon: Package,
            title: "Drug Type Management"
        },
        {
            icon: Building2,
            title: "Multiple Store Management"
        },
        {
            icon: UserCheck,
            title: "Supplier Management"
        },
        {
            icon: Calculator,
            title: "GST Reports and Tax Filing"
        },
        {
            icon: MessageCircle,
            title: "Transaction Message"
        },
        {
            icon: TrendingUp,
            title: "Item Profit and Loss Reports"
        },
        {
            icon: Shield,
            title: "User Access Control"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-20">
                    Vyapar Pharmacy Software App Adds Value To Your Pharma Business
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border border-pink-100">
                                <feature.icon className="w-16 h-16 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight">{feature.title}</h3>
                        </div>
                    ))}
                </div>

            
            </div>
        </section>
    );
}
