import React from "react"

const featuresData = [
  {
    iconSrc: "/Desktop/Manage1.webp",
    title: "Offline Billing Capability",
    description: (
      <>
        By enabling offline billing, Vyapar enables companies to{" "}
        <a href="#" className="text-[var(--text-link-active)] hover:underline">
          generate invoices
        </a>{" "}
        without internet access and synchronise them later with ease.
      </>
    ),
  },
  {
    iconSrc: "/Desktop/Manage2.webp",
    title: "Estimate & Quotation Generation",
    description: "Before you make a final billing, Vyapar enables companies to quickly generate and share estimates and quotations.",
  },
  {
    iconSrc: "/Desktop/Manage3.png",
    title: "E-Invoicing & E-Way Bill",
    description: (
      <>
        Creates GST-compliant{" "}
        <a href="#" className="text-[var(--text-link-active)] hover:underline">
          e-invoices
        </a>{" "}
        and e-way bills to guarantee error-free tax filing and transportation.
      </>
    ),
  },
  {
    iconSrc: "/Desktop/Manage4.png",
    title: "Multi-User Access",
    description: "Allows you to give more users role-based access so they can effectively manage reports, inventory, and billing.",
  },
  {
    iconSrc: "/Desktop/Manage5.webp",
    title: "OCR Scanner",
    description: (
      <>
        With{" "}
        <a href="#" className="text-[var(--text-link-active)] hover:underline">
          OCR tool
        </a>
        , save time and effort by quickly scanning and extracting text from documents, such as bills and receipts.
      </>
    ),
  },
  {
    iconSrc: "/Desktop/Manage6.png",
    title: "Loyalty Points & Discounts",
    description: "Offer loyalty points and discounts for regular customers to encourage them to do more business.",
  },
]

export default function ManagementFeatures() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          Easy Management of All Billing Operations on Your Computer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-[var(--background-feature-card)] p-8 rounded-2xl text-center space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-center mb-2">
                <img src={feature.iconSrc} alt={`${feature.title} icon`} className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{feature.title}</h3>
              <p className="text-sm text-[var(--text-foreground)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}