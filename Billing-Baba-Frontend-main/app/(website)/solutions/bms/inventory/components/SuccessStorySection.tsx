"use client"; // Important: This component needs state for the video modal

import React, { useState } from "react";
import Image from "next/image";

// --- ✨ SVG Icons for this Component ---
const StoreIcon = () => (
  <svg
    className="h-4 w-4 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
const PinIcon = () => (
  <svg
    className="h-4 w-4 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
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

// --- ✨ Data for the Section ---
const storyData = {
  mainTitle: "Empowering 1 Crore+ Businesses Since 2015",
  testimonial: {
    avatarSrc:
      "https://png.pngtree.com/thumb_back/fw800/background/20231009/pngtree-d-render-of-an-online-marketing-website-on-a-laptop-in-image_13595569.png", // IMPORTANT: Image path
    name: "Amritlal Khandelwal",
    businessName: "Itanissa Garments",
    location: "Bangalore",
    quote:
      '"Billing Baba has changed the way I do my business. It has helped me achieve unreal profits in my business."',
  },
  video: {
    thumbnailSrc: "/inventory/videos/business-story-thumbnail.png", // IMPORTANT: Image path
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with your actual YouTube video embed URL
  },
};

const SuccessStorySection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <h2 className="mb-16 text-center text-xl font-semibold text-[color:var(--text-secondary)]">
            {storyData.mainTitle}
          </h2>
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            {/* Left Column: Testimonial */}
            <div className="relative pt-12">
              <div className="absolute left-8 top-0 z-10 -translate-y-1/2 transform">
                <Image
                  src={storyData.testimonial.avatarSrc}
                  alt={storyData.testimonial.name}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white bg-white shadow-lg"
                />
              </div>
              <div className="rounded-2xl bg-sky-50 p-8 pt-20 shadow-md">
                <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
                  {storyData.testimonial.name}
                </h3>
                <div className="my-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <StoreIcon /> {storyData.testimonial.businessName}
                  </div>
                  <div className="flex items-center gap-2">
                    <PinIcon /> {storyData.testimonial.location}
                  </div>
                </div>
                <p className="mt-4 italic text-[color:var(--text-secondary)]">
                  {storyData.testimonial.quote}
                </p>
              </div>
            </div>

            {/* Right Column: Video */}
            <div
              className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-xl"
              onClick={handleOpenModal}
            >
              <Image
                src={storyData.video.thumbnailSrc}
                alt="Business Story Video Thumbnail"
                width={800}
                height={450}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-all duration-300 group-hover:bg-opacity-10">
                <PlayIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-75"
            onClick={handleCloseModal}
          ></div>
          <div className="relative z-10 w-full max-w-4xl">
            <div className="aspect-video">
              <iframe
                src={storyData.video.videoUrl}
                title="Business Success Story"
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

export default SuccessStorySection;
