// Example file path: src/components/jewellery-page/JewelleryAddonFeaturesSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface AddonFeature {
  title: string;
  iconSrc: string;
}

// --- Data for the Component, transcribed from your image ---
const addonFeaturesData: AddonFeature[] = [
  {
    title: "Design-Wise Inventory Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Design-Wise-Inventory-Management-01.webp",
  },
  {
    title: "Reporting & Analytics",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Reporting-Analytics-01.webp",
  },
  {
    title: "Jewellery Repair & Service Tracking",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Jewellery-Repair-Service-Tracking-01.webp",
  },
  {
    title: "Jewellery Shop Cash Flow Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Jewellery-Shop-Cash-Flow-Management-01.webp",
  },
  {
    title: "Quick Sale With Payment Options",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Quick-Sale-With-Payment-Options-01.webp",
  },
  {
    title: "Purchase & Vendor Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Purchase-Vendor-Management-01.webp",
  },
  {
    title: "SMS & Email Notifications",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/SMS-Email-Notifications-01.webp",
  },
  {
    title: "Multi-Store Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Multi-Store-Management-01.webp",
  },
  {
    title: "Discount & Offer Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Discount-Offer-Management-01.webp",
  },
  {
    title: "Print & Digital Invoice Options",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Print-Digital-Invoice-Options-01.webp",
  },
  {
    title: "User Permissions & Security",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/User-Permissions-Security-01.webp",
  },
  {
    title: "Jewellery Order Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Jewellery-Order-Management-01.webp",
  },
];

// Main Component
const JewelleryAddonFeaturesSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Add-On Features of Vyapar’s Jewellery Billing System Software
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {addonFeaturesData.map((feature) => (
            <div
              key={feature.title}
              className="bg-background-light p-6 rounded-2xl shadow-sm text-center transition-transform hover:-translate-y-2 duration-300"
            >
              <img
                src={feature.iconSrc}
                alt={feature.title}
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-text-primary">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JewelleryAddonFeaturesSection;
