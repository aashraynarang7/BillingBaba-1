// path: app/(website)/solutions/bms/ios/page.tsx

import React from "react";
import BusinessesSupportedSection from "./componentss/BusinessesSupportedSection";
import EmpoweringBusinessesSection from "./componentss/EmpoweringBusinessesSection";
import MoreFeaturesSection from "./componentss/MoreFeaturesSection";
import PosFaqSection from "./componentss/PosFaqSection";
import PosHeroSection from "./componentss/PosHeroSection";
import PosVideoSection from "./componentss/PosVideoSection";
import ProductDemoSection from "./componentss/ProductDemoSection";
import SocialProofSection from "./componentss/SocialProofSection";
import WhyChoosePosSection from "./componentss/WhyChoosePosSection";

// --- The Main Page Component ---
export default function IOSPage() {
  return (
    <main>
      <PosHeroSection />
      <PosVideoSection />
      <WhyChoosePosSection />
      <BusinessesSupportedSection />
      <SocialProofSection />
      <ProductDemoSection />
      <MoreFeaturesSection />
      <EmpoweringBusinessesSection />
      <PosFaqSection />
    </main>
  );
}
