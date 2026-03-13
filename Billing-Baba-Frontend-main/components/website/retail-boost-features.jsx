"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
    QrCode, 
    FileText, 
    CreditCard, 
    Monitor, 
    Bell, 
    FileText as FileTextIcon, 
    Shield, 
    BarChart3, 
    TrendingUp, 
    Database, 
    ClipboardList, 
    Printer 
} from "lucide-react";

export default function RetailBoostFeatures() {
    const features = [
        { 
            icon: QrCode, 
            title: "Barcode Management"
        },
        { 
            icon: FileText, 
            title: "Multiple Invoice Templates"
        },
        { 
            icon: CreditCard, 
            title: "Multiple Payment Options"
        },
        { 
            icon: Monitor, 
            title: "Online Store"
        },
        { 
            icon: Bell, 
            title: "Bulk Payment Reminder"
        },
        { 
            icon: FileTextIcon, 
            title: "E Way Bill"
        },
        { 
            icon: Shield, 
            title: "User Role Access"
        },
        { 
            icon: BarChart3, 
            title: "Party Wise Item Rate"
        },
        { 
            icon: TrendingUp, 
            title: "Retail & Wholesale Rate"
        },
        { 
            icon: Database, 
            title: "Real Time Data Sync"
        },
        { 
            icon: ClipboardList, 
            title: "Bulk Update Items"
        },
        { 
            icon: Printer, 
            title: "Thermal/Regular Printer Compatibility"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-20">
                    Boost Your Retail Shop Business with Vyapar App Features
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-36 h-36 bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                <feature.icon className="w-20 h-20 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight">{feature.title}</h3>
                        </div>
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="text-center mt-24">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                        Advanced Retail Shop Billing Software to Enhance Business Growth
                    </h3>
                    <p className="text-[var(--text-secondary)] max-w-4xl mx-auto mb-8">
                        Experience the power of Vyapar's comprehensive retail billing solution designed to streamline your business operations, 
                        improve efficiency, and drive growth with professional billing, inventory management, and detailed reporting.
                    </p>
                    <button className="bg-[var(--primary-red)] text-white text-lg font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                        Download Vyapar Now
                    </button>
                </div>
            </div>
        </section>
    );
}
