import React from "react";

// --- ✨ SVG Icon for Stars ---
const StarIcon = () => (
  <svg
    className="h-5 w-5 text-yellow-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// --- ✨ Data for the Testimonials Section ---
const testimonialsData = [
  {
    rating: 5,
    comment:
      "Being a businessman, with a busy schedule and I often don't get time to maintain balance and inventory for my company.",
    author: "Deepak",
    category: "(Food & Beverages)",
    source: "Capterra",
    sourceUrl: "#",
  },
  {
    rating: 5,
    comment:
      "I use it for billing, inventory, accounting and taxation. It is convenient, easy to use.",
    author: "Tanvir",
    category: "(Apparel & Fashion)",
    source: "Capterra",
    sourceUrl: "#",
  },
  {
    rating: 5,
    comment:
      "Print Invoices and debit/credit notes directly from the app, with an added bonus of the ability to maintain inventory.",
    author: "Divyansh",
    category: "(Consumer Goods)",
    source: "Capterra",
    sourceUrl: "#",
  },
];

const InventoryTestimonials: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="relative inline-block text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            What Customers are Talking About Our Inventory Software?
            <span
              className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(to right, var(--primary-red), #FBBF24)",
              }}
            ></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg"
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              <p className="my-6 flex-grow text-lg italic text-[color:var(--text-secondary)]">
                "{testimonial.comment}"
              </p>

              <div>
                <p className="font-bold text-[color:var(--text-primary)]">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-500">{testimonial.category}</p>
                <p className="mt-4 text-sm text-gray-400">
                  Source:{" "}
                  <a
                    href={testimonial.sourceUrl}
                    className="text-sky-500 hover:underline"
                  >
                    {testimonial.source}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InventoryTestimonials;
