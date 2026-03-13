// Example file path: src/components/ios-page/PosHeroSection.tsx

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  RefreshCw,
  ClipboardList,
  BarChart3,
} from "lucide-react";

// --- Data for the Component ---

// Feature data for the right side
const features = [
  {
    icon: <RefreshCw className="h-8 w-8 text-sky-600" />,
    bgColor: "bg-sky-100",
    text: "Fast Checkout Process",
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-orange-600" />,
    bgColor: "bg-orange-100",
    text: "Inventory Sync",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-rose-600" />,
    bgColor: "bg-rose-100",
    text: "Sales Reporting",
  },
];

// "Trusted By" logos data
const trustedByLogos = [
  {
    name: "Prestige Group",
    src: "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/prestige-group.png",
    alt: "Prestige Group Logo",
  },
  {
    name: "KSRTC",
    src: "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/ksrtc.png",
    alt: "KSRTC Logo",
  },
  {
    name: "Sublime Media House",
    src: "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/sublime.png",
    alt: "Sublime Media House Logo",
  },
];

const PosHeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-white via-sky-50 to-sky-100 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center lg:justify-start text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href="/free" className="hover:text-gray-700">
                Free
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-gray-700 font-medium">
                pos-billing-software
              </span>
            </nav>

            {/* Main Content */}
            <div>
              <div className="inline-block border border-sky-500 text-sky-600 rounded-full px-4 py-1 text-sm font-semibold mb-4">
                PoS Billing Software
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
                Make a bill in <span className="text-sky-500">30 Seconds!</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">With V-PoS simplify</p>
              <Link href="/download-desktop">
                <button className="mt-8 bg-red-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-md hover:bg-red-700 transition-transform hover:scale-105 duration-300">
                  Download For Desktop
                </button>
              </Link>
            </div>

            {/* Trusted By Section */}
            <div className="pt-8">
              <h3 className="text-gray-500 font-semibold text-lg mb-4">
                Trusted By
              </h3>
              <div className="flex justify-center lg:justify-start items-center gap-8">
                {trustedByLogos.map((logo) => (
                  <img
                    key={logo.name}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 object-contain"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Image and Features */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col space-y-10">
              {features.map((feature) => (
                <div
                  key={feature.text}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`p-4 rounded-full ${feature.bgColor}`}>
                    {feature.icon}
                  </div>
                  <p className="mt-2 font-semibold text-gray-700">
                    {feature.text}
                  </p>
                  <div className="w-1/2 h-px bg-gray-300 mt-2"></div>
                </div>
              ))}
            </div>
            <div>
              <img
                src="https://vyaparapp.in/v/z/wp-content/uploads/2025/01/posbillingsoftware1.1.webp"
                alt="PoS Billing Software interface on a terminal"
                className="max-w-md w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PosHeroSection;
