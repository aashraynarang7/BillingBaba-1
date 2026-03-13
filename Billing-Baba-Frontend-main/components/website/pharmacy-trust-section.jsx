"use client";

import React from 'react';
import { Monitor, DollarSign, Wifi, Headphones } from "lucide-react";

export default function PharmacyTrustSection() {
    const features = [
        {
            icon: Monitor,
            title: "User Friendly",
            description: "Vyapar's simple design makes managing your pharmacy easy. With clear navigation and easy-to-use features, it helps you handle billing, track stock, and manage accounts—all without needing any technical skills."
        },
        {
            icon: DollarSign,
            title: "Pocket Friendly",
            description: "Vyapar is a budget-friendly option for pharmacies, offering affordable plans with no surprise fees. With free basic features and a low-cost one-time payment option, it's perfect for businesses looking to save money."
        },
        {
            icon: Wifi,
            title: "Online and Offline Support",
            description: "Vyapar gives your pharmacy the flexibility to work both online and offline. Whether you have internet access or not, you can easily manage billing, track inventory, and handle accounting without any disruptions. This is especially useful who are looking for an offline app for their business."
        },
        {
            icon: Headphones,
            title: "Free Customer Support",
            description: "Vyapar offers free customer support via phone, chat, and email, so you can get help whenever you need it. This ensures that any issues or questions are quickly resolved, making it easier for you to manage your pharmacy smoothly."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side - Statistics */}
                    <div className="lg:w-1/2 text-center">
                       <img src="/is/pharmacy/pharmacies_delivered_growth.png" alt="Pharmacies Delivered Growth" className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-contain rounded-lg drop-shadow-lg" />
                        {/* <h3 className="text-2xl lg:text-3xl font-bold text-[var(--primary-red)] mt-6">
                            Pharmacies Trust Vyapar
                        </h3> */}
                    </div>

                    {/* Right Side - Features */}
                    <div className="lg:w-1/2">
                        <h4 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-12 text-center lg:text-left">
                            Pharmacies Delivered Growth
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-[var(--primary-red)] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="text-xl font-bold text-[var(--text-primary)]">
                                                {feature.title}
                                            </h5>
                                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
