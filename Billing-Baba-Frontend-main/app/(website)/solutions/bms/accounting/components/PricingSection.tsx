import React from "react";

// --- ✨ Data for the Pricing Plans ---
const pricingPlans = [
  {
    name: "Silver Package",
    originalPrice: "350",
    discountedPrice: "283",
    features: [
      "Track income, expenses and cash flow",
      "Send professional invoices and quotations",
      "Manage full stock inventory",
      "Generate critical business and tax reports",
      "Import item details from Excel",
      "Create purchase and sales orders",
      "Auto-backup feature for data safety",
      "Preferred customer support",
      "Share transactions with parties, Get 200 SMS Credits",
    ],
  },
  {
    name: "Gold Package",
    originalPrice: "400",
    discountedPrice: "308",
    features: [
      "Track income, expenses and cash flow",
      "Generate E-Way Bills",
      "Quick Billing",
      "Add TCS on Invoices",
      "Send professional invoices and quotations",
      "Manage full stock inventory",
      "Generate critical business and tax reports",
      "Import item details from Excel",
      "Create purchase and sales orders",
      "Auto-backup feature for data safety",
      "Preferred customer support",
      "Share transactions with parties, Get 200 SMS Credits",
      "Sync data across devices",
    ],
  },
];

const PricingSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Accounting Software Packages in India
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg bg-sky-50 p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
                {plan.name}
              </h3>

              <div className="my-6">
                <p className="text-xl text-red-500 line-through">
                  ₹{plan.originalPrice}
                </p>
                <p className="text-4xl font-extrabold text-[color:var(--primary-red)]">
                  ₹{plan.discountedPrice}
                  <span className="text-lg font-medium text-gray-600">
                    /month*
                  </span>
                </p>
              </div>

              <ul className="flex-grow space-y-3 text-left">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <span className="mr-2 mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-500"></span>
                    <span className="text-sm text-[color:var(--text-secondary)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="rounded-full bg-[color:var(--primary-red)] px-8 py-3 font-bold text-white shadow-md transition-transform duration-200 hover:scale-105">
            Check Detailed Pricing
          </button>
          <p className="mt-2 text-xs text-gray-500">
            * The plans will be billed annually
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
