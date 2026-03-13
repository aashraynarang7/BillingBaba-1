"use client"; // Important: This component needs state for interactivity

import React, { useState } from "react";
import Image from "next/image";

// --- ✨ SVG Icons for the Tabs ---
const ManufacturingIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1-4h1m-1 4h1"
    />
  </svg>
);
const WholesaleIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
    />
  </svg>
);
const EcommerceIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const LogisticsIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2l3 3v6a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h2"
    />
  </svg>
);
const RetailIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

// --- ✨ Data for the Industries Tabs Section ---
const industriesData = [
  {
    name: "Manufacturing",
    icon: <ManufacturingIcon />,
    imageSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/inventory-management-soft-revamp/manufacturing-lg.webp?w=1080&q=75", // IMPORTANT: Image path
    title: "Manufacturing",
    description:
      "Managing inventory without any professional inventory control software for manufacturing companies can be a complex and challenging task. Manufacturing industries face managing raw materials, work-in-progress and finished goods across various locations.",
    points: [
      "Manage raw materials & production materials in one place",
      "Bill of material feature facility",
      "Automated deduction of raw materials after finished goods",
      "Production and consumption reports",
      "Expense management for the production",
    ],
  },
  {
    name: "Wholesale",
    icon: <WholesaleIcon />,
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/wholesale-lg.webp?w=1080&q=75", // IMPORTANT: Image path
    title: "Wholesale",
    description:
      "For wholesale businesses, managing bulk orders, multiple warehouses, and batch-wise inventory is crucial. Our software simplifies these complex operations.",
    points: [
      "Manage bulk stock across multiple godowns",
      "Track inventory by batch number and expiry dates",
      "Set different pricing for different customer groups",
      "Generate bulk invoices and delivery challans",
      "Analyze sales trends to optimize stock levels",
    ],
  },
  {
    name: "E-commerce",
    icon: <EcommerceIcon />,
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/ecomm-lg.webp?w=1080&q=75", // IMPORTANT: Image path
    title: "E-commerce",
    description:
      "Selling online requires real-time stock updates across all your channels. Our software syncs your inventory to prevent overselling and manage returns efficiently.",
    points: [
      "Sync inventory with Shopify, WooCommerce, and other platforms",
      "Automated stock updates on new orders or returns",
      "Manage online and offline inventory from one place",
      "Track order statuses from processing to delivery",
      "Analyze channel-wise sales performance",
    ],
  },
  // Add more industries here
];

const ServingIndustriesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const activeTabData = industriesData[activeTab];

  return (
    <section className="bg-sky-50 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          How Our App is Serving Many Industries with Inventory Control Software
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {industriesData.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`flex shrink-0 items-center gap-2 px-1 pb-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === index
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 items-center gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <Image
              src={activeTabData.imageSrc}
              alt={activeTabData.title}
              width={400}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-bold text-[color:var(--text-primary)]">
              {activeTabData.title}
            </h3>
            <p className="mb-6 text-[color:var(--text-secondary)]">
              {activeTabData.description}
            </p>
            <ul className="space-y-2">
              {activeTabData.points.map((point, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-sky-500"></span>
                  <span className="text-sm text-[color:var(--text-secondary)]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServingIndustriesSection;
