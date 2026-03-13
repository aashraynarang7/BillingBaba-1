"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { BusinessDetailsStep } from "../component/BusinessDetailsStep";
import { PartyTransactionStep } from "../component/PartyTransactionStep";
import { ItemFieldsStep } from "../component/ItemFieldsStep";
import { InvoicePreview } from "../component/InvoicePreview";
import { SetupSuccessDialog } from "../component/SetupSuccessDialog";

export default function SetupBusinessPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { number: 1, title: "Enter Business Details", component: <BusinessDetailsStep /> },
    { number: 2, title: "Set Up Party and Transaction fields", component: <PartyTransactionStep /> },
    { number: 3, title: "Set Up Item Fields", component: <ItemFieldsStep /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Image src="/LOGO1.png" alt="Billing baba Logo" width={32} height={32}/>
          <h1 className="font-bold text-lg">
            Set Up My Business on <span className="text-red-500">Vyapar</span>
          </h1>
        </div>
        <Button variant="ghost" size="icon">
          <Home className="h-5 w-5"/>
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Left: current step form */}
        <div className="flex flex-col">
          <div className="mb-6 flex items-center gap-4">
            <Home className="h-6 w-6 text-gray-400"/>
            <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
          </div>
          <div className="flex-1">{currentStepData.component}</div>
        </div>

        {/* Right: invoice preview */}
        <InvoicePreview />
      </main>

      {/* Footer navigation */}
      <footer className="flex items-center justify-between p-4 border-t sticky bottom-0 bg-white z-10">
        {currentStep === 1 ? (
          <Button variant="outline" className="rounded-full">Cancel</Button>
        ) : (
          <Button variant="outline" className="rounded-full" onClick={handleBack}>
            Go Back
          </Button>
        )}
        <Button
          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-6"
          onClick={handleNext}
        >
          {currentStep === steps.length
            ? "Finish Set Up"
            : `Step ${currentStep + 1}: ${steps[currentStep].title}`}
          <ArrowRight className="ml-2 h-4 w-4"/>
        </Button>
      </footer>

      {/* Success modal */}
      <SetupSuccessDialog open={showSuccessModal} onOpenChange={setShowSuccessModal} />
    </div>
  );
}
