"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 text-white">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const GreatWorkplaces = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-6 text-center">
        
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Great Teams deserve Great Workplaces!
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Check out our Bangalore Office. Collaborate, Unwind & unlock the full potential of collective growth
        </p>

        {/* Main container to establish positioning context */}
        <div className="relative w-full max-w-4xl aspect-video mx-auto mt-12 group">
          
          {/* This container holds both blobs and the play button. 
              It's positioned absolutely and shifted up with a negative top value.
              'mx-auto' with 'left-0 right-0' ensures it stays centered horizontally.
          */}
          <div className="absolute top-[-15%] sm:top-[-25%] left-0 right-0 mx-auto w-[80%] sm:w-[70%]">
            
            {/* Yellow Blob - Background Layer */}
            <div className="absolute top-[5%] left-[5%] w-full h-full">
              <Image 
                src="/Career/yellow-blob.png"
                width={800}
                height={800}
                objectFit="contain"
                alt='yellow-blob'
              />
            </div>
            
            {/* Video Blob / Video Player - Foreground Layer */}
            <div className="relative z-10">
              {isPlaying ? (
                <video
                  src="/Career/my-office-work-short-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image 
                  src="/Career/video-blob.png"
                  width={800}
                  height={800}
                  objectFit="contain"
                  alt='Bangalore Office'
                />
              )}
            </div>

            {/* Play Button - Positioned absolutely on top of all blobs */}
            {!isPlaying && (
             <div 
               className="absolute top-[48%] left-[55%] -translate-x-1/2 z-20 cursor-pointer"
               onClick={() => setIsPlaying(true)}
             >
               <div className=" w-16 h-16 bg-[var(--primary-red)] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                 <PlayIcon />
               </div>
             </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreatWorkplaces;