"use client"

import React, { useState } from "react"
import { Tag, LineChart, Repeat, Wifi, CreditCard, DatabaseBackup, Award, Package, ChevronDown } from "lucide-react"

const benefitsData = [
  {
    icon: <Tag className="h-6 w-6" />,
    title: "Lifetime free basic usage",
    short: "Using our free GST accounting and billing software, you can seamlessly create custom invoices. Further, you can manage your dashboard and track inventory items...",
    long: "We have kept all essential features of our computerized accounting tool accessible for free. The free features are available for lifetime for Android mobile users. Our aim behind free access is to include millions of small business owners in the digital economy. Lifetime free access to mobile devices makes our invoicing tool the best fit for their needs.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Track your business status",
    short: "Billing Baba business dashboard makes the entire management process seamless. You can check business cash flow, inventory status, open orders...",
    long: "With free GST billing software and invoicing tools, you can manage your business using mobile. Accounting in your business becomes quite simple and efficient with this free software. As all data gets stored during invoicing, you can rely on the app to get business updates in one place.",
  },
  {
    icon: <Repeat className="h-6 w-6" />,
    title: "Manage cashflow seamlessly",
    short: "GST billing & accounting software allows businesses to record transactions. It helps track payments. Over 1 crore businesses have tried out our free billing software features...",
    long: "The billing software by Billing Baba helps automate management. It is done to prevent mistakes in accounting. By investing in this billing software, you can manage your business flow effortlessly. This all-in-one software makes managing cash transactions possible. As it comes with features like bank withdrawals and deposits.",
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    title: "Online/Offline billing",
    short: "Using our billing tool, you need not stop business operations due to weak internet connectivity. You can use the offline billing features in the app to generate bills...",
    long: "Billing Baba app helps you generate invoices for your customers without requiring you to stay online. You can rely on our app to continue your business operations without any interruptions.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Provide multiple payment options",
    short: "Your customers are less likely to default on the payments if you provide multiple payment options for convenience. You can provide choices like UPI, QR, NEFT...",
    long: "Convenience is vital for customers; the biggest comfort you can provide is allowing them to choose how they pay you. Using the Billing Baba invoicing app, you can create invoices that include multiple payment options.",
  },
  {
    icon: <DatabaseBackup className="h-6 w-6" />,
    title: "Keep data safe with backups",
    short: "Using our free GST software for billing in India, you can set up an automatic data backup, allowing you to safeguard the data stored in the app...",
    long: "Keeping data safe is the utmost priority of any business today, as data is the backbone of a business. You can generate reports and analyse the sales information for future growth prospects using your sales data. For additional safety, you can create a local backup too.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Build a positive brand image",
    short: "Providing professional quotes and estimates during negotiation builds a positive brand image. Further, you can provide complete disclosure about the deal...",
    long: "Billing Baba GST billing software helps build a professional brand for you. A professionally built custom invoice helps build trust and makes your business stand out among competitors.",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Plan your inventory space",
    short: "Using our GST billing software, you can keep track of available items in your store. It can help you set up low inventory alerts to place advance orders...",
    long: "Inventory management is crucial for businesses with a wide variety of items, and our free billing software helps in managing it seamlessly. You can detect possible theft in your store by keeping track of your inventory.",
  },
]

interface BenefitItemProps {
  item: (typeof benefitsData)[0]
}

function BenefitItem({ item }: BenefitItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <div className="flex items-start space-x-5">
        <div className="flex-shrink-0 mt-1 p-3 bg-primary/10 rounded-full">
          <span className="text-destructive">{item.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">{item.short}</p>
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-muted-foreground leading-relaxed">{item.long}</p>
        </div>
      </div>

      <hr className="mt-4 border-border/60" />
      <div className="flex justify-end mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-destructive font-semibold group"
        >
          <span>{isExpanded ? "Read less" : "Read more"}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  )
}

export default function BenefitsSection() {
  const leftColumnBenefits = benefitsData.slice(0, 4)
  const rightColumnBenefits = benefitsData.slice(4, 8)

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Benefits of GST Billing Software</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-1 space-y-10">
            {leftColumnBenefits.map((item, index) => (
              <BenefitItem key={index} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1 hidden lg:flex items-center justify-center px-8">
            <img
              src="/Home/Benefit.webp"
              alt="Billing Baba App on Mobile Phones"
              className="max-w-full h-auto drop-shadow-2xl"
            />
          </div>

          <div className="lg:col-span-1 space-y-10">
            {rightColumnBenefits.map((item, index) => (
              <BenefitItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}