// Example file path: src/components/ocr-page/OcrStatsSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface StatItem {
  value: string;
  label: string;
}

// --- Data for the Component, transcribed from your image ---
const statsData: StatItem[] = [
  {
    value: "1 Cr+",
    label: "Bills Auto Scanned",
  },
  {
    value: "99.9%",
    label: "Data Accuracy",
  },
  {
    value: "30+",
    label: "Minutes Saved Daily",
  },
];

const OcrStatsSection: React.FC = () => {
  return (
    <section className="bg-background-light py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {statsData.map((stat) => (
            <div key={stat.label}>
              <p className="text-5xl font-extrabold text-primary-red">
                {stat.value}
              </p>
              <p className="mt-2 text-lg text-text-primary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OcrStatsSection;
