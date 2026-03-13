import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- ✨ SVG Icon for list items ---
const ArrowIcon = () => (
  <svg
    className="h-4 w-4 flex-shrink-0 text-[color:var(--primary-red)] opacity-70"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// --- ✨ Data for the Explore Section ---
const exploreData = {
  title: "Explore Billing Baba Invoicing Software for All Businesses",
  imageSrc: "https://vyaparapp.in/v/z/wp-content/uploads/2023/01/6-13.webp", // IMPORTANT: Image path
  linkColumns: [
    [
      "Invoicing Software for Garage",
      "Invoicing Software for Windows",
      "E-invoicing Software",
      "Invoicing Software for Consultants",
      "Invoicing Software for Freelancers",
      "Invoicing Software for Construction",
    ],
    [
      "Invoicing Software for Recruitment",
      "Automated Invoicing Software",
      "Auto Repair Invoice Software",
      "SaaS Invoicing Software",
      "Invoice Software for Landscaping",
      "Enterprise Invoicing Software",
    ],
    [
      "Car Sales Invoice Software",
      "Invoice Receipt Software",
      "Invoice Reminder Software",
      "Daycare Invoice Software",
      "Locksmith Invoicing Software",
      "Invoicing Software for Office",
    ],
  ],
};

const ExploreLinksSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-[color:var(--primary-red)]">
          {exploreData.title}
        </h2>

        <div className="rounded-2xl bg-sky-50 p-8 shadow-md">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-4">
            {/* Image Column */}
            <div className="flex justify-center lg:col-span-1">
              <Image
                src={exploreData.imageSrc}
                alt="Billing Baba Invoicing Software"
                width={400}
                height={350}
              />
            </div>

            {/* Link Columns */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
              {exploreData.linkColumns.map((column, colIndex) => (
                <ul key={colIndex} className="space-y-3">
                  {column.map((linkText, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="group flex items-start gap-2 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--primary-red)]"
                      >
                        <ArrowIcon />
                        <span>{linkText}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreLinksSection;
