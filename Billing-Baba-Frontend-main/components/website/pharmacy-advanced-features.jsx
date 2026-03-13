"use client";

import React from 'react';
import { LayoutGrid, ScanLine, FileText, Building2, UserCheck, Calculator, MessageCircle, TrendingUp, Shield, Package, Bell, Database, ClipboardList, Printer, Settings, Download, Share2, Users, BarChart, Smartphone, ShieldCheck, Cloud, RefreshCw, CreditCard } from "lucide-react";

export default function PharmacyAdvancedFeatures() {
    const alternatingFeatures = [
        {
            title: "Easy Rack Management",
            description: "Vyapar's Billing Software for Pharmacy offers a powerful Rack Wise Management feature to help you organise and manage your pharma inventory efficiently. By categorising your products based on their rack locations, you can locate items quickly and reduce customer's wait time.",
            additionalInfo: "With Rack Wise Management pharma bill app, you can maintain a well-organised pharmacy in India, enhance customer satisfaction, and minimise the risk of stockouts and overstocking. This feature helps streamline your operations and improve efficiency.",
            image: "/is/pharmacy/Easy_Rack_Management.png",
            imageAlt: "Easy Rack Management Interface",
            icon: LayoutGrid,
            features: [
                "Locate items quickly",
                "Reduce retrieval times",
                "Monitor stock levels",
                "Organized inventory"
            ]
        },
        {
            title: "Barcode Scanning for Faster Billing",
            description: "In a pharmacy, it's crucial to avoid errors and confusion when identifying and billing medicines. Vyapar's Barcode Support feature makes this process simple and efficient by allowing you to scan barcodes and quickly identify medicines.",
            additionalInfo: "With Vyapar's Pharma Billing Software's Barcode Support, do fast billing, avoid errors, save time, and improve accuracy by streamlining your pharmacy operations and providing a better customer experience.",
            image: "/is/pharmacy/Barcode_Scanning_for_faster_billing.png",
            imageAlt: "Barcode Scanning Interface",
            icon: ScanLine,
            features: [
                "Scan barcodes quickly",
                "Automatic recognition",
                "Edit details easily",
                "Error-free billing"
            ]
        },
        {
            title: "Drug License Number",
            description: "As a pharmacy, it's essential to comply with industry regulations. One requirement is to display your drug license number on invoices. Vyapar's Pharma Software's Custom Additional Fields feature makes it easy to add your drug license number and customize your bills.",
            additionalInfo: "With Vyapar Billing software for Pharmacy, you can ensure compliance and maintain a professional image for your pharma business by creating professional documents that meet regulatory standards and impress your customers.",
            image: "/is/pharmacy/Drug_License_Number.png",
            imageAlt: "Drug License Number Management",
            icon: FileText,
            features: [
                "Add drug license number",
                "Customize your bills",
                "Create professional documents",
                "Regulatory compliance"
            ]
        },
        {
            title: "Drug Type Management By Item Category",
            description: "Pharmacies need to store and handle different drug types such as tablets, capsules, and syrups. Vyapar's best pharmacy billing software makes this process easy by allowing you to create custom categories and organize your inventory by drug type.",
            additionalInfo: "By organising your inventory by drug type, you can ensure proper storage and easy access to medicines. This feature helps you filter and search quickly, and generate reports to analyze sales and profits by drug type.",
            image: "/is/pharmacy/Drug_type_management_by_item_category.png",
            imageAlt: "Drug Type Management Interface",
            icon: Package,
            features: [
                "Create custom categories",
                "Filter and search",
                "Generate reports",
                "Proper storage organization"
            ]
        },
        {
            title: "Multiple Store Management",
            description: "Managing multiple pharmacies can be challenging. Vyapar's billing software for pharmacy simplifies management by allowing you to create and link businesses, connect all your outlets within one app, and sync data across stores.",
            additionalInfo: "With Vyapar, managing multiple pharmacies has become easier. You can keep track of stock, sales, and expenses across all locations, compare performance, and get insights into your overall business operations.",
            image: "/is/pharmacy/Multiple_Store_Management.png",
            imageAlt: "Multiple Store Management Interface",
            icon: Building2,
            features: [
                "Create and link businesses",
                "Sync data across stores",
                "Compare performance",
                "Analysis and insights"
            ]
        },
        {
            title: "Supplier Management",
            description: "Vyapar's Supplier Management feature simplifies medicine procurement and vendor relationships. This feature provides centralized supplier database, purchase order management, and reorder notifications to help you manage suppliers efficiently.",
            additionalInfo: "With Vyapar pharmacy software, pharmacies can efficiently manage suppliers, ensure timely stock availability, and maintain strong vendor relationships. Track supplier payments and credit, and receive timely notifications for better procurement management.",
            image: "/is/pharmacy/Supplier_management.png",
            imageAlt: "Supplier Management Interface",
            icon: UserCheck,
            features: [
                "Centralized supplier database",
                "Purchase order management",
                "Reorder notifications",
                "Payment and credit management"
            ]
        },
        {
            title: "GST Reports and Tax Filing",
            description: "Download Vyapar's free pharmacy billing software to streamline your GST compliance. Key features include generating GST reports, viewing and exporting reports in various formats, and simplifying GST compliance process.",
            additionalInfo: "With Vyapar, you can efficiently manage your GST regulations and focus on growing your pharmacy business. Generate GSTR-1, GSTR-3B, GSTR-4, and other necessary reports in real time for easy filing.",
            image: "/is/pharmacy/GST_Reports_and_Tax_Filing.png",
            imageAlt: "GST Reports and Tax Filing Interface",
            icon: Calculator,
            features: [
                "Generate GST reports",
                "View and export reports",
                "Simplify GST compliance",
                "Real-time reporting"
            ]
        },
        {
            title: "Transaction Message",
            description: "To communicate and connect with your customers effectively, Vyapar's best pharmacy billing software enables you to send them transaction messages and receipts via your WhatsApp or default SMS platform. Our messaging feature helps you build trust and loyalty.",
            additionalInfo: "Vyapar helps you to communicate and connect with your customers better and faster. Keep your customers informed and engaged with frequent transaction messages and receipts, making them happy and more likely to return and recommend your business.",
            image: "/is/pharmacy/Transaction_Message.png",
            imageAlt: "Transaction Message Interface",
            icon: MessageCircle,
            features: [
                "Build trust and loyalty",
                "Increase sales and referrals",
                "Enhance customer service",
                "Customizable templates"
            ]
        },
        {
            title: "Item Profit and Loss Reports",
            description: "Pharmacy owners need to track profits and losses for financial health, and Vyapar's software offers comprehensive reporting. This feature helps you identify profitable products, optimize inventory, and make business decisions based on profit/loss data.",
            additionalInfo: "Download the Vyapar app for data-driven decisions to improve profitability. Generate reports based on specific periods and criteria, and get detailed analysis providing insights into revenue, expenses, and net profit.",
            image: "/is/pharmacy/Item_Profit_and_Loss_Reports.png",
            imageAlt: "Item Profit and Loss Reports Interface",
            icon: TrendingUp,
            features: [
                "Identify profitable products",
                "Optimize inventory",
                "Make business decisions",
                "Detailed analysis"
            ]
        },
        {
            title: "User Access Control",
            description: "To control and monitor the pharmacy store staff or employees activities, our online pharmacy billing software provides robust user-wise access management features to ensure the security and integrity of your business operations.",
            additionalInfo: "With Vyapar, you can manage your staff and employees activity, and responsibilities and enable data security. Assign different levels of access to staff based on their job responsibilities to prevent unauthorised access.",
            image: "/is/pharmacy/User_Access_Control.png",
            imageAlt: "User Access Control Interface",
            icon: Shield,
            features: [
                "Role-based permissions",
                "Login history tracking",
                "Activity logs",
                "Maintain data security"
            ]
        },
        {
            title: "Batch and Expiry Management",
            description: "Pharmacies deal with a wide range of medicines, each with its own batch number and expiration date. Effectively managing these details is crucial to ensure product quality and customer safety.",
            additionalInfo: "Vyapar's Pharmacy Billing Software offers a robust Batch Number and Expiry Management feature to help you set expiry alerts, filter and sort by batch number and expiry date, and generate detailed reports to track medicine expiration.",
            image: "/is/pharmacy/Batch_and_Expiry_Management.png",
            imageAlt: "Batch and Expiry Management Interface",
            icon: Bell,
            features: [
                "Set expiry alerts",
                "Filter and sort",
                "Generate detailed reports",
                "Track medicine expiration"
            ]
        },
        {
            title: "Inventory and Stock Management for Drugs",
            description: "Vyapar's Pharma Billing Software has the solution to manage out-of-stock issues. You'll always be one step ahead with our Low Stock Inventory Management feature that provides real-time alerts and low stock reports.",
            additionalInfo: "Get instant notifications when your stock levels are low, see exactly which items are running out and by how much, and schedule orders efficiently to plan your reorders and avoid missed sales.",
            image: "/is/pharmacy/Inventory_and_Stock_Management_for_Drugs.png",
            imageAlt: "Inventory and Stock Management Interface",
            icon: Database,
            features: [
                "Real-time alerts",
                "Low stock reports",
                "Schedule orders",
                "Avoid missed sales"
            ]
        },
        {
            title: "Multi-Mode Payment Acceptance",
            description: "Vyapar's free pharmacy billing software offers a variety of payment options, making it easier for pharmacists and customers to complete transactions. You can accept cash, credit/debit cards, UPI, and digital wallets.",
            additionalInfo: "By offering multiple payment options, you can speed up the checkout process, accommodate different preferences, improve sales efficiency, and simplify transactions for both you and your customers.",
            image: "/is/pharmacy/Multi_Mode_Payment_Acceptance.png",
            imageAlt: "Multi-Mode Payment Acceptance Interface",
            icon: CreditCard,
            features: [
                "Cash payments",
                "Credit/Debit cards",
                "UPI integration",
                "Digital wallets"
            ]
        },
        {
            title: "GST Invoicing for Medicines",
            description: "Vyapar is the essential pharma GST billing software that automates and streamlines your invoicing process. Generate accurate invoices quickly, stay compliant with GST, and reduce manual errors with auto-calculation features.",
            additionalInfo: "Customise your invoices to match your pharmacy's branding and specific needs. Easily add GST rates to your invoices and ensure compliance with tax regulations while creating professional invoices in minutes.",
            image: "/is/pharmacy/GST_Invoicing_for_Medicines.png",
            imageAlt: "GST Invoicing for Medicines Interface",
            icon: FileText,
            features: [
                "Generate accurate invoices",
                "Stay compliant with GST",
                "Reduce manual errors",
                "Customise your invoices"
            ]
        },

    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-16">
                    Advanced Pharmacy Billing Software Features to Enhance Your Pharma Business
                </h2>
                
                <div className="space-y-24">
                    {alternatingFeatures.map((feature, index) => (
                        <div key={index} className={`flex flex-col lg:flex-row gap-12 items-center ${
                            index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                        }`}>
                            {/* Image Side */}
                            <div className="lg:w-1/2">
                                <div className="relative group">
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2">
                                        <img
                                            src={feature.image}
                                            alt={feature.imageAlt}
                                            className="w-full h-[300px] md:h-[400px] object-contain rounded-lg drop-shadow-lg"
                                        />
                                    </div>
                                   </div>
                            </div>

                            {/* Content Side */}
                            <div className="lg:w-1/2 space-y-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                                        <feature.icon className="w-8 h-8 text-[var(--primary-red)]" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-[var(--text-primary)]">
                                        {feature.title}
                                    </h3>
                                </div>
                                
                                <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                                    <p className="text-lg">
                                        {feature.description}
                                    </p>
                                    <p className="text-base">
                                        {feature.additionalInfo}
                                    </p>
                                </div>

                                {/* Feature List */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    {feature.features.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-[var(--primary-red)] rounded-full"></div>
                                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                         
                            </div>
                        </div>
                    ))}
                </div>

              
            </div>
        </section>
    );
}
