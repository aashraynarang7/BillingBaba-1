// Example file path: src/components/ios-page/PosVideoSection.tsx

"use client"; // This component is interactive (uses useState)

import React, { useState } from "react";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

// --- Data for the Component ---
const videoData = {
  title: "See Our POS Software in Action",
  description:
    "From scanning items to printing bills, see how our V-PoS system makes your checkout process faster and more efficient.",
  // The screenshot you provided is used as the thumbnail
  thumbnailSrc: "https://i.imgur.com/eQJqF8c.png",
  // The video link you provided
  videoUrl:
    "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/pos-video-tutorial.mp4",
};

const PosVideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* Section Title and Description */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            {videoData.title}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            {videoData.description}
          </p>
        </div>

        {/* Video Player Container */}
        <div className="mt-12 max-w-5xl mx-auto rounded-2xl shadow-xl overflow-hidden relative aspect-video group">
          {isPlaying ? (
            // If playing, show the video
            <video
              src={videoData.videoUrl}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            // If not playing, show the thumbnail and play button
            <div onClick={handlePlayClick} className="cursor-pointer">
              <img
                src={videoData.thumbnailSrc}
                alt="POS Software Demo Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40 flex items-center justify-center">
                <PlayCircle
                  className="h-24 w-24 text-white/80 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PosVideoSection;
