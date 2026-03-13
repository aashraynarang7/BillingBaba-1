// Example file path: src/components/ocr-page/OcrHeroSection.tsx

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const OcrHeroSection: React.FC = () => {
  return (
    <section className="bg-background-light py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center lg:justify-start text-sm text-text-secondary">
              <Link href="/" className="hover:text-text-primary">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-text-primary font-medium">
                OCR Scanner Software
              </span>
            </nav>

            {/* Main Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary leading-tight">
                Smart <span className="text-primary-red">OCR Scanning</span>{" "}
                Software
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-lg mx-auto lg:mx-0">
                Scan bills, receipts, and documents to auto-capture data into
                your Vyapar account. Save time, reduce errors, and boost
                productivity instantly! Try a Free trial Now!
              </p>
              <Link href="/download">
                <button className="mt-8 bg-primary-red text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md hover:bg-primary-dark-red transition-colors duration-300">
                  Download OCR Scanner
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Image Composition */}
          <div className="relative flex items-center justify-center min-h-[450px]">
            {/* Main background image container */}
            <div className="relative bg-amber-50 p-6 rounded-2xl shadow-lg w-[500px] h-auto">
              <Image
                src="https://staging.vyaparapp.in/v/z/wp-content/uploads/2025/04/hero_img.png"
                alt="OCR Scanner Software Interface"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>

            {/* Floating Invoice Image */}
            {/* <div className="absolute bottom-[-5%] right-[5%] w-[250px] transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://vyaparapp.in/v/z/wp-content/uploads/2024/07/OCR-Scanner-Software-02.webp"
                alt="Scanned Invoice"
                width={250}
                height={350}
                className="rounded-lg shadow-2xl"
              />
            </div> */}

            {/* Floating Chat Bubble
            <div className="absolute top-[10%] right-[5%] w-12 h-12 transform transition-transform duration-500 hover:scale-110">
              <Image
                src="https://vyaparapp.in/v/z/wp-content/uploads/2024/07/OCR-Scanner-Software-03.webp"
                alt="Chat Icon"
                width={48}
                height={48}
              />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OcrHeroSection;
