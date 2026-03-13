import React from 'react';
import RetailHero from '@/components/website/retail-hero';
import RetailFeatures from '@/components/website/retail-features';
import RetailBoostFeatures from '@/components/website/retail-boost-features';
import RetailAdvancedFeatures from '@/components/website/retail-advanced-features';
import RetailPricing from '@/components/website/retail-pricing';
import RetailFAQ from '@/components/website/retail-faq';
import RetailCTA from '@/components/website/retail-cta';

export default function RetailPage() {
    return (
        <div className="min-h-screen bg-white">
            <RetailHero />
            <RetailFeatures />
            <RetailBoostFeatures />
            <RetailAdvancedFeatures />
            <RetailCTA />
            <RetailPricing />
            <RetailFAQ />
           
        </div>
    );
}
