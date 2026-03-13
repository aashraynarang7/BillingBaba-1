import React from 'react';

export default function RetailFAQ() {
    const faqs = [
        {
            question: "What is Retail Billing Software?",
            answer: "Retail billing software is a computer program designed to help businesses manage their sales transactions and invoicing processes. Vyapar billing software for retail shops is a highly recommended solution for retail business management."
        },
        {
            question: "What is the cost of Retail shop billing software?",
            answer: "The cost of retail billing software can vary depending on the specific features and functionality offered by the software. Usually it costs a few thousand rupees for a yearly subscription. Vyapar software is one such cost effective software popular among small businesses and it provides a free trial to the users on Android mobile and Windows PC."
        },
        {
            question: "How to get billing software for a retail shop?",
            answer: "Depending upon the device you can either download a billing software from web, Play-store or App-store. Vyapar for PC can be downloaded from Vyapar website whereas you can download the Vyapar Android billing software for retail shop from Google play-store."
        },
        {
            question: "How to get support for Retail billing software by Vyapar?",
            answer: "You can reach the Vyapar support team between 09:00 AM to 09:00 PM, 7 days a week over phone, email and Chat. Phone: +91-9333-911-911 WhatsApp: +91-6366-827-420 Email: support@vyaparapp.in"
        },
        {
            question: "How safe is billing software for retail shops by Vyapar?",
            answer: "Vyapar billing software for retail shops comes with a number of features which ensures data safety and security. Some of these are passcode for transaction edit and delete, passcode to ensure authorized access, user level access, automatic data backup and more."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-16">
                    Frequently Asked Questions (FAQs)
                </h2>
                
                <div className="space-y-8 px-4">
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
