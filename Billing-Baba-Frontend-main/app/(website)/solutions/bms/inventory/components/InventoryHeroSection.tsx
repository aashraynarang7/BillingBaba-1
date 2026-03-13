import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- ✨ SVG Icon for the "Trusted by" badge ---
const TrustIcon = () => (
  <svg
    className="h-6 w-6 text-yellow-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// --- ✨ Data for the Hero Section ---
const heroData = {
  breadcrumbs: [
    { name: "Home", href: "/" },
    { name: "Free", href: "#" },
    { name: "Inventory Management Software", href: "/inventory" },
  ],
  pillText: "Inventory Management Software",
  subtitle: "For Indian Businesses",
  heading: "Manage Inventory with",
  highlightedText: "1 Click!",
  description:
    "Your Complete inventory solution for stock tracking, order management & stock movements. Control over low stock, overstock & expiring items. Take your business on the go!",
  buttonText: "Download Inventory Software",
  trustText: "Trusted by 1 Crore+ Vyaparis",
  imageUrl: "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/inventory-management-soft-revamp/inventory-hero2.webp", // IMPORTANT: Image path
};

const InventoryHeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[color:var(--background-light)] py-16 md:py-24">
      {/* Decorative Gradient Background */}
      <div className="absolute right-0 top-0 h-full w-full md:w-1/2 bg-gradient-to-br from-sky-100 to-blue-200 opacity-60 blur-3xl"></div>

      <div className="container relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left">
            <nav
              className="mb-6 flex justify-center text-sm md:justify-start"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1">
                {heroData.breadcrumbs.map((crumb, index) => (
                  <li key={index} className="inline-flex items-center">
                    {index > 0 && <span className="mx-1 text-gray-400">/</span>}
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

            <div className="mb-4 inline-block rounded-full border border-sky-500 px-4 py-1">
              <p className="font-semibold text-sky-600">{heroData.pillText}</p>
            </div>
            <p className="mb-4 text-sm italic text-[color:var(--text-primary)]">
              {heroData.subtitle}
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-[color:var(--text-primary)] md:text-5xl lg:text-6xl">
              {heroData.heading}{" "}
              <span className="text-sky-500">{heroData.highlightedText}</span>
            </h1>

            <p className="mt-6 text-lg text-[color:var(--text-secondary)]">
              {heroData.description}
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 md:flex-row">
              <button className="w-full rounded-full bg-[color:var(--primary-red)] px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 md:w-auto">
                {heroData.buttonText}
              </button>
              <div className="flex items-center gap-2">
                <TrustIcon />
                <span className="font-semibold text-orange-500">
                  {heroData.trustText}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex items-center justify-center">
            <Image
              src={heroData.imageUrl}
              alt="Inventory Management Features"
              width={600}
              height={450}
              priority
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryHeroSection;
