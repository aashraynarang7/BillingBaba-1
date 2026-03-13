"use client";

import React from 'react';
import { QrCode, FileText, CreditCard, Monitor, Bell, Shield, BarChart3, TrendingUp, Database, ClipboardList, Printer, Settings, Download, Share2, Users, Calculator, BarChart, Smartphone, ShieldCheck, Cloud, RefreshCw } from "lucide-react";

export default function RetailAlternatingFeatures() {
    const alternatingFeatures = [
        {
            title: "Barcode Management",
            description: "The Barcode billing Management feature offered by Vyapar simplifies retail operations by allowing for fast and precise product scanning at the time of billing. Retailers can easily create, print, and scan barcodes with this tool, minimizing errors from manual entries and accelerating the checkout process.",
            additionalInfo: "Also, it supports effective inventory management by automatically adjusting stock levels with each scan. By implementing Vyapar's Barcode Inventory Management, retail shop owners can improve accuracy, save time, and deliver a smooth shopping experience for their customers.",
            image: "/is/retails/inventory_tracking.png",
            imageAlt: "Barcode Management Interface",
            icon: QrCode,
            features: [
                "Fast product scanning",
                "Automatic inventory updates",
                "Error-free billing",
                "Real-time stock tracking"
            ]
        },
        {
            title: "Multiple Invoice Templates",
            description: "Vyapar's Multiple Invoice Templates feature in its billing software for retail store offers a versatile solution for retail shop owners. This feature, available in the best retail billing software, allows you to choose from a variety of customizable invoice designs tailored to your business needs.",
            additionalInfo: "Whether you need a simple, professional look or a more detailed format, Vyapar's templates can be personalized with your business logo, terms, and conditions. This customization helps you create invoices that not only look professional but also reflect your brand identity.",
            image: "/is/retails/quick_billing.png",
            imageAlt: "Multiple Invoice Templates",
            icon: FileText,
            features: [
                "GST Theme options",
                "Customizable designs",
                "Brand logo integration",
                "Professional appearance"
            ]
        },
        {
            title: "Multiple Payment Options",
            description: "Vyapar's Multiple Payment Options feature in its billing software for retail store provides exceptional flexibility and convenience for both shop owners and customers. Available in the retail billing software free download, this feature supports various payment methods.",
            additionalInfo: "Including cash, credit/debit cards, UPI, and digital wallets, catering to diverse customer preferences. By offering a range of payment options, Vyapar not only accelerates the checkout process but also boosts customer satisfaction.",
            image: "/is/retails/multi_device.png",
            imageAlt: "Multiple Payment Options",
            icon: CreditCard,
            features: [
                "Cash & Card payments",
                "UPI integration",
                "Digital wallet support",
                "Faster checkout process"
            ]
        },
        {
            title: "E-Invoicing",
            description: "The E-Invoicing feature offered by Vyapar, a free offline billing software for retail shop, makes the invoicing process easier for retail shop owners by enabling them to create and send digital invoices almost instantly.",
            additionalInfo: "With just a few clicks, you can generate GST-compliant e-invoices that can be shared directly with customers through email or WhatsApp. This feature not only minimizes paperwork but also guarantees accuracy and adherence to tax regulations.",
            image: "/is/retails/busines_task_report.png",
            imageAlt: "E-Invoicing System",
            icon: FileText,
            features: [
                "GST-compliant invoices",
                "Instant digital sharing",
                "Email & WhatsApp integration",
                "Tax regulation compliance"
            ]
        },
        {
            title: "User Role Access",
            description: "Vyapar's User Role Access feature, part of the best billing software for retail shop in India, empowers retail shop owners to assign specific roles and permissions to different users within the app.",
            additionalInfo: "This feature ensures that access is regulated based on job roles, allowing each user to view or modify only the information relevant to their responsibilities. For example, cashiers can handle transactions, while managers can access inventory data and financial reports.",
            image: "/is/retails/quick_billing.png",
            imageAlt: "User Role Access Control",
            icon: Users,
            features: [
                "Role-based permissions",
                "Secure access control",
                "Employee management",
                "Data security"
            ]
        },
        {
            title: "Party Wise Item Rate",
            description: "Vyapar's Party Wise Item Rate feature allows retail shop owners to set different pricing for the same product based on customer categories. This advanced pricing strategy helps maximize profits while maintaining customer relationships.",
            additionalInfo: "You can create customer groups and assign specific rates for wholesale customers, regular customers, and VIP customers. This feature ensures that you can offer competitive pricing to different customer segments while maintaining your profit margins.",
            image: "/is/retails/inventory_tracking.png",
            imageAlt: "Party Wise Item Rate",
            icon: BarChart3,
            features: [
                "Customer-specific pricing",
                "Wholesale rate management",
                "VIP customer rates",
                "Profit optimization"
            ]
        },
        {
            title: "Retail and Wholesale Rate",
            description: "Vyapar's Retail and Wholesale Rate feature provides flexible pricing options for different business models. Set separate rates for retail customers and wholesale buyers to maximize your business potential.",
            additionalInfo: "This feature allows you to maintain different profit margins for different sales channels. You can set wholesale rates for bulk purchases and retail rates for individual customers, helping you capture both market segments effectively.",
            image: "/is/retails/multi_device.png",
            imageAlt: "Retail and Wholesale Rate",
            icon: TrendingUp,
            features: [
                "Dual pricing system",
                "Bulk purchase rates",
                "Market segment pricing",
                "Revenue optimization"
            ]
        },
        {
            title: "Real Time Data Sync",
            description: "Vyapar's Real Time Data Sync feature ensures that all your business data is synchronized across multiple devices and locations in real-time. This feature is crucial for businesses operating from multiple locations.",
            additionalInfo: "Whether you're using the mobile app, desktop software, or web application, all your data including sales, inventory, and customer information stays updated automatically. This eliminates data discrepancies and ensures business continuity.",
            image: "/is/retails/quick_billing.png",
            imageAlt: "Real Time Data Sync",
            icon: RefreshCw,
            features: [
                "Instant synchronization",
                "Multi-device access",
                "No data loss",
                "Business continuity"
            ]
        },
        {
            title: "Bulk Update Items",
            description: "Vyapar's Bulk Update Items feature allows you to update multiple products simultaneously, saving significant time and effort. This is especially useful when you need to change prices, categories, or other attributes for multiple items.",
            additionalInfo: "You can select multiple items and update their prices, descriptions, categories, or any other attributes in one operation. This feature is particularly helpful during seasonal sales, price revisions, or inventory reorganization.",
            image: "/is/retails/inventory_tracking.png",
            imageAlt: "Bulk Update Items",
            icon: ClipboardList,
            features: [
                "Mass item updates",
                "Time-saving operations",
                "Batch processing",
                "Efficient management"
            ]
        },
        {
            title: "Thermal/ Regular Printer Compatibility",
            description: "Vyapar's Thermal/ Regular Printer Compatibility feature ensures that you can print invoices and receipts using any type of printer available in your retail shop. This flexibility is essential for different business setups.",
            additionalInfo: "Whether you have a thermal printer for quick receipts, a regular printer for detailed invoices, or both, Vyapar supports all printer types. This feature ensures that you can always provide customers with printed documentation regardless of your printer setup.",
            image: "/is/retails/busines_task_report.png",
            imageAlt: "Printer Compatibility",
            icon: Printer,
            features: [
                "Thermal printer support",
                "Regular printer support",
                "Flexible printing options",
                "Professional output"
            ]
        },
        {
            title: "Auto Data Backup",
            description: "Vyapar's Auto Data Backup feature automatically saves your business data at regular intervals, ensuring that you never lose important information due to system failures or accidents.",
            additionalInfo: "This feature creates automatic backups of your sales data, inventory records, customer information, and financial reports. You can restore your data anytime, ensuring business continuity and data security.",
            image: "/is/retails/multi_device.png",
            imageAlt: "Auto Data Backup",
            icon: Cloud,
            features: [
                "Automatic backups",
                "Data security",
                "Easy restoration",
                "Business protection"
            ]
        },
        {
            title: "Set Credit Limit for Customers",
            description: "Vyapar's Set Credit Limit for Customers feature allows you to define credit limits for different customers, helping you manage credit sales effectively and reduce bad debt risks.",
            additionalInfo: "You can set different credit limits based on customer history, payment behavior, and business relationship. This feature helps you maintain healthy cash flow while building customer trust and loyalty.",
            image: "/is/retails/inventory_tracking.png",
            imageAlt: "Credit Limit Management",
            icon: Shield,
            features: [
                "Customer credit limits",
                "Risk management",
                "Cash flow control",
                "Customer trust building"
            ]
        },
        {
            title: "Online Store",
            description: "Vyapar's Online Store feature enables retail shop owners to expand their business beyond physical locations. This comprehensive e-commerce solution integrates seamlessly with your billing and inventory management system.",
            additionalInfo: "Create an attractive online storefront, manage product catalogs, process online orders, and maintain real-time inventory synchronization between your physical and online stores.",
            image: "/is/retails/quick_billing.png",
            imageAlt: "Online Store",
            icon: Monitor,
            features: [
                "E-commerce integration",
                "Online product catalog",
                "Digital storefront",
                "Multi-channel sales"
            ]
        },
        {
            title: "Mobile App Access",
            description: "Vyapar's Mobile App Access feature provides complete business management capabilities on your smartphone. Access your business data, manage sales, and monitor performance from anywhere, anytime.",
            additionalInfo: "The mobile app offers all the features of the desktop version, allowing you to manage your retail business on the go. Whether you're traveling or away from your shop, you can stay connected to your business operations.",
            image: "/is/retails/multi_device.png",
            imageAlt: "Mobile App Access",
            icon: Smartphone,
            features: [
                "Mobile business management",
                "On-the-go access",
                "Full feature access",
                "Business mobility"
            ]
        },
        {
            title: "GST Compliant",
            description: "Vyapar's GST Compliant feature ensures that your billing software meets all GST requirements and regulations. Generate GST-compliant invoices and reports automatically without manual calculations.",
            additionalInfo: "The software automatically calculates GST rates, generates proper tax invoices, and provides detailed GST reports for filing. This feature helps you stay compliant with tax regulations and avoid penalties.",
            image: "/is/retails/busines_task_report.png",
            imageAlt: "GST Compliance",
            icon: ShieldCheck,
            features: [
                "GST calculation",
                "Tax compliance",
                "Automated reporting",
                "Regulatory adherence"
            ]
        },
        {
            title: "Offline Compatibility",
            description: "Vyapar's Offline Compatibility feature ensures that your business operations continue smoothly even without internet connectivity. This is crucial for retail shops in areas with unreliable internet connections.",
            additionalInfo: "You can continue creating bills, managing inventory, and processing sales even when offline. All data is stored locally and automatically syncs when internet connectivity is restored, ensuring no data loss.",
            image: "/is/retails/inventory_tracking.png",
            imageAlt: "Offline Compatibility",
            icon: Database,
            features: [
                "Offline operations",
                "Local data storage",
                "Automatic sync",
                "Business continuity"
            ]
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-16">
                    Advanced Retail Shop Billing Software to Enhance Business Growth
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
                                            className="w-full h-full object-cover rounded-lg drop-shadow-lg"
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

                                {/* Learn More Button */}
                                <button className="mt-6 bg-transparent border-2 border-[var(--primary-red)] text-[var(--primary-red)] px-6 py-2 rounded-lg font-semibold hover:bg-[var(--primary-red)] hover:text-white transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

              
            </div>
        </section>
    );
}
