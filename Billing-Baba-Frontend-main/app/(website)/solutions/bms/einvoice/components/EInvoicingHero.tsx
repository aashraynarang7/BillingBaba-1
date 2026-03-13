// Example file path: src/components/EInvoicingHero.tsx

import React from "react";
// FIX 1: Se cambió la importación de 'react-router-dom' a 'next/link'.
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const EInvoicingHero: React.FC = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          {/* FIX 2: Se cambió 'to' por 'href' en todos los Links. */}
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/free" className="hover:text-gray-700">
            Free
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/invoicing-software" className="hover:text-gray-700">
            Invoicing Software
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700 font-medium">E-Invoicing</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              E-Invoicing System Software
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Vyapar’s{" "}
              <strong className="font-semibold text-gray-700">
                e-invoicing software
              </strong>{" "}
              ensures faster, secure and easier e-invoice creation in just under
              2 minutes and streamlines all your other invoicing operations.
              Avail a free trial and get started today!
            </p>
            <Link href="/download">
              <button className="mt-8 bg-red-600 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">
                Download E-Invoicing Software
              </button>
            </Link>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://vyaparapp.in/v/z/wp-content/uploads/2024/07/hero_Hero-copy-5-2048x1367.webp"
              alt="E-Invoicing Software on a laptop screen"
              className="w-full max-w-2xl h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EInvoicingHero;
