import React from 'react';
import Image from 'next/image';

// The list of features is managed in this array for better code organization.
// Using JSX fragments (<>...</>) allows for embedding styled text like <strong>.
const features = [
  <>Become <strong className="font-semibold text-gray-800">GST compatible</strong>.</>,
  'Manage all parties in one single place and market business much easily.',
  'View how business is performing instantly.',
  <>Create, print/share <strong className="font-semibold text-gray-800">customized invoices</strong>.</>,
  'Set up "Auto Backup" and secure his business accounting data against accidental data loss.',
  'Expired items can be easily selected for upcoming sale by simply tracking individual units of the item by batch numbers.',
  'Set automatic payment reminders.',
  'Do business accounting software offline without internet.',
];

const EffortlessBusinessSection = () => {
  return (
    <section className="bg-white font-sans py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-16">
          With Billing Baba, a Businessman can effortlessly
        </h2>

        {/* Two-column layout container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 mx-4 md:mx-10">
          
          {/* Left Column: Feature list */}
          <div className="w-full lg:w-1/2">
            <ul className="list-disc list-inside space-y-5 text-gray-600 text-lg">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Right Column: Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            {/* The fade effect on the left of the image should be part of the image file itself. */}
            {/* Remember to replace the placeholder 'src' with your actual image path. */}
            <Image
              src="/About/effortlessly.webp"
              alt="Businessman using Billing Baba software in a warehouse"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-md"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default EffortlessBusinessSection;