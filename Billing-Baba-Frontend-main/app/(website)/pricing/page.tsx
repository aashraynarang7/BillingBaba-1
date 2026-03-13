"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown, Info } from "lucide-react";

// Types
interface FeatureItem {
  name: string;
  basic: string | boolean;
  premium: string | boolean;
  tooltip?: string;
}

interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

interface PricingPlan {
  id: string;
  name: string;
  icon: string;
  originalPrice: number;
  discountedPrice: number;
  monthlyPrice: number;
  isPopular?: boolean;
}

// Data
const planOptions = ["Desktop + Mobile", "Desktop Only", "Mobile Only"];
const durationOptions = ["1 Year", "2 Years", "3 Years"];

const pricingData: PricingPlan[] = [
  {
    id: "silver",
    name: "Silver",
    icon: "⚪",
    originalPrice: 6799,
    discountedPrice: 3999,
    monthlyPrice: 333.25,
  },
  {
    id: "gold",
    name: "Gold",
    icon: "🟡",
    originalPrice: 8199,
    discountedPrice: 4299,
    monthlyPrice: 358.25,
    isPopular: true,
  },
];

// Feature Categories
const features: FeatureCategory[] = [
  {
    category: "Features",
    items: [
      { name: "Sync data across devices", basic: true, premium: true },
      {
        name: "Create multiple companies",
        basic: "3 companies",
        premium: "5 companies",
      },
      {
        name: "Generate E-way Bills",
        basic: "10 per month",
        premium: "Unlimited",
      },
      {
        name: "Restore deleted transactions",
        basic: "2 transactions",
        premium: "Unlimited",
      },
      { name: "Remove advertisement on invoices", basic: true, premium: true },
      { name: "Set multiple pricing for items", basic: true, premium: true },
      { name: "Update Items in bulk", basic: true, premium: true },
      { name: "Set credit limit for parties", basic: true, premium: true },
      { name: "Add Fixed Assets", basic: true, premium: true },
      { name: "Automate Payment Reminders", basic: true, premium: true },
      {
        name: "Combine multiple orders/challans into one sale",
        basic: true,
        premium: true,
      },
      { name: "Accounting Module", basic: true, premium: true },
      { name: "Vyapar Smart Connect", basic: true, premium: true },
      { name: "Google Profile Manager", basic: true, premium: true },
    ],
  },
  {
    category: "Reports",
    items: [
      { name: "Balance Sheet", basic: true, premium: true },
      { name: "Billwise Profit and Loss Reports", basic: true, premium: true },
      { name: "Partywise Profit and Loss Report", basic: true, premium: true },
      { name: "Item Batch and Serial Report", basic: true, premium: true },
    ],
  },
  {
    category: "Settings",
    items: [
      { name: "Add TCS on invoices", basic: true, premium: true },
      {
        name: "Keep different rates for each party",
        basic: true,
        premium: true,
      },
      { name: "Create Multiple Firms", basic: "3 Firms", premium: "5 Firms" },
      { name: "Check Profit on Invoices", basic: true, premium: true },
      {
        name: "Add Expenses with input tax credit",
        basic: true,
        premium: true,
      },
      { name: "Add additional fields to items", basic: true, premium: true },
      { name: "Send transaction message to self", basic: true, premium: true },
      {
        name: "Send message on updating any transaction",
        basic: true,
        premium: true,
      },
      { name: "Add TDS on invoices", basic: true, premium: true },
      { name: "Service reminders", basic: true, premium: true },
      { name: "Add Custom Fields for Items", basic: true, premium: true },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};
const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const PricingComponent = () => {
  const [selectedPlan, setSelectedPlan] = useState(planOptions[0]);
  const [selectedDuration, setSelectedDuration] = useState(durationOptions[0]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  return (
    <section
      id="pricing-section"
      className="py-16 px-4 bg-gradient-to-b from-[var(--background-section-gray)] to-white"
    >
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={containerVariants}>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Plans & Pricing
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </motion.div>

        {/* Selectors */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12"
          variants={containerVariants}
        >
          {[
            { value: selectedPlan, set: setSelectedPlan, options: planOptions },
            {
              value: selectedDuration,
              set: setSelectedDuration,
              options: durationOptions,
            },
          ].map(({ value, set, options }, idx) => (
            <div key={idx} className="relative">
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="appearance-none bg-white border border-border-color rounded-xl px-6 py-3 pr-12 text-[var(--text-primary)] font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]/20"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5 pointer-events-none" />
            </div>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
          variants={containerVariants}
        >
          {pricingData.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover="hover"
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                plan.isPopular
                  ? "border-[var(--primary-red)] shadow-xl"
                  : "border-[var(--border-color)]"
              }`}
            >
              {plan.isPopular && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <span className="bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-dark-red)] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </motion.div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">{plan.icon}</span>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                    {plan.name}
                  </h3>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[var(--text-secondary)] text-lg line-through">
                      ₹{plan.originalPrice}
                    </span>
                    <span className="text-3xl font-bold text-[var(--text-primary)]">
                      ₹{plan.discountedPrice}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Only ₹{plan.monthlyPrice} per month
                  </p>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 mb-8 ${
                    plan.isPopular
                      ? "bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-dark-red)] text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-[var(--primary-red)] text-[var(--primary-red)] hover:bg-[var(--primary-red)] hover:text-white"
                  }`}
                >
                  Get Vyapar {plan.name}
                </motion.button>

                {/* Features Preview */}
                <div className="space-y-4">
                  {features[0].items.slice(0, 6).map((item, idx) => (
                    <motion.div
                      key={item.name}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between group border-b border-[var(--border-color)] pb-2"
                    >
                      <div className="flex items-center text-[var(--text-primary)] font-medium">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        {item.name}
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] font-medium">
                        {plan.id === "silver" ? item.basic : item.premium}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compare Features Toggle */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-[var(--primary-red)] hover:text-[var(--primary-dark-red)] font-semibold transition-colors duration-300"
          >
            {showAllFeatures ? "Hide Features" : "Compare All Features"}
            <motion.div
              animate={{ rotate: showAllFeatures ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Feature Comparison */}
        <AnimatePresence>
          {showAllFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 bg-white rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
                  Feature Comparison
                </h3>

                {features.map((category, i) => (
                  <div key={i} className="mb-8">
                    <h4 className="text-xl font-semibold text-[var(--primary-red)] mb-4">
                      {category.category}
                    </h4>
                    <div className="space-y-3">
                      {category.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="grid grid-cols-3 gap-4 items-center border-b border-[var(--border-color)] pb-2"
                        >
                          <div className="flex items-center text-[var(--text-primary)] font-medium">
                            {item.name}
                            {item.tooltip && (
                              <Info className="w-4 h-4 ml-2 text-[var(--text-secondary)]" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 justify-center">
                            {item.basic === true ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : item.basic === false ? (
                              <X className="w-4 h-4 text-red-400" />
                            ) : (
                              <span className="text-sm">{item.basic}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 justify-center">
                            {item.premium === true ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : item.premium === false ? (
                              <X className="w-4 h-4 text-red-400" />
                            ) : (
                              <span className="text-sm">{item.premium}</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Back Button */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => {
                      setShowAllFeatures(false);
                      setTimeout(() => {
                        const section =
                          document.getElementById("pricing-section");
                        if (section) {
                          section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }, 500);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 text-[var(--primary-red)] hover:text-[var(--primary-dark-red)] font-semibold"
                  >
                    ↑ Back To Plans
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default PricingComponent;
