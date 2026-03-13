"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const heroBackgroundImage = "/Desktop/Hero.png"

export default function DesktopHeroSection() {
  return (
    <section
      className="relative flex items-center justify-center bg-contain bg-center text-center min-h-[400px] md:min-h-[400px] lg:min-h-screen"
      style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      
      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d3748] text-balance leading-tight">
              Billing Software for PC
            </h1>
            <p className="text-lg text-[#4a5568] max-w-2xl mx-auto">
              Create professional invoices in seconds, track income & expenses
              easily, and stay organized! Download Vyapar Now & Experience
              Faster Billing on PC with a Free Trial!
            </p>
          </div>

          <div>
            <Button
              size="lg"
              className="bg-[#ED516B] text-white hover:bg-[#D94660] text-base font-semibold px-8 py-3 h-auto rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Download Vyapar Now!
              <Download className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}