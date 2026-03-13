import React from "react";
import Image from "next/image";

// --- ✨ Data for the Entire Section ---
const tailoredFeaturesData = [
  {
    title: "Double Entry Accounting System",
    imageUrl: "/inventory/Double-entry-accounting-768x768.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Accurate Journal Entries:",
        regularText:
          "Every transaction is automatically logged in the corresponding accounts, ensuring that journal entries remain balanced and follow standard accounting principles.",
      },
      {
        boldText: "Built-in Ledger Management:",
        regularText:
          "This helps business owners track account balances efficiently for all parties, assets, and liabilities.",
      },
      {
        boldText: "Automatic Balancing:",
        regularText:
          "The app ensures all debits and credits match automatically, significantly reducing the chance of misstatements in financial statements.",
      },
    ],
  },
  {
    title: "Profit and Loss Reports",
    imageUrl: "/inventory/Lease-Payment-Tracking-768x768.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Real-Time Tracking:",
        regularText:
          "Users can track income and expenses daily, weekly, or monthly, making it easy to evaluate business performance over time.",
      },
      {
        boldText: "Expense Categorization:",
        regularText:
          "Our software lets you tag each expense under predefined categories like rent, utilities, or payroll, enhancing report clarity.",
      },
      {
        boldText: "Instant Report Generation:",
        regularText:
          "With just a few clicks, generate downloadable P&L reports for sharing with partners, investors, or accountants.",
      },
    ],
  },
  {
    title: "GST Reports",
    imageUrl:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/GST-Compliance-768x768.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "GSTR-1, GSTR-2, GSTR-3B:",
        regularText:
          "Generate all essential GST reports directly from your sales and purchase data. Avoid manual errors and save time during filing.",
      },
      {
        boldText: "JSON Export:",
        regularText:
          "Export reports in the government-recommended JSON format for easy upload to the GST portal.",
      },
    ],
  },
  {
    title: "Payment Due Tracking",
    imageUrl:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/05/Lease-Payment-Tracking-768x768.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Automated Reminders:",
        regularText:
          "Set up automatic payment reminders via WhatsApp, SMS, or Email to be sent to your customers before the due date.",
      },
      {
        boldText: "Payment Status Updates:",
        regularText:
          "Track the status of every invoice—Paid, Partially Paid, or Overdue—from a single, clear dashboard.",
      },
    ],
  },
];

const TailoredFeaturesSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Best Tailored Features of Accounting Software for SMBs
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {tailoredFeaturesData.map((feature, index) => (
            <div key={index}>
              <div className="mb-6 overflow-hidden rounded-xl border border-[color:var(--border-color)] shadow-lg">
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  width={600}
                  height={450}
                  className="h-auto w-full"
                />
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold text-[color:var(--text-primary)]">
                  {feature.title}
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {feature.descriptionPoints.map((point, pIndex) => (
                    <li
                      key={pIndex}
                      className="text-[color:var(--text-secondary)]"
                    >
                      <strong className="font-semibold text-[color:var(--text-primary)]">
                        {point.boldText}
                      </strong>{" "}
                      {point.regularText}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Download Button (Optional, as it was not in the provided code but is in the image) */}
        <div className="mt-16 text-center">
          <button className="rounded-md bg-[color:var(--primary-red)] px-8 py-4 text-lg font-bold text-white shadow-md transition-transform duration-200 hover:scale-105">
            Download Accounting Software
          </button>
        </div>
      </div>
    </section>
  );
};

export default TailoredFeaturesSection;
