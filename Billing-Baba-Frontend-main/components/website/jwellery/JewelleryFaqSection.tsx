// Example file path: src/components/jewellery-page/JewelleryFaqSection.tsx

"use client"; // This component is interactive (uses useState)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";

// --- Type Definitions for TypeScript ---
interface FaqItem {
  question: string;
  answer: string;
}

// --- Data for the Component, transcribed from your image ---
const faqData: FaqItem[] = [
  {
    question: "Which Billing Software is Best for Jewellery Stores?",
    answer:
      "Billing Baba is the best billing software for jewellery stores, offering specialized features like design-wise inventory, multi-rate billing for gold/silver, GST compliance, and robust reporting.",
  },
  {
    question:
      "Can I Use the Billing Baba App to Manage Multiple Jewellery Shop Stores?",
    answer:
      "Yes, our multi-store management feature allows you to oversee operations, track inventory, and view consolidated reports for all your branches from a single dashboard.",
  },
  {
    question:
      "How much does it cost to use the Billing Baba App in a Jewellery Store?",
    answer:
      "We offer various subscription plans tailored to different business sizes. Please visit our pricing page or contact us for a detailed quote based on your specific needs.",
  },
  {
    question: "Why do People use Jewellery Store Billing Software?",
    answer:
      "Jewellers use billing software to automate complex tasks like GST calculation, manage intricate inventory (e.g., by weight, carat, design), track profits, and provide a faster, more professional checkout experience for customers.",
  },
  {
    question: "How do you maintain Jewellery accounts?",
    answer:
      "Billing Baba simplifies account maintenance with features for tracking sales, purchases, expenses, and cash flow. All transactions are recorded accurately, providing you with a clear financial overview at all times.",
  },
  {
    question: "Is it Safe to Use Billing Baba and Store Data in it?",
    answer:
      "Yes, data security is our top priority. We use advanced encryption and secure cloud storage to ensure your business data is always safe, backed up, and accessible only to you.",
  },
];

// Helper Component for the Star Rating
const PostRating: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="mt-12 py-8 bg-section-gray rounded-lg">
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
        Average rating 4.51 / 5. Vote count: 694
      </p>
    </div>
  );
};

// Main Component
const JewelleryFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Top Promotional Banner */}
      <div className="bg-primary-red py-4">
        <div className="container mx-auto px-4 text-center">
          {/* Corrected the text to be relevant for Jewellery */}
          <h2 className="text-xl font-bold text-text-on-dark">
            Take Your Jewellery Business to the Next Level with Billing Baba
            App! Try Free!
          </h2>
        </div>
      </div>

      {/* Main FAQ Section */}
      <section className="bg-background-light py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-section-gray rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-text-primary hover:bg-gray-200/50"
                  >
                    <span className="flex items-center gap-3">
                      <Play
                        className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                      />
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-text-secondary border-t border-gray-200 pt-4 ml-8">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <PostRating />
        </div>
      </section>
    </>
  );
};

export default JewelleryFaqSection;
