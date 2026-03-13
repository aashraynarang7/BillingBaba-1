import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; 

const PictureYourself = () => {
  const galleryImages = [
    { 
      src: '/Career/careers-pictures-2.png', 
      alt: 'Billing Baba team celebrating on stage' 
    },
    { 
      src: '/Career/careers-pictures-3.png', 
      alt: 'Billing Baba team enjoying in a swimming pool' 
    },
    { 
      src: '/Career/careers-pictures-2.png', 
      alt: 'Billing Baba team on an outdoor trip with mountains in the background' 
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">
            Picture Yourself At Billing Baba
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Find us on LinkedIn{' '}
            <Link href="" passHref>
              <span >
                @Billing Baba
              </span>
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative w-full h-80">
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default PictureYourself;