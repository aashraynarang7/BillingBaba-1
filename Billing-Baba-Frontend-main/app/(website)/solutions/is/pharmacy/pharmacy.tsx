import React from 'react';
import PharmacyHero from '@/components/website/pharmacy-hero';
import PharmacyFeatures from '@/components/website/pharmacy-features';
import PharmacyBoostFeatures from '@/components/website/pharmacy-boost-features';
import PharmacyAdvancedFeatures from '@/components/website/pharmacy-advanced-features';
import PharmacyTrustSection from '@/components/website/pharmacy-trust-section';
import PharmacyWholesaleSection from '@/components/website/pharmacy-wholesale-section';
import PharmacyPricing from '@/components/website/pharmacy-pricing';
import PharmacyFAQ from '@/components/website/pharmacy-faq';
import PharmacyCTA from '@/components/website/pharmacy-cta';

export default function Pharmacy() {
    return (
        <div className="min-h-screen bg-white">
            <PharmacyHero />
            <PharmacyFeatures />
            <PharmacyBoostFeatures />
            <PharmacyTrustSection />
            <PharmacyWholesaleSection />
            <PharmacyAdvancedFeatures />
            <PharmacyPricing />
            <PharmacyFAQ />
            <PharmacyCTA />
        </div>
    );
}   