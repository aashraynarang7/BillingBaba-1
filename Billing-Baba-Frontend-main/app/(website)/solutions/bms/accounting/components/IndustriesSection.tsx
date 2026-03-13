"use client"; // Important: For interactive state management

import React, { useState } from "react";
import Image from "next/image";

// --- ✨ SVG Icons for this Component ---
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
const FashionIcon = () => (
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
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
const ElectronicsIcon = () => (
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
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const PlayIcon = () => (
  <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

// --- ✨ Data for the Entire Section ---
const industriesSectionData = {
  videoSection: {
    title: "How to Use Our Accounting Software for Small Business in India",
    description:
      "Our accounting system is trusted by 1.5 Cr+ small business owners in India. Easy installation, simple user interface, and a high-rated accounting app. Watch the video to learn how to use the app for your accounting needs.",
    thumbnailUrl: "/images/video-thumbnail.png", // IMPORTANT: Image path
  },
  ctaBanner: {
    text: "Save Money with Our Accounting Solution. Start a Free Trial!",
  },
  industriesTabs: [
    {
      name: "Manufacturing",
      icon: <ManufacturingIcon />,
      imageSrc: "/inventory/Manufacturing-1024x955.webp", // IMPORTANT: Image path
      content: [
        {
          title: "Hardware Business",
          description:
            "You can manage your equipment seamlessly. From listing items and spare parts as small as a bolt to those as big as a vehicle, you can keep track of your inventory.",
        },
        {
          title: "Furniture Business",
          description:
            "By understanding what products sell more, you can choose the items from the best categories to stay on display.",
        },
        {
          title: "Construction Material",
          description:
            "Our software for construction businesses is a perfect tool to keep accounts for construction materials. You can use it to track all required raw materials and set up alerts.",
        },
      ],
    },
    {
      name: "Fashion",
      icon: <FashionIcon />,
      imageSrc: "/inventory/Inventory8.webp", // IMPORTANT: Image path
      content: [
        {
          title: "Apparel Stores",
          description:
            "Manage different sizes, colors, and styles of your apparel. Track sales trends to stock up on popular items.",
        },
        {
          title: "Boutiques",
          description:
            "Handle custom orders, manage consignments, and keep track of your unique collection with ease.",
        },
      ],
    },
    {
      name: "Logistics",
      icon: <LogisticsIcon />,
      imageSrc: "/inventory/Logistics-1024x955.webp", // IMPORTANT: Image path
      content: [
        {
          title: "Transport Services",
          description:
            "Manage fleet expenses, track trip profitability, and generate invoices for your clients automatically.",
        },
        {
          title: "Courier Agencies",
          description:
            "Keep a record of all shipments, manage delivery statuses, and handle billing for both individual and corporate clients.",
        },
      ],
    },
    // Add more industries here...
  ],
};

const IndustriesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const activeTabData = industriesSectionData.industriesTabs[activeTab];

  return (
    <>
      {/* Part 1: Video Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-[color:var(--text-primary)]">
                {industriesSectionData.videoSection.title}
              </h2>
              <p className="text-[color:var(--text-secondary)]">
                {industriesSectionData.videoSection.description}
              </p>
            </div>
            <div className="relative cursor-pointer overflow-hidden rounded-lg shadow-xl">
              <Image
                src={industriesSectionData.videoSection.thumbnailUrl}
                alt="Video Thumbnail"
                width={500}
                height={300}
                className="w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-all duration-300 hover:bg-opacity-10">
                <PlayIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: CTA Banner */}
      <section className="w-full bg-[color:var(--primary-red)] py-6">
        <div className="container text-center">
          <h3 className="text-2xl font-bold text-white">
            {industriesSectionData.ctaBanner.text}
          </h3>
        </div>
      </section>

      {/* Part 3: Industries Tabs */}
      <section className="bg-sky-50 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)]">
            Our Free Accounting Software Suits Many Industries
          </h2>

          <div className="mb-8 flex items-center justify-center border-b border-gray-200">
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {industriesSectionData.industriesTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 rounded-t-lg px-4 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === index
                      ? "border-b-2 border-[color:var(--primary-red)] text-[color:var(--primary-red)]"
                      : "text-gray-500 hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg shadow-lg md:col-span-1">
              <Image
                src={activeTabData.imageSrc}
                alt={activeTabData.name}
                width={400}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-4 text-2xl font-bold text-[color:var(--text-primary)]">
                {activeTabData.name}
              </h3>
              <div className="space-y-4">
                {activeTabData.content.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-[color:var(--text-primary)]">
                      {item.title}
                    </h4>
                    <p className="text-[color:var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IndustriesSection;
