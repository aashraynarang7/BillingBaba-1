// Example file path: src/components/jewellery-page/JewelleryFeaturesSection.tsx

import React from "react";
import Link from "next/link"; // Asumo que estás usando Next.js

// --- Type Definitions for TypeScript ---
interface FeatureDetail {
  heading: string;
  text: string;
}

interface FeatureItem {
  title: string;
  imageSrc: string;
  details: FeatureDetail[];
}

// --- Data for the Component ---
const featuresData: FeatureItem[] = [
  {
    title: "GST-Compliant Invoicing",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/GST-Compliant-Invoicing-1536x1536.webp",
    details: [
      {
        heading: "Automatic GST Calculation:",
        text: "Vyapar automatically applies the correct GST rate for each product or service, like gold, silver, or other stones, eliminating manual entry and ensuring accurate, error-free GST jewellery bills.",
      },
      {
        heading: "Multi-Rate Billing Made Easy:",
        text: "The Vyapar App simplifies your work by allowing you to apply different tax rates within a single invoice. This feature is handy for jewellery businesses that deal with multiple product categories like gold, silver, and gemstones at the same time.",
      },
      {
        heading: "GST Reporting and Filing:",
        text: "Generate GSTR-1, GSTR-3B, and GSTR-4 reports directly in Vyapar. Export GST data in ready-to-file format like Excel, PDF, JSON and share it with your tax consultant, making filing easy.",
      },
    ],
  },
  {
    title: "Jewellery Barcode Integration",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/Jewellery-Barcode-Integration-1536x1536.webp",
    details: [
      {
        heading: "Fast and Error-Free Billing:",
        text: "With each item linked to a barcode, the business enables instant scanning during checkout. It speeds up your billing process, reduces all manual entry errors, and ensures that every sale is recorded accurately.",
      },
      {
        heading: "Real-Time Inventory Updates:",
        text: "The barcode inventory system keeps your stock data exact and up-to-date. You can easily track fast-moving items, monitor current stock levels, and avoid overstocking or stockout situations.",
      },
      {
        heading: "Better Inventory Control:",
        text: "Gain full control over your jewellery store’s inventory with Vyapar. Easily locate products, maintain organised records, spot errors early, and boost store efficiency.",
      },
    ],
  },
  {
    title: "Multiple Price Management",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/Custom-Pricing-For-Jewellery-1536x1536.webp",
    details: [
      {
        heading: "Dynamic Pricing:",
        text: "Set multiple price lists for different customer groups, such as retail, wholesale, or VIP customers. Adjust prices based on gold rates, making charges, or special promotions.",
      },
      {
        heading: "Maintaining Profitability:",
        text: "Track profit margins on every item sold. The system helps you analyze profitability to make informed pricing decisions and maximize your returns.",
      },
    ],
  },
  {
    title: "Track Purchase Records",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/Customer-Management-with-Purchase-History--1536x1536.webp",
    details: [
      {
        heading: "Party Details Management:",
        text: "Maintain a complete record of your suppliers and customers. Track purchase history, outstanding payments, and contact details all in one place.",
      },
      {
        heading: "Purchase Order Tracking:",
        text: "Create and manage purchase orders, track their status from placed to received, and easily convert them into purchase bills, ensuring a seamless procurement process.",
      },
    ],
  },
];

const JewelleryFeaturesSection: React.FC = () => {
  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Top 4 Key Features of a Jewellery Billing Software
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {featuresData.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <img
                  src={feature.imageSrc}
                  alt={feature.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="w-full text-left">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  {feature.title}
                </h3>
                <ul className="space-y-3 list-disc list-inside text-text-secondary">
                  {feature.details.map((detail) => (
                    <li key={detail.heading}>
                      <strong className="font-semibold text-text-primary">
                        {detail.heading}
                      </strong>{" "}
                      {detail.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          {/* FIX: Las clases del botón ahora están en el componente Link */}
          <Link
            href="/download-jewellery-software"
            className="inline-block bg-primary-red text-white font-bold text-lg px-8 py-4 rounded-full shadow-md hover:bg-primary-dark-red transition-transform hover:scale-105 duration-300"
          >
            Download Jewellery Software
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JewelleryFeaturesSection;
