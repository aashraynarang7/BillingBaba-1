import AdditionalFeatures from "@/components/website/clothing/AdditionalFeatures";
import CustomizeBilling from "@/components/website/clothing/CustomizeBilling";
import DiscountManagement from "@/components/website/clothing/DiscountManagement";
import GarmentSoftwareHero from "@/components/website/clothing/garmentSoftwareHero";
import OrderManagement from "@/components/website/clothing/OrderManagement";
import PricingManagement from "@/components/website/clothing/PricingManagement";
import ProductFeaturesSection from "@/components/website/clothing/ProductFeaturesSection";
import VideoPlayer from "@/components/website/clothing/VideoPlayer";
import FinalSaleBanner from "@/components/website/final-sale-banner";

export default function DesktopPage() {
    return (
        <main className="min-h-screen">
            <FinalSaleBanner />
            <GarmentSoftwareHero />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CustomizeBilling />
                <OrderManagement />
                <PricingManagement />
                <DiscountManagement />
            </div>
            <AdditionalFeatures />
            <ProductFeaturesSection />
            <VideoPlayer
                title="How to Setup Cloth & Garment Business on Vyapar App"
                youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with your actual video URL
            />
        </main>
    )
}