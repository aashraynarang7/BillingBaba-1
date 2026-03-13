import React from "react";
import Link from "next/link";

// --- ✨ SVG Icons for the Stats ---
const CustomerIcon = () => (
  <svg
    className="h-10 w-10 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const InvoiceIcon = () => (
  <svg
    className="h-10 w-10 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const MobileIcon = () => (
  <svg
    className="h-10 w-10 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);
const PlayStoreIcon = () => (
  <svg
    className="h-10 w-10 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const SinceIcon = () => (
  <svg
    className="h-10 w-10 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// --- ✨ Data for the Hero Section ---
const heroData = {
  breadcrumbs: [
    { name: "Home", href: "/" },
    { name: "Free", href: "#" },
    { name: "Invoicing Software", href: "/invoicing" },
  ],
  heading: "Invoicing Software for Small Business",
  description:
    "Revolutionize your invoicing with Billing Baba! Free Invoicing Software for small business creates customized invoices in less than 2 minutes. Sign up now for effortless online/ offline invoicing.", // ✨ Yahan badlav kiya gaya hai
  buttonText: "Download Invoice Software",
  stats: [
    { icon: <CustomerIcon />, value: "1 Cr +", label: "Happy Customers" },
    { icon: <InvoiceIcon />, value: "100 Cr +", label: "Invoices Created" },
    { icon: <MobileIcon />, value: "Free", label: "Android & iOS app" },
    {
      icon: <PlayStoreIcon />,
      value: "Rated 4.7/5",
      label: "On Google Playstore",
    },
    {
      icon: <SinceIcon />,
      value: "Since 2016",
      label: "Serving small businesses",
    },
  ],
  backgroundImageUrl: "/invoicing/hero-background.jpg", // IMPORTANT: Background image path
};

const InvoicingHeroSection: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center py-20 md:py-28"
      style={{ backgroundImage: `url(${heroData.backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"></div>
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <nav
            className="mb-6 flex justify-center text-sm"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              {heroData.breadcrumbs.map((crumb, index) => (
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

          <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--text-primary)] md:text-5xl lg:text-6xl">
            {heroData.heading}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[color:var(--text-secondary)]">
            {heroData.description}
          </p>
          <div className="mt-8">
            <button className="rounded-full bg-[color:var(--primary-red)] px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105">
              {heroData.buttonText}
            </button>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 justify-items-center gap-8 md:grid-cols-3 lg:grid-cols-5">
          {heroData.stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-[color:var(--text-primary)]">
                {stat.value}
              </p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvoicingHeroSection;
