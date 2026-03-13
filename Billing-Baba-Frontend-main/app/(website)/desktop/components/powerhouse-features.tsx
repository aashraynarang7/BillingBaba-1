"use client"

import React, { useState } from "react"

const featuresData = [
  {
    id: 1,
    title: "Scan Barcode for Quick Billing",
    imageSrc: "/Desktop/Section9.webp",
    description: (
      <>
        Integration of the{" "}
        <a href="#" className="text-[var(--text-link-active)] hover:underline">
          barcode scanner
        </a>{" "}
        in our desktop software increases your billing efficiency during checkout by scanning the product's barcodes. This also helps in tracking products by streamlining your inventory easily.
      </>
    ),
  },
  {
    id: 2,
    title: "Business Custom Fields",
    imageSrc: "/Desktop/Section9.webp",
    description: "Tailor your invoices and reports by adding custom fields. Capture specific information relevant to your business, such as serial numbers, batch details, or any other unique data points for better organization.",
  },
  {
    id: 3,
    title: "Multi-device Sync",
    imageSrc: "/Desktop/Section9.webp",
    description: "Work seamlessly across your desktop, laptop, and mobile devices. All your data is automatically synchronized in real-time, ensuring you have the latest information wherever you are.",
  },
  {
    id: 4,
    title: "Payment Reminders",
    imageSrc: "/Desktop/Section9.webp",
    description: "Automate payment follow-ups with professional reminders sent via SMS, email, and WhatsApp. Reduce late payments and improve your cash flow without any manual effort.",
  },
  {
    id: 5,
    title: "WhatsApp Personalization",
    imageSrc: "/Desktop/Section9.webp",
    description: "Engage with your customers directly through WhatsApp. Share invoices, payment links, and promotional messages with personalized templates to build stronger customer relationships.",
  },
  {
    id: 6,
    title: "Direct Print Compatibility",
    imageSrc: "/Desktop/Section9.webp",
    description: "Print professional invoices directly from the software. Our application is compatible with both regular (laser) and thermal printers, supporting various paper sizes for your convenience.",
  },
  {
    id: 7,
    title: "Cash and Bank Management",
    imageSrc: "/Desktop/Section9.webp",
    description: "Link your bank accounts to track payments, manage cash flow, and reconcile transactions seamlessly. Keep a clear and real-time view of your financial health in one place.",
  },
  {
    id: 8,
    title: "Stock and Inventory Tracking",
    imageSrc: "/Desktop/Section9.webp",
    description: "Maintain optimal stock levels with real-time inventory tracking. Get low-stock alerts, manage items by batch number and expiry date, and generate detailed stock reports to prevent shortages.",
  },
  {
    id: 9,
    title: "Order Management",
    imageSrc: "/Desktop/Section9.webp",
    description: "Create and track sales and purchase orders efficiently. Convert orders into invoices with a single click and manage the entire order lifecycle from start to finish.",
  },
  {
    id: 10,
    title: "Online Store",
    imageSrc: "/Desktop/Section9.webp",
    description: "Take your business online by creating a digital storefront right from the app. Showcase your products, accept online orders, and expand your customer reach beyond your physical location.",
  },
  {
    id: 11,
    title: "Multiple Business Reports",
    imageSrc: "/Desktop/Section9.webp",
    description: "Generate over 40 types of business reports, including GST reports, profit & loss statements, and balance sheets. Make data-driven decisions to grow your business effectively.",
  },
];

export default function PowerhouseFeatures() {
  const [activeFeatureId, setActiveFeatureId] = useState(1)

  const activeFeature = featuresData.find((f) => f.id === activeFeatureId)

  if (!activeFeature) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--background-section-gray)]">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          Turn Your PC into a Billing Powerhouse with Vyapar Software
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4">
              {featuresData.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeatureId(feature.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 relative ${
                    activeFeatureId === feature.id
                      ? "bg-white border-[var(--text-link-active)] shadow-lg"
                      : "bg-white border-gray-200 hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  {activeFeatureId === feature.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--text-link-active)] rounded-l-lg"></div>
                  )}
                  <span className={`font-medium ${
                    activeFeatureId === feature.id ? "text-[var(--text-foreground)]" : "text-gray-600"
                  }`}>
                    {feature.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div key={activeFeatureId} className="lg:col-span-2 animate-in fade-in duration-500">
            <div className="space-y-6">
              <p className="text-[var(--text-foreground)] text-base leading-relaxed">
                {activeFeature.description}
              </p>
              <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-100">
                 <img
                  src={activeFeature.imageSrc}
                  alt={activeFeature.title}
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}