// path: app/(website)/solutions/bms/is/jwellery/jwellery.tsx

import React from "react";

// --- Importando todos los componentes de sección para la página de Joyería ---
// FIX: Las rutas ahora coinciden con tu estructura de carpetas.
import JewelleryHeroSection from "@/components/website/jwellery/JewelleryHeroSection";
import JewelleryFeaturesSection from "@/components/website/jwellery/JewelleryFeaturesSection";
import JewelleryTestimonialsSection from "@/components/website/jwellery/JewelleryTestimonialsSection";
import JewelleryAddonFeaturesSection from "@/components/website/jwellery/JewelleryAddonFeaturesSection";
import BusinessEfficiencySection from "@/components/website/jwellery/BusinessEfficiencySection";
import WhyTrustBillingBabaSection from "@/components/website/jwellery/WhyTrustBillingBabaSection";
import JewelleryFaqSection from "@/components/website/jwellery/JewelleryFaqSection";

// --- El Componente Principal de la Página ---
// El nombre de la función ahora es JewelleryPage para seguir las convenciones de React.
export default function JewelleryPage() {
  return (
    <main>
      {/* Todos los componentes se renderizan aquí en el orden correcto */}
      <JewelleryHeroSection />
      <JewelleryFeaturesSection />
      <JewelleryTestimonialsSection />
      <JewelleryAddonFeaturesSection />
      <BusinessEfficiencySection />
      <WhyTrustBillingBabaSection />
      <JewelleryFaqSection />
    </main>
  );
}
