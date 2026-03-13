// Example file path: src/components/ProductDetailsService.tsx

import React from "react";

// --- Type Definitions for TypeScript ---
interface DetailItem {
  title: string;
  subtitle: string;
  color: string;
  transform: string;
  arcPath: string;
  arcColor: string;
}

// --- Data for the Component, transcribed from your image ---
const detailItems: DetailItem[] = [
  {
    title: "Itemised List",
    subtitle: "Product name, Service invoice",
    color: "bg-blue-500",
    transform: "translate(-120%, -100%)",
    arcPath: "M 40 100 A 60 60 0 0 1 100 40",
    arcColor: "stroke-blue-500",
  },
  {
    title: "Quantity",
    subtitle: "The number of units",
    color: "bg-orange-500",
    transform: "translate(-50%, -160%)",
    arcPath: "M 100 40 A 60 60 0 0 1 160 100",
    arcColor: "stroke-orange-500",
  },
  {
    title: "Unit Price",
    subtitle: "Product or Service Price",
    color: "bg-red-500",
    transform: "translate(50%, -160%)",
    arcPath: "M 160 100 A 60 60 0 0 1 100 160",
    arcColor: "stroke-red-500",
  },
  {
    title: "Tax Rate",
    subtitle: "GST, CGST, etc.",
    color: "bg-teal-500",
    transform: "translate(120%, -100%)",
    arcPath: "M 100 160 A 60 60 0 0 1 40 100",
    arcColor: "stroke-teal-500",
  },
];

const ProductDetailsService: React.FC = () => {
  return (
    // This section has a light blue background
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Diagram */}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative w-52 h-52">
              {/* Central Circle */}
              <div className="absolute inset-8 bg-orange-500 rounded-full flex items-center justify-center text-center text-white font-bold text-xl leading-tight shadow-lg z-10">
                Product, <br /> Service Details
              </div>

              {/* SVG for Arcs and connecting lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                {detailItems.map((item, index) => (
                  <path
                    key={index}
                    d={item.arcPath}
                    fill="none"
                    strokeWidth="10"
                    className={item.arcColor}
                  />
                ))}
              </svg>

              {/* Detail Bubbles */}
              {detailItems.map((item, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: item.transform }}
                >
                  {/* Connecting Line */}
                  <div
                    className="absolute w-px h-8 bg-gray-400"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateY(-4px)",
                    }}
                  >
                    <div className="absolute w-2 h-2 rounded-full bg-gray-400 -bottom-1 -left-0.5"></div>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`relative ${item.color} text-white rounded-full w-32 h-32 flex flex-col items-center justify-center text-center p-2 shadow-md`}
                    style={{ clipPath: "circle(50% at 50% 50%)" }}
                  >
                    <div
                      className="absolute bottom-0 w-4 h-4 bg-inherit transform rotate-45"
                      style={{ marginBottom: "-8px" }}
                    ></div>
                    <p className="font-bold text-lg">{item.title}</p>
                    <p className="text-xs">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Text List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-red">
              Product or Service Details
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start">
                <span className="font-bold text-text-primary mr-2">•</span>
                <div>
                  <strong className="font-semibold text-text-primary">
                    Itemised list of products or services:
                  </strong>{" "}
                  Product name or service being invoiced.
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-text-primary mr-2">•</span>
                <div>
                  <strong className="font-semibold text-text-primary">
                    Quantity:
                  </strong>{" "}
                  The number of units of each product or service provided.
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-text-primary mr-2">•</span>
                <div>
                  <strong className="font-semibold text-text-primary">
                    Unit Price:
                  </strong>{" "}
                  The price per unit of each product or service.
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-text-primary mr-2">•</span>
                <div>
                  <strong className="font-semibold text-text-primary">
                    Tax Rate:
                  </strong>{" "}
                  Applicable tax rates for each item (e.g., GST).
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsService;
