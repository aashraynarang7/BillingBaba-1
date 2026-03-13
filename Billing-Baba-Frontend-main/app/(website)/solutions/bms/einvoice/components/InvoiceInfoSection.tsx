// Example file path: src/components/InvoiceInfoSection.tsx

import React from "react";
import { Store, UserCircle, FileText } from "lucide-react";

// --- Type Definitions for TypeScript ---
interface InfoItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  colors: {
    bg: string;
    border: string;
    iconBg: string;
    iconText: string;
    line: string;
  };
  position: string;
}

// --- Data for the Component, transcribed from your image ---
const infoItems: InfoItem[] = [
  {
    title: "Supplier Information",
    subtitle: "Company Name, Address",
    icon: Store,
    colors: {
      bg: "bg-red-50",
      border: "border-red-400",
      iconBg: "bg-red-100",
      iconText: "text-red-500",
      line: "bg-red-400",
    },
    position: "top-0 left-1/2 transform -translate-y-1/2 -translate-x-[20%]",
  },
  {
    title: "Customer Information",
    subtitle: "Address, GSTIN",
    icon: UserCircle,
    colors: {
      bg: "bg-orange-50",
      border: "border-orange-400",
      iconBg: "bg-orange-100",
      iconText: "text-orange-500",
      line: "bg-orange-400",
    },
    position: "top-1/2 left-full transform -translate-y-1/2 ml-8",
  },
  {
    title: "Invoice Details",
    subtitle: "Invoice Number, Due Date",
    icon: FileText,
    colors: {
      bg: "bg-teal-50",
      border: "border-teal-400",
      iconBg: "bg-teal-100",
      iconText: "text-teal-500",
      line: "bg-teal-400",
    },
    position: "bottom-0 left-1/2 transform translate-y-1/2 -translate-x-[20%]",
  },
];

const InvoiceInfoSection: React.FC = () => {
  return (
    // This section has a light blue bottom part, achieved by padding on the parent
    <section className="bg-blue-50 py-16 md:py-24">
      {/* The main content has a white background */}
      <div className="bg-background-light py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              What Will Be Included in Creating E-invoicing?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary-red">
                Basic Invoice Information
              </h3>
              <ul className="space-y-3 list-disc list-inside text-text-secondary">
                <li>
                  <strong className="font-semibold text-text-primary">
                    Supplier Information:
                  </strong>{" "}
                  Your company name, address, and GSTIN (if applicable).
                </li>
                <li>
                  <strong className="font-semibold text-text-primary">
                    Customer Information:
                  </strong>{" "}
                  Buyer’s company name, address, and GSTIN (if applicable).
                </li>
                <li>
                  <strong className="font-semibold text-text-primary">
                    Invoice Details:
                  </strong>{" "}
                  Invoice number, date of issue, and due date.
                </li>
              </ul>
            </div>

            {/* Right Column: Diagram */}
            <div className="flex items-center justify-center min-h-[350px]">
              <div className="relative w-48 h-48">
                {/* Central Red Circle */}
                <div className="absolute inset-0 bg-primary-red rounded-full flex items-center justify-center text-center text-white font-bold text-xl leading-tight shadow-lg">
                  Invoice <br /> Information
                </div>

                {/* Connecting Lines and Pills */}
                {infoItems.map((item, index) => (
                  <div
                    key={item.title}
                    className={`absolute ${item.position} w-64`}
                  >
                    {/* Connecting Line */}
                    <div
                      className="absolute"
                      style={{
                        top: index === 0 ? "auto" : "50%",
                        bottom: index === 0 ? "50%" : "auto",
                        right: index === 1 ? "auto" : "100%",
                        left: index === 1 ? "100%" : "auto",
                        width: index === 1 ? "40px" : "60px",
                        height: "2px",
                        transform:
                          index === 0
                            ? "rotate(-45deg) translate(20px, 20px)"
                            : index === 2
                              ? "rotate(45deg) translate(20px, -20px)"
                              : "none",
                        transformOrigin: index === 1 ? "left" : "right",
                      }}
                    >
                      <div
                        className={`w-full h-full ${item.colors.line}`}
                      ></div>
                      <div
                        className={`absolute w-3 h-3 rounded-full ${item.colors.line}`}
                        style={{
                          top: "-5px",
                          left: index === 1 ? "-6px" : "auto",
                          right: index !== 1 ? "-6px" : "auto",
                        }}
                      ></div>
                    </div>

                    {/* Pill Content */}
                    <div
                      className={`flex items-center gap-3 p-2 rounded-full shadow-md border-2 ${item.colors.border} ${item.colors.bg}`}
                    >
                      <div className={`p-2 rounded-full ${item.colors.iconBg}`}>
                        <item.icon
                          className={`w-6 h-6 ${item.colors.iconText}`}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">
                          {item.title}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceInfoSection;
