// Example file path: src/components/ocr-page/ReviewColumnsSection.tsx

import React from "react";
import Image from "next/image";

const ReviewColumnsSection: React.FC = () => {
  return (
    <section className="bg-background-light py-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-b-4 border-primary-red">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                Experience the Speed and Accuracy
              </h2>
              <p className="text-lg text-text-secondary">
                No more manual data entry or typos. Vyapar OCR automatically
                extracts data from your documents with 99.9% accuracy.
              </p>
            </div>

            {/* Right Column: Image with Glow Effect */}
            <div className="relative flex items-center justify-center p-4">
              {/* Soft Glow Background */}
              <div className="absolute inset-0 bg-yellow-300/20 blur-3xl rounded-full"></div>

              {/* Main Image */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://staging.vyaparapp.in/v/z/wp-content/uploads/2025/04/ocr.gif"
                  alt="Review Columns software interface"
                  width={1024}
                  height={476}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewColumnsSection;
