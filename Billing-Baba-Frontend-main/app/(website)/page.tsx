"use client";

import HeroSection from "@/components/website/hero-section"
import SocialProof from "@/components/website/social-proof"
import FeaturesOverview from "@/components/website/features-overview"
import HowItWorks from "@/components/website/how-it-works"
import Testimonials from "@/components/website/testimonials"
import PricingSnippet from "@/components/website/pricing-snippet"
import FinalCTA from "@/components/website/final-cta"
import FAQ from "@/components/website/faq"
import BenefitsSection from "@/components/website/benefits-section" 
import RatingSection from "@/components/website/rating-section"
import FinalSaleBanner from "@/components/website/final-sale-banner"
import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/login')
  // return (
  //   <main className="min-h-screen">
  //     <FinalSaleBanner/>
  //     <HeroSection />
  //     <SocialProof />
  //     <FeaturesOverview />
  //     <HowItWorks />
  //      <BenefitsSection />
  //     <Testimonials />
      {/* <PricingSnippet />
      <FinalCTA /> */}
  //     <FAQ />
  //     <RatingSection/>

  //   </main>
  // )
}
