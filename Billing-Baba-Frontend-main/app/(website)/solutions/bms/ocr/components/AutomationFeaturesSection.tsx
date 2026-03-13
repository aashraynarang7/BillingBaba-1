// Example file path: src/components/ocr-page/AutomationFeaturesSection.tsx

import React from "react";
import {
  Flame,
  Receipt,
  MousePointerClick,
  FileBadge2,
  Paperclip,
} from "lucide-react";

// --- Type Definitions for TypeScript ---
interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

// --- Data for the Component, transcribed from your image ---
const featuresData: FeatureItem[] = [
  {
    icon: Receipt,
    title: "Auto-Scan Bills and Receipts",
    description:
      "Easily scan paper bills or receipts using OCR application and extract vendor details, item, price, and tax details instantly.",
  },
  {
    icon: MousePointerClick,
    title: "One-Tap Purchase Entry from Scanned Data",
    description:
      "Convert scanned documents into purchase entries with just one tap—no manual typing required.",
  },
  {
    icon: FileBadge2,
    title: "Accurate GST Data Extraction",
    description:
      "Vyapar’s OCR automatically reads and fills GSTIN, HSN/SAC codes, and tax breakdowns from the scanned invoice.",
  },
  {
    icon: Paperclip,
    title: "Attach and Store Documents Digitally",
    description:
      "Each scanned document is attached to its transaction and automatically recorded in reports like Purchase Summary, GST Reports, and Expense Reports.",
  },
];

// Helper component for individual feature cards to keep code clean
const FeatureCard: React.FC<FeatureItem> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
      <div className="flex-shrink-0 bg-primary-red/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-primary-red" />
      </div>
      <div>
        <h3 className="font-bold text-text-primary text-lg">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
};

// Main Component
const AutomationFeaturesSection: React.FC = () => {
  return (
    <section className="bg-background-section-gray py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 text-orange-500" />
            Unlock the Power of{" "}
            <span className="text-primary-red">Automation</span> with Vyapar’s
            OCR Tool
          </h2>
          <p className="mt-4 text-text-secondary">
            Vyapar’s OCR tool blends intelligent automation with ease, built for
            growing businesses that want to digitize their billing and
            documentation effortlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AutomationFeaturesSection;
