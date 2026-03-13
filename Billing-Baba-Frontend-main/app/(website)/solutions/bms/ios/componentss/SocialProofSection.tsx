// Example file path: src/components/ios-page/SocialProofSection.tsx

"use client"; // This component is interactive (uses useState)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Type Definitions for TypeScript ---
interface Review {
  platform: "Google Play" | "G2" | "Capterra";
  platformIcon: string;
  rating?: number;
  user: { name: string; title: string; avatar: string };
  reviewTitle: string;
  reviewText: string;
  reviewStars: number;
}

interface Partner {
  name: string;
  src: string;
}

interface Hardware {
  name: string;
  positionClasses: string;
}

// --- Data for the Sections with "Billing Baba" ---
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
      "I've been using Billing Baba since 2022, and it's truly awesome. For me, opting for the mobile app premium was a smart move, especially for those at the shop who may not be comfortable with computers. The app is straightforward, and e-way bill is a great addition.",
    reviewStars: 5,
  },
  {
    platform: "G2",
    platformIcon:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/g2-pos.png",
    rating: 5,
    user: {
      name: "Hema Srivastava",
      title: "Retailer",
      avatar:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/rev3.svg",
    },
    reviewTitle: "Easy & Economical",
    reviewText:
      "I really like the Billing Baba app, and I've been using it since the beginning for invoicing. It's very user-friendly and easy to work with. I take pride in Billing Baba for being a cost-effective invoicing solution compared to other applications in the industry. Thanks again, Billing Baba!",
    reviewStars: 5,
  },
  {
    platform: "Capterra",
    platformIcon:
      "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/capterra-pos.png",
    user: {
      name: "Verified Reviewer",
      title: "Business Owner",
      avatar:
        "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Taj-Trading-Co-01.webp",
    },
    reviewTitle: "Highly Recommended",
    reviewText:
      "This software has streamlined our entire invoicing process. The customer support is excellent and the features are exactly what a small business needs to stay compliant and efficient.",
    reviewStars: 5,
  },
];

const partnerLogos: Partner[] = [
  {
    name: "TVS",
    src: "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/partner-tvs.webp",
  },
  {
    name: "Razorpay",
    src: "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/partner-razorpay.webp",
  },
  {
    name: "Posytude",
    src: "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/partner-posytude.webp",
  },
  {
    name: "Indiamart",
    src: "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/partner-indiamart.webp",
  },
];

const hardwareData: Hardware[] = [
  { name: "POS Machine", positionClasses: "top-[45%] right-0" },
  { name: "A4 Printers", positionClasses: "top-[60%] right-0" },
  { name: "Barcode Scanner", positionClasses: "top-[60%] left-0" },
  { name: "Cash Drawers", positionClasses: "top-[75%] left-0" },
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

const SocialProofSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeReview = reviewsData[activeTab];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24 space-y-24">
      {/* --- Section 1: Growing Community --- */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Billing Baba's Growing Community
          </h2>
        </div>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          >
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

      {/* --- Section 2: Our Partners --- */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Our Partners
          </h2>
        </div>
        <div className="relative h-16 overflow-x-hidden">
          <motion.div
            className="absolute top-0 left-0 flex h-full items-center"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          >
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <img
                key={index}
                src={logo.src}
                alt={logo.name}
                className="h-8 md:h-10 mx-10 object-contain"
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- Section 3: Supported Hardware --- */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Supported Hardware
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Billing Baba POS integrates seamlessly with diverse hardware,
            offering flexibility tailored to your business needs.
          </p>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <img
            src="https://vyaparapp.in/v/z/wp-content/uploads/2024/07/supported-hardware-desktop-2048x986.webp"
            alt="Supported POS Hardware"
            className="w-full h-auto"
          />
          {hardwareData.map((item) => (
            <div
              key={item.name}
              className={`absolute ${item.positionClasses} flex items-center`}
            >
              <div className="w-16 h-px bg-blue-400"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="ml-2 text-sm font-semibold text-text-primary bg-white/70 backdrop-blur-sm px-2 py-1 rounded-md">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
