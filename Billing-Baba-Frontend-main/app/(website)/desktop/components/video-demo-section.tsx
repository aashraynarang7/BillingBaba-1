import React from "react"

const demoData = {
  title: "Watch How to Use Vyapar Billing Software for Laptop or Desktop",
  mainImageSrc: "/Desktop/Section8.webp",
  decorativeImageSrc: "/Desktop/Section8-1.webp",
  altText: "A graphic demonstrating the Vyapar desktop application on a monitor, with a learning hub badge.",
}

export default function VideoDemoSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          {demoData.title}
        </h2>
        <div className="relative max-w-4xl mx-auto flex justify-center lg:justify-end">
          <img
            // src={demoData.decorativeImageSrc}
            // alt="Decorative graphic showing a computer monitor"
            className="absolute bottom-0 left-0 w-1/2 max-w-sm z-0 hidden lg:block pointer-events-none"
          />

          <div className="relative w-full max-w-2xl z-10">
            <img
              src={demoData.mainImageSrc}
              alt={demoData.altText}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}