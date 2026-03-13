// Example file path: src/components/ios-page/WhyChoosePosSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface FeatureItem {
  number: number;
  title: string;
  description: string;
}

// --- Data for the Component, transcribed from your image ---
const featuresData: FeatureItem[] = [
  {
    number: 1,
    title: "Inventory Management",
    description:
      "Stay on top of your inventory levels, reducing wastage and ensuring products are always available.",
  },
  {
    number: 2,
    title: "Online Store",
    description:
      "Build an online store along with your offline presence and enable users to shop from anywhere, anytime.",
  },
  {
    number: 3,
    title: "WhatsApp Integration",
    description:
      "Seamlessly communicate with your customers via WhatsApp, enhancing your customer service.",
  },
  {
    number: 4,
    title: "Hardware Compatibility",
    description:
      "Vyapar billing software seamlessly integrates with a wide range of hardware, providing you with flexibility and choice. Vyapar POS machine supports all devices with Windows 7 and above and Mac.",
  },
];

const WhyChoosePosSection: React.FC = () => {
  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Why Choose Vyapar POS Billing Software
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Numbered List */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-blue-100 hidden sm:block"></div>

            <div className="space-y-10 relative">
              {featuresData.map((feature) => (
                <div key={feature.number} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl z-10">
                    {feature.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src="https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/usp3.webp"
                alt="POS Software features illustration"
                className="w-full max-w-md h-auto relative z-10"
              />
              {/* Decorative background circle */}
              <div className="absolute inset-0 m-auto w-96 h-96 border-8 border-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoosePosSection;
