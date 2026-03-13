import React from "react"

const StarIcon = () => (
  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const testimonialsData = [
  {
    rating: 5,
    text: "Vyapar is Low cost billing software with user friendly dashboard and whatsapp bill message feature is great.",
    author: "Akash",
    role: "(Small Business Owner)",
    source: "Capterra",
    sourceUrl: "#",
  },
  {
    rating: 5,
    text: "My most loved feature is SMS and Invoice sharing capabilities in one or two click. Latest improvement I was wondering that customer can make a payment by clicking our invoice!",
    author: "Abdul kader",
    role: "(Fine Art, Owner)",
    source: "Capterra",
    sourceUrl: "#",
  },
  {
    rating: 5,
    text: "Best billing app I have ever seen in the play store. I liked their invoice formats. I was shocked that there are 14 invoice formats. No one will provide these many formats for free. Faster billing and accounting and UI are also too good. Now I'm planning for paid version.",
    author: "Sanjay",
    role: "(Food & Beverage Business)",
    source: "Capterra",
    sourceUrl: "#",
  },
]

export default function DesktopTestimonials() {
  return (
    <section className="py-16 md:py-20 bg-[var(--background-section-gray)]">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-foreground)] mb-2">
            What Customers are Talking About Vyapar's PC Billing App?
          </h2>
          <div className="inline-block h-1 w-48 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col text-center"
            >
              <div className="flex justify-center mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="text-[var(--text-foreground)] mb-8 flex-grow">{testimonial.text}</p>
              <div className="mt-auto">
                <p className="font-bold text-[var(--text-primary)]">{testimonial.author}</p>
                <p className="text-sm text-[var(--text-foreground)] mb-5">{testimonial.role}</p>
                <p className="text-sm text-gray-500">
                  Source:{" "}
                  <a href={testimonial.sourceUrl} className="text-[var(--text-link-active)] hover:underline">
                    {testimonial.source}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}