// Example file path: src/components/ios-page/MoreFeaturesSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface FeatureItem {
  title: string;
  description: string;
  iconSrc: string;
  bgColor: string;
}

// --- Data for the Component, transcribed from your image ---
const featuresData: FeatureItem[] = [
  {
    title: "Multi-Godown Support",
    description:
      "Scale your business with ease by operating multiple billing counters efficiently.",
    iconSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/godown.png",
    bgColor: "bg-blue-100",
  },
  {
    title: "Multiple Payment Options",
    description:
      "V-POS allows you to accept various payment methods to accommodate your customer’s preferences.",
    iconSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/payment-method.png",
    bgColor: "bg-red-100",
  },
  {
    title: "Cloud Based Convenience",
    description:
      "Enjoy the benefits of a cloud-based solution, giving you access to your data from anywhere, anytime.",
    iconSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/cloud-based.png",
    bgColor: "bg-orange-100",
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain valuable insights into your business with detailed reporting and analytics tools.",
    iconSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/offline.png",
    bgColor: "bg-sky-100",
  },
  {
    title: "Works Fully Offline",
    description:
      "Even when the Internet connection is unreliable or unavailable, V-POS continues to serve your business needs.",
    iconSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/payment-method.png",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Full Financial Accounting",
    description:
      "Keep your finances in check with built-in financial accounting features.",
    iconSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/payment-method.png",
    bgColor: "bg-rose-100",
  },
];

// Helper component for individual feature cards to keep code clean
const FeatureCard: React.FC<FeatureItem> = ({
  title,
  description,
  iconSrc,
  bgColor,
}) => {
  return (
    <div className="bg-background-light p-8 rounded-2xl shadow-sm text-center h-full">
      <div
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${bgColor}`}
      >
        <img src={iconSrc} alt={title} className="w-12 h-12" />
      </div>
      <h3 className="mt-6 text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </div>
  );
};

// Main Component
const MoreFeaturesSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            More Features
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              iconSrc={feature.iconSrc}
              bgColor={feature.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreFeaturesSection;
