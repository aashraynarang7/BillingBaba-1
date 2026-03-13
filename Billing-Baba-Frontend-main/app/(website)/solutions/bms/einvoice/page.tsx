// path: src/app/e-invoice/page.tsx

import React from "react";

// --- Importing all the section components for the E-Invoice page ---
import BenefitsSection from "./components/BenefitsSection";
import BusinessManagementFeatures from "./components/BusinessManagementFeatures";
import CommunityReviewsSection from "./components/CommunityReviewsSection";
import EInvoiceGuideSection from "./components/EInvoiceGuideSection";
import EInvoicingHero from "./components/EInvoicingHero";
import FaqSection from "./components/FaqSection";
import FinalSaleBanner from "./components/FinalSaleBanner";
import IndustriesBenefitingSection from "./components/IndustriesBenefitingSection";
import InvoiceInfoSection from "./components/InvoiceInfoSection";
import KeyFeaturesSection from "./components/KeyFeaturesSection";
import ProductDetailsService from "./components/ProductDetailsService";
import StatsSection from "./components/StatsSection";
import GSTComplianceSection from "./components/STComplianceSection"; // Assuming the file is named this
import WhyVyaparIsBestSection from "./components/WhyVyaparIsBestSection";

// --- The Main Page Component ---
export default function EInvoicePage() {
  return (
    <main>
      {/* All sections are rendered here in the correct order */}
      <FinalSaleBanner />
      <EInvoicingHero />
      <KeyFeaturesSection />
      <StatsSection />
      <EInvoiceGuideSection />
      <InvoiceInfoSection />
      <ProductDetailsService />
      <WhyVyaparIsBestSection />
      <BusinessManagementFeatures />
      <BenefitsSection />
      <IndustriesBenefitingSection />
      <GSTComplianceSection />
      <CommunityReviewsSection />
      <FaqSection />
    </main>
  );
}
