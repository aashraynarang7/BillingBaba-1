// Example file path: src/components/jewellery-page/WhyTrustBillingBabaSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface TrustFeature {
  title: string;
  description: string;
  iconSrc: string;
  bgColor: string;
}

// --- Data for the Component ---
const trustFeaturesData: TrustFeature[] = [
  {
    title: "Grow Your Jewellery Business",
    description:
      "Whether you sell gold bangles or diamond rings, Billing Baba helps you grow by keeping your billing, inventory, and accounts organised. It also helps you keep customers happy with better service and follow-ups.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Grow-Your-Jewellery-Business-01.webp",
    bgColor: "bg-red-100",
  },
  {
    title: "Save Time with Smart Billing",
    description:
      "Billing made digital and easy! Add a customer once, and Billing Baba remembers everything from past purchases to pending payments. All details are just one tap away.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Save-Time-with-Smart-Billing-01.webp",
    bgColor: "bg-pink-100",
  },
  {
    title: "Fast & Powerful",
    description:
      "Billing Baba works smoothly on both mobile and desktop. So whether you’re in the shop or at home, your business runs without a pause. It’s quick, safe, and always synced.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Fast-Powerful-01.webp",
    bgColor: "bg-blue-100",
  },
  {
    title: "Know Your Profits",
    description:
      "Track how your business is doing daily, weekly, or monthly. With Billing Baba, you get clear reports of your profits and sales so you can make smart decisions on time.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Know-Your-Profits-01.webp",
    bgColor: "bg-purple-100",
  },
  {
    title: "Auto Accounting + GST",
    description:
      "Billing Baba automatically takes care of your accounting and GST. You just do your business, Billing Baba handles the rest, no accountant needed for every small thing.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Auto-Accounting-GST-01.webp",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Go Digital",
    description:
      "Send invoices through WhatsApp or email, print them if needed, and even take your jewellery shop online. Billing Baba lets you stay modern and professional at the same time.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Go-Digital-01.webp",
    bgColor: "bg-green-100",
  },
];

// Helper component for individual feature cards
const TrustFeatureCard: React.FC<TrustFeature> = ({
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
const WhyTrustBillingBabaSection: React.FC = () => {
  return (
    <>
      {/* Top Promotional Banner */}
      <div className="bg-primary-red py-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-text-on-dark">
            Everything You Need in One Jewellery App – Try Billing Baba Now!
          </h2>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="bg-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Why Thousands of Jewellers Trust the Billing Baba's Jewellery
              Billing Software
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustFeaturesData.map((feature) => (
              <TrustFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyTrustBillingBabaSection;
