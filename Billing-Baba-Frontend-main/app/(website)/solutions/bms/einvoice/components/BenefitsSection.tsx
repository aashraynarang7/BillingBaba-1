// Example file path: src/components/BenefitsSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface BenefitItem {
  title: string;
  description: string;
  imageSrc: string;
}

// --- Data for the Component, transcribed from your image ---
const benefitsData: BenefitItem[] = [
  {
    title: "Saves Time and Cost",
    description:
      "Vyapar’s e-invoicing boosts productivity by eliminating unnecessary steps, saving time for you and your customers. It also cuts costs related to paper, printing, postage, and manual handling, resulting in long-term savings for your business.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Saves-Time-Cost-1536x1536.webp",
  },
  {
    title: "Curbes Tax Evasion",
    description:
      "E-invoicing under GST helps prevent tax evasion by providing real-time billing data and reducing invoice manipulation. Vyapar’s e-invoicing minimises fake GST invoices and ensures legitimate ITC claims, aiding tax officials in detecting fake input tax credits.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Curbes-Tax-Evasion-1536x1536.webp",
  },
  {
    title: "Brings Simplicity",
    description:
      "Generating e-invoices is complex, but Vyapar simplifies it, taking only 2 minutes. The app stores invoices, generates reports, automates inventory tracking, and offers multiple payment methods, eliminating the need for multiple apps. Save client data in the cloud and create invoices with a click.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Brings-Simplicity-1536x1536.webp",
  },
  {
    title: "Reduces Error",
    description:
      "Vyapar’s e-invoicing system automates billing accurately, ensuring no errors. Unlike manual methods which leads to mistakes, even with experienced users, Vyapar’s system provides reliable invoicing.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Reduces-Error-1536x1536.webp",
  },
  {
    title: "Improves Brand Identity",
    description:
      "Cloud-based billing software strengthens brand identity by allowing you to customize and add your brand’s logo and theme. This enhances prompt payments by integrating your UPI QR code and other payment options.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Improves-Brand-Identity-1536x1536.webp",
  },
  {
    title: "Simplified Administration",
    description:
      "Successful cash flow management involves automating one’s invoicing process and reducing administrative costs. Compared to a manually prepared bill from scratch, quick and automated bills can be easily prepared with only a proposed bill format, a GST bill format, or a quote format.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Simplified-Adminstration-1536x1536.webp",
  },
];

// Helper component for individual benefit cards
const BenefitCard: React.FC<BenefitItem> = ({
  title,
  description,
  imageSrc,
}) => {
  return (
    <div className="bg-background-light p-4 rounded-2xl shadow-sm text-center h-full border border-gray-200">
      {/* Pink background container for the image */}
      <div className="bg-faq-accent p-6 rounded-xl mb-6">
        <img src={imageSrc} alt={title} className="w-full h-auto" />
      </div>
      <h3 className="text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary px-2">{description}</p>
    </div>
  );
};

// Main Component
const BenefitsSection: React.FC = () => {
  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Benefits of Vyapar’s E-invoicing System
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefitsData.map((benefit) => (
            <BenefitCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
              imageSrc={benefit.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
