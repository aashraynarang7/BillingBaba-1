"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Phone, MessageCircle, Mail } from "lucide-react";

export default function PharmacyCTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                        Ready to Transform Your Pharmacy Business?
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-4xl mx-auto">
                        Join thousands of pharmacy owners who trust Vyapar for their billing, inventory, and business management needs. 
                        Start your free trial today and experience the difference!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
                    {/* Download Section */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="text-center">
                            <Download className="w-16 h-16 text-[var(--primary-red)] mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                                Download Vyapar Pharmacy App
                            </h3>
                            <p className="text-[var(--text-secondary)] mb-6">
                                Get started with our free pharmacy billing software. No credit card required, 
                                instant access to all basic features.
                            </p>
                            <Button size="lg" className="bg-[var(--primary-red)] text-white hover:bg-red-700 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                                Download Now - Free
                            </Button>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="text-center">
                            <Phone className="w-16 h-16 text-[var(--primary-red)] mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                                Need Help? Contact Us
                            </h3>
                            <p className="text-[var(--text-secondary)] mb-6">
                                Our expert team is here to help you get started and answer any questions 
                                about Vyapar pharmacy software.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <Phone className="w-5 h-5 text-[var(--primary-red)]" />
                                    <span className="text-[var(--text-secondary)]">+91-9333-911-911</span>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <MessageCircle className="w-5 h-5 text-[var(--primary-red)]" />
                                    <span className="text-[var(--text-secondary)]">+91-6366-827-420 (WhatsApp)</span>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <Mail className="w-5 h-5 text-[var(--primary-red)]" />
                                    <span className="text-[var(--text-secondary)]">support@vyaparapp.in</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
                        Reduce Customer Wait Time with Faster Billing
                    </h3>
                    <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
                        Try our Pharma Billing App and see how Vyapar can streamline your pharmacy operations, 
                        improve customer satisfaction, and boost your business growth.
                    </p>
                    <Button size="lg" className="bg-[var(--primary-red)] text-white hover:bg-red-700 px-12 py-4 text-xl font-bold rounded-lg shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                        Start Your Free Trial Today
                    </Button>
                </div>
            </div>
        </section>
    );
}
