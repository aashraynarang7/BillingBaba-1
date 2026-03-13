import React from 'react';
import Image from 'next/image';

// Data for the three statistics cards is managed here for cleanliness.
const statsData = [
  {
    icon: '/About/download-icon.webp', // Replace with your actual icon path
    alt: 'Download icon',
    title: 'Downloads',
    value: '10M+',
  },
  {
    icon: '/About/playstore-icon.webp', // Replace with your actual icon path
    alt: 'Play Store icon',
    title: 'Play Store Ratings',
    value: '4.7 out of 5 stars',
  },
  {
    icon: '/About/madeinindia-icon.webp', // Replace with your actual icon path
    alt: 'Made in India logo',
    title: 'Made in',
    value: 'India',
  },
];

const TechnologySection = () => {
  return (
    // A relative parent container for the section and the floating button.
    <div className="relative font-sans">
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-16">
            Adopt Right Technology for your Business
          </h2>

          {/* Grid container for the cards, ensures responsiveness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50/50 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="flex justify-center mb-5 h-16">
                  {/* Remember to replace the placeholder 'src' with your actual icon paths in the array above */}
                  <Image
                    src={stat.icon}
                    alt={stat.alt}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="text-lg text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      {/* <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
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
    </div>
  );
};

export default TechnologySection;