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
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/invoicing-software/bs-manufacturing.webp?w=2048&q=75",
    description:
      "Manufacturing faces unique invoicing challenges. Complex projects with variable costs, materials tracking, and progress billing can lead to errors and delays. Billing Baba invoicing software tackles these issues by:",
    points: [
      {
        bold: "Automating Calculations:",
        text: "Generate accurate invoices based on bills of materials, labor hours, and project milestones.",
      },
      {
        bold: "Streamlining Progress Billing:",
        text: "Send invoices at predetermined stages of production to ensure timely payments.",
      },
      {
        bold: "Inventory Tracking:",
        text: "Ensure accurate cost calculations by integrating with inventory management systems.",
      },
      {
        bold: "Improved Communication:",
        text: "Provide real-time project updates to clients through the software, fostering transparency and trust.",
      },
    ],
  },
  {
    name: "Wholesale",
    icon: <WholesaleIcon />,
    imageSrc:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/inventory-management-soft-revamp/wholesale-lg.webp?w=2048&q=75",
    description:
      "For wholesalers, managing large volumes of invoices and tracking payments is key. Our software helps by:",
    points: [
      {
        bold: "Bulk Invoicing:",
        text: "Create and send hundreds of invoices in a single batch.",
      },
      {
        bold: "Payment Tracking:",
        text: "Get a clear overview of paid, partially paid, and overdue invoices.",
      },
      {
        bold: "Customer-Specific Pricing:",
        text: "Apply different price lists to different wholesale customers automatically.",
      },
    ],
  },
  // Add more industries here...
];

const IndustriesTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeTabData = industriesData[activeTab];

  return (
    <section className="bg-gradient-to-b from-white to-sky-50 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          Online Invoice Software Built for All Industries
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-center space-x-6 overflow-x-auto">
            {industriesData.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                  activeTab === index
                    ? "bg-blue-100 text-blue-600"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Tab Underline */}
        <div
          className="relative mx-auto h-0.5 w-full max-w-xs bg-sky-500"
          style={{ transform: `translateX(calc(${activeTab * 100}%))` }}
        ></div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 items-center gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <Image
              src={activeTabData.imageSrc}
              alt={activeTabData.name}
              width={400}
              height={500}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-bold text-[color:var(--text-primary)]">
              {activeTabData.name}
            </h3>
            <p className="mb-6 text-sm text-[color:var(--text-secondary)]">
              {activeTabData.description}
            </p>
            <ul className="space-y-3">
              {activeTabData.points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-500"></span>
                  <span className="text-sm text-[color:var(--text-secondary)]">
                    <strong className="font-bold text-gray-700">
                      {point.bold}
                    </strong>{" "}
                    {point.text}
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

export default IndustriesTabsSection;
