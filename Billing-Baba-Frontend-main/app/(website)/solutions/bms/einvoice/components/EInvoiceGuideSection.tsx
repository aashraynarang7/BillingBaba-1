// FIX: Se añadió "use client" para que el componente sea interactivo en el navegador.
"use client";

import React, { useState } from "react";

// --- Type Definitions for TypeScript ---
interface StepContent {
  title: string;
  points: string[];
}

interface Step {
  tabTitle: string;
  content: StepContent;
}

// --- Data for the Component, transcribed from your image ---
const stepsData: Step[] = [
  {
    tabTitle: "Launch Vyapar",
    content: {
      title: "Step 1: Open Vyapar Software",
      points: ["Launch the Vyapar e-invoice app on your device."],
    },
  },
  {
    tabTitle: "Create E Invoice",
    content: {
      title: "Step 2: Create a Sales Invoice",
      points: [
        "Add Party Details: Ensure that the party’s GST details are already added to the system.",
        "Create Invoice: Generate a sales invoice for the transaction, ensuring it is taxed appropriately.",
      ],
    },
  },
  {
    tabTitle: "Verification",
    content: {
      title: "Step 3: Verification & Submission",
      points: [
        "Review all the details on the generated invoice for accuracy.",
        "Submit the invoice to the IRP (Invoice Registration Portal) directly through the software.",
      ],
    },
  },
];

const EInvoiceGuideSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    // Using 'bg-background-light' from your global CSS
    <section className="bg-background-light py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* Top Section: Title and Video Thumbnail */}
        <div className="max-w-3xl mx-auto">
          {/* Using 'text-text-primary' and 'text-text-secondary' from global CSS */}
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            How Do You Create an E-invoice on Vyapar E-invoicing Software?
          </h2>
          <p className="mt-4 text-text-secondary">
            You can access the Vyapar app’s electronic invoicing software in
            many ways. There are a few steps that you need to follow to gain
            full access.
          </p>
        </div>

        <div className="my-12">
          <a
            href="https://www.youtube.com/watch?v=your_video_id" // Replace with your video link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://tse2.mm.bing.net/th/id/OIP.vwv3cbxchXTBrdBOP9mBmAHaHa?pid=Api&P=0&h=180"
              alt="Generate E-invoice in Vyapar App - Watch Now"
              className="max-w-lg w-full h-auto rounded-lg shadow-lg"
            />
          </a>
        </div>

        {/* Bottom Section: Step-by-Step Guide */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-text-primary mb-8">
            Step-by-Step Guide To Generate E-Invoice
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Left Column: Tab Buttons */}
            <div className="flex flex-col gap-2">
              {stepsData.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all duration-200 border-2 ${
                    activeStep === index
                      ? "bg-white text-blue-600 border-blue-500 shadow-md"
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {step.tabTitle}
                </button>
              ))}
            </div>

            {/* Right Column: Tab Content */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-text-primary mb-4">
                {stepsData[activeStep].content.title}
              </h4>
              <ul className="space-y-3 list-disc list-inside">
                {stepsData[activeStep].content.points.map((point, idx) => (
                  <li key={idx} className="text-text-secondary">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EInvoiceGuideSection;
