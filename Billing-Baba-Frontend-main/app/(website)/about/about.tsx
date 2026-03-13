import RatingSection from "@/components/website/rating-section";
import AboutHero from "./AboutHero";
import AccountingSoftwareSection from "./AccountingSoftwareSection";
import AppInfoSection from "./AppInfoSection";
import BusinessInfoSection from "./BusinessInfoSection";
import EffortlessBusinessSection from "./EffortlessBusinessSection";
import RecognitionSection from "./RecognitionSection";
import TechnologySection from "./TechnologySection";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <AboutHero />

                    {/* Core Sections */}
                    <AccountingSoftwareSection />
                    <TechnologySection />
                    <BusinessInfoSection />
                    <AppInfoSection />
                    <EffortlessBusinessSection />
                    <RecognitionSection />

                    {/* Ratings / Testimonials */}
                    <RatingSection />
                </div>
            </div>
        </div>
    );
}
