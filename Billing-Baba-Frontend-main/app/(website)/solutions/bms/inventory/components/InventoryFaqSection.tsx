"use client"; // Important: This component needs state for interactivity

import React, { useState } from "react";

// --- ✨ SVG Icons for the Accordion ---
const ChevronUpIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// --- ✨ Data for the FAQ Section ---
const faqData = [
  {
    question: "What is Inventory Management Software?",
    answer:
      "Inventory management software is a professional tool for businesses to handle supplies, stocks, or inventory. Smart inventory control is crucial for companies to maximize profits and minimize the use of space required for storage. Many businesses use our inventory management app to understand what sells more and create the next fiscal business plan.",
  },
  {
    question: "Which is the best software to use for Inventory Management?",
    answer:
      "Our app is widely regarded as one of the best choices for small and medium-sized businesses in India due to its comprehensive features, user-friendly interface, and affordable pricing.",
  },
  {
    question: "Why does a business require Inventory Management Software?",
    answer:
      "It helps in preventing stockouts and overstocking, reduces manual errors, saves time through automation, provides real-time data for better decision-making, and improves overall operational efficiency.",
  },
  {
    question: "What is the cost associated with Inventory Management Software?",
    answer:
      "We offer a range of plans, including a completely free version with essential features. Our paid plans are affordably priced to provide advanced functionalities for growing businesses. You can check our pricing page for more details.",
  },
  {
    question:
      "What are the pricing plans for inventory management software with barcode scanning?",
    answer:
      "Barcode scanning is available in our premium plans. This feature allows for faster billing, accurate stock-taking, and efficient inventory management, significantly reducing manual effort.",
  },
  {
    question: "Can I track inventory across multiple locations or godowns?",
    answer:
      "Yes, our multi-godown management feature allows you to track and manage stock across multiple stores, warehouses, or locations from a single dashboard, providing a centralized view of your entire inventory.",
  },
  {
    question: "Does the software provide low stock alerts?",
    answer:
      "Absolutely. You can set a minimum stock level for each item. The software will automatically notify you when the stock reaches that level, so you can reorder in time and avoid losing sales.",
  },
];

const InventoryFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first item open
  const [showAll, setShowAll] = useState(false);
  const initialVisibleCount = 5;

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const visibleFaqs = showAll ? faqData : faqData.slice(0, initialVisibleCount);

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-wider text-[color:var(--text-primary)]">
          FAQs
        </h2>

        <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white shadow-sm">
          {visibleFaqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => handleToggle(index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-[color:var(--text-primary)]">
                  {faq.question}
                </span>
                <span className="text-sky-500">
                  {openIndex === index ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 text-[color:var(--text-secondary)]">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {faqData.length > initialVisibleCount && !showAll && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 mx-auto font-semibold text-sky-600 hover:text-sky-800"
            >
              Show More <ChevronDownIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InventoryFaqSection;
