import { Button } from "@/components/ui/button"
import React from "react"

export default function PreHeaderCTA() {
  return (
    <section className="bg-[var(--primary-red)]">
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-white gap-4">
          <h3 className="text-lg md:text-xl font-bold text-center sm:text-left">
            Try Free All-in-One Billing Solution for Your Business Runs on Laptop.
          </h3>
          <Button
            variant="outline"
            className="bg-white text-gray-700 hover:bg-gray-100 border-transparent font-semibold"
          >
            Install Vyapar!
          </Button>
        </div>
      </div>
    </section>
  )
}