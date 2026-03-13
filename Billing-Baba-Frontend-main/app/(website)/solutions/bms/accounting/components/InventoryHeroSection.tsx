import React from "react";
import Image from "next/image";
import Link from "next/link";

// ✨ Data object component ke andar hi define kiya gaya hai
const heroContent = {
  breadcrumbs: [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Accounting", href: "/solutions/bms/accounting" },
  ],
  heading: "Accounting Software",
  subheading: "A Game Changer for Indian SMEs",
  description:
    "India's #1 Accounting Software for your small business. Easily manage Cash Flows, GST billing, inventory, expenses & reports on mobile or desktop.",
  buttonText: "Get Started for Free",
  imageUrl: "/inventory/inventory1.webp", // Path to your image in the public folder
  imageAlt: "Dashboard of Accounting Software", // ✨ Yahan imageAlt add kiya gaya hai
};

// Component ab koi props nahi leta hai
const InventoryHeroSection: React.FC = () => {
  // Internal 'heroContent' object ko seedhe use karein
  const {
    breadcrumbs,
    heading,
    subheading,
    description,
    buttonText,
    imageUrl,
    imageAlt, // Ab yeh yahan available hai
  } = heroContent;

  return (
    <section className="bg-[color:var(--background-light)] py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            {/* Breadcrumbs */}
            <nav
              className="mb-4 flex justify-center text-sm md:justify-start"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.name} className="inline-flex items-center">
                    {index > 0 && (
                      <span className="mx-2 text-[color:var(--text-secondary)]">
                        /
                      </span>
                    )}
                    <Link
                      href={crumb.href}
                      className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary-red)]"
                    >
                      {crumb.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Heading */}
            <h1 className="font-bold tracking-tight text-[color:var(--text-primary)]">
              <span className="block text-4xl md:text-5xl">{heading}</span>
              <span className="block text-4xl md:text-5xl">{subheading}</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-[color:var(--text-secondary)]">
              {description}
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <button className="rounded-md bg-[color:var(--primary-red)] px-8 py-4 text-lg font-bold text-white shadow-md transition-transform duration-200 hover:scale-105">
                {buttonText}
              </button>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center">
            {/* Using Next.js Image for optimization */}
            <Image
              src={imageUrl}
              alt={imageAlt} // Yahan alt text use ho jayega
              width={600}
              height={450}
              priority // Load this image first
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryHeroSection;
