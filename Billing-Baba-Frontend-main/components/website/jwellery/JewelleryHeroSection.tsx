// Example file path: src/components/jewellery-page/JewelleryHeroSection.tsx

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const JewelleryHeroSection: React.FC = () => {
  return (
    <section className="relative bg-white pt-12 md:pt-20 pb-20 md:pb-28 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://vyaparapp.in/v/z/wp-content/uploads/2024/12/Hero-Img_Hero-Accounting-Software-For-Growing-Business_Hero-Accounting-Software-For-Growing-Business-1-2048x1367.webp" // The jewellery background image
          alt="Jewellery background"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-pink-50/80 to-pink-50/70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center lg:justify-start text-sm text-text-secondary">
              <Link href="/" className="hover:text-text-primary">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href="/free" className="hover:text-text-primary">
                Free
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link
                href="/retail-shop-billing-software"
                className="hover:text-text-primary"
              >
                Retail Shop Billing Software
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-text-primary font-medium">
                Jewellery Shop
              </span>
            </nav>

            {/* Main Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight">
                All-In-One Jewellery Billing Software
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto lg:mx-0">
                Vyapar’s Jewellery Billing Software is built for jewellers.
                Manage making & labour charges, gold rates, GST billing, and
                payments easily. Works offline too. Simplify your store’s
                operations and boost growth effortlessly!
              </p>
              <Link href="/download-jewellery-software">
                <button className="mt-8 bg-primary-red text-white font-bold text-lg px-8 py-4 rounded-full shadow-md hover:bg-primary-dark-red transition-transform hover:scale-105 duration-300">
                  Download Jewellery Software
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Software Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-full min-h-[400px]">
              <Image
                src="https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Image-01-1-1024x582.webp"
                alt="Jewellery Billing Software Interface"
                width={1024}
                height={582}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-[120%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelleryHeroSection;
