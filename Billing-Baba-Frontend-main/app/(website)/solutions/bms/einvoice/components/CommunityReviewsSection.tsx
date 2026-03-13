// FIX: Se añadió "use client" para que el componente sea interactivo en el navegador.
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Type Definitions for TypeScript ---
interface Review {
  platform: "Google Play" | "G2" | "Capterra";
  platformIcon: string;
  rating?: number; // Optional overall rating (for G2)
  user: {
    name: string;
    title: string;
    avatar: string;
  };
  reviewTitle: string;
  reviewText: string;
  reviewStars: number; // Stars at the bottom of the review
}

// --- Data for the Component with "Billing Baba" ---
const reviewsData: Review[] = [
  {
    platform: "Google Play",
    platformIcon:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Play-Store-01.webp",
    user: {
      name: "Taj Trading Co.",
      title: "Retailer",
      avatar:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/rev2.svg",
    },
    reviewTitle: "Excellent",
    reviewText:
      "Since 2022, I've been using Billing Baba, and it's fantastic. Upgrading to the premium mobile app was a wise choice, particularly for shop staff who aren't familiar with using computers. The app is user friendly, and the inclusion of e invoicing functionality is a significant advantage.",
    reviewStars: 5,
  },
  {
    platform: "G2",
    platformIcon:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/g2-pos.png",
    rating: 5,
    user: {
      name: "Hema Srivastava",
      title: "Distributor",
      avatar:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/rev3.svg",
    },
    reviewTitle: "Easy & Economical",
    reviewText:
      "I've been using the Billing Baba app for invoicing since I came across it, and I really like it. It's incredibly user friendly and easy to get on with it. I'm proud to use Billing Baba, as it offers a cost effective invoicing solution compared to other industry applications. Thank you, Billing Baba!",
    reviewStars: 5,
  },
  {
    platform: "Capterra",
    platformIcon:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/rev1.svg",
    user: {
      name: "Verified Reviewer",
      title: "Business Owner",
      avatar:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/capterra-pos.png",
    },
    reviewTitle: "Highly Recommended",
    reviewText:
      "This software has streamlined our entire invoicing process with Billing Baba. The customer support is excellent and the features are exactly what a small business needs to stay compliant and efficient.",
    reviewStars: 5,
  },
];

// Helper component for Star Rating
const StarRating: React.FC<{ count: number; color: string; size?: string }> = ({
  count,
  color,
  size = "w-6 h-6",
}) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        className={`${size} ${color}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const CommunityReviewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeReview = reviewsData[activeTab];

  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Billing Baba's Growing Community
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center border-b border-gray-200 mb-10">
          {reviewsData.map((review, index) => (
            <button
              key={review.platform}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-300 relative ${
                activeTab === index
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <img
                src={review.platformIcon}
                alt={review.platform}
                className="h-6 w-auto"
              />
              <span>{review.platform}</span>
              {activeTab === index && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                  layoutId="underline"
                />
              )}
            </button>
          ))}
        </div>

        {/* Review Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          >
            {/* Left Column (User Info) */}
            <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-4">
                <img
                  src={activeReview.user.avatar}
                  alt={activeReview.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-text-primary">
                    {activeReview.user.name}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {activeReview.user.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (Review Details) */}
            <div className="md:col-span-2">
              {activeReview.rating && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-semibold text-text-primary">
                    Rating:
                  </span>
                  <StarRating
                    count={activeReview.rating}
                    color="text-yellow-400"
                    size="w-5 h-5"
                  />
                </div>
              )}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative">
                <h3 className="font-bold text-text-primary mb-2">
                  {activeReview.reviewTitle}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {activeReview.reviewText}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <StarRating
                    count={activeReview.reviewStars}
                    color="text-green-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CommunityReviewsSection;
