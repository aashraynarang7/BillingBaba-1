"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  DollarSign,
  Headphones,
  TrendingUp,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const PartnerWithUs = () => {
  const [activeRegion, setActiveRegion] = useState("North");
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [clients, setClients] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(5000);
  const [annualEarnings, setAnnualEarnings] = useState(60000);

  const regions = ["North", "South", "West", "East"];

  const successStories = {
    North: [
      {
        name: "Rajesh Kumar",
        location: "Delhi",
        story:
          "Vyapar helped me take my retail business online and doubled my sales within 6 months with their comprehensive suite of accounting tools.",
        earning: "₹3.5 Lakh/month",
      },
      {
        name: "Neha Singh",
        location: "Jaipur",
        story:
          "Becoming a Vyapar partner has been life-changing. I now earn a steady ₹1.5 Lakh every month by referring businesses.",
        earning: "₹1.5 Lakh/month",
      },
    ],
    South: [
      {
        name: "Priya Nair",
        location: "Bangalore",
        story:
          "As a tech startup founder, Vyapar's advanced features helped streamline our financial operations and focus on growth.",
        earning: "₹5.2 Lakh/month",
      },
      {
        name: "Arun Kumar",
        location: "Chennai",
        story:
          "Vyapar’s partner program gave me the flexibility to work with multiple clients while earning great commissions.",
        earning: "₹2.8 Lakh/month",
      },
    ],
    West: [
      {
        name: "Amit Patel",
        location: "Mumbai",
        story:
          "Vyapar has truly transformed my manufacturing business. I can now track inventory and manage finances efficiently.",
        earning: "₹4.8 Lakh/month",
      },
      {
        name: "Pooja Mehta",
        location: "Ahmedabad",
        story:
          "With Vyapar, I’ve built strong client relationships and significantly increased my income as a business consultant.",
        earning: "₹2.2 Lakh/month",
      },
    ],
    East: [
      {
        name: "Sourav Ghosh",
        location: "Kolkata",
        story:
          "The partnership program has been incredible. I've helped 200+ businesses digitize and earned substantial commissions.",
        earning: "₹3.2 Lakh/month",
      },
      {
        name: "Ankita Das",
        location: "Guwahati",
        story:
          "Vyapar gave me the perfect opportunity to expand my financial services and support local businesses.",
        earning: "₹1.9 Lakh/month",
      },
    ],
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Recurring Income",
      description:
        "Earn consistent monthly revenue through successful referrals, creating a stable revenue stream from your network.",
    },
    {
      icon: Zap,
      title: "Fast Payout",
      description:
        "Get your commissions quickly with our streamlined payout system directly to your account.",
    },
    {
      icon: Headphones,
      title: "Extensive Support",
      description:
        "Comprehensive training & dedicated support team to help you succeed as a partner.",
    },
    {
      icon: DollarSign,
      title: "No Investment Required",
      description:
        "Start earning immediately with zero investment. No need to purchase inventory or pay any fees.",
    },
  ];

  const partnerBenefits = [
    "Dedicated dashboard to track earnings",
    "Digital marketing materials & assets",
    "Regular product training sessions",
    "Personal relationship manager",
    "Access to partner community",
    "Special incentives & bonuses",
  ];

  const faqs = [
    {
      question: "What is Vyapar Distributor Program?",
      answer:
        "The Vyapar Distributor Program allows you to earn by promoting and selling Vyapar software to businesses. You'll become a commission agent for each successful referral, creating a sustainable income stream.",
    },
    {
      question: "How much can I earn as a Vyapar distributor?",
      answer:
        "Your earnings depend on the number of successful referrals and the plans your clients choose. Top performers earn ₹50,000+ monthly through consistent referrals and building a strong client network.",
    },
    {
      question: "Do I need technical knowledge to become a distributor?",
      answer:
        "No technical expertise is required. We provide comprehensive training on Vyapar software features, sales techniques, and ongoing support to help you succeed as a partner.",
    },
    {
      question: "How do I receive payments?",
      answer:
        "Payments are processed monthly through bank transfer. You'll receive detailed commission statements and can track your earnings through our partner dashboard.",
    },
    {
      question: "Is there any investment required to join?",
      answer:
        "No investment is required to join our partner program. It's completely free to start, and you begin earning from your first successful referral.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8" variants={itemVariants}>
              <div className="space-y-6">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  variants={itemVariants}
                >
                  Become Vyapar Partner
                  <br />
                  <span className="text-[var(--primary-red)]">
                    & Earn Upto INR 2 Lakh
                  </span>
                </motion.h1>
                <motion.p
                  className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Join 2700+ successful Partners across India earning ₹20,000+
                  monthly by promoting India's most loved business accounting
                  software.
                </motion.p>
              </div>
              <motion.div variants={itemVariants}>
                <Button
                  size="lg"
                  className="bg-[var(--primary-red)] hover:bg-[var(--primary-dark-red)] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Register Now
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 border border-border-color"
              variants={itemVariants}
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-[var(--text-primary)]">
                  Become a Partner
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-[var(--primary-red)]" />
                    <span className="text-[var(--text-secondary)]">
                      Join 2700+ Partners
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-[var(--primary-red)]" />
                    <span className="text-[var(--text-secondary)]">
                      Earn up to ₹2 Lakh/month
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-[var(--primary-red)]" />
                    <span className="text-[var(--text-secondary)]">
                      Quick & Easy Setup
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-[var(--primary-red)] hover:bg-[var(--primary-dark-red)] text-white py-6 rounded-xl text-lg font-semibold">
                  Register Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Success Stories Section */}
      <motion.section
        className="py-16 bg-[var(--background-section-gray)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Section Title */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Success Stories from Across India
            </h2>
          </motion.div>

          {/* Region Tabs */}
          <motion.div
            className="flex justify-center mb-12"
            variants={itemVariants}
          >
            <div className="flex bg-white rounded-xl p-1 shadow-md overflow-x-auto">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeRegion === region
                      ? "bg-[var(--primary-red)] text-white shadow-md"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            key={activeRegion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto"
          >
            {successStories[activeRegion as keyof typeof successStories].map(
              (story, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-xl border-0 rounded-2xl transition hover:shadow-2xl"
                >
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                      {/* Left side */}
                      <div className="bg-[var(--primary-red)] text-white p-8 flex flex-col justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                          <User className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {story.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="text-white/90">
                            {story.location}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="self-start bg-white/20 text-white hover:bg-white/30"
                        >
                          {story.earning}
                        </Badge>
                      </div>

                      {/* Right side */}
                      <div className="p-8 bg-white flex items-center">
                        <blockquote className="text-[var(--text-secondary)] italic text-lg leading-relaxed">
                          “{story.story}”
                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto w-full px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Why Become a Vyapar Partner?
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-border-color hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-[var(--primary-red)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="w-8 h-8 text-[var(--primary-red)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Calculator Section */}
      <motion.section
        className="py-16 bg-[var(--background-section-gray)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto w-full px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Calculate What You Earn & Discover What You Get
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div variants={itemVariants}>
              <Card className="bg-[var(--primary-red)] text-white shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <Calculator className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Earnings Calculator</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Clients
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={clients}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setClients(value);
                            setMonthlyEarnings(value * 1200);
                            setAnnualEarnings(value * 14400);
                          }}
                          className="flex-1 accent-white"
                        />
                        <span className="text-2xl font-bold min-w-[3rem]">
                          {clients}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Monthly Earnings
                      </label>
                      <div className="text-3xl font-bold">
                        ₹{monthlyEarnings.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Annual Earnings
                      </label>
                      <div className="text-3xl font-bold">
                        ₹{annualEarnings.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-xl border-border-color">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8">
                    What You'll Get as a Vyapar Partner
                  </h3>

                  <div className="space-y-4">
                    {partnerBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span className="text-[var(--text-secondary)]">
                          {benefit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-16 bg[var(--background-faq-accent)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto w-full px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Frequently Asked Questions (FAQs)
            </h2>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-4"
            variants={containerVariants}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="shadow-md border-border-color overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setOpenFAQ(openFAQ === index ? null : index)
                      }
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-semibold text-[var(--text-primary)] pr-4">
                        {faq.question}
                      </span>
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-[var(--primary-red)] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--primary-red)] flex-shrink-0" />
                      )}
                    </button>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-[var(--primary-red)] text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto w-full px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Partnership Journey?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of successful partners and start earning with
              India's leading business software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[var(--primary-red)] hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Become a Partner
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-[var(--primary-red)] hover:bg-white hover:text-[var(--primary-red)] px-8 py-6 text-lg rounded-full font-semibold transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us: +91-8000-444-777
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PartnerWithUs;
