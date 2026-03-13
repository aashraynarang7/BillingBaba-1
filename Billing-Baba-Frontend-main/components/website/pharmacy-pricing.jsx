"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PharmacyPricing() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                        Pharmacy Pricing Plans
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                        Choose the perfect plan for your pharmacy business. Start with our free plan and upgrade as you grow.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <span className="text-2xl text-gray-500 line-through">₹350</span>
                                <span className="text-4xl font-bold text-[var(--text-primary)]">₹283</span>
                                <span className="text-xl text-[var(--text-secondary)]">/month*</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                Professional Pharmacy Plan
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                Perfect for established pharmacies with advanced needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Track income, expenses and cash flow</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Send professional invoices and quotations</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Manage full stock inventory</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Generate critical business and tax reports</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Import item details from Excel</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Create purchase and sales orders</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Auto-backup feature for data safety</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-[var(--text-secondary)]">Preferred customer support</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <Button size="lg" className="bg-[var(--primary-red)] text-white hover:bg-red-700 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                                Check Pricing
                            </Button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-[var(--text-secondary)]">
                                *Get 200 SMS Credits included. Share transaction with parties.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" className="bg-[var(--primary-red)] text-white hover:bg-red-700 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                        Download Pharmacy Billing Software
                    </Button>
                </div>
            </div>
        </section>
    );
}
