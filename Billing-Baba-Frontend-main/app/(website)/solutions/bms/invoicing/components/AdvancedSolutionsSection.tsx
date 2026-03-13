import React from "react";
import Image from "next/image";

// --- ✨ Data for the Advanced Solutions Section ---
const featuresData = [
  {
    subheading: "Comprehensive GST compliance",
    description1: (
      <>
        Ensuring accurate tax calculation and adherence to{" "}
        <strong className="font-semibold text-gray-700">
          government regulations
        </strong>{" "}
        for any business owner is crucial. The GST compliance feature in the
        invoicing app ensures all invoices adhere to GST regulations,{" "}
        <strong className="font-semibold text-gray-700">
          automatically calculating
        </strong>{" "}
        the correct{" "}
        <strong className="font-semibold text-gray-700">GST rates</strong> and
        generating GST-compliant invoices.
      </>
    ),
    description2:
      "The app facilitates the generation of GST reports for the filings, maintains accurate tax records, and provides real-time reports. This reduces errors, saves time, and ensures the business meets all its tax obligations efficiently.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Img_GST-Invoicing-Rectangle.webp",
    imageAlt: "GST calculation feature in an invoice",
  },
  {
    subheading: "Barcode Label Generation",
    description1:
      "Barcode labels are essential for businesses because they help to improve efficiency and accuracy, and help to track items or products, leading to cost savings and better customer service.",
    description2:
      "Billing Baba's online invoicing software's barcode label generation feature allows businesses to create and print custom barcode labels for their products easily. It enables you to include essential product details like name, price, and SKU.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Barcode-Scanning.webp",
    imageAlt: "Barcode label generation feature",
  },
  {
    subheading: "Loyalty Points",
    description1:
      "Our free invoice app's loyalty point feature enables businesses to reward their customers for repeat purchases. With this feature, you can set up a points system where customers earn points for each transaction, which can later be redeemed for discounts or other rewards.",
    description2:
      "This feature helps build customer loyalty, encouraging repeat business, and enhancing customer satisfaction, making it a valuable tool for small businesses looking to strengthen their customer relationships.",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Img_Loyalty-Points-379.webp",
    imageAlt: "Loyalty points feature in the app",
  },
];

const AdvancedSolutionsSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          Advanced Invoicing Solutions to Enhance Business Growth
        </h2>

        <div className="space-y-12">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl p-4 md:p-8 ${index === 1 ? "bg-sky-50" : ""}`}
            >
              <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                {/* Text Column */}
                <div className={index === 1 ? "md:order-last" : ""}>
                  <h3 className="mb-4 text-xl font-bold text-[color:var(--primary-red)]">
                    {feature.subheading}
                  </h3>
                  <div className="space-y-4 text-[color:var(--text-secondary)]">
                    <p>{feature.description1}</p>
                    <p>{feature.description2}</p>
                  </div>
                </div>

                {/* Image Column */}
                <div
                  className={`flex justify-center ${index === 1 ? "md:order-first" : ""}`}
                >
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    width={500}
                    height={450}
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="rounded-full bg-[color:var(--primary-red)] px-8 py-3 font-bold text-white shadow-md transition-transform duration-200 hover:scale-105">
            Check Detailed Pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdvancedSolutionsSection;
