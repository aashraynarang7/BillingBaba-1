import React from 'react';
import Image from 'next/image';

const BusinessInfoSection = () => {
  return (
    <div className="bg-white font-sans py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 space-y-20">

        {/* Section 1: Small/Medium Business (SME) */}
        <div className="bg-gray-50/70 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            
            {/* Left Side: Illustration Image */}
            <div className="w-full md:w-5/12">
              {/* Remember to replace the 'src' with your actual image path */}
              <Image
                src="/About/small-midium.webp"
                alt="Small and Medium Business Illustration"
                width={500}
                height={400}
                className="rounded-2xl object-cover shadow-md"
              />
            </div>

            {/* Right Side: Text Content */}
            <div className="w-full md:w-7/12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Small/Medium Business (SME)
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Even today, <strong className="font-semibold text-gray-800">70% SMEs</strong> in India still create bills on paper. Being that, most of their productive time is consumed in making manual entries and calculations. When small things go wrong, the entire business goes down, simply because there is no place to fall back. Not having the resources can really wear out the business owner driving them away from doing what matters most. <strong className="font-semibold text-gray-800">Small Business Accounting Software needs a Digital Upgrade</strong>. An upgrade that is simple yet efficient. We are trying to bring in a simpler solution that works for them and hence VYAPAR!
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Founders */}
        <div className="bg-gray-50/70 rounded-3xl p-8 md:p-12">
          {/* 'md:flex-row-reverse' moves the image to the right on medium screens and up */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-16">
            
            {/* Right Side: Founders Image */}
            <div className="w-full md:w-5/12">
              <div className="relative">
                {/* Remember to replace the 'src' with your actual image path */}
                <Image
                  src="/About/small-midium.webp"
                  alt="Founders of Billing Baba"
                  width={500}
                  height={400}
                  className="rounded-2xl object-cover"
                />
                {/* Name tags positioned absolutely over the image */}
                {/* <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-around items-center">
                  <div className="bg-gray-800/80 backdrop-blur-sm text-white rounded-lg px-4 py-2 text-center shadow-lg">
                    <h3 className="font-semibold">Sumit Agarwal</h3>
                    <p className="text-xs text-gray-300">Founder & CEO,Billing Baba</p>
                  </div>
                  <div className="bg-gray-800/80 backdrop-blur-sm text-white rounded-lg px-4 py-2 text-center shadow-lg">
                    <h3 className="font-semibold">Shubham Agrawal</h3>
                    <p className="text-xs text-gray-300">Founder & CTO, Billing Baba</p>
                  </div>
                </div> */}
              </div>
            </div>
            
            {/* Left Side: Quote */}
            <div className="w-full md:w-7/12">
              <p className="text-gray-600 leading-relaxed italic">
                “We are talking about improving the life of a segment that is the largest in our nation, i.e ‘Small Business Sector’ the heartbeat of our economy. One of the major aspect holding down the small and medium enterprise (SME) sector is that they hardly have any access to proper technology. Easing this situation will go a long way in nurturing and sustaining SMEs. To let India emerge as one of the brightest economic spots in the coming years, businesses should focus on ways to make cash rather than stuck up in counting cash. Billing Baba basically helps them do business accounting easier with the modern digital way!”
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessInfoSection;