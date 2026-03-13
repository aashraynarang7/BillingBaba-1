"use client"

import React, { useState } from "react"

const IconWindows = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20M12 2v20"/></svg>
);
const IconApple = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.4 3.6a1.71 1.71 0 0 1 2.3 2.3 1.71 1.71 0 0 1-2.3 2.3 1.71 1.71 0 0 1-2.3-2.3c0-1 1.3-3.1 2.3-2.3Z"/><path d="M12 20.7a10.2 10.2 0 0 1-7.5-3.2c-3-3-3.1-7.8.2-10.8a9.4 9.4 0 0 1 11-1.8c3.9 1.5 5.8 5.3 5.3 9.4a10.3 10.3 0 0 1-9 6.4Z"/></svg>
);
const IconAndroid = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12.5 5h-1"/><path d="M12.5 19h-1"/></svg>
);
const IconSync = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M21 21v-5h-5"/></svg>
);

const featuresData = [
  {
    tabName: "Tax Invoicing",
    imageTitle: "GST\nInvoicing",
    imageSrc: "/Desktop/Section4.webp",
    description: [
      <>
        With our powerful <strong className="text-[var(--primary-red)]">invoicing solution</strong>, create professional GST and non-GST bills easily on your PC in just a few clicks or within 30 seconds.
      </>,
      "Generate accurate bills with HSN/SAC codes, tax breakdowns, and invoice numbers, ensuring full compliance.",
    ],
  },
  {
    tabName: "Quick Sale Entry",
    imageTitle: "Add\nYour Sale",
    imageSrc: "/Desktop/Section4.webp",
    description: [
      <>
        With the integration of <strong className="text-[var(--primary-red)]">barcode-based billing</strong> and desktop or laptop keyboard shortcuts, you can quickly enter sale details for quick billing.
      </>,
      "Suits to create multiple bills at the same time.",
    ],
  },
  {
    tabName: "Customize your Bill",
    imageTitle: "Custom\nBilling",
    imageSrc: "/Desktop/Section4.webp",
    description: [
      "Bring your brand closer to customers by customizing bills with ready-built templates. You can add your business logo, terms, payment details, and even QR codes directly from your desktop.",
    ],
  },
  {
    tabName: "Easy Payment Modes",
    imageTitle: "Multi Payment\nOptions",
    imageSrc: "/Desktop/Section4.webp",
    description: [
      "Help customers pay off with their choice – via cash, UPI, bank transfers, or split payments. The software records all transactions neatly, streamlining cash flow management from your PC.",
    ],
  },
];


export default function DesktopFeaturesTabs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const activeFeature = featuresData[activeTabIndex]

  return (
    <section className="py-16 md:py-20 bg-[var(--background-section-gray)]">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          Essential PC Billing Software Features for Indian Vyapaaris
        </h2>

        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-10">
          {featuresData.map((tab, index) => (
            <button
              key={tab.tabName}
              onClick={() => setActiveTabIndex(index)}
              className={`px-4 sm:px-6 py-2 rounded-full border text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTabIndex === index
                  ? "border-[var(--primary-red)] text-[var(--primary-red)] bg-white shadow-md"
                  : "border-gray-300 text-[var(--text-foreground)] bg-white hover:border-gray-400"
              }`}
            >
              {tab.tabName}
            </button>
          ))}
        </div>

        <div key={activeTabIndex} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center animate-in fade-in duration-500">
          <div className="relative rounded-2xl p-8 bg-gradient-to-br from-purple-100 to-blue-100">
            <div className="absolute top-8 left-8 text-[var(--text-primary)]">
              <h3 className="text-3xl font-bold whitespace-pre-line leading-tight">
                {activeFeature.imageTitle}
              </h3>
              <div className="mt-4">
                <p className="text-sm font-medium text-[var(--text-foreground)]">Available on</p>
                <div className="flex items-center gap-2 mt-1">
                  <IconWindows />
                  <IconApple />
                  <IconAndroid />
                  <IconSync />
                </div>
              </div>
            </div>
            <img src={activeFeature.imageSrc} alt={activeFeature.tabName} className="w-full h-auto rounded-lg shadow-2xl"/>
          </div>

          <div className="space-y-5 text-lg text-[var(--text-foreground)]">
            {activeFeature.description.map((paragraph, index) => (
              <p key={index} className="text-[var(--text-foreground)]">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}