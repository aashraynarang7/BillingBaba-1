"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Which is the best software for billing?",
    answer: [
      "Billing Baba app is the best billing software available for SMEs in India. The Billing Baba app provides access to a range of useful features. They can make the business management process seamless for business owners.",
      "Using our billing tool, you can save a lot of time and effort required in creating GST invoices. You can use automation tools, managing inventory using tracking features. Further, you can create reports using stored data, and much more.",
    ],
  },
  {
    question: "What is billing software?",
    answer: [
      "Billing software is a tool that automates the process of creating and sending invoices to customers. It helps businesses track payments, manage customer data, and generate financial reports, streamlining the entire billing cycle.",
    ],
  },
  {
    question: "How much does a billing software cost?",
    answer: [
      "The cost of billing software can vary widely. Billing Baba offers a lifetime free plan for basic usage on Android mobile devices. For more advanced features and desktop access, we have affordable yearly subscription plans designed to provide maximum value for small and medium businesses.",
    ],
  },
  {
    question: "Is my business data secure with Billing Baba?",
    answer: [
      "Absolutely. Data security is our highest priority. We utilize bank-level encryption and provide automatic cloud backup options to ensure your business information is always safe, secure, and accessible only to you.",
    ],
  },
  {
    question: "Can I generate GST-compliant invoices?",
    answer: [
      "Yes, Billing Baba allows you to create fully GST-compliant invoices that meet government standards. You can easily include GST, HSN codes, SAC codes, and other tax details in your invoices.",
    ],
  },
  {
    question: "Does Billing Baba work offline?",
    answer: [
      "Yes, Billing Baba supports offline billing. You can create invoices without an internet connection, and the data will automatically sync when you go online.",
    ],
  },
  {
    question: "Can I manage inventory with Billing Baba?",
    answer: [
      "Absolutely. Billing Baba provides complete inventory management, including stock tracking, low-stock alerts, purchase management, and automatic stock updates with every sale.",
    ],
  },
  {
    question: "Is Billing Baba available for desktop and mobile?",
    answer: [
      "Yes, Billing Baba is available on Android, iOS, and desktop platforms. This ensures you can manage your business anytime, anywhere, with seamless synchronization across devices.",
    ],
  },
  {
    question: "Do you provide customer support?",
    answer: [
      "Yes, we offer dedicated customer support through chat, email, and phone. Our support team is always available to help you resolve issues quickly and effectively.",
    ],
  },
  {
    question: "Can I export reports and data?",
    answer: [
      "Yes, Billing Baba allows you to export sales reports, GST reports, and customer data in Excel and PDF formats. This makes it easy to analyze your business performance and file taxes.",
    ],
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-8 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-background border rounded-xl transition-all duration-300 ${
                openIndex === index
                  ? "border-primary/50 shadow-lg"
                  : "border-border hover:border-border/80"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="text-lg font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "transform rotate-180 text-destructive" : "text-muted-destructive"
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0 space-y-4">
                    {faq.answer.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}