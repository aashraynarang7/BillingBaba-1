"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

// --- Custom Icons ---
const XlsIcon = () => (
  <div className="relative">
    <svg
      width="80"
      height="100"
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path
          d="M0 8C0 3.58172 3.58172 0 8 0H54L80 26V92C80 96.4183 76.4183 100 72 100H8C3.58172 100 0 96.4183 0 92V8Z"
          fill="#2563EB"
        />
        <path
          d="M54 0L80 26H62C57.5817 26 54 22.4183 54 18V0Z"
          fill="#60A5FA"
        />
      </g>
    </svg>
    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-serif italic">
      xls
    </span>
  </div>
);

const UploadIcon = () => (
  <div className="relative">
    <svg
      width="100"
      height="120"
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0H62L100 38V108C100 114.627 94.6274 120 88 120H12C5.37258 120 0 114.627 0 108V12Z"
        fill="#2563EB"
        fillOpacity="0.9"
      />
      <path
        d="M62 0L100 38H74C67.3726 38 62 32.6274 62 26V0Z"
        fill="#93C5FD"
      />
      <path
        d="M49.9999 54V90"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 66L50 54L62 66"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// --- Page Component ---
export default function ImportExcelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Import Excel</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-400 hover:text-gray-600"
          onClick={() => router.back()}
        >
          <X className="h-6 w-6" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column */}
            <div className="flex flex-col items-center text-center space-y-8 pt-8">
              <p className="font-semibold text-gray-700">
                Download .xls/.xlsx (excel sheet)
                <br />
                template file to enter Data
              </p>
              <XlsIcon />
              <Button
                className="text-white shadow-lg shadow-blue-500/50 px-10 py-6 text-base rounded-md"
                style={{
                  background: "linear-gradient(to bottom, #3b82f6, #2563eb)",
                }}
              >
                Download
              </Button>
            </div>

            {/* Separator */}
            <div className="relative h-full hidden md:block">
              <Separator orientation="vertical" className="absolute h-full" />
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-center text-center space-y-4 pt-8">
              <p className="font-semibold text-gray-700">
                Upload your .xls/.xlsx (excel sheet)
              </p>
              <div className="w-full flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-16">
                <UploadIcon />
                <p className="text-gray-500 mt-6">
                  Drag and drop or{" "}
                  <button className="text-blue-600 font-semibold hover:underline focus:outline-none">
                    Click here to Browse
                  </button>
                  <br />
                  formatted excel file to continue
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
