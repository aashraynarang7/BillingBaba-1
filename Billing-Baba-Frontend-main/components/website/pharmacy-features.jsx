"use client";

import React from 'react';

export default function PharmacyFeatures() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 animate-fade-in">
                        Top Features Tailored For Free Pharmacy Billing Software
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
                    
                    {/* GST Invoicing for Medicines Card */}
                    
                    <div className="group animate-fade-in-up">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/pharmacy/GST_Invoicing_for_Medicines.png" 
                                    alt="GST Invoicing for Medicines" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                GST Invoicing for Medicines
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar is the essential pharma GST billing software that automates and streamlines your invoicing process. With Vyapar, you can:
                                </p>
                                <ul className="text-left space-y-2 text-base">
                                    <li><strong>Generate Accurate Invoices Quickly:</strong> Create professional invoices in minutes, complete with GST calculations.</li>
                                    <li><strong>Stay Compliant with GST:</strong> Easily add GST rates to your invoices and ensure compliance with tax regulations.</li>
                                    <li><strong>Reduce Manual Errors:</strong> Our auto-calculation feature saves you time and eliminates mistakes.</li>
                                    <li><strong>Customise Your Invoices:</strong> Tailor your invoices to match your pharmacy's branding and specific needs.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Batch and Expiry Management Card */}
                    <div className="group animate-fade-in-up delay-200">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-200">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/pharmacy/Batch_and_Expiry_Management.png" 
                                    alt="Batch and Expiry Management" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-200">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Batch and Expiry Management
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Pharmacies deal with a wide range of medicines, each with its own batch number and expiration date. Effectively managing these details is crucial to ensure product quality and customer safety.
                                </p>
                                <p className="text-base">
                                    Vyapar's Pharmacy Billing Software offers a robust Batch Number and Expiry Management feature to help you:
                                </p>
                                <ul className="text-left space-y-2 text-base">
                                    <li><strong>Set Expiry Alerts:</strong> Receive timely notifications before medicines expire.</li>
                                    <li><strong>Filter and Sort:</strong> Easily organize your inventory by batch number and expiry date.</li>
                                    <li><strong>Generate Detailed Reports:</strong> Track medicine expiration and identify items for return.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Inventory and Stock Management for Drugs Card */}
                    <div className="group animate-fade-in-up delay-400">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-400">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/pharmacy/Inventory_and_Stock_Management_for_Drugs.png" 
                                    alt="Inventory and Stock Management for Drugs" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-400">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Inventory and Stock Management for Drugs
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's Pharma Billing Software has the solution to manage out-of-stock issues. You'll always be one step ahead with our Low Stock Inventory Management feature.
                                </p>
                                <ul className="text-left space-y-2 text-base">
                                    <li><strong>Real-time Alerts:</strong> Get instant notifications when your stock levels are low.</li>
                                    <li><strong>Low Stock Reports:</strong> See exactly which items are running out and by how much.</li>
                                    <li><strong>Schedule Orders:</strong> Plan your reorders efficiently and avoid missed sales.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Multi-Mode Payment Acceptance Card */}
                    <div className="group animate-fade-in-up delay-600">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-600">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/pharmacy/Multi_Mode_Payment_Acceptance.png" 
                                    alt="Multi-Mode Payment Acceptance" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-600">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Multi-Mode Payment Acceptance
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's free pharmacy billing software offers a variety of payment options, making it easier for pharmacists and customers to complete transactions. With Vyapar, you can accept:
                                </p>
                                <ul className="text-left space-y-2 text-base">
                                    <li><strong>Cash:</strong> For traditional payments.</li>
                                    <li><strong>Credit/Debit Cards:</strong> For convenient electronic payments.</li>
                                    <li><strong>UPI:</strong> For fast and secure digital payments.</li>
                                    <li><strong>Digital Wallets:</strong> For popular mobile payment methods.</li>
                                </ul>
                                <p className="text-base">
                                    By offering multiple payment options, you can speed up the checkout process, accommodate different preferences, improve sales efficiency, and simplify transactions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rack Management Card */}
                    <div className="group animate-fade-in-up delay-800">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-800">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/pharmacy/WEB-IMAGES_product-data-base-1.png" 
                                    alt="Rack Management" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-800">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Rack Management
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    Vyapar's Billing Software for Pharmacy offers a powerful Rack Wise Management feature to help you organise and manage your pharma inventory efficiently.
                                </p>
                                <ul className="text-left space-y-2 text-base">
                                    <li><strong>Locate Items Quickly:</strong> Spend less time searching for products and reduce customer's wait time.</li>
                                    <li><strong>Reduce Retrieval Times:</strong> Streamline your operations and improve efficiency.</li>
                                    <li><strong>Monitor Stock Levels:</strong> Keep track of your inventory and avoid stockouts or overstocking.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Barcode Scanning Card */}
                    <div className="group animate-fade-in-up delay-1000">
                        {/* Image Container */}
                        <div className="mb-8 relative animate-scale-in delay-1000">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 hover:scale-105">
                                <img 
                                    src="/is/pharmacy/Pharma-1536x1536.png" 
                                    alt="Barcode Scanning for Faster Billing" 
                                    className="w-full max-w-lg mx-auto drop-shadow-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center animate-fade-in-delay delay-1000">
                            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)] group-hover:text-[var(--primary-red)] transition-colors duration-300">
                                Barcode Scanning for Faster Billing
                            </h3>
                            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                <p className="text-lg">
                                    In a pharmacy, it's crucial to avoid errors and confusion when identifying and billing medicines. Vyapar's Barcode Support feature makes this process simple and efficient.
                                </p>
                                <ul className="text-left space-y-2 text-base">
                                    <li><strong>Scan Barcodes:</strong> Use Vyapar's barcode scanner to quickly identify medicines.</li>
                                    <li><strong>Automatic Recognition:</strong> The app instantly displays the medicine's details, including name, price, and quantity.</li>
                                    <li><strong>Edit Details:</strong> Make any necessary changes before adding the item to your invoice.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action Button */}
                <div className="text-center mt-20 animate-fade-in-up delay-1200">
                    <button className="bg-[var(--primary-red)] text-white text-xl font-bold px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                        Download Pharmacy Software
                    </button>
                </div>
            </div>
        </section>
    );
}
