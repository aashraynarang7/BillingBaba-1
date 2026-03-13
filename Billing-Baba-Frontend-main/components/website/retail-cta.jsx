"use client";

import React, { useState } from 'react';

export default function RetailCTA() {
    const [selectedIndustry, setSelectedIndustry] = useState('Electrical Shop');

    const industries = [
        {
            id: 'Hardware Store',
            name: 'Hardware Store',
            description: 'Hardware Store Billing Software optimizes billing processes by delivering accurate invoices and effectively managing transactions. It streamlines operations to ensure precision in invoicing, inventory management, and customer transactions, thereby enhancing efficiency and customer satisfaction. This software is tailored to meet the specific needs of hardware stores, providing robust tools for seamless billing and transaction management in a dynamic retail environment.',
            buttonText: 'Read More: Hardware Store Billing Software'
        },
        {
            id: 'Ice Cream Parlour',
            name: 'Ice Cream Parlour',
            description: 'Ice Cream Parlour Billing Software streamlines transaction management, ensuring accurate billing and efficient order processing to boost customer satisfaction and operational efficiency. This software simplifies tasks like invoicing, inventory management, and customer record-keeping, optimizing the parlour\'s daily operations. With its user-friendly features, it enhances service delivery and ensures a seamless experience for both customers and staff in ice cream parlours.',
            buttonText: 'Read More: Ice Cream Parlour Billing Software'
        },
        {
            id: 'Electrical Shop',
            name: 'Electrical Shop',
            description: 'Electrical Shop Billing Software streamlines transaction management in electrical shops, ensuring precise invoicing and efficient record-keeping. This software enhances operational efficiency by simplifying tasks such as billing, inventory management, and customer records. It aims to improve customer satisfaction through accurate service delivery and reliable transaction handling, supporting the smooth operation of electrical businesses with its user-friendly interface and robust features.',
            buttonText: 'Read More: Electrical Shop Billing Software'
        },
        {
            id: 'Hospital',
            name: 'Hospital',
            description: 'Hospital Billing Software automates billing processes in healthcare facilities, ensuring accurate invoicing, streamlined patient account management, and compliance with regulatory requirements. This software optimizes financial operations and enhances patient care by efficiently managing billing tasks and maintaining compliance standards in the healthcare industry.',
            buttonText: 'Read More: Hospital Billing Software'
        }
    ];

    const currentIndustry = industries.find(ind => ind.id === selectedIndustry);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-16 bg-[var(--bg-secondary)] px-6 py-3 rounded-lg inline-block mx-auto">
                    Built for your Industry
                </h2>
                
                <div className="flex flex-col lg:flex-row gap-8 max-w-9xl mx-auto">
                    {/* Left Sidebar - Industry Tabs */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg border border-[var(--border-color)] p-4 space-y-1">
                            {industries.map((industry) => (
                                <button
                                    key={industry.id}
                                    onClick={() => setSelectedIndustry(industry.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 relative ${
                                        selectedIndustry === industry.id
                                            ? 'bg-[var(--accent-light)] text-[var(--text-primary)] font-semibold border-l-4 border-[var(--accent-primary)]'
                                            : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                                    }`}
                                >
                                    {industry.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right Content Area */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg p-8 shadow-lg border border-[var(--border-color)]">
                            <div className="space-y-6">
                                <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                                    {currentIndustry?.description}
                                </p>
                                
                                <button className="bg-[var(--primary-red)] text-[var(--text-on-dark)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-red-dark)] transition-colors duration-200 shadow-md">
                                    {currentIndustry?.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
