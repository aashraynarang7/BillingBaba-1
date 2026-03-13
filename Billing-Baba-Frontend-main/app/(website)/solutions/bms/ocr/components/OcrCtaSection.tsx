// Example file path: src/components/ocr-page/OcrCtaSection.tsx

import React from "react";
import Link from "next/link";
import { DownloadCloud } from "lucide-react";

const OcrCtaSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 py-16 md:py-20">
      <div className="container mx-auto px-4 text-center text-white">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Transform Your Business Documentation?
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          Join thousands of businesses saving time and reducing errors with
          Vyapar's OCR technology.
        </p>

        {/* Call to Action Button */}
        <div className="mt-8">
          <Link href="/download-ocr-scanner">
            <button className="bg-white text-primary-red font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 duration-300">
              <span className="flex items-center gap-2">
                <DownloadCloud size={20} />
                Download OCR Scanner
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OcrCtaSection;
