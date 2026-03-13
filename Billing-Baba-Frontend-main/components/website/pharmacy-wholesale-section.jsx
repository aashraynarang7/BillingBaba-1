"use client";

import React from 'react';

export default function PharmacyWholesaleSection() {
    return (
        <section className="py-20 bg-white mx-4 lg:mx-8">
            {/* Red Banner */}
            <div className="bg-[var(--primary-red)] py-12 mb-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-white text-2xl lg:text-3xl font-bold">
                        Reduce Customer Wait Time with Faster Billing. Try Pharma Billing App!
                    </h2>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side - Image */}
                    <div className="lg:w-1/2">
                        <div className="flex justify-center">
                            <img 
                                src="/is/pharmacy/Wholesale_Pharma_Billing_Software_for_Distributors.png" 
                                alt="Wholesale Pharma Billing Software" 
                                className="w-full h-[450px] object-contain rounded-lg drop-shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-1/2">
                        <h3 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
                            Wholesale Pharma Billing Software for Distributors
                        </h3>
                        
                        <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
                            <p className="text-lg">
                                Vyapar's <strong>Wholesale Pharma Billing Software</strong> is designed to simplify billing and inventory management for pharma distributors and wholesale medicine suppliers. It enables you to generate bulk invoices quickly, ensuring faster transactions and seamless order fulfillment. With batch tracking and expiry date management, you can efficiently monitor medicine stock levels and restock on time.
                            </p>
                            
                            <p className="text-lg">
                                Tailored for pharmaceutical wholesalers, Vyapar automates GST calculations, reducing manual effort and ensuring compliance. The software helps prevent errors in medicine billing, <strong>stock tracking</strong>, and order processing, while offering real-time insights into sales trends and inventory movement. By using Vyapar, wholesale pharma businesses can enhance efficiency, avoid stock shortages, and streamline operations effortlessly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
