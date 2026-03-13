import React from "react";

// --- ✨ Data for the Brand Identity Section ---
const brandData = [
  {
    title: "Create Professional Invoices",
    bgColor: "bg-rose-50", // Light pink background
    points: [
      "Choose from multiple formats",
      "Add your company logo",
      "Customize the invoices",
      "Provide multiple payment options",
    ],
  },
  {
    title: "Send Invoices Online",
    bgColor: "bg-green-50", // Light green background
    points: [
      "Send invoices via SMS, email and WhatsApp",
      "Keep track of invoice status in the dashboard",
      "Follow up with automated payment reminders",
    ],
  },
  {
    title: "Receive Payments on Time",
    bgColor: "bg-yellow-50", // Light yellow background
    points: [
      "Enable multiple payment options",
      "Accept credit & debit cards using POS",
      "Enable scanning and payment with UPI and QR payments",
      "Open other cash, cheque, and online payment options",
    ],
  },
];

const BrandIdentitySection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          Build Brand Identity With Billing Baba's Free Invoice Software
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {brandData.map((card, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 shadow-md ${card.bgColor}`}
            >
              <h3 className="text-xl font-bold text-[color:var(--text-primary)]">
                {card.title}
              </h3>
              <hr className="my-4 border-gray-300" />
              <ul className="space-y-3">
                {card.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start">
                    <span className="mr-3 mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-500"></span>
                    <span className="text-sm text-[color:var(--text-secondary)]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandIdentitySection;
