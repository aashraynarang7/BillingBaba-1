"use client"; // Important: This component needs state for interactivity

import React, { useState } from "react";
import Image from "next/image";

// --- ✨ Data for the Steps Section ---
const stepsData = [
  {
    title: "Launch Billing Baba",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Img_Launch-Vyapar.webp", // IMPORTANT: Image path
  },
  {
    title: "Enter Customer Details",
    imageSrc:
      "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201024%20615%22%3E%3C/svg%3E", // IMPORTANT: Image path
  },
  {
    title: "Enter Product or Service Details",
    imageSrc:
      "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201024%20614%22%3E%3C/svg%3E", // IMPORTANT: Image path
  },
  {
    title: "Customization",
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Create-Invoices.webp", // IMPORTANT: Image path
  },
  {
    title: "Save and Share",
    imageSrc:
      "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201024%20615%22%3E%3C/svg%3E", // IMPORTANT: Image path
  },
];

const InvoiceStepsSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-sky-50 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
          5 Easy Steps to Create Invoices Easily on Billing Baba
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* Left Column: Step Buttons */}
          <div className="flex flex-col gap-4">
            {stepsData.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`rounded-lg p-5 text-left text-lg font-semibold shadow-sm transition-all duration-200 ${
                  activeStep === index
                    ? "bg-sky-100 text-sky-600 ring-2 ring-sky-500"
                    : "bg-white text-[color:var(--text-secondary)] hover:bg-gray-50"
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          {/* Right Column: Image Display */}
          <div className="flex items-center justify-center rounded-lg bg-white p-4 shadow-lg">
            <Image
              src={stepsData[activeStep].imageSrc}
              alt={`Step ${activeStep + 1}: ${stepsData[activeStep].title}`}
              width={500}
              height={400}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceStepsSection;
