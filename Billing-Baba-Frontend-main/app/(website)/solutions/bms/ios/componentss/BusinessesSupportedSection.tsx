// Example file path: src/components/ios-page/BusinessesSupportedSection.tsx

"use client"; // This component is interactive (uses useState and onClick)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Cog, ShoppingCart, Sparkles, Store } from "lucide-react";

// --- Type Definitions for TypeScript ---
interface TabContent {
  title: string;
  imageSrc: string;
  details: {
    heading: string;
    text: string;
    link?: string;
  }[];
}

interface BusinessTabData {
  name: string;
  icon: React.ElementType;
  content: TabContent;
}

// --- Data for the Component, transcribed from your image ---
const tabsData: BusinessTabData[] = [
  {
    name: "Manufacturing",
    icon: Factory,
    content: {
      title: "Manufacturing",
      imageSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/inventory-management-soft-revamp/manufacturing-lg.webp?w=2048&q=75",
      details: [
        {
          heading: "Furniture POS Software",
          text: "Manage custom orders, delivery charges, and variant tracking with Vyapar’s furniture pos software, designed for home decor and manufacturing businesses.",
        },
      ],
    },
  },
  {
    name: "Service",
    icon: Cog,
    content: {
      // Placeholder content
      title: "Service Industry",
      imageSrc:
        "https://vyaparapp.in/v/z/wp-content/uploads/2025/06/image-10-1024x1024.png?w=1080&q=75",
      details: [
        {
          heading: "Service Billing",
          text: "Create professional invoices for services rendered, track project hours, and manage client payments efficiently.",
        },
      ],
    },
  },
  {
    name: "E-commerce",
    icon: ShoppingCart,
    content: {
      // Placeholder content
      title: "E-commerce Business",
      imageSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/inventory-management-soft-revamp/ecomm-lg.webp?w=1080&q=75",
      details: [
        {
          heading: "Online Order Management",
          text: "Integrate with your online store, manage orders from multiple channels, and keep inventory synced automatically.",
        },
      ],
    },
  },
  {
    name: "Beauty",
    icon: Sparkles,
    content: {
      // Placeholder content
      title: "Beauty and Wellness",
      imageSrc:
        "https://vyaparapp.in/v/z/wp-content/uploads/2025/06/image-9-1024x1024.png?w=1080&q=75",
      details: [
        {
          heading: "Salon & Spa POS",
          text: "Manage appointments, client histories, and retail product sales with a system designed for beauty businesses.",
        },
      ],
    },
  },
  {
    name: "Retail",
    icon: Store,
    content: {
      // Placeholder content
      title: "Retail Stores",
      imageSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/inventory-management-soft-revamp/retail-lg.webp?w=1080&q=75",
      details: [
        {
          heading: "Retail POS Software",
          text: "Handle fast-paced retail environments with quick billing, barcode scanning, and multi-location inventory management.",
        },
      ],
    },
  },
];

const BusinessesSupportedSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeTabData = tabsData[activeTab];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Businesses Supported
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="border-b border-gray-200 mb-12">
          <div className="flex justify-center space-x-8">
            {tabsData.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 pb-3 font-semibold transition-colors duration-300 relative ${
                  activeTab === index
                    ? "text-blue-600"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span>{tab.name}</span>
                {activeTab === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="active-tab-underline"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // Key change triggers the animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Column: Image */}
            <div className="flex justify-center">
              <img
                src={activeTabData.content.imageSrc}
                alt={activeTabData.content.title}
                className="w-full max-w-lg h-auto rounded-xl shadow-lg"
              />
            </div>

            {/* Right Column: Text Content */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-text-primary">
                {activeTabData.content.title}
              </h3>
              {activeTabData.content.details.map((detail, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-text-primary">
                    {detail.heading}
                  </h4>
                  <p className="text-text-secondary mt-1">{detail.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BusinessesSupportedSection;
