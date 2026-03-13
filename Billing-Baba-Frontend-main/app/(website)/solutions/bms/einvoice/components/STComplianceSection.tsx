// Example file path: src/components/GSTComplianceSection.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface CompliancePoint {
  title: string;
  details: string[];
}

// --- Data for the Component, transcribed from your image ---
const compliancePoints: CompliancePoint[] = [
  {
    title: "Real-Time Integration with GST Portal",
    details: [
      "Vyapar’s e-invoicing system connects with the government’s Invoice Registration Portal (IRP). This connection is essential for creating valid e-invoices.",
      "When Vyapar generates an invoice, the software sends it directly to the IRP for validation. Once validated, the portal gives a unique Invoice Reference Number (IRN) and a QR code for the invoice.",
    ],
  },
  {
    title: "Automatic Generation of IRN and QR Code",
    details: [
      "Government rules state that every invoice must have a unique IRN and a QR code to be an e-invoice. Vyapar’s electronic invoice app automatically incorporates these elements.",
      "The QR code has important information. It includes the supplier’s GSTIN, the buyer’s GSTIN, the invoice value, and more.",
    ],
  },
  {
    title: "Adherence to Standard E-Invoice Schema",
    details: [
      "The government mandates that all e-invoices follow a specific format or schema, which includes mandatory fields and structures.",
      "Vyapar software updates automatically to accommodate any changes in the schema or government requirements, ensuring ongoing compliance.",
    ],
  },
  {
    title: "GST Compliant Fields and Calculations",
    details: [
      "Vyapar makes sure that all the information needed for GST compliance is in the invoice. This includes HSN codes, GST rates, and tax breakdowns.",
      "The software helps businesses use the right GST rates for each product or service. This reduces errors and makes compliance easier.",
    ],
  },
  {
    title: "Direct Upload to GST Returns",
    details: [
      "E-invoices generated in Vyapar can be directly used to file GST returns (GSTR-1). This integration makes it easier to enter invoice data during filing.",
      "It automatically connects e-invoice data to the GST return filing system. This ensures compliance and makes filing returns easier and quicker each month or quarter.",
    ],
  },
  {
    title: "Auto-Updating Features for Compliance Changes",
    details: [
      "Government agencies frequently update regulations around GST and e-invoicing. Our team frequently updates the Vyapar GST e-invoicing software.",
      "By keeping up with the latest government guidelines, Vyapar helps users avoid penalties.",
    ],
  },
  {
    title: "B2B and B2G Compliance",
    details: [
      "Vyapar’s best e-invoicing software meets the rules for both B2B (Business to Business) and B2G (Business to Government) transactions.",
      "It offers tools to create invoices that other businesses and government departments accept.",
    ],
  },
  {
    title: "Audit Trail and Record Keeping",
    details: [
      "Government regulations require businesses to maintain accurate and detailed financial records. Vyapar makes a digital record for each e-invoice.",
      "The electronic invoicing system stores all e-invoices safely. This makes it easy to access them later.",
    ],
  },
];

const GSTComplianceSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Ensure Real-Time GST Compliance with Vyapar’s E-Invoicing Software
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Text List */}
          <div className="space-y-6">
            <p className="text-text-secondary">
              Vyapar e-invoice generation software helps businesses follow
              government rules easily. This is especially important for India’s
              Goods and Services Tax (GST) requirements. E-invoicing is a system
              created by the Indian government. It aims to make submitting
              invoices under GST easier and more uniform. Here’s how Vyapar’s
              e-invoicing software solutions ensures compliance with these
              government regulations:
            </p>
            <ol className="space-y-6">
              {compliancePoints.map((point, index) => (
                <li key={index}>
                  <h3 className="text-lg font-bold text-primary-red mb-2">
                    {index + 1}. {point.title}
                  </h3>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    {point.details.map((detail, idx) => (
                      <li key={idx} className="text-text-secondary">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center pt-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
              <img
                src="https://vyaparapp.in/v/z/wp-content/uploads/2024/10/Real-Time-GST-Compliance.webp"
                alt="Real-Time GST Compliance on a mobile screen"
                className="w-full max-w-md h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GSTComplianceSection;
