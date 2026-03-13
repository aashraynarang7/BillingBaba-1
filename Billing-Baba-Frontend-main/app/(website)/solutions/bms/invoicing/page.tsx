import React from "react";
import InvoicingHeroSection from "./components/InvoicingHeroSection";
import KeyFeaturesGrid from "./components/KeyFeaturesGrid";
import InvoicingFeaturesSection from "./components/InvoicingFeaturesSection";
import InvoiceStepsSection from "./components/InvoiceStepsSection";
import BrandIdentitySection from "./components/BrandIdentitySection";
import BestInvoiceProgramSection from "./components/BestInvoiceProgramSection";
import AdvancedSolutionsSection from "./components/AdvancedSolutionsSection";
import IndustriesTabsSection from "./components/IndustriesTabsSection";
import InvoicingVideoSection from "./components/InvoicingVideoSection";
import FactorsAndCommunitySection from "./components/FactorsAndCommunitySection";
import InvoicingFaqSection from "./components/InvoicingFaqSection";
import ExploreLinksSection from "./components/ExploreLinksSection";

export default function InvoicingPage() {
  return (
    <main>
      <InvoicingHeroSection />
      <KeyFeaturesGrid />
      <InvoicingFeaturesSection />
      <InvoiceStepsSection />
      <BrandIdentitySection />
      <BestInvoiceProgramSection />
      <AdvancedSolutionsSection />
      <IndustriesTabsSection />
      <InvoicingVideoSection />
      <FactorsAndCommunitySection />
      <InvoicingFaqSection />
      <ExploreLinksSection />
    </main>
  );
}
