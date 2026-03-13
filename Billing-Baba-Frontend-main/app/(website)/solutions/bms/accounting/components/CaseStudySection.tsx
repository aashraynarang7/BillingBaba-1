import React from "react";
import Image from "next/image";

// --- SVG Icons (No changes here) ---
const WarningIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0 text-red-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0 text-green-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const BillingIcon = () => (
  <svg
    className="h-8 w-8 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const TaxIcon = () => (
  <svg
    className="h-8 w-8 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CustomerIcon = () => (
  <svg
    className="h-8 w-8 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const PlanIcon = () => (
  <svg
    className="h-8 w-8 text-[color:var(--primary-red)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// --- Data for the Case Study Component (No changes here) ---
const caseStudyData = {
  mainTitle:
    "Case Study: How a Local Retail Shop Saved 8 Hours/Week with Our Accounting Solution",
  business: { name: "Priya Garments", industry: "Retail-Apparel" },
  owner: {
    name: "Priya Sharma",
    title: "Owner",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2025/05/Case-Study-2-.webp",
  },
  challenge: {
    quote: "I was spending more time on manual accounting than on growth.",
  },
  impact: {
    quote:
      "Now, my accounts stay updated automatically. I can track everything from my phone, even when I'm not at the shop.",
  },
  outcomes: [
    { icon: <BillingIcon />, text: "80% faster billing" },
    { icon: <TaxIcon />, text: "Zero errors in tax filings" },
    { icon: <CustomerIcon />, text: "Happier customers and staff" },
    {
      icon: <PlanIcon />,
      text: "More time to plan stock and expand the business",
    },
  ],
  details: {
    storyTitle: "Real Story, Real Impact - A Retail Success Story",
    problem:
      "Manual billing and stock entry consumed 8-10 hours weekly, leading to delayed GST reports and billing errors. Resulted in lack of focus on growth.",
    impactPoints: [
      "Invoices auto-generated with just a few taps",
      "Real-time inventory sync across purchase and sales",
      "One-click GST-ready reports",
      "Payment reminders sent via WhatsApp",
    ],
    outcomePoints: [
      "80% faster billing",
      "Zero errors in tax filings",
      "Happier customers and staff",
      "More time to plan stock and expand the business",
    ],
  },
};

const CaseStudySection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          {caseStudyData.mainTitle}
        </h2>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left Column */}
          <div className="lg:col-span-3">
            {/* --- ✨ YEH HISSA SAHI KIYA GAYA HAI --- */}
            {/* Red overlay ko hata diya gaya hai */}
            <div className="mb-6 w-full overflow-hidden rounded-lg shadow-xl">
              <Image
                src={caseStudyData.owner.imageSrc}
                alt={caseStudyData.owner.name}
                width={700}
                height={450}
                className="w-full object-cover"
              />
            </div>
            {/* --- ✨ YAHAN TAK SAHI KIYA GAYA HAI --- */}

            <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 shadow-inner md:grid-cols-2">
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-red-800">
                  {" "}
                  <WarningIcon /> The Challenge{" "}
                </div>
                <p className="text-red-700 italic">
                  "{caseStudyData.challenge.quote}"
                </p>
              </div>
              <div className="rounded-md border border-green-200 bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-green-800">
                  {" "}
                  <CheckCircleIcon /> The Impact{" "}
                </div>
                <p className="text-green-700 italic">
                  "{caseStudyData.impact.quote}"
                </p>
              </div>
              <p className="text-right font-semibold text-[color:var(--text-secondary)] md:col-span-2">
                {" "}
                — {caseStudyData.owner.name}, {caseStudyData.owner.title}{" "}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="relative mb-6 pb-2 text-center text-2xl font-bold text-[color:var(--text-primary)] after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-20 after:-translate-x-1/2 after:bg-[color:var(--primary-red)]">
                Outcome
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {caseStudyData.outcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 rounded-lg border border-[color:var(--border-color)] p-4 text-center"
                  >
                    {outcome.icon}
                    <p className="font-bold text-[color:var(--text-primary)]">
                      {outcome.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-[color:var(--border-color)] bg-white p-6 shadow-md">
              <h4 className="mb-4 text-lg font-bold text-[color:var(--primary-red)]">
                {caseStudyData.details.storyTitle}
              </h4>
              <h5 className="mb-2 flex items-center gap-2 font-bold text-[color:var(--text-primary)]">
                <WarningIcon /> The Challenge
              </h5>
              <p className="mb-6 text-sm text-[color:var(--text-secondary)]">
                {caseStudyData.details.problem}
              </p>
              <h5 className="mb-2 flex items-center gap-2 font-bold text-[color:var(--text-primary)]">
                <CheckCircleIcon /> The Impact
              </h5>
              <ul className="mb-6 list-disc list-inside space-y-1 text-sm text-[color:var(--text-secondary)]">
                {caseStudyData.details.impactPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <h5 className="mb-2 font-bold text-[color:var(--text-primary)]">
                Outcome
              </h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-[color:var(--text-secondary)]">
                {caseStudyData.details.outcomePoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
