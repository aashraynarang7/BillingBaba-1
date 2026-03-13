"use client"

import React from 'react';
import { Lock } from 'lucide-react';

// WhatsApp icon ka SVG component
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
    </svg>
);


// --- Main WhatsApp Integration Page Component ---
export default function WhatsappIntegrationPage() {
    return (
        // --- PADDING & TEXT SIZE FIX ---
        <div className="bg-white min-h-screen w-full font-sans flex justify-center py-8 px-4">
            <div className="max-w-5xl mx-auto text-center">

                {/* --- Header Section --- */}
                <div className="flex items-center justify-center gap-3 mb-2">
                    <WhatsAppIcon />
                    {/* Text Size Reduced */}
                    <h1 className="text-2xl font-bold text-gray-800">
                        WhatsApp in  Billing Baba to Share Bills, Reminders & More
                    </h1>
                </div>
                {/* Text Size & Margin Reduced */}
                <p className="text-gray-500 max-w-3xl mx-auto mb-8 text-base">
                    Send invoices, remind customers, and track payments – all from  Billing Baba with your existing WhatsApp.
                </p>

                {/* --- Central Illustration --- */}
                <div className="mb-10 flex justify-center">
                     {/* Corrected width syntax and made image smaller */}
                    <img 
                        src="/dashboard/people-using-mobile-bank-remittance-money.png" 
                        alt=" Billing Baba WhatsApp Integration Illustration" 
                        className="max-w-xs w-full"
                    />
                </div>

                {/* --- Features Section --- */}
                {/* Margin Reduced */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 mb-10">
                    {/* Feature 1: Send Bills */}
                    <div className="flex items-center text-left gap-4">
                        <img src="/dashboard/bank-card-mobile-phone-online-payment.png" alt="Send Bills in Single Click" className="w-16 h-16 flex-shrink-0"/>
                        <div>
                            {/* Text Size Reduced */}
                            <h3 className="text-base font-bold text-gray-800 mb-1">Send Bills in Single Click</h3>
                            <p className="text-gray-600 text-sm">Send bills instantly and get payments on time</p>
                        </div>
                    </div>
                    
                    {/* Feature 2: Works with Existing WhatsApp */}
                     <div className="flex items-center text-left gap-4">
                        <img src="/dashboard/online-payment-security-concept-3d-phone-bill.png" alt="Works With Existing WhatsApp" className="w-16 h-16 flex-shrink-0"/>
                        <div>
                            {/* Text Size Reduced */}
                            <h3 className="text-base font-bold text-gray-800 mb-1">Works With Existing WhatsApp</h3>
                            <p className="text-gray-600 text-sm">No new app. Keep using the account you already have</p>
                        </div>
                    </div>

                    {/* Feature 3: Fully Secured */}
                     <div className="flex items-center text-left gap-4">
                        <img src="/dashboard/Data_security.png" alt="Fully Secured & Encrypted" className="w-16 h-16 flex-shrink-0"/>
                        <div>
                            {/* Text Size Reduced */}
                            <h3 className="text-base font-bold text-gray-800 mb-1">Fully Secured & Encrypted</h3>
                            <p className="text-gray-600 text-sm">Messages are end to end encrypted and safe</p>
                        </div>
                    </div>
                </div>

                {/* --- Call to Action Section --- */}
                <div className="flex flex-col items-center gap-4">
                    <button className="bg-red-500 text-white font-semibold px-10 py-3 rounded-full text-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400">
                        Link my WhatsApp
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Lock className="h-4 w-4" />
                        <span>Secure, official, and designed for your business.</span>
                    </div>
                </div>

            </div>
        </div>
    );
}