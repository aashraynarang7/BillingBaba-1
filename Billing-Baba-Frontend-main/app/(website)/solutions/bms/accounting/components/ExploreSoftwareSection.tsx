import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- ✨ SVG Icon for list items ---
const ArrowIcon = () => (
  <svg
    className="h-4 w-4 flex-shrink-0 text-gray-400"
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
  title: "Explore Our Accounting Software for Your Businesses",
  imageSrc: "https://vyaparapp.in/v/z/wp-content/uploads/2023/01/6-13.webp", // IMPORTANT: Image path
  linkColumns: [
    [
      "Ledgers Accounting Software",
      "Accounting software for freelancers",
      "Accounting software for construction business",
      "Accounting software for church",
      "Accounting software for travel agency",
      "Accounting software for growing business",
      "Accounting software for daycare",
      "Accounting software for food manufacturers",
    ],
    [
      "Accounting software for consultants",
      "Accounting software for advertising agencies",
      "Accounting software for bookkeeping",
      "Accounting software for lending",
      "Accounting software for real estate",
      "Accounting software for architecture firm",
      "Accounting software for property investors",
      "Accounting software for bank reconciliation",
    ],
    [
      "Accounting software for farm",
      "Accounting software for healthcare organization",
      "Accounting software for interior designer",
      "Accounting software for diamond industry",
      "Accounting software for photography",
      "Cloud based accounting software",
      "Offline accounting software",
      "Accounting software for government agencies",
    ],
  ],
};

const ExploreSoftwareSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2
          className="mb-8 text-center text-3xl font-bold"
          style={{ color: "var(--primary-red)" }}
        >
          {exploreData.title}
        </h2>

        <div className="rounded-lg bg-sky-50 p-8 shadow-md">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-4">
            {/* Image Column */}
            <div className="flex justify-center lg:col-span-1">
              <Image
                src={exploreData.imageSrc}
                alt="Accounting Software Dashboard"
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

export default ExploreSoftwareSection;
