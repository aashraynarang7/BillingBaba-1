import React from "react";
import Image from "next/image";

// --- ✨ SVG Icon for Stars ---
const StarIcon = () => (
  <svg
    className="h-5 w-5 text-green-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// --- ✨ Data for the Testimonials Section ---
const testimonialsData = {
  title: "Our Growing Community",
  platforms: [
    { name: "Google Play", iconSrc: "/icons/platforms/google-play.svg" },
    {
      name: "G2",
      iconSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/g2-pos.png",
      rating: 5,
    },
    {
      name: "Capterra",
      iconSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/rev3.svg",
    },
  ],
  reviews: [
    {
      avatarSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/capterra-pos.png", // IMPORTANT: Image path
      name: "Kshirasagar Textiles",
      role: "Distributor",
      title: "Excellent Accounting System",
      review:
        "Our accounting partner for four years now, and it's been a smooth ride. Their subscription model is clear cut, and whenever I've needed help, their support team jumps in quickly and gets things sorted. Plus, they're honest - no hidden fees or surprises. A reliable and trustworthy companion for my business growth.",
      rating: 5,
    },
    {
      avatarSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/rev3.svg", // IMPORTANT: Image path
      name: "Manu Rajeshwari",
      role: "Wholesaler",
      title: "Easy & Economical",
      review:
        "Simple and powerful! I have been using this app on my desktop for one year. It's simple and can be easily learned by anyone. The app is continuously updated and there are many features added.",
      rating: 5,
    },
  ],
  cta: "Grow Your Business to the Next Level with the Our App!",
};

const TestimonialsSection: React.FC = () => {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            {testimonialsData.title}
          </h2>

          {/* Platform Logos */}
          <div className="mb-12 grid grid-cols-3 items-center justify-items-center gap-8 divide-x divide-gray-200">
            {testimonialsData.platforms.map((platform, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center justify-center gap-2"
              >
                <Image
                  src={platform.iconSrc}
                  alt={platform.name}
                  width={120}
                  height={40}
                />
                {platform.rating && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">Rating:</span>
                    <div className="flex">
                      {Array.from({ length: platform.rating }).map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {testimonialsData.reviews.map((review, index) => (
              <div
                key={index}
                className="rounded-lg border border-sky-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex items-center">
                  <Image
                    src={review.avatarSrc}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-[color:var(--text-primary)]">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[color:var(--text-primary)]">
                  {review.title}
                </h3>
                <p className="mb-6 text-[color:var(--text-secondary)]">
                  {review.review}
                </p>
                <div className="mt-auto border-t border-sky-200 pt-4">
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-[color:var(--primary-red)] py-8">
        <div className="container text-center">
          <h3 className="text-2xl font-bold text-white">
            {testimonialsData.cta}
          </h3>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
