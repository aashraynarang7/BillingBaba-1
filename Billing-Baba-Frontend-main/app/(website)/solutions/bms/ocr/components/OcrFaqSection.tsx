// Example file path: src/components/ocr-page/OcrFaqSection.tsx

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
    question: "Can I edit the data after scanning?",
    answer:
      "Yes, after OCR scans the document, you can manually review and edit any fields before saving.",
  },
  {
    question: "Does OCR support multiple languages?",
    answer:
      "Yes, our OCR technology is designed to recognize and process documents in multiple languages, including English and various regional languages.",
  },
  {
    question: "What kind of documents can Billing Baba OCR scan?",
    answer:
      "Our OCR is optimized for various business documents, including purchase bills, sales invoices, receipts, and expense vouchers.",
  },
  {
    question: "Is OCR included in the free version of Billing Baba?",
    answer:
      "The OCR feature is part of our premium subscription plans. You can explore its functionality during the free trial period.",
  },
  {
    question: "Can I scan multiple pages in one go?",
    answer:
      "Yes, the software supports multi-page document scanning, allowing you to process lengthy bills or multiple receipts in a single operation.",
  },
  {
    question: "What file formats are supported for upload?",
    answer:
      "You can upload common image formats like JPG, PNG, and HEIC, as well as PDF documents for scanning.",
  },
  {
    question: "Is internet connection required for using OCR?",
    answer:
      "Yes, an active internet connection is required for the OCR feature to process the document and extract the data accurately.",
  },
];

// Helper Component for the Star Rating
const PostRating: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  return (
    // FIX: Using global CSS variable for the background color
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
                    ? // The yellow color for stars is usually universal, keeping it as is.
                      "text-yellow-400"
                    : // FIX: Using border color for inactive stars for theme consistency
                      "text-border"
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
const OcrFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="h-1 w-24 bg-primary-red mx-auto rounded-full mb-4"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Frequently Asked Questions (FAQs)
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              // FIX: Using global CSS variables for background and border
              <div
                key={index}
                className="bg-background-light rounded-xl shadow-sm overflow-hidden border border-border-color"
              >
                <button
                  onClick={() => handleToggle(index)}
                  // FIX: Using global CSS for hover background
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-text-primary hover:bg-secondary"
                >
                  <span>{item.question}</span>
                  {/* FIX: Using global CSS for icon colors */}
                  {isOpen ? (
                    <ChevronUp className="text-primary h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
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

        <PostRating />
      </div>
    </section>
  );
};

export default OcrFaqSection;
