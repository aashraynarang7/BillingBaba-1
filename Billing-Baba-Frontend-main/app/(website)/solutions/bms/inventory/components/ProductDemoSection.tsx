"use client"; // Important: This component needs state for the video modal

import React, { useState } from "react";
import Image from "next/image";

const PlayIcon = () => (
  <svg
    className="h-20 w-20 text-white transition-transform duration-300 group-hover:scale-110"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Data with updated image and video URLs ---
const demoData = {
  title: "Product Demo",
  // FIX: Replaced with a high-quality, relevant product demo thumbnail
  thumbnailSrc:
    "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  // FIX: Replaced with a professional software demo video from YouTube
  videoUrl: "https://www.youtube.com/embed/k_p52a0vQ_4?autoplay=1&rel=0",
  subtitle: "Empowering 1 Crore+ Businesses Since 2015",
};

const ProductDemoSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container text-center">
          <h2 className="mb-4 text-xl font-bold text-[color:var(--text-primary)]">
            {demoData.title}
          </h2>

          <div
            className="group relative mx-auto max-w-4xl cursor-pointer overflow-hidden rounded-2xl shadow-xl"
            onClick={handleOpenModal}
          >
            <Image
              src={demoData.thumbnailSrc}
              alt="Product Demo Thumbnail"
              width={1280}
              height={720}
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-all duration-300 group-hover:bg-opacity-10">
              <div className="rounded-full bg-white bg-opacity-20 p-4 backdrop-blur-sm">
                <PlayIcon />
              </div>
            </div>
          </div>

          <p className="mt-6 font-semibold text-[color:var(--text-secondary)]">
            {demoData.subtitle}
          </p>
        </div>
      </section>

      {/* Video Modal (No changes to logic) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-75"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl">
            <div className="aspect-video">
              <iframe
                src={demoData.videoUrl}
                title="Product Demo Video"
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
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDemoSection;
