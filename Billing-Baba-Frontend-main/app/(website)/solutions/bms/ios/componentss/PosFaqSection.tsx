// Example file path: src/components/ios-page/PosFaqSection.tsx

"use client"; // This component is interactive (uses useState)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

// --- Type Definitions for TypeScript ---
interface FaqItem {
  question: string;
  answer: string;
}

// --- Data for the Component ---
const faqData: FaqItem[] = [
  {
    question: "Does V-POS support multi counter billing?",
    answer: "Yes, we support it on online mode.",
  },
  {
    question: "Can V-POS be used offline?",
    answer:
      "Yes, V-POS is designed to work fully offline. All your data is saved locally, and it syncs to the cloud once you reconnect to the internet.",
  },
  {
    question: "Does V-POS offer Accounting Solutions?",
    answer:
      "Absolutely. V-POS comes with full financial accounting features, including balance sheets, profit & loss statements, and detailed business reports.",
  },
  {
    question: "Are E-commerce integrations available with V-POS?",
    answer:
      "Yes, V-POS can integrate with popular e-commerce platforms to sync your online and offline inventory and sales, providing a unified management experience.",
  },
  {
    question: "Does V-POS support payment integrations?",
    answer:
      "Yes, V-POS supports multiple payment options, including UPI, credit/debit cards, and mobile wallets through integrations with providers like Razorpay.",
  },
  {
    question: "What kind of hardware is supported?",
    answer:
      "Our software is compatible with a wide range of hardware, including barcode scanners, receipt printers (thermal and regular), and cash drawers on Windows and Mac devices.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a free trial for you to explore all the features of V-POS before committing to a subscription plan.",
  },
];

// Helper Component for the Star Rating
const PostRating: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="mt-12 py-8 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-bold text-text-primary">
        How Useful Was This Post?
      </h3>
      <p className="text-sm text-text-secondary mt-1">
        Click on a star to rate it!
      </p>
      <div className="flex justify-center my-4">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={starValue}
              type="button"
              className="text-4xl transition-colors"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              <span
                className={
                  starValue <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                &#9733;
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-text-secondary">
        Average rating 4.58 / 5. Vote count: 789
      </p>
    </div>
  );
};

// Main Component
const PosFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const itemsToShow = showAll ? faqData : faqData.slice(0, 5);

  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            FAQs
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {itemsToShow.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-text-primary hover:bg-gray-50"
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="text-blue-500" />
                  ) : (
                    <ChevronDown />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-text-secondary">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        {!showAll && faqData.length > 5 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="text-blue-600 font-semibold flex items-center gap-1 mx-auto"
            >
              Show More <ChevronDown />
            </button>
          </div>
        )}

        {/* Post Rating Section */}
        <PostRating />
      </div>
    </section>
  );
};

export default PosFaqSection;
