"use client"; // Important: This component needs to be interactive for rating

import React, { useState } from "react";

// --- ✨ SVG Icon for a single Star ---
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`h-8 w-8 cursor-pointer ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const InventoryRatingSection: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  // Static data as shown in the image
  const averageRating = 4.48;
  const voteCount = 1045;

  return (
    <>
      <section className="bg-[color:var(--background-section-gray)] py-12">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">
            How Useful Was This Post?
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Click on a star to rate it!
          </p>

          <div
            className="flex justify-center gap-2"
            onMouseLeave={() => setHover(0)}
          >
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type="button"
                  key={starValue}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  aria-label={`Rate ${starValue} out of 5 stars`}
                >
                  <StarIcon filled={starValue <= (hover || rating)} />
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Average rating {averageRating} / 5. Vote count: {voteCount}
          </p>
        </div>
      </section>

      {/* Footer Bar as shown in the image */}
      <footer className="bg-[color:var(--footer-background)] py-2">
        <div className="container">
          {/* You can add footer content here if needed in the future */}
        </div>
      </footer>
    </>
  );
};

export default InventoryRatingSection;
