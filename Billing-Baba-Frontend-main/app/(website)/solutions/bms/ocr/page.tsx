// path: ocr/page.tsx

import React from "react";

// --- Importing all the section components for the OCR Page ---
// FIX: Paths ko local 'components' folder ke hisab se theek kiya gaya hai
import OcrHeroSection from "./components/OcrHeroSection";
import OcrStatsSection from "./components/OcrStatsSection";
import AutomationFeaturesSection from "./components/AutomationFeaturesSection";
import HowOcrWorksSection from "./components/HowOcrWorksSection";
import ReviewColumnsSection from "./components/ReviewColumnsSection";
import OcrTestimonialsSection from "./components/OcrTestimonialsSection";
import OcrCtaSection from "./components/OcrCtaSection";
import OcrFaqSection from "./components/OcrFaqSection";

// --- The Main Page Component ---
export default function OcrPage() {
  return (
    <main>
      {/* All sections are rendered here in the correct order */}
      <OcrHeroSection />
      <OcrStatsSection />
      <AutomationFeaturesSection />
      <HowOcrWorksSection />
      <ReviewColumnsSection />
      <OcrTestimonialsSection />
      <OcrCtaSection />
      <OcrFaqSection />
    </main>
  );
}
