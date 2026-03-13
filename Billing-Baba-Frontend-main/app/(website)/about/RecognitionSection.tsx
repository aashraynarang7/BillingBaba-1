import React from 'react';
import Image from 'next/image';

const RecognitionSection = () => {
  return (
    // A top margin (mt-20) is added to the parent section to create space for the image that overflows its container.
    <section className="font-sans relative mt-20 py-16">
      <div className="container mx-auto max-w-7xl px-6">
        {/* The gradient container is set to 'relative' to serve as the positioning context for the absolutely positioned image inside it. */}
        <div className="relative bg-gradient-to-r from-[var(--primary-red)] to-[var(--accent-orange)] rounded-3xl">
          <div className="flex flex-col lg:flex-row items-center justify-between p-12 md:p-16 min-h-[24rem]">
            
            {/* Left Column: Text and Button */}
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <div className="space-y-6 text-white text-xl leading-relaxed">
                <p className='text-white'>
                  We're thrilled that <strong className="font-semibold">Billing Baba</strong> has been recognized by Indian Businessmen who have taken it up and made it a success as a result of which we're running towards 10 Million installs on play store.
                </p>
                <p className='text-white'>
                  We hope "Billing Baba App" continues to ease the life of our Indian businessmen.
                </p>
              </div>

              {/* Download Button */}
              <button className="mt-10 bg-[#FFD700] text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 duration-300">
                <div className="flex items-center gap-3">
                  <span>Download for Desktop</span>
                  {/* Download Icon */}
                  <span className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </div>
              </button>
            </div>

            {/* Right Column (Desktop): Absolutely positioned image */}
            {/* This div is hidden on mobile and tablet. It contains the image that overflows the container on large screens. */}
            <div className="w-full lg:w-1/2 h-full hidden lg:block">
              <Image
                src="/About/aboutus-banner.png"
                alt="Billing Baba App Logo"
                width={400} // Adjust width as per your image's aspect ratio
                height={500} // Adjust height as per your image's aspect ratio
                // These classes make the image overflow its parent container on large screens
                className="absolute lg:-top-24 lg:right-16 drop-shadow-2xl"
                priority // Preloads the image as it's likely important
              />
            </div>

            {/* Image for Mobile/Tablet View */}
            {/* This div is only visible on mobile/tablet and stacks normally below the text content. */}
            <div className="block lg:hidden mt-12">
               <Image
                src="/About/aboutus-banner.png"
                alt="Billing Baba App Logo"
                width={300} // A smaller size for mobile view
                height={375}
                className="drop-shadow-2xl"
                priority
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RecognitionSection;