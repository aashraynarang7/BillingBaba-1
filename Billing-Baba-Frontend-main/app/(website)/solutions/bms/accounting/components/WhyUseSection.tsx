import React from "react";
import Image from "next/image";

// --- ✨ Data for the Benefits Grid ---
const benefitsData = [
  {
    iconSrc: "/inventory/keeps-Accurate-Records-150x150.png", // IMPORTANT: Image path
    iconBgColor: "bg-purple-100",
    title: "Keeps Accurate Records",
    description:
      "Keeping track of cash flow will be easier and ensure the documents will be ready to file taxes. Our accounting bookkeeping app automates all the necessary bills without misplacing them.",
  },
  {
    iconSrc: "/inventory/Monitors-Business-Health-150x150.png", // IMPORTANT: Image path
    iconBgColor: "bg-green-100",
    title: "Monitors Business Health",
    description:
      "Tracking finances has never been so straightforward! You can have an overview of sales and expenses with simplified charts. As soon as you update a deal, the data gets updated without delay.",
  },
  {
    iconSrc: "/inventory/Get-Payment-Faster-150x150.png", // IMPORTANT: Image path
    iconBgColor: "bg-yellow-100",
    title: "Get Payment Faster",
    description:
      "Concerned about overdue payments? Utilize the app's automated reminders to prompt customers and facilitate direct UPI payment to your bank account, speeding up your payment process.",
  },
  {
    iconSrc: "/inventory/Looks-Professional-150x150.png", // IMPORTANT: Image path
    iconBgColor: "bg-blue-100",
    title: "Looks Professional",
    description:
      "Issuing GST invoices not only simplifies your taxation but also enhances your professional image and customer service. It offers a transparent view of your sales, leaving a positive impression.",
  },
  {
    iconSrc: "/inventory/Save-Time-and-Money-150x150.png", // IMPORTANT: Image path
    iconBgColor: "bg-pink-100",
    title: "Saves Time and Money",
    description:
      "Traditional accounting is time-consuming. Digital accounting with the app streamlines the process and saves a lot of money, reducing the risk of calculation errors.",
  },
  {
    iconSrc: "/inventory/Faster-Business-Growth-150x150.png", // IMPORTANT: Image path
    iconBgColor: "bg-red-100",
    title: "Faster Business Growth",
    description:
      "Using the small business accounting software, you can be assured about the accounts of your business. It will allow you to make plans for the future by using data.",
  },
];

const WhyUseSection: React.FC = () => {
  return (
    <section className="bg-sky-50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Why Use Our Accounting Software for Small Businesses in India?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${benefit.iconBgColor}`}
              >
                <Image
                  src={benefit.iconSrc}
                  alt={`${benefit.title} icon`}
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[color:var(--text-primary)]">
                {benefit.title}
              </h3>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUseSection;
