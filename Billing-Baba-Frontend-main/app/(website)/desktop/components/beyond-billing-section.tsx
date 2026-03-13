import React from "react"

const featuresData = [
  {
    iconSrc: "/Desktop/Section13.webp",
    iconBgColor: "var(--icon-bg-1)",
    title: "Best Accounting Management",
    description: (
      <>
        By automating expense tracking, producing financial reports, controlling GST, and streamlining cash flow, Vyapar provides the{" "}
        <a href="#" className="text-[var(--text-link-active)] hover:underline">best accounting management</a>
        , assisting businesses in maintaining compliance and financial organisation.
      </>
    ),
  },
  {
    iconSrc: "/Desktop/Section13-1.webp",
    iconBgColor: "var(--icon-bg-2)",
    title: "Track Your Stock Easily",
    description: "Your inventory and billing are directly connected with Vyapar. Your stock levels are automatically updated each time you create an invoice. This implies that you are aware of your best-selling items in real-time and receive low-stock alerts.",
  },
  {
    iconSrc: "/Desktop/Section13-2.webp",
    iconBgColor: "var(--icon-bg-3)",
    title: "Your Business Command Center",
    description: "Billing manages incoming funds, but understanding outgoing funds is the key to real financial clarity. Every business expense, from minor chai bills to significant supplier payments, can be tracked with Vyapar.",
  },
  {
    iconSrc: "/Desktop/Section13-3.webp",
    iconBgColor: "var(--icon-bg-4)",
    title: "Check Business Health in Real Time",
    description: "Consider the Vyapar desktop app as your business dashboard rather than just another application just to generating an invoice. You can quickly view your bank balances, cash-on-hand, total sales, and expenses.",
  },
  {
    iconSrc: "/Desktop/Section13-4.webp",
    iconBgColor: "var(--icon-bg-5)",
    title: "Manage Your Business Relationship",
    description: "You can manage all of your “parties” in one location with Vyapar, including suppliers and customers. To make sure nothing ever gets lost, you can view the entire transaction history, keep track of who owes you money, and see what you owe other people.",
  },
  {
    iconSrc: "/Desktop/Section13-5.webp",
    iconBgColor: "var(--icon-bg-6)",
    title: "Do Smart Marketing",
    description: "By sending festive greetings, customised offers, and targeted campaigns via Smart Ad Connect on WhatsApp, Vyapar's marketing tool helps businesses increase sales and improve customer engagement.",
  },
];

export default function BeyondBillingSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--background-beyond-billing)]">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          How Vyapar Desktop App More than Just Billing?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl text-center space-y-4 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="mx-auto h-20 w-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: feature.iconBgColor }}
              >
                <img src={feature.iconSrc} alt={`${feature.title} icon`} className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] pt-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-foreground)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}