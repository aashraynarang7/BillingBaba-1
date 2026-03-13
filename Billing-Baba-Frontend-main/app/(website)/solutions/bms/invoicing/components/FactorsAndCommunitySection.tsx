import React from "react";
import Image from "next/image";

// --- ✨ SVG Icon for Stars ---
const StarIcon = ({ colorClass = "text-yellow-400" }) => (
  <svg
    className={`h-5 w-5 ${colorClass}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// --- ✨ Data for the Sections ---
const factorsData = [
  {
    title: "Estimates And Quotations",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/03/Additional-Charges-for-packing-1.png",
    description:
      "Free invoicing software offers small businesses an option to save more time and get quotes instantly. Our invoicing application helps simplify estimates and quotations for customers.",
  },
  {
    title: "Expense Tracking",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/05/Expense-Tracking.png",
    description:
      "Our free invoicing app is an efficient way to manage expenses. Using the app, businesses can optimise their expenditure to save more money. It can help you prepare a strategy to maximise profits.",
  },
  {
    title: "Detailed Business Reports",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/05/Icon_Icons-User-Privilege-Security-copy-71.png",
    description:
      "You can create 57+ business reports using our free invoice tool for all your business requirements. Users can easily view and analyse the data instantly using our invoicing application.",
  },
  {
    title: "Business Dashboard",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/03/Accurate-and-dynamic-reports-1.png",
    description:
      "Empower your customers with a portal where they can view the dynamics of their business in one place. With the Billing Baba business dashboard, you can manage invoices, check estimates, and cash flow.",
  },
  {
    title: "Inventory Management",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/03/Accurate-and-dynamic-reports-1.png",
    description:
      "Billing Baba app can track your business sales and manage your inventory. The business reports measure the effectiveness of your management. With an auto stock adjustment option, you can ensure that inventory items are always available.",
  },
  {
    title: "Barcode Scanner Compatibility",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/05/Icon_Icons-User-Privilege-Security-copy-73.png",
    description:
      "Billing Baba's barcode features reduce the time and effort required in the invoicing process by retrieving product information. It eliminates the need to enter minute details about each item.",
  },
];

const communityData = {
  platforms: [
    { name: "Google Play", iconSrc: "/icons/platforms/google-play.svg" },
    {
      name: "G2",
      iconSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/g2-pos.png",
      rating: 5,
    },
    {
      name: "Capterra",
      iconSrc:
        "https://vyaparwebsiteimages.vypcdn.in/marketing-images/images/pos-billing-software-revamp/capterra-pos.png",
    },
  ],
  reviews: [
    {
      avatarSrc:
        "https://vyaparapp.in/v/z/wp-content/uploads/2024/05/Icon_Icons-User-Privilege-Security-copy-73.png",
      name: "Taj Trading Co.",
      role: "Retailer",
      title: "Excellent",
      comment:
        "Since 2022, I've been using Billing Baba, and it's fantastic. Upgrading to the premium mobile app was a wise choice, particularly for shop staff who aren't familiar with using computers.",
      rating: 5,
      starColor: "text-green-500",
    },
    {
      avatarSrc:
        "https://vyaparapp.in/v/z/wp-content/uploads/2024/03/Accurate-and-dynamic-reports-1.png",
      name: "Hema Srivastava",
      role: "Distributor",
      title: "Easy & Economical",
      comment:
        "I've been using the Billing Baba app for invoicing since I came across it, and I really like it. It's incredibly user-friendly and easy to get on with. It offers a cost-effective solution.",
      rating: 5,
      starColor: "text-green-500",
    },
  ],
};

const FactorsAndCommunitySection: React.FC = () => {
  return (
    <>
      {/* Section 1: Factors to Consider */}
      <section className="bg-sky-50 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Factors to Consider for Choosing the Best Invoice App
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {factorsData.map((factor, index) => (
              <div key={index} className="rounded-2xl bg-white p-6 shadow-md">
                <Image
                  src={factor.iconSrc}
                  alt={factor.title}
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <h3 className="mb-2 text-lg font-bold text-[color:var(--text-primary)]">
                  {factor.title}
                </h3>
                <p className="text-sm text-[color:var(--text-secondary)]">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Growing Community */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Billing Baba's Growing Community
          </h2>
          <div className="mb-12 grid grid-cols-3 items-center justify-items-center gap-8 divide-x divide-gray-200">
            {communityData.platforms.map((platform, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center justify-center gap-2"
              >
                <Image
                  src={platform.iconSrc}
                  alt={platform.name}
                  width={120}
                  height={40}
                />
                {platform.rating && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">Rating:</span>
                    <div className="flex">
                      {Array.from({ length: platform.rating }).map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {communityData.reviews.map((review, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex items-center">
                  <Image
                    src={review.avatarSrc}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-[color:var(--text-primary)]">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[color:var(--text-primary)]">
                  {review.title}
                </h3>
                <p className="mb-6 text-[color:var(--text-secondary)]">
                  {review.comment}
                </p>
                <div className="mt-auto border-t border-gray-200 pt-4">
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <StarIcon key={i} colorClass={review.starColor} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FactorsAndCommunitySection;
