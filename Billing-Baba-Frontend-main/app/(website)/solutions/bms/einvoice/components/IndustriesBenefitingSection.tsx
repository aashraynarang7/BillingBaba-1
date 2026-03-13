// Example file path: src/components/IndustriesBenefitingSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface IndustryItem {
  id: string;
  name: string;
  color: string;
  position: string;
}

// --- Data for the Component, transcribed from your image ---
const industries: IndustryItem[] = [
  {
    id: "01",
    name: "Large Enterprises",
    color: "bg-purple-500",
    position: "top-0 left-full transform -translate-y-1/2",
  },
  {
    id: "02",
    name: "Manufacture Industry",
    color: "bg-pink-500",
    position: "top-1/2 right-full transform translate-y-8",
  },
  {
    id: "03",
    name: "Wholesale Business",
    color: "bg-green-500",
    position: "bottom-full left-0 transform -translate-y-4",
  },
  {
    id: "04",
    name: "Small and Medium Enterprises",
    color: "bg-blue-500",
    position: "bottom-0 right-full transform translate-y-1/2",
  },
  {
    id: "05",
    name: "Service Providers",
    color: "bg-indigo-500",
    position: "bottom-full right-0 transform -translate-y-4",
  },
];

const IndustriesBenefitingSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Industries Benefiting from GST E-invoicing Software
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text List */}
          <div className="space-y-6">
            <p className="text-text-secondary">
              Billing Baba shows which industries can get the most value from
              our free e-invoicing software. It also explains how e-invoicing
              helps different sectors.
            </p>
            <ul className="space-y-3 list-disc list-inside text-text-secondary">
              <li>
                <strong className="font-semibold text-text-primary">
                  Large Enterprises:
                </strong>{" "}
                Helps manage a high volume of transactions efficiently.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Small and Medium Enterprises (SMEs):
                </strong>{" "}
                Simplifies invoicing, reducing the burden on limited staff.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Manufacturers:
                </strong>{" "}
                Streamlines the supply chain and maintains proper records for
                GST.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Wholesale Businesses:
                </strong>{" "}
                Enhances efficiency and speed in generating invoices.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Service Providers:
                </strong>{" "}
                Simplifies service invoicing and ensures compliance.
              </li>
            </ul>
            <p className="text-text-secondary text-sm">
              For each industry, the content would detail specific challenges
              that e-invoicing helps resolve. For instance, manufacturers can
              eliminate manual entry errors, while wholesale businesses can
              achieve quicker transaction turnaround.
            </p>
          </div>

          {/* Right Column: Diagram */}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative w-64 h-64">
              {/* Central Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full flex flex-col items-center justify-center text-center text-white font-bold text-lg leading-tight shadow-2xl p-4">
                <img
                  src="https://vyaparapp.in/v/z/wp-content/uploads/2024/10/Infographic.webp"
                  alt="Vyapar Logo"
                  className="w-10 h-10 mb-2"
                />
                <span className="text-sm text-text-primary">
                  Industry Benefits from E-invoicing App
                </span>
              </div>

              {/* Industry Bubbles */}
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  className={`absolute ${industry.position} flex items-center gap-2`}
                >
                  {/* Connecting Line and Number */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full ${industry.color} text-white text-xs font-bold flex items-center justify-center`}
                    >
                      {industry.id}
                    </div>
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                  {/* Bubble Content */}
                  <div
                    className={`${industry.color} text-white text-sm font-semibold p-3 rounded-lg shadow-md`}
                  >
                    {industry.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesBenefitingSection;
