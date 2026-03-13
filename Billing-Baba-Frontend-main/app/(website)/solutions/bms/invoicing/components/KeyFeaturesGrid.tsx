import React from "react";

// --- ✨ SVG Icons for the Features Grid ---
// Maine aapke design se milte-julte icons bana diye hain.
const GstIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const BarcodeIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 5v14M8 5v14m4-5v5m4-2v2M20 5v14"
    />
  </svg>
);
const LoyaltyIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);
const PaymentOptionIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);
const ReminderIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);
const MessagingIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h8z"
    />
  </svg>
);
const CashFlowIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 11l5-5m0 0l5 5m-5-5v12"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 13l-5 5m0 0l-5-5m5 5V6"
    />
  </svg>
);
const LowStockIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 9v2m0 4h.01"
    />
  </svg>
);
const DashboardIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const MultiUserIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292"
    />
  </svg>
);
const ReportsIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const OnlineAccessIcon = () => (
  <svg
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-1.414v.01M9 10.5a3 3 0 11-6 0 3 3 0 016 0zM19 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// --- ✨ Data for the Features Grid ---
const featuresData = [
  { icon: <GstIcon />, label: "GST Rate & Compliance" },
  { icon: <BarcodeIcon />, label: "Barcode Label Generation" },
  { icon: <LoyaltyIcon />, label: "Loyalty Points" },
  { icon: <PaymentOptionIcon />, label: "Multi-Payment Option" },
  { icon: <ReminderIcon />, label: "Payment Reminders" },
  { icon: <MessagingIcon />, label: "Transaction Messaging" },
  { icon: <CashFlowIcon />, label: "Cash Flow Tracking" },
  { icon: <LowStockIcon />, label: "Low Stock Alert" },
  { icon: <DashboardIcon />, label: "Business Dashboard" },
  { icon: <MultiUserIcon />, label: "Multi-User Access" },
  { icon: <ReportsIcon />, label: "Financial Reports" },
  { icon: <OnlineAccessIcon />, label: "Online And Offline Access" },
];

const KeyFeaturesGrid: React.FC = () => {
  return (
    <section className="bg-sky-50 py-16 md:py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          Key Features of Billing Baba Invoice Software for Small Business
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="text-[color:var(--primary-red)] opacity-80">
                {feature.icon}
              </div>
              <p className="font-semibold text-sm text-[color:var(--text-primary)]">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesGrid;
