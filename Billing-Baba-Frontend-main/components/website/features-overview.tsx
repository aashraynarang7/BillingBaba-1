"use client"

import React, { useState } from "react"

const featuresData = [
  {
    title: "Create GST Bills for customers and share them online",
    shortDescription:
      "Billing Baba billing software allows you to generate GST invoices for clients and share them digitally. This tool aids in establishing a...",
    imageSrc: "/Home/feature.webp",
    imageAlt: "Laptop showing invoice creation with sharing options",
    longDescription: [
      "Billing Baba billing software allows you to generate GST invoices for clients and share them digitally. This tool aids in establishing a professional brand image with its essential GST billing functionalities. You can utilize the Billing Baba accounting and billing app to draft invoices, ensuring adherence to Goods and Services Tax regulations in India.",
      "The Billing Baba app minimizes accounting mistakes and safeguards your business data. With just a few simple steps, you can create GST invoices using the app’s templates. Additionally, the Billing Baba app can be accessed both online and offline, making it convenient for small and medium enterprises to follow optimal accounting practices and streamline their bookkeeping processes.",
      "Using our user-friendly invoicing software to comply with GST norms. Billing Baba billing software comes with variety of useful billing solutions. You can create invoices for your customers in few steps. Further, you can share them with customers using WhatsApp, email, or print methods. You can print them use your printer in A4, A5, 2, and 3 inches variations.",
      "Unlike most accounting softwares, Billing Baba enables you to create invoices within minutes. The best part is that you won’t require hours of rigorous training as it is an easy process. In the app, you can choose from 10+ professional GST invoice formats and billing formats to create professional and unique bills. (It includes the design based on tally accounting software).",
      "Billing Baba is the free invoicing software. It comes with various useful billing and accounting features. Using the app makes business management hassle-free for SMEs. With completely customised GST-compliant invoices, your business can stand out among competitors.",
      "The best billing software makes the billing process easier for business owners. To do so, Billing Baba comes with a dedicated billing & inventory Android app along with Windows software. The basic features required for everyday accounting are free for Android mobile users. A business owners only have to pay for premium features as a yearly subscription.",
      "Numerous useful features are available in Windows desktop software. Every business can access them during the free trial. So, every business can try out the features before purchasing the subscription. It helps SMEs understand how the app benefits them before paying.",
    ],
  },
  {
    title: "Manage Inventory Seamlessly",
    shortDescription:
      "Billing Baba brings the finest inventory management software with incredibly effective features. It helps improve business...",
    imageSrc: "/Home/feature1.webp",
    imageAlt: "Inventory management interface with product listings and boxes",
    longDescription: [
      "Detailed content about inventory management will be displayed here once it is available.",
    ],
  },
  {
    title: "Send Payment Reminders to Recover Dues",
    shortDescription:
      "Billing Baba's accounting and billing software assists small and medium-sized enterprises (SMEs) in securing prompt payments...",
    imageSrc: "/Home/feature2.webp",
    imageAlt: "Payment reminder notification on a mobile device",
    longDescription: [
      "Detailed content about payment reminders will be displayed here once it is available.",
    ],
  },
  {
    title: "GST filing made simpler and faster",
    shortDescription:
      "Filing GST can be a daunting task for entrepreneurs, often requiring a lengthy manual process. However, with Billing Baba billing...",
    imageSrc: "/Home/feature3.webp",
    imageAlt: "GST filing interface with tax forms and a calculator",
    longDescription: [
      "Detailed content about GST filing features will be displayed here once it is available.",
    ],
  },
]

interface FeatureSectionProps {
  feature: (typeof featuresData)[0]
  imagePosition: "left" | "right"
}

function FeatureSection({ feature, imagePosition }: FeatureSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded)
  }

  const imageBlock = (
    <div className={imagePosition === "left" ? "lg:order-1" : "lg:order-2"}>
      <img src={feature.imageSrc} alt={feature.imageAlt} className="w-full h-auto" />
    </div>
  )

  const textBlock = (
    <div className={`space-y-6 ${imagePosition === "left" ? "lg:order-2" : "lg:order-1"}`}>
      <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
        {feature.title}
      </h2>
      <p className="text-lg text-foreground max-w-lg">{feature.shortDescription}</p>

      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {feature.longDescription.map((paragraph, index) => (
            <p key={index} className="text-lg text-foreground max-w-lg">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {feature.longDescription && feature.longDescription.length > 0 && (
        <button onClick={toggleReadMore} className="text-destructive font-semibold hover:underline">
          {isExpanded ? "- Read less" : "+ Read more"}
        </button>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {imageBlock}
      {textBlock}
    </div>
  )
}

export default function FeaturesOverview() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container space-y-20 md:space-y-28">
        {featuresData.map((feature, index) => (
          <FeatureSection key={index} feature={feature} imagePosition={index % 2 === 0 ? "left" : "right"} />
        ))}
      </div>
    </section>
  )
}