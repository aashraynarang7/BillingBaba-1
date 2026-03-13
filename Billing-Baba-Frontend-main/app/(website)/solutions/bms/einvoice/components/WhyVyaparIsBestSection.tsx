// Example file path: src/components/WhyVyaparIsBestSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface BenefitPoint {
  heading: string;
  text: string;
}

interface BenefitItem {
  title: string;
  imageSrc: string;
  points: BenefitPoint[];
  layout: "textLeft" | "textRight";
}

// --- Data for the Component, transcribed from your image ---
const benefitsData: BenefitItem[] = [
  {
    title: "Quick and Easy E-invoice Creation",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/10/Easy-E-Invoice-Creation.webp",
    points: [
      {
        heading: "Time-saving:",
        text: "The platform is equipped with features which help save time to the business owner and operate accounts efficiently.",
      },
      {
        heading: "Data security:",
        text: "Security of the data is of the utmost value. Invoicing software helps businesses secure data with ease and accuracy.",
      },
    ],
    layout: "textLeft",
  },
  {
    title: "Generate Multiple E-invoices",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/10/Multiple-e-invoices.webp",
    points: [
      {
        heading: "Bulk creation:",
        text: "Vyapar offers a feature to create multiple e-invoices at once, saving you time and effort.",
      },
      {
        heading: "Customisation:",
        text: "Vyapar e-invoicing software helps businesses create invoices according to their requirements.",
      },
    ],
    layout: "textRight",
  },
  {
    title: "Generate E-way Bills",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/10/Multiple-e-invoices.webp",
    points: [
      {
        heading: "Integrated solution:",
        text: "Vyapar’s E-way Bill generation feature works smoothly with the e-invoicing system. This offers a complete solution for your business.",
      },
      {
        heading: "Compliance:",
        text: "E-way Bills are mandatory for interstate movement of goods, and Vyapar helps you comply with this requirement.",
      },
    ],
    layout: "textLeft",
  },
  {
    title: "Cancel E-invoices",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/10/Multiple-e-invoices.webp",
    points: [
      {
        heading: "Flexibility:",
        text: "Vyapar offers a simple and efficient process for cancellation of e-invoices.",
      },
      {
        heading: "Error Correction:",
        text: "You can easily correct any errors in your invoices before you send them to customers with our e-invoice system.",
      },
    ],
    layout: "textRight",
  },
];

// Helper component for a single benefit block to keep code clean
const BenefitBlock: React.FC<BenefitItem> = ({
  title,
  imageSrc,
  points,
  layout,
}) => {
  const isTextLeft = layout === "textLeft";

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isTextLeft ? "" : "lg:grid-flow-col-dense"}`}
    >
      {/* Text Column */}
      <div className={`space-y-6 ${isTextLeft ? "lg:order-1" : "lg:order-2"}`}>
        <h3 className="text-2xl font-bold text-primary-red">{title}</h3>
        <ul className="space-y-3 text-text-secondary">
          {points.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="font-bold text-text-primary mr-2">•</span>
              <div>
                <strong className="font-semibold text-text-primary">
                  {point.heading}
                </strong>{" "}
                {point.text}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Image Column */}
      <div
        className={`flex justify-center ${isTextLeft ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
          <img
            src={imageSrc}
            alt={title}
            className="w-full max-w-lg h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
const WhyVyaparIsBestSection: React.FC = () => {
  return (
    <section className="bg-background-light">
      <div className="container mx-auto px-4 text-center py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
          Why is the Vyapar Electronic Invoicing System the Best for Your
          Business?
        </h2>
      </div>

      {benefitsData.map((benefit, index) => (
        <div
          key={index}
          className={index % 2 === 1 ? "bg-blue-50" : "bg-background-light"}
        >
          <div className="container mx-auto px-4 py-16">
            <BenefitBlock {...benefit} />
          </div>
        </div>
      ))}
    </section>
  );
};

export default WhyVyaparIsBestSection;
