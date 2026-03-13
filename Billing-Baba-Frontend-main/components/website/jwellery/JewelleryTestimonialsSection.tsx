// Example file path: src/components/jewellery-page/JewelleryTestimonialsSection.tsx

import React from "react";
interface Testimonial {
  name: string;
  quote: string;
  avatarSrc: string;
  rating: number;
}

const testimonialsData: Testimonial[] = [
  {
    name: "Gaurav R.",
    quote:
      "Vyapar software is a very convenient and easy-to-use platform for accounting and GST filing for SMEs. It has a multi-user management feature which allows multiple users at a single time.",
    avatarSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/image-1.png",
    rating: 5,
  },
  {
    name: "SumanKumar G.",
    quote:
      "Vyapar is one the most loved cloud-based accounting, billing software that fulfils all needs of your organization. It has lots of features like direct messages to customers, notifications, create bills, etc.",
    avatarSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/image-2.png",
    rating: 4,
  },
  {
    name: "Roshan R.",
    quote:
      "Vyapar is the very best alternative as compared to other billing & accounting software. It is effortless to use. The user interface of this app is straightforward to understand.",
    avatarSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/08/image-3.png",
    rating: 5,
  },
];

// Helper component for Star Rating
const StarRating: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex justify-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < count ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  quote,
  avatarSrc,
  rating,
}) => {
  return (
    <div className="relative bg-background-light p-8 pt-16 rounded-2xl shadow-md text-center border border-gray-100">
      {/* Avatar popping out from the top */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img
          src={avatarSrc}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white ring-2 ring-red-500"
        />
      </div>

      <div className="mb-4">
        <StarRating count={rating} />
      </div>

      <p className="text-text-secondary italic mb-6">"{quote}"</p>

      <h4 className="font-bold text-text-primary">{name}</h4>
    </div>
  );
};

// Main Component
const JewelleryTestimonialsSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Driving Success Through Customer Insights
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JewelleryTestimonialsSection;
