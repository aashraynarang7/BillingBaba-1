import React from 'react';
import Image from 'next/image';

const AccountingSoftwareSection = () => {
  return (
    <section className="bg-white font-sans py-12 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        {/* The flex container aligns items to the center vertically. Justification and gaps are removed as requested. */}
        <div className="flex flex-col md:flex-row items-center">

          {/* Left Side: Image */}
          {/* A right margin (md:mr-16) is added on medium screens and up to create space. */}
          <div className="w-full md:w-1/2 md:mr-16">
            {/* Remember to replace the 'src' with the actual path to your image. */}
            <Image
              src="/About/mobile-head-img.webp" 
              alt="Billing Baba accounting app on a smartphone"
              width={450}
              height={550}
              className="object-contain"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-2xl text-gray-500 leading-relaxed">
              <strong>Billing Baba</strong> is a <strong>FREE Business Accounting Software</strong> built for Indian small businesses to deal with invoicing, inventory, accounting needs, and much more! The goal is to make a businessman's daily routine less tiring and let them focus more on growing their business, less on paperwork.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AccountingSoftwareSection;