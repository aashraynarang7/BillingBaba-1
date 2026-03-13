import React from "react";
import Image from "next/image";

// --- ✨ Data for the Section ---
const featuresData = [
  {
    title: "Invoicing Solution that Saves Time",
    points: [
      "Billing Baba simplifies small business invoicing, saving you time to focus on what matters.",
      "Create professional invoices in minutes with their easy-to-use interface, with no training needed.",
      "Choose from over 50 invoice formats for a unique and professional look.",
      "Save time with bulk payment reminders via WhatsApp, email, or calls.",
    ],
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/06/Invoicing-Solution.webp",
    imageAlt: "A person using invoicing software on a laptop and mobile phone",
  },
  {
    title: "Avail Lifetime Free Basic Use",
    points: [
      "Billing Baba offers free invoicing software with multiple invoice formats.",
      "Free software allows the creation of custom invoices.",
      "Manage your dashboard, inventory, and more for free on the Billing Baba mobile android app.",
      "Get a free trial for desktop versions.",
      "Upgrade to premium features and desktop applications with a subscription.",
      "Works for all industries (SMEs, freelancers, professionals).",
    ],
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/06/Streamline-workflow.webp",
    imageAlt: "A person holding a mobile phone showing the free invoicing app",
  },
  {
    title: "Streamline Your Workflow",
    points: [
      "Billing Baba offers invoicing, time tracking, project management, and reporting tools.",
      "Offers multiple features to complement your business needs.",
      "Customize invoices to fit your company's specific requirements.",
      "The business dashboard tracks activity and provides data for better strategy creation.",
    ],
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/06/Optimize-business-operation.webp",
    imageAlt:
      "A person working on a laptop with charts and graphs on the screen",
  },
  {
    title: "Optimized Business Operations",
    points: [
      "Works even offline – no internet needed – receive cash & eWallet payments in retail businesses.",
      "Speeds up accounting and optimizes business operations.",
      "Manage invoicing, accounting, and inventory on a single app.",
      "Eliminates manual calculations and errors and keeps the data updated.",
    ],
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/06/Optimize-business-operation.webp",
    imageAlt:
      "A person using the invoicing app on a laptop and phone at a desk",
  },
];

const BestInvoiceProgramSection: React.FC = () => {
  return (
    <section className="bg-sky-50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            What Makes Billing Baba the Best Invoice Program for Small
            Businesses?
          </h2>
          <p className="mt-4 text-[color:var(--text-secondary)]">
            Billing Baba free small business invoice software is crucial for
            small businesses because it streamlines tasks, improves accuracy,
            and gives you better control of your finances. This reduces
            administrative workload, minimizes errors, and improves cash flow,
            ultimately supporting better business efficiency and growth.
          </p>
        </div>

        <div className="space-y-16">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
            >
              <div
                className={`flex justify-center ${index % 2 !== 0 ? "md:order-last" : ""}`}
              >
                <Image
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  width={500}
                  height={350}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className={index % 2 !== 0 ? "md:order-first" : ""}>
                <h3 className="mb-4 text-2xl font-bold text-[color:var(--primary-red)]">
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-start">
                      <span className="mr-3 mt-2 block h-2 w-2 flex-shrink-0 rounded-full bg-sky-500"></span>
                      <span className="text-[color:var(--text-secondary)]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestInvoiceProgramSection;
