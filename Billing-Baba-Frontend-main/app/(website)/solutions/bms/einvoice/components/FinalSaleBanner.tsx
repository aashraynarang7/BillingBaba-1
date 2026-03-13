// FIX: Se añadió "use client" para que el componente sea interactivo en el navegador.
"use client";

// Example file path: src/components/FinalSaleBanner.jsx
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner"; // 'sonner' es una librería de cliente

const FinalSaleBanner = () => {
  const couponCode = "FINAL60";

  // Esta función usa APIs del navegador (navigator.clipboard) y necesita ejecutarse en el cliente.
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success(`Coupon code "${couponCode}" copied to clipboard!`);
  };

  return (
    // Main container with a red background
    <div className="bg-red-600 text-white font-sans overflow-hidden">
      <div
        className="container mx-auto px-6 py-4 flex items-center justify-around gap-4 relative"
        // This inline style creates the subtle grid pattern from the image
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Section 1: Happy Customers & Features */}
        <div className="flex items-center gap-8">
          <div className="bg-yellow-400 text-red-700 font-bold p-4 rounded-2xl text-center shadow-lg transform -rotate-3 shrink-0">
            <p className="text-3xl">10M+</p>
            <p className="text-sm tracking-wide">Happy Customers</p>
          </div>
          <div className="text-xl font-bold tracking-wider leading-relaxed">
            <p>E-WAY BILL</p>
            <p>E-INVOICING</p>
            <p>LOYALTY POINTS</p>
          </div>
        </div>

        {/* Section 2: Final Sale Text */}
        <div className="relative text-center">
          <h2
            className="text-7xl font-extrabold"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
          >
            <span className="text-white drop-shadow-lg">Final</span>
            <br />
            <span className="text-yellow-300 drop-shadow-lg">Sale</span>
          </h2>
          <ArrowUpRight className="absolute -bottom-2 -right-4 w-12 h-12 text-yellow-300" />
        </div>

        {/* Section 3: Call to Action Text */}
        <div className="flex items-center gap-4">
          <div className="bg-white text-gray-800 p-4 rounded-xl shadow-md text-center">
            <p className="font-semibold">Last day of month—your final</p>
            <p className="font-semibold">chance to grab massive deals!</p>
          </div>
          <div className="bg-yellow-400 text-red-700 font-bold px-6 py-2 rounded-lg text-lg transform rotate-3 shadow-md">
            Hurry Up!
          </div>
        </div>

        {/* Section 4: Discount Badge */}
        <div className="relative">
          <div
            className="bg-yellow-400 text-red-700 font-extrabold p-4 rounded-xl relative transform -rotate-6 shadow-lg"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 75%)",
            }}
          >
            <p className="text-7xl">60%</p>
            <p className="text-xs absolute top-10 right-3 font-bold">
              OFF ON <br /> MRP
            </p>
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-red-800 font-bold px-4 py-2 rounded-full text-sm shadow-md">
            SAVE UPTO
          </div>
        </div>

        {/* Section 5: Coupon Code */}
        <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-white text-red-600 font-bold p-2 text-center">
            <p>
              <span className="text-2xl">30ᵗʰ</span> AUG
            </p>
            <p className="text-sm">8am to 12am Midnight</p>
          </div>
          <div className="bg-yellow-400 text-gray-800 p-3 flex items-center justify-center gap-4">
            <span className="font-bold">COUPON CODE</span>
            <button
              onClick={handleCopyCoupon}
              className="bg-white text-gray-900 font-extrabold text-2xl px-4 py-1 rounded-lg border-2 border-dashed border-gray-400 hover:bg-gray-100 transition"
              title="Click to copy"
            >
              {couponCode}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSaleBanner;
