import { Button } from "@/components/ui/button"
import React from "react"

const comparisonData = [
  { feature: "Price", basic: "Free", vyapar: "Free" },
  { feature: "Custom Invoicing", basic: true, vyapar: true },
  { feature: "Professional Invoices Themes", basic: false, vyapar: true },
  { feature: "Barcode Scanning", basic: false, vyapar: true },
  { feature: "GST Calculations & Reports", basic: true, vyapar: true },
  { feature: "Multi Payment Modes", basic: true, vyapar: true },
  { feature: "Payment Tracking & Reminders", basic: false, vyapar: true },
  { feature: "Client Management", basic: false, vyapar: true },
  { feature: "Accounting Integration", basic: false, vyapar: true },
  { feature: "Inventory Tracking", basic: false, vyapar: true },
  { feature: "Multi-Device Access", basic: false, vyapar: true },
  { feature: "Expense Tracking", basic: false, vyapar: true },
  { feature: "Real-Time Business Reports", basic: false, vyapar: true },
  { feature: "Data Security & Backup", basic: false, vyapar: true },
]

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#4CAF50" />
    <path d="M7 12.5L10.5 16L17.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CrossIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F44336" />
    <path d="M9 15L15 9M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const StatusCell = ({ value, isVyapar = false }: { value: string | boolean; isVyapar?: boolean }) => {
  if (value === true) return <CheckIcon />
  if (value === false) return <CrossIcon />
  if (value === "Free" && isVyapar) {
    return <span className="font-semibold text-[var(--accent-orange)]">{value}</span>
  }
  return <span className="font-semibold text-[var(--text-secondary)]">{value}</span>
}

export default function FeatureComparison() {
  return (
    <section className="bg-[var(--background-comparison-section)] py-16 md:py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          Why Vyapar is the Right Choice for Your Business?
        </h2>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-red-100">
          <div className="grid grid-cols-[3fr_2fr_2fr] gap-x-4">
            <div className="pb-4 px-2">
              <h3 className="font-bold text-[var(--text-primary)] text-lg">Features</h3>
            </div>
            <div className="pb-4 px-2 text-center">
              <h3 className="font-bold text-[var(--text-primary)] text-lg">Basic Billing Software</h3>
            </div>
            <div className="pb-4 px-2 text-center border-l-2 border-[var(--primary-red)]">
              <div className="flex flex-col items-center space-y-2">
                <img src="/Logo1.png" alt="Vyapar Logo" className="h-8 w-auto" />
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Billing Software</h3>
              </div>
            </div>

            {comparisonData.map((item, index) => (
              <React.Fragment key={index}>
                <div className="py-4 px-2 border-t border-red-100 text-[var(--text-foreground)] flex items-center">
                  {item.feature}
                </div>
                <div className="py-4 px-2 border-t border-red-100 flex justify-center items-center">
                  <StatusCell value={item.basic} />
                </div>
                <div className="py-4 px-2 border-t border-l-2 border-[var(--primary-red)] flex justify-center items-center">
                  <StatusCell value={item.vyapar} isVyapar={true} />
                </div>
              </React.Fragment>
            ))}

            <div className="pt-4 border-t border-red-100 col-start-3 col-span-1">
              <div className="border-l-2 border-[var(--primary-red)] h-full flex items-center justify-center px-4">
                <Button className="w-full bg-[var(--primary-red)] hover:bg-[var(--primary-dark-red)] text-white font-semibold py-3 px-4 rounded-lg text-sm">
                  Download Vyapar Now!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}