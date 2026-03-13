// Example file path: src/components/KeyFeaturesSection.jsx

import React from "react";

// Data for the four feature cards, transcribed from your image
const features = [
  {
    title: "Generate E-invoice",
    description:
      "Support e-invoicing software the platform is designed to fetch GSTIN from a list of contacts. It can automatically fetch details, like customer information, billing and shipping address, and also auto-populate data from the database.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Auto-Invoice-Fetch-1536x1536.webp",
  },
  {
    title: "GSP Integration",
    description:
      "GST Suvidha Provider (GSP) integration is a seamless offering of functions and services provided by third-party applications (like Vyapar). This integration allows automatic validation and validation of invoices, ensuring compliance with GST regulations, easy uploading to the IRP, avoiding process friction, and real-time communication with the government e-invoicing system.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/GST-Integration-1536x1536.webp",
  },
  {
    title: "Auto Invoice Fetch",
    description:
      "This feature streamlines the process for generating E-Way Bills. The platform has the functionality to fetch e-invoice details using IRN and auto-populate data. This saves the user from the hassle of lengthy, repetitive input.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Invoice-Reference-Number-1536x1536.webp",
  },
  {
    title: "Invoice Cancellation",
    description:
      "E-Way invoice can be cancelled if the order is not picked up or cancelled by the customer. The portal provides provisions to cancel the generated E-invoice and discard the freight invoice. Cancellation and amendments are recorded for specific items or quality of the items.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/e-invoice-cancellation-1536x1536.webp",
  },
];

const KeyFeaturesSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Key Features of an E-invoicing Software
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
            >
              {/* Subtle dot pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="mb-6 w-full">
                  <img
                    src={feature.imageSrc}
                    alt={feature.title}
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
