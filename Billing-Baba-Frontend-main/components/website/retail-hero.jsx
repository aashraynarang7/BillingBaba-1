import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function RetailHero() {
    return (
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/is/retails/hero.png')" }}
                />
                {/* Light overlay for better text readability */}
                <div className="absolute inset-0 bg-white/30" />
            </div>

            {/* Breadcrumb Navigation - Top Left Overlay */}
            <div className="absolute top-8 left-8 z-20">
                <Breadcrumb 
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Free', href: '/free' },
                        { label: 'Retail Shop Billing Software' }
                    ]} 
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
                <h1 className="mb-6 font-bold text-4xl sm:text-5xl md:text-6xl leading-tight drop-shadow-sm text-[var(--text-primary)]">
                    Retail Shop Billing Software
                </h1>
                
                <div className="mb-8 max-w-3xl mx-auto">
                    <p className="text-base sm:text-lg md:text-xl font-bold leading-relaxed text-[var(--text-secondary)]">
                        Create professional bills in seconds, track income & expenses easily, and stay organized!
                        Download Vyapar Now & Experience Faster Billing on PC and Mobile with a Free Trial!
                    </p>
                </div>
                
              
            </div>

            {/* Chat Icon - Bottom Right */}
            <div className="absolute bottom-8 right-8 z-20">
                <Button 
                    size="icon" 
                    className="w-16 h-16 rounded-full shadow-lg transition-all duration-300 bg-[var(--primary-red)] text-[var(--text-on-dark)] border-[var(--primary-red)]"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </div>
        </section>
    );
}
