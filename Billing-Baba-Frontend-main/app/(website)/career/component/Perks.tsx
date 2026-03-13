import React from 'react';
import Image from 'next/image';

const Perks = () => {
  // --- आपका पर्क्स डेटा ---
  const perksData = [
    { 
      title: 'ESOPs', 
      imageUrl: '/Career/perks-1.webp' 
    },
    { 
      title: 'Medical Insurance', 
      imageUrl: '/Career/perks-2.webp' 
    },
    { 
      title: 'Flexible Work Hours', 
      imageUrl: '/Career/perks-3.webp' 
    },
    { 
      title: 'Learning Reimbursements', 
      imageUrl: '/Career/perks-4.webp' 
    },
    { 
      title: 'Stocked Pantry', 
      imageUrl: '/Career/perks-5.webp' 
    },
    { 
      title: 'Flexible Leave Policy', 
      imageUrl: '/Career/perks-6.webp' 
    },
  ];

  return (
    <section className="relative bg-gray-50 py-20 sm:py-28 overflow-hidden">
      
      <div className="absolute top-1/2 left-0 w-full h-auto -translate-y-1/2 z-0 pointer-events-none">
        <svg className="w-full h-auto" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path 
            fill="#FFC300" // यह brand-yellow का कलर है
            d="M-200,200 C200,50 600,350 1000,200 C1200,100 1400,250 1600,200"
            stroke="none"
            strokeWidth="0"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-text-primary mb-16">
          Perks
        </h2>
        
        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {perksData.map((perk) => (
            <div 
              key={perk.title} 
              className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center text-center gap-6 transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-28 h-28 bg-primary-red rounded-full flex items-center justify-center mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={perk.imageUrl}
                    alt={`${perk.title} icon`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <p className="font-semibold text-text-secondary">
                {perk.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Perks;