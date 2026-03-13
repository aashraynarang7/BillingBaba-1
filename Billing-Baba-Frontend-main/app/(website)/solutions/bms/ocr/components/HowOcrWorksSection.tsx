// Example file path: src/components/ocr-page/HowOcrWorksSection.tsx

import React from "react";
import {
  Cog,
  ScanLine,
  Upload,
  DatabaseZap,
  Bookmark,
  Paperclip,
} from "lucide-react";

// --- Type Definitions for TypeScript ---
// FIX: Corrected the syntax error by moving the closing parenthesis.
interface StepItem {
  number: number;
  icon: React.ElementType | (() => JSX.Element);
  title: string;
  description: string;
}

// Custom Logo Icon Component
const CustomLogoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 0L0 10L20 20L40 10L20 0Z" fill="#FFC107" />
    <path d="M0 10V30L20 40V20L0 10Z" fill="#F44336" />
    <path d="M20 40L40 30V10L20 20V40Z" fill="#4CAF50" />
  </svg>
);

// --- Data for the Component with "Billing Baba" ---
const stepsData: StepItem[] = [
  {
    number: 1,
    icon: CustomLogoIcon,
    title: "Open Billing Baba",
    description: "Go to the Purchase or Expense section to begin scanning.",
  },
  {
    number: 2,
    icon: ScanLine,
    title: "Tap Scan Option",
    description: "Select ‘Upload Bill’ to activate the OCR scanning tool.",
  },
  {
    number: 3,
    icon: Upload,
    title: "Upload File",
    description: "Choose a PDF or image from your device to scan instantly.",
  },
  {
    number: 4,
    icon: DatabaseZap,
    title: "OCR Extracts Data",
    description:
      "Billing Baba reads vendor, items, GST, totals, and other key details.",
  },
  {
    number: 5,
    icon: Bookmark,
    title: "Review & Save",
    description: "Make quick edits if needed and save it as a transaction.",
  },
  {
    number: 6,
    icon: Paperclip,
    title: "Auto Attach",
    description:
      "The scanned file is auto-linked to entries and visible in reports.",
  },
];

const HowOcrWorksSection: React.FC = () => {
  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-semibold text-primary-red mb-2">
            Easily Convert in 2 Minutes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary flex items-center justify-center gap-3">
            <Cog className="w-8 h-8 text-gray-400" />
            How Billing Baba OCR Works
          </h2>
        </div>

        {/* Timeline Diagram */}
        <div className="relative">
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-red-200 hidden md:block"></div>

          <div className="relative flex justify-between">
            {stepsData.map((step, index) => {
              const isTop = index % 2 === 0;
              const IconComponent = step.icon;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center w-40 text-center ${isTop ? "mb-24" : "mt-24"}`}
                >
                  {/* Step Title and Description */}
                  <div className={`order-1 ${isTop ? "mb-4" : "hidden"}`}>
                    <h3 className="font-bold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Icon and Number Circle */}
                  <div className={`relative order-2 bg-white`}>
                    <div
                      className="absolute w-px h-12 bg-red-200 left-1/2 -translate-x-1/2"
                      style={{
                        top: isTop ? "100%" : "auto",
                        bottom: isTop ? "auto" : "100%",
                      }}
                    ></div>
                    <div className="relative w-20 h-20 border-2 border-red-100 rounded-full flex items-center justify-center bg-white">
                      <IconComponent className="w-8 h-8 text-primary-red" />
                      <div
                        className="absolute w-6 h-6 bg-primary-red text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
                        style={{
                          top: isTop ? "-12px" : "auto",
                          bottom: isTop ? "auto" : "-12px",
                        }}
                      >
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Step Title and Description (for bottom items) */}
                  <div className={`order-3 ${isTop ? "hidden" : "mt-4"}`}>
                    <h3 className="font-bold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowOcrWorksSection;
