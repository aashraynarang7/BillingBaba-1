"use client";

import React from 'react';

export default function RetailFeatures() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 animate-fade-in">
                        Top Features of Billing Software for Retail Shop
                    </h2>
                    
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
                    
                    {/* Quick Billing Card */}
                    <div className="group animate-fade-in-up">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/retails/quick_billing.png" 
                                    alt="Quick Billing Interface" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Quick Billing
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's retail shop billing software simplifies the billing process, accelerates transactions, 
                                    and improves customer satisfaction. Generate invoices in just a few seconds, reducing wait times 
                                    and increasing efficiency.
                                </p>
                                <p className="text-base">
                                    The software is user-friendly, supporting various payment methods, and offering inventory management 
                                    to prevent out-of-stock scenarios. Quick billing helps retailers serve more customers, enhancing 
                                    sales and creating a smooth shopping experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Multi Device Sync Card */}
                    <div className="group animate-fade-in-up delay-200">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-200">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/retails/multi_device.png" 
                                    alt="Multi Device Sync Interface" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-200">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Multi Device Sync
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's Multi Device Sync feature provides smooth access to billing information across various 
                                    devices, ensuring business operations run smoothly from anywhere. Business owners can oversee 
                                    billing, inventory, and expenses in real-time.
                                </p>
                                <p className="text-base">
                                    The feature guarantees immediate visibility of updates across all synchronized devices, which 
                                    is beneficial for businesses with multiple employees managing sales and billing simultaneously. 
                                    Multi Device Sync ensures accurate and current data management, enhancing efficiency and minimizing discrepancies.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Tracking Card */}
                    <div className="group animate-fade-in-up delay-400">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-400">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/retails/inventory_tracking.png" 
                                    alt="Inventory Tracking Interface" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-400">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Inventory Tracking
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's Inventory Tracking feature helps retail shop owners manage their stock effectively 
                                    and prevent shortages or excess inventory. Get real-time updates on stock levels, set low 
                                    stock alerts, and track product movement across your business.
                                </p>
                                <p className="text-base">
                                    The system automatically updates inventory when sales are made, ensuring accurate stock counts 
                                    and helping you make informed purchasing decisions. With comprehensive inventory reports, 
                                    you can optimize your stock levels and improve cash flow management.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Business Tax Report Card */}
                    <div className="group animate-fade-in-up delay-600">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-600">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/retails/busines_task_report.png" 
                                    alt="Business Tax Report Interface" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-600">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Business Tax Report
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's Business Tax Report feature makes it easier for retail shop owners to manage their 
                                    finances by producing detailed reports in just a few clicks. Generate comprehensive tax reports, 
                                    track income and expenses, and maintain proper financial records for compliance.
                                </p>
                                <p className="text-base">
                                    The software automatically calculates taxes based on your sales and provides detailed breakdowns 
                                    for GST, income tax, and other applicable taxes. With organized financial data, you can make 
                                    better business decisions and ensure timely tax filing without any hassles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action Button */}
                <div className="text-center mt-20 animate-fade-in-up delay-800">
                    <button className="bg-[var(--primary-red)] text-white text-xl font-bold px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                        Install Billing Baba!
                    </button>
                </div>
            </div>
        </section>
    );
}
