// Example file path: src/components/StatsSection.tsx

import React from "react";

// --- Type Definitions ---
interface StatCardProps {
  title: string;
  description: string;
  iconSrc: string;
  bgColor: string;
}

type StatDataType = {
  title: string;
  description: string;
  iconSrc: string;
  bgColor: string;
};

// Data for the four benefit cards (no changes here)
const statsData: StatDataType[] = [
  {
    title: "1 Crore+ Businesses",
    description: "Trusted by over 1 crore businesses across the globe.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Businesses-230x230.png",
    bgColor: "bg-green-100", // This is fine as it's a specific, one-off color
  },
  {
    title: "20 Million+ E-invoices Processed",
    description:
      "We’ve facilitated the processing of over 20 million e-invoices, streamlining finances for countless businesses.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/E-Invoice-Processed-230x230.png",
    bgColor: "bg-pink-100",
  },
  {
    title: "Reduced Processing Time",
    description:
      "Experience a significant reduction in invoice processing time with our automated features.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Processing-Time-230x230.png",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Faster Payments",
    description:
      "Get paid faster with on-time invoice delivery and easy payment options.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Faster-Payments-230x230.png",
    bgColor: "bg-purple-100",
  },
];

// Main component, now using global CSS variables
const StatsSection: React.FC = () => {
  return (
    // FIX: Using var(--background-section-gray) via a custom Tailwind class 'bg-section-gray'
    <section className="bg-section-gray py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* FIX: Using 'text-primary' from your global CSS variables */}
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Join the Millions Who Have Transformed Their E-invoicing
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          <div className="sm:col-span-2 lg:col-span-1">
            <StatCard
              title={statsData[0].title}
              description={statsData[0].description}
              iconSrc={statsData[0].iconSrc}
              bgColor={statsData[0].bgColor}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <StatCard
                title={statsData[1].title}
                description={statsData[1].description}
                iconSrc={statsData[1].iconSrc}
                bgColor={statsData[1].bgColor}
              />
              <StatCard
                title={statsData[2].title}
                description={statsData[2].description}
                iconSrc={statsData[2].iconSrc}
                bgColor={statsData[2].bgColor}
              />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex justify-center">
            <div className="w-full lg:w-1/3">
              <StatCard
                title={statsData[3].title}
                description={statsData[3].description}
                iconSrc={statsData[3].iconSrc}
                bgColor={statsData[3].bgColor}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component, now using global CSS variables
const StatCard: React.FC<StatCardProps> = ({
  title,
  description,
  iconSrc,
  bgColor,
}) => {
  return (
    // FIX: Using 'bg-background-light' from your global CSS
    <div className="bg-background-light p-8 rounded-2xl shadow-sm text-center h-full">
      <div
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${bgColor}`}
      >
        <img src={iconSrc} alt={title} className="w-12 h-12" />
      </div>
      {/* FIX: Using 'text-primary' and 'text-secondary' from your global CSS */}
      <h3 className="mt-6 text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </div>
  );
};

export default StatsSection;
