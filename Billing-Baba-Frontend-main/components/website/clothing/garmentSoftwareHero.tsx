"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ReceiptText, Archive, Percent } from "lucide-react";

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Free", href: "/free" },
  { name: "Retail Shop Billing Software", href: "/retail" },
  { name: "Cloth Shop", href: "#" },
];

const features = [
  {
    icon: <ReceiptText className="h-10 w-10 text-green-500" />,
    title: "Customize Billing",
  },
  {
    icon: <Archive className="h-10 w-10 text-blue-500" />,
    title: "Order Management",
  },
  {
    icon: <Percent className="h-10 w-10 text-orange-500" />,
    title: "Discount Management",
  },
];

export default function GarmentSoftwareHero() {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="container mx-auto px-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex flex-wrap items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.name}>
                <div className="flex items-center">
                  {index !== 0 && (
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  )}
                  <Link
                    href={crumb.href}
                    className={`ml-2 hover:text-gray-700 ${
                      index === breadcrumbs.length - 1 ? 'font-medium text-gray-700' : ''
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Garment & Cloth Shop Billing Software
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Run Your Cloth Shop Smoother with Vyapar! Create invoices in seconds, manage
              inventory easily, track sales & insights. Get paid faster! Free for Cloth Shops.
            </p>
            <div className="mt-10">
              <button
                className="rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Download Garment Billing Software
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start">
            <div className="hidden sm:flex flex-col items-center justify-around gap-8 self-stretch pr-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  {index !== 0 && <div className="mb-8 h-px w-16 bg-gray-200" />}
                  {feature.icon}
                  <p className="mt-2 text-sm font-semibold text-gray-700">{feature.title}</p>
                </div>
              ))}
            </div>
            
            <div className="relative w-full max-w-2xl">
              <Image
                src="/Solutions/Hero.webp" // Replace with the actual image path
                alt="Garment & Cloth Shop Billing Software interface on desktop and mobile"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}