import React from 'react';

export default function PharmacyFAQ() {
    const faqs = [
        {
            question: "What is Pharmacy Billing Software?",
            answer: "Pharmacy billing software provides seamless and more efficient management of billing, purchases, cash flows, payments, and inventories. With the barcode scanning capability, the app helps pharmacists make billing in quick time."
        },
        {
            question: "Which Is The Best Pharmacy Billing Software?",
            answer: "The best pharmacy billing software in India is Vyapar because it is free, easy, and feature-rich. Vyapar helps you manage your pharmacy store efficiently and effectively, and comply with GST regulations. Vyapar is trusted by lakhs of pharmacy owners across India."
        },
        {
            question: "How Can I Get A Vyapar Pharmacy Billing Software Demo for Free?",
            answer: "Once you download the pharmacy software of Vyapar's, log in with your mobile number and request a demo. Our support team will be in touch with you and schedule the demo with our product experts."
        },
        {
            question: "Is Vyapar's Wholesale Pharma Billing Software Available for Free?",
            answer: "Yes, Vyapar offers a free version of its wholesale pharma billing software, allowing distributors to generate invoices, track inventory, and manage GST. However, premium features like advanced reporting and multi-user access are available in the paid version."
        },
        {
            question: "Can I Get Cheap Pharmacy Billing Software In The Indian Market?",
            answer: "Yes, if you are running a pharma business in India, Vyapar is the best and cheapest billing software for pharmacies. The pharmacy billing software price is completely free for the mobile version and you can get a free trial for desktops. You will get the premium features at a very affordable price."
        },
        {
            question: "How To Download Free Retail Pharmacy Software From Vyapar?",
            answer: "To download free retail pharmacy software from Vyapar, you just have to visit our website or app store and click on the download button. You can also scan the QR code on our website or app store and download Vyapar directly to your device."
        },
        {
            question: "Who Can Use Vyapar Billing Software for Pharmacy?",
            answer: "Vyapar Billing Software for Pharmacy can be used by anyone who owns or operates a pharmacy store or pharmacy. Vyapar is designed to suit the needs and requirements of pharmacy owners and managers and to make their work easier and faster."
        },
        {
            question: "How To Use Vyapar Pharmacy Billing Software?",
            answer: "To use Vyapar pharmacy billing software, you just have to register and create your business profile in the app. You can then start adding your medicines, customers, suppliers, and transactions in the app. You can also use the various features and functions of the app to manage your inventory, billing, GST, reports, and more."
        },
        {
            question: "What Are The Benefits Of Using Vyapar Billing Software for Pharmacy?",
            answer: "The benefits of using Vyapar pharmacy billing software are many and varied. Some of the benefits are: Save time, money, and hassle by using Vyapar's free and easy pharmacy billing app. Increase customer satisfaction and loyalty by using Vyapar's quick and professional billing software. Comply with GST regulations and avoid penalties and fines by using Vyapar's accurate and timely GST software. Improve your business performance and growth by using Vyapar's powerful and insightful reports software."
        },
        {
            question: "How Do I Contact the Vyapar Support Team if I Have Any Issues or Queries?",
            answer: "You can contact our support team anytime and anywhere if you have any issues or queries regarding Vyapar pharmacy billing software. You can reach us by email, phone, chat, or social media. We are always happy to help you and resolve your issues and queries. Phone: +91-9333-911-911 WhatsApp: +91-6366-827-420"
        },
        {
            question: "Why is Billing Software For The Pharmacy Business Much Needed?",
            answer: "In today's healthcare industry, pharmacies play an important role. To sustain the competitive market, the pharma business requires advanced and efficient software to manage billing, inventory, sales and purchase management, and more. Vyapar billing software for pharmacy offers a robust solution to handle billing, accounting, and inventory processes."
        },
        {
            question: "Can I use Vyapar's software for wholesale medicine billing and GST filing?",
            answer: "Absolutely! Vyapar's Free Wholesale Medicine Billing Software automates medicine stock tracking, invoice generation, and GST calculations. It helps wholesalers keep accurate records of sales, taxes, and outstanding payments while reducing manual errors."
        },
        {
            question: "Who Should Use Vyapar's Pharma Wholesale Billing Software?",
            answer: "Vyapar's Pharma Wholesale Billing Software is ideal for pharmaceutical wholesalers, distributors, and stockists who need an easy way to manage bulk billing, stock tracking, and GST compliance while ensuring smooth business operations."
        },
        {
            question: "What Essential Features Does Vyapar App's Pharmacy Software Offer for Indian SMEs?",
            answer: "Vyapar's pharmacy billing software offers quick billing, smart inventory tracking, medicine expiry alerts, and full GST compliance. It also supports multi-store management, drug license tracking, and detailed business reports—perfectly tailored for Indian SMEs."
        },
        {
            question: "How Does Vyapar App's Pharmacy Software Help With GST Compliance in India?",
            answer: "With Vyapar, 100% GST compliance becomes effortless. The software automates tax calculations, generates GST-compliant invoices, and ensures all transactions meet regulatory standards. This reduces the risk of manual errors and makes it easier for pharmacy owners to stay tax-ready throughout the year."
        },
        {
            question: "Can Vyapar App's Pharmacy Billing Software Manage Medicine Expiry Dates and Inventory Effectively?",
            answer: "Yes, Vyapar App provides robust Medicine Expiry Management with real-time low stock alerts, enabling smart reordering and helping to prevent losses from expired stock."
        },
        {
            question: "Is Vyapar App's Pharmacy Billing Software Cloud-based?",
            answer: "Yes, Vyapar runs on a secure cloud-based platform. Pharmacy owners can access their data anytime and from anywhere with an internet connection. The system supports automatic updates and ensures real-time data syncing across devices, making business management seamless and secure."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-16">
                    Frequently Asked Questions (FAQs)
                </h2>
                
                <div className="space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="space-y-3">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
                                {faq.question}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
