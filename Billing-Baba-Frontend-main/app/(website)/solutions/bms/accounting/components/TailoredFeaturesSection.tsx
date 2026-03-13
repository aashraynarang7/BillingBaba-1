"use client"; // Important: Isko client component banayein

import React, { useState } from "react";
import Image from "next/image";

// --- ✨ DATA COMPONENT KE ANDAR HI DEFINE KIYA GAYA HAI ---

// Data for the main interactive tabbed section
const tabbedFeaturesData = [
  {
    tabName: "Balance Sheet Generation",
    imageUrl:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/05/Business-Performance-Reports-768x466.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Auto Asset-Liability Classification:",
        text: "Assets like inventory and machinery, and liabilities such as loans, are auto-classified based on your entries.",
      },
      {
        boldText: "Customizable Reporting Periods:",
        text: "Choose any start and end dates to view or download your balance sheet.",
      },
      {
        boldText: "Export to PDF or Excel:",
        text: "Easily share your financial data with stakeholders by exporting your balance sheet.",
      },
    ],
  },
  {
    tabName: "Data Import from Tally",
    imageUrl:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Data-Import-from-Tally-768x461.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Seamless Migration:",
        text: "Easily import all your master data like items and parties from Tally ERP 9 to our software in a single click.",
      },
      {
        boldText: "No Data Loss:",
        text: "Our import tool is designed to accurately map and transfer your data without any loss of information.",
      },
    ],
  },
  {
    tabName: "Expense Management",
    imageUrl:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Expense-Tracking-768x461.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Record All Expenses:",
        text: "Track every business expense, from rent and salaries to small miscellaneous costs.",
      },
      {
        boldText: "Attach Receipts:",
        text: "Digitally attach bills and receipts to expense entries for easy verification and bookkeeping.",
      },
    ],
  },
  {
    tabName: "Cash and Bank Management",
    imageUrl:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Cash-and-Bank-Management-768x461.webp", // IMPORTANT: Image path
    descriptionPoints: [
      {
        boldText: "Multiple Bank Accounts:",
        text: "Add and manage multiple bank and cash accounts within the software.",
      },
      {
        boldText: "Bank Reconciliation:",
        text: "Easily reconcile your bank statements with your book entries to ensure accuracy.",
      },
    ],
  },
];

const TabbedFeaturesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const activeContent = tabbedFeaturesData[activeTab];

  return (
    <section className="bg-[color:var(--background-section-gray)] py-16 md:py-24">
      <div className="container">

        {/* Main Interactive Section */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Powerful Free Accounting Software Empowering SMBs in India
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Tabs */}
          <div className="lg:col-span-1">
            <div className="flex flex-col space-y-2">
              {tabbedFeaturesData.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full rounded-lg p-4 text-left font-bold transition-all duration-300 ${
                    activeTab === index
                      ? "bg-[color:var(--primary-red)] text-white shadow-lg"
                      : "bg-white text-[color:var(--text-primary)] hover:bg-gray-100"
                  }`}
                >
                  {tab.tabName}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2">
            {activeContent && (
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <ul className="list-disc list-inside space-y-3">
                  {activeContent.descriptionPoints.map((point, index) => (
                    <li
                      key={index}
                      className="text-[color:var(--text-secondary)]"
                    >
                      <strong className="font-semibold text-[color:var(--text-primary)]">
                        {point.boldText}
                      </strong>{" "}
                      {point.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 overflow-hidden rounded-md border border-[color:var(--border-color)]">
                  <Image
                    src={activeContent.imageUrl}
                    alt={activeContent.tabName}
                    width={500}
                    height={300}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabbedFeaturesSection;
