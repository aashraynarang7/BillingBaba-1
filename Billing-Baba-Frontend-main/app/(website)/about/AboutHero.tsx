import React from 'react';
import Image from 'next/image';

const AboutHero = () => {
  return (
    // The 'overflow-hidden' class was removed from this div to fix the positioning issue.
    <div className="relative w-full bg-white font-sans mb-20 ">
      <div className="bg-gradient-to-r from-[var(--primary-red)] to-[var(--accent-orange)] mx-auto px-6 p-12 md:rounded-br-[240px]">
        <div className="flex flex-col lg:flex-row items-center   justify-center my-5  ">
          
          {/* Left Side: Text Content */}
          <div className="lg:w-2/5 text-right lg:text-left mb-10 lg:mb-16 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 whitespace-nowrap">
              GST Billing App
            </h1>
            <button className="bg-[#FFD700] text-gray-900 font-bold py-4 px-8 md:py-5 md:px-10 text-lg md:text-xl rounded-full shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 duration-300">
              Download For Desktop
            </button>
          </div>
          
          {/* Right Side: Single Image */}
          <div className="relative w-full lg:w-3/5 flex items-center justify-center">
            <Image
              src="/About/mobile-head-img.webp"
              alt="Vyapar GST Billing Software on a laptop with floating icons"
              width={400} // Intrinsic width of the image
              height={400} // Intrinsic height of the image
              // These classes position the image correctly on top of the red background
              className="md:absolute md:-top-20 z-20 h-auto drop-shadow-2xl"
              priority 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutHero;