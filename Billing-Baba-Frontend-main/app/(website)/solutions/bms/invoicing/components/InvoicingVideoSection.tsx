"use client"; // Important: This component needs state for the video modal

import React, { useState } from "react";
import Image from "next/image";

// --- ✨ SVG Icon for the Play Button ---
const PlayIcon = () => (
  <svg
    className="h-16 w-16 text-white transition-transform duration-300 group-hover:scale-110"
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

// --- ✨ Data for the Video Section ---
const videoData = {
  title:
    "Ease Your Invoicing Process Using Invoicing Software for Small Business",
  description:
    "Many small business owners in India are still dependent on manual invoicing processes. Billing Baba brings the free invoicing app to help these small business vendors with absolute invoicing solutions. Watch the video to understand the key features of the application and how it can benefit your small businesses.",
  thumbnailSrc: "/invoicing/video/thumbnail.png", // IMPORTANT: Thumbnail image path
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with your actual YouTube video embed URL
};

const InvoicingVideoSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="bg-sky-50 py-16 md:py-24">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            {videoData.title}
          </h2>

          <div
            className="group relative mx-auto mt-8 max-w-3xl cursor-pointer overflow-hidden rounded-2xl shadow-xl"
            onClick={handleOpenModal}
          >
            <Image
              src={videoData.thumbnailSrc}
              alt="Invoicing Software Demo Thumbnail"
              width={900}
              height={500}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-300 group-hover:bg-opacity-20">
              <PlayIcon />
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-sm text-[color:var(--text-secondary)]">
            {videoData.description}
          </p>
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
                src={videoData.videoUrl}
                title="Invoicing Software Demo"
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

export default InvoicingVideoSection;
