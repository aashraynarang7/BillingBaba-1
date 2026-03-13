// Example file path: src/components/ocr-page/OcrTestimonialsSection.tsx

import React from "react";
import Image from "next/image";

// --- Type Definitions for TypeScript ---
interface Testimonial {
  name: string;
  title: string;
  location: string;
  avatarSrc: string;
  quote: string;
}

// --- Data for the Component, transcribed from your image ---
const testimonialsData: Testimonial[] = [
  {
    name: "Swati Patel",
    title: "Co-owner, Swati's Café",
    location: "Surat",
    avatarSrc:
      "https://tse3.mm.bing.net/th/id/OIP.X9MGZ-hPQ23e5lNffa7V-wHaE8?pid=Api&P=0&h=180",
    quote:
      "Uploading receipts from my phone and letting OCR do the rest? Brilliant. It even catches GST details perfectly—super useful for monthly reports.",
  },
  {
    name: "Ramesh Dey",
    title: "Accountant, Sunrise Hardware",
    location: "Kolkata",
    avatarSrc:
      "https://tse4.mm.bing.net/th/id/OIP.Z9q17wcANpLjzOC2Fo_4swHaHk?pid=Api&P=0&h=180",
    quote:
      "Earlier, I used to enter all purchase data manually. Now, with Vyapar's OCR, 90% of it is auto-filled. Total game changer.",
  },
  {
    name: "Tanvi Shah",
    title: "Founder, Blossom Boutique",
    location: "Pune",
    avatarSrc:
      "https://tse1.mm.bing.net/th/id/OIP.tL1dKiGcEl_zmAltMAiCDQHaHa?pid=Api&P=0&h=180",
    quote:
      "Even scanned bills from suppliers get sorted easily. OCR works smoothly and having the documents auto-attached is a big plus!",
  },
  {
    // Adding a fourth one for better layout balance
    name: "Amit Kumar",
    title: "Manager, City Electronics",
    location: "Delhi",
    avatarSrc:
      "https://tse1.mm.bing.net/th/id/OIP.tL1dKiGcEl_zmAltMAiCDQHaHa?pid=Api&P=0&h=180", // Placeholder image
    quote:
      "The accuracy is impressive. It saves us hours of data entry every week, allowing us to focus more on customer service.",
  },
];

// Helper component for individual testimonial cards
const TestimonialCard: React.FC<Testimonial> = ({
  name,
  title,
  location,
  avatarSrc,
  quote,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 break-inside-avoid mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={avatarSrc}
          alt={name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h4 className="font-bold text-text-primary">{name}</h4>
          <p className="text-sm text-text-secondary">
            {title} – {location}
          </p>
        </div>
      </div>
      <p className="text-text-secondary italic">"{quote}"</p>
    </div>
  );
};

// Main Component
const OcrTestimonialsSection: React.FC = () => {
  return (
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            What Business Owners Say About
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-primary-red mt-2 font-serif italic">
            Vyapar’s OCR Magic
          </h3>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OcrTestimonialsSection;
