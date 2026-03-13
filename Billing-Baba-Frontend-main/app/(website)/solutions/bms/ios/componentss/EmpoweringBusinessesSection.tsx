// Example file path: src/components/ios-page/EmpoweringBusinessesSection.tsx

"use client"; // This component is interactive (uses useState for the video modal)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, MapPin, PlayCircle } from "lucide-react";

// --- Type Definitions for TypeScript ---
interface TestimonialData {
  name: string;
  avatarSrc: string;
  company: string;
  location: string;
  quote: string;
}

// --- Data for the Component ---
const testimonialData: TestimonialData = {
  name: "Amritlal Khandelwal",
  avatarSrc:
    "https://tse4.mm.bing.net/th/id/OIP.gAYVH3Q892Dv3saU3upeuAHaHa?pid=Api&P=0&h=180",
  company: "Ranisa Garments",
  location: "Bangalore",
  quote:
    "Vyapar has changed the way I do my business. It has helped me achieve unreal profits in my business.",
};

const videoData = {
  thumbnailSrc:
    "https://tse4.mm.bing.net/th/id/OIP.gAYVH3Q892Dv3saU3upeuAHaHa?pid=Api&P=0&h=180",
  videoUrl: "https://www.youtube.com/embed/your_video_id_here?autoplay=1", // Replace with your actual YouTube embed URL
};

const EmpoweringBusinessesSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Empowering 1 Crore+ Businesses Since 2015
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Testimonial Card */}
            <div className="flex justify-center">
              <div className="relative max-w-lg">
                <img
                  src={testimonialData.avatarSrc}
                  alt={testimonialData.name}
                  className="w-32 h-32 rounded-full object-cover absolute -top-16 left-8 shadow-lg border-4 border-white"
                />
                <div className="bg-blue-50/70 backdrop-blur-sm rounded-2xl p-6 pt-20">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {testimonialData.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary mt-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Building size={16} />
                      <span>{testimonialData.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{testimonialData.location}</span>
                    </div>
                  </div>
                  <p className="text-text-secondary italic">
                    "{testimonialData.quote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Video Thumbnail */}
            <div
              className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-xl"
              onClick={handleOpenModal}
            >
              <img
                src={videoData.thumbnailSrc}
                alt="Customer story video thumbnail"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 group-hover:bg-black/10">
                <PlayCircle
                  className="h-24 w-24 text-white/80 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0 bg-black/80"
              onClick={handleCloseModal}
            ></div>
            <motion.div
              className="relative z-10 w-full max-w-4xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="aspect-video">
                <iframe
                  src={videoData.videoUrl}
                  title="Customer Story Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-lg"
                ></iframe>
              </div>
              <button
                onClick={handleCloseModal}
                className="absolute -top-10 right-0 text-3xl font-bold text-white hover:text-gray-300"
                aria-label="Close video"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmpoweringBusinessesSection;
