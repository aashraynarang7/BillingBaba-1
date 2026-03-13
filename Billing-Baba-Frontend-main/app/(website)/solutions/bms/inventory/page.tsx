import React from "react";

// Section components
import InventoryHeroSection from "./components/InventoryHeroSection";
import InventoryFeaturesSection from "./components/InventoryFeaturesSection";
import ServingIndustriesSection from "./components/ServingIndustriesSection";
import GstComplianceSection from "./components/GstComplianceSection";
import IntegrationsSection from "./components/IntegrationsSection";
import ProductDemoSection from "./components/ProductDemoSection";
import InventoryTestimonials from "./components/InventoryTestimonials";
import SuccessStorySection from "./components/SuccessStorySection";
import InventoryFaqSection from "./components/InventoryFaqSection";
import InventoryRatingSection from "./components/InventoryRatingSection";
// import InventoryIntroSection from "./components/InventoryIntroSection"; // 🔹 New section for rahul-cmtai content

// Main Page Component
export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Hero */}
      <InventoryHeroSection />

      {/* Intro (rahul-cmtai breadcrumb + features/impact + CTA) */}
      {/* <InventoryIntroSection /> */}

      {/* Core Sections */}
      <InventoryFeaturesSection />
      <ServingIndustriesSection />
      <GstComplianceSection />
      <IntegrationsSection />
      <InventoryTestimonials />
      <ProductDemoSection />
      <SuccessStorySection />
      <InventoryFaqSection />
      <InventoryRatingSection />
    </main>
  );
}
