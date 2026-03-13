"use client"; // Important: This component has interactive tabs

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// --- SVG Icons for this Component (No changes needed) ---
const CheckIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0 text-sky-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// --- Data with updated image URLs ---
const integrationsData = [
  {
    tabName: "Billing Software",
    // FIX: Added a relevant image for billing software
    imageSrc:
      "https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Our billing software integration allows you to create GST-compliant invoices directly from your inventory, ensuring stock levels are always accurate.",
    points: [
      "Auto-generate invoices from sales orders",
      "Track payment status for each invoice",
      "Customizable invoice templates",
    ],
  },
  {
    tabName: "Thermal and Regular Printer Support",
    // FIX: Added a relevant image for printers
    imageSrc:
      "https://images.pexels.com/photos/403567/pexels-photo-403567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Our app is compatible with thermal printers (for POS and small invoices) as well as traditional printers for A4-size formats. This flexibility ensures businesses can print invoices, reports, and labels as per their requirement.",
    points: [
      "Professional billing with your preferred format",
      "Cost-effective printing for high-volume sales",
      "Customizable invoice designs",
    ],
  },
  {
    tabName: "Barcode Printer and Scanner",
    // FIX: Added a relevant image for barcode scanners
    imageSrc:
      "https://images.pexels.com/photos/7174415/pexels-photo-7174415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Speed up your workflow by integrating barcode scanners and printers. Manage your inventory faster and with fewer errors.",
    points: [
      "Quickly add items to bills using a scanner",
      "Generate and print custom barcode labels",
      "Reduce manual data entry errors",
    ],
  },
];

const appBannerData = {
  heading: "Manage and Fulfill Orders on the Go",
  description:
    "Stay connected and get real-time updates on the order status, no matter where you are.",
  // FIX: Changed to a functional Google Play store link
  googlePlayUrl: "https://play.google.com/store/apps",
  // FIX: Replaced banner images with relevant phone app screenshots
  phoneImage1Src:
    "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=600",
  phoneImage2Src:
    "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600",
  // FIX: Added a separate URL for the Google Play badge image
  googlePlayBadgeSrc:
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
};

const IntegrationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeTabData = integrationsData[activeTab];

  return (
    <>
      {/* Section 1: Integrations */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Our Inventory Software Integration with Other Tools
          </h2>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {integrationsData.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeTab === index
                    ? "bg-sky-100 text-sky-600 ring-2 ring-sky-500"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.tabName}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center">
              <Image
                src={activeTabData.imageSrc}
                alt={activeTabData.tabName}
                width={400}
                height={300}
                className="rounded-lg object-cover shadow-md"
              />
            </div>
            <div>
              <p className="mb-6 text-[color:var(--text-secondary)]">
                {activeTabData.description}
              </p>
              <ul className="space-y-3">
                {activeTabData.points.map((point, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-[color:var(--text-secondary)]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className="mt-6 inline-flex items-center gap-2 font-bold text-sky-600 hover:underline"
              >
                <PhoneIcon /> Get a free Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: App Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-100 via-blue-100 to-sky-100 py-16">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold uppercase tracking-tight text-[color:var(--text-primary)] md:text-5xl">
                {appBannerData.heading}
              </h2>
              <p className="mt-4 text-lg text-[color:var(--text-secondary)]">
                {appBannerData.description}
              </p>
              <Link
                href={appBannerData.googlePlayUrl}
                className="mt-6 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={appBannerData.googlePlayBadgeSrc}
                  alt="Get it on Google Play"
                  width={180}
                  height={54}
                />
              </Link>
            </div>
            <div className="relative h-64 lg:h-80">
              <Image
                src={appBannerData.phoneImage1Src}
                alt="App screen 1"
                width={200}
                height={400}
                className="absolute bottom-0 right-1/2 translate-x-1/4 transform rounded-2xl shadow-2xl object-cover lg:right-1/3"
              />
              <Image
                src={appBannerData.phoneImage2Src}
                alt="App screen 2"
                width={200}
                height={400}
                className="absolute bottom-0 right-1/4 -translate-x-1/4 transform rounded-2xl shadow-2xl object-cover lg:right-0"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IntegrationsSection;
