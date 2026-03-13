import React from "react";
import Image from "next/image";

// --- ✨ DATA ARRAY COMPONENT KE ANDAR HI DEFINE KIYA GAYA HAI ---
const comparisonData = [
  { feature: "Price", basic: "Free", ours: "Free" },
  { feature: "Accounts Payable/Receivable", basic: false, ours: true },
  { feature: "Profit & Loss Reports", basic: false, ours: true },
  { feature: "Customizable Invoices", basic: true, ours: true },
  { feature: "GST Compliance", basic: false, ours: true },
  { feature: "User Interface & Ease of Use", basic: false, ours: true },
  { feature: "Balance Sheet Report", basic: false, ours: true },
  { feature: "Multi-User Access", basic: false, ours: true },
  { feature: "Tax Calculations", basic: true, ours: true },
  { feature: "Expense Tracking", basic: false, ours: true },
  { feature: "E-Invoice and E-Way Bill Creation", basic: false, ours: true },
  { feature: "Stock Tracking", basic: false, ours: true },
  { feature: "Real-Time Online Sync", basic: false, ours: true },
];

// Icons for check and cross
const CheckIcon = () => (
  <svg
    className="h-6 w-6 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CrossIcon = () => (
  <svg
    className="h-6 w-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// --- COMPONENT AB KOI PROPS NAHI LETA HAI ---
const ComparisonSection: React.FC = () => {
  const title =
    "Why Billing Baba is a Perfect Choice for Indian Small Businesses?";

  return (
    <section className="bg-[color:var(--background-faq-accent)] py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          {title}
        </h2>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-[color:var(--background-light)] shadow-2xl ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "var(--primary-red)" }}
                >
                  <th className="w-2/5 px-6 py-5 text-left font-bold text-[color:var(--text-primary)]">
                    Features
                  </th>
                  <th className="w-1/4 px-6 py-5 text-center font-bold text-[color:var(--text-primary)]">
                    Basic Accounting Software
                  </th>
                  <th className="relative w-1/3 rounded-t-lg border-2 border-b-0 border-[color:var(--primary-red)] px-6 py-4 text-center">
                    <span className="font-bold text-[color:var(--text-primary)]">
                      Billing Baba Software
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0"
                    style={{ borderColor: "var(--primary-red)" }}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[color:var(--text-secondary)]">
                      {item.feature}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {typeof item.basic === "string" ? (
                          <span className="text-sm font-semibold text-gray-700">
                            {item.basic}
                          </span>
                        ) : item.basic ? (
                          <CheckIcon />
                        ) : (
                          <CrossIcon />
                        )}
                      </div>
                    </td>
                    <td className="border-x-2 border-[color:var(--primary-red)] px-6 py-4">
                      <div className="flex justify-center">
                        {typeof item.ours === "string" ? (
                          <span className="text-sm font-semibold text-orange-600">
                            {item.ours}
                          </span>
                        ) : item.ours ? (
                          <CheckIcon />
                        ) : (
                          <CrossIcon />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}></td>
                  <td className="rounded-b-lg border-x-2 border-b-2 border-[color:var(--primary-red)] p-4">
                    <button className="w-full rounded-md bg-[color:var(--primary-red)] py-3 text-sm font-bold text-white transition hover:opacity-90">
                      Download Billing Baba Now!
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
