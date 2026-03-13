import RatingSection from "@/components/website/rating-section"
import BeyondBillingSection from "./components/beyond-billing-section"
import DesktopFAQ from "./components/desktop-faq"
import DesktopFeaturesTabs from "./components/desktop-features-tabs"
import DesktopHeroSection from "./components/desktop-hero-section"
import DesktopTestimonials from "./components/desktop-testimonials"
import FeatureComparison from "./components/feature-comparison"
import HowItWorksSection from "./components/how-it-works-section"
import IndustrySolutions from "./components/industry-solutions"
import ManagementFeatures from "./components/management-features"
import OfflineBilling from "./components/offline-billing"
import PowerhouseFeatures from "./components/powerhouse-features"
import PreHeaderCTA from "./components/pre-header-cta"
import SocialProof from "./components/social-proof"
import VideoDemoSection from "./components/video-demo-section"
import FinalSaleBanner from "@/components/website/final-sale-banner"
export default function DesktopPage() {
    return (
        <main className="min-h-screen">
            <FinalSaleBanner/>
            <DesktopHeroSection />
            <SocialProof/>
            <FeatureComparison/>
            <DesktopFeaturesTabs/>
            <ManagementFeatures/>
            <DesktopTestimonials/>
            <HowItWorksSection/>
            <VideoDemoSection/>
            <PowerhouseFeatures/>
            <PreHeaderCTA/>
            <IndustrySolutions/>
            <OfflineBilling/>
            <BeyondBillingSection/>
            <DesktopFAQ/>
            <RatingSection/>
        </main>
    )
}