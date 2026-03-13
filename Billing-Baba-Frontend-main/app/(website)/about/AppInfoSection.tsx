import React from 'react';
import Image from 'next/image';

const AppInfoSection = () => {
  return (
    <section className="font-sans ">
      {/* The padding has been adjusted for mobile devices. 
          It's now 4 on the sides for small screens and 10 for larger ones. */}
      <div className="bg-gradient-to-r from-[var(--primary-red)] to-[var(--accent-orange)] py-4 px-4 sm:px-10">
        {/* The padding has been adjusted for mobile devices. */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-10">
          {/* The flex-col class ensures that the items stack on top of each other on mobile. 
              The lg:flex-row class makes them go back to side-by-side on large screens. */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10">
            
            <div className="w-full lg:w-1/2">
              {/* This grid will now have 1 column on mobile and 2 on medium screens and up. 
                  The gap between grid items is also reduced on smaller screens. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 h-full">
                
                {/* The border radius has been made uniform for all screen sizes for a consistent look. */}
                <div className="bg-white rounded-[1.5rem] md:rounded-r-[0px] md:rounded-l-[1.5rem] py-4 text-center flex flex-col items-center justify-center shadow-sm">
                  <div className="h-14 mb-4 flex items-center">
                    <Image
                      src="/About/window.webp"
                      alt="Platforms icon"
                      width={80} 
                      height={50} 
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-500 text-md">Platforms</p>
                  <h3 className="font-bold text-xl text-gray-800 mt-1">
                    Android & Windows
                  </h3>
                </div>

                <div className="bg-white rounded-[1.5rem] md:rounded-l-[0px] md:rounded-r-[1.5rem] py-4 text-center flex flex-col items-center justify-center shadow-sm">
                  <div className="h-14 mb-4 flex items-center">
                    <Image
                      src="/About/phone.webp"
                      alt="Mobile icon"
                      width={40} 
                      height={60} 
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-500 text-md">Mobile</p>
                  <h3 className="font-bold text-xl text-gray-800 mt-1">
                    100% FR
                  </h3>
                </div>

                <div className="bg-white rounded-[1.5rem] md:rounded-r-[0px] md:rounded-l-[1.5rem] py-4 text-center flex flex-col items-center justify-center shadow-sm">
                  <div className="h-14 mb-4 flex items-center">
                    <Image
                      src="/About/language.webp"
                      alt="Language icon"
                      width={65} 
                      height={55} 
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-500 text-md">Language</p>
                  <h3 className="font-bold text-xl text-gray-800 mt-1">
                    English, Hindi
                  </h3>
                </div>

                <div className="bg-white rounded-[1.5rem] md:rounded-l-[0px] md:rounded-r-[1.5rem] py-4 text-center flex flex-col items-center justify-center shadow-sm">
                  <div className="h-14 mb-4 flex items-center">
                    <Image
                      src="/About/device.webp"
                      alt="Device icon"
                      width={100} 
                      height={50} 
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-500 text-md">Device</p>
                  <h3 className="font-bold text-xl text-gray-800 mt-1">
                    Mobile, Desktop, Tablet
                  </h3>
                </div>

              </div>
            </div>

            <div className="w-full lg:w-1/2">
              {/* Padding has been reduced for smaller screen sizes. */}
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 h-full flex flex-col justify-center shadow-sm">
                {/* The text size has been adjusted to be slightly smaller on mobile for better readability. */}
                <p className="text-gray-600 text-base sm:text-lg leading-loose">
                  <strong className="font-bold text-gray-800">A Business Accounting App</strong> like Billing Baba (available both as Android/Desktop App) most importantly sets up the business financial data at all times 100% accurately. It works offline, helping one use it without being connected to unreliable internet. Billing Baba App paints the picture of what they own (assets), how much they owe (liabilities) and what are their business values (equity). It serves as a basis for proper planning of the business accounting activities.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="_0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div> */}
    </section>
  );
};

export default AppInfoSection;