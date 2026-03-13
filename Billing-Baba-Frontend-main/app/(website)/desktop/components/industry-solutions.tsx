"use client"

import React, { useState, useRef } from "react"
import {
  Building2,
  Shirt,
  Truck,
  Store,
  Laptop,
  HeartPulse,
  Car,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const industryData = [
  {
    id: 1,
    name: "Manufacturing",
    icon: <Building2 className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-1.webp",
    content: {
      subTitle: "Streamline Your Operations with Powerful Desktop Billing Software",
      description: "Running a hardware, furniture, or construction material business requires efficient management of inventory, invoicing, and customer relationships. Our PC billing software streamlines these processes across various industries with the following features:",
      features: [
        { title: "Inventory Management:", text: "Track stock levels, raw materials, and equipment accurately, with low-stock alerts to prevent shortages." },
        { title: "Optimized Invoicing:", text: "Create professional, customized invoices with itemized lists, product images, and tax calculations." },
        { title: "Customer Relationship Management:", text: "Track purchase history and preferences to offer personalized recommendations and promotions." },
        { title: "Real-time Payment Tracking:", text: "Monitor payments in real-time, reduce overdue balances, and improve cash flow with automated reminders." },
      ],
    },
  },
  {
    id: 2,
    name: "Fashion",
    icon: <Shirt className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-2.webp",
    content: {
      subTitle: "Elevate Your Business with Smart Billing",
      description: "Running an apparel, footwear, or salon business requires efficient management and a deep understanding of customer preferences. Our free billing software for PC is designed to streamline operations and boost sales across these industries with the following features:",
      features: [
        { title: "Inventory and Product Management:", text: "Track varying sizes, styles, and brands effortlessly, with low-stock alerts to keep your shelves stocked with the right products." },
        { title: "Personalized Invoicing:", text: "Create professional invoices with detailed product information, customer details, barcode scan billing, and clear payment terms." },
        { title: "Flexible Payment Options:", text: "Offer a variety of payment methods, from cash and card to digital modes, for a smooth payment experience." },
        { title: "Sales Analytics:", text: "Analyze sales data to understand customer preferences, identify top-selling items, and optimize inventory and marketing strategies." },
        { title: "Customer Relationship Management:", text: "Track purchase history to offer personalized recommendations and promotions that boost customer satisfaction." },
      ],
    },
  },
  {
    id: 3,
    name: "Logistics",
    icon: <Truck className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-3.webp",
    content: {
      subTitle: "Boost Efficiency with Specialized Billing Application",
      description: "Running a transport or travel agency business involves managing complex logistics, bookings, and tight schedules. Our computer billing software is tailored to streamline these operations and enhance your efficiency across these industries with the following features:",
      features: [
        { title: "Shipment and Booking Management:", text: "Track consignments and manage bookings efficiently, from pickup to delivery or flights to tours, ensuring complete visibility and accuracy." },
        { title: "Digital Documentation and Invoicing:", text: "Easily create digital delivery challans or quotations, converting them into accurate invoices that include transportation costs, discounts, or GST rates." },
        { title: "Payment and Commission Tracking:", text: "Monitor payments closely to ensure timely collections and track commissions for agents and partners, improving cash flow and transparency." },
        { title: "Customer Relationship Management:", text: "Store and manage customer information to personalize services, build loyalty, and enhance customer satisfaction." },
      ],
    },
  },
  {
    id: 4,
    name: "Retail",
    icon: <Store className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-4.webp",
    content: {
      subTitle: "Simplify Your Sales with a Powerful Billing Solution",
      description: "Running a grocery store, supermarket, or provision store involves managing a high volume of transactions and inventory efficiently. Our billing app for PC is specifically designed for the retail industry, offering the following features to streamline your operations:",
      features: [
        { title: "Custom Invoicing:", text: "Generate detailed, professional invoices with complete transaction information, ensuring accuracy and clarity for both you and your customers." },
        { title: "Inventory Management:", text: "Easily track inventory levels, from daily essentials to bulk products, and receive low-stock alerts to prevent shortages and meet customer demand." },
        { title: "Quick Billing:", text: "Process multiple customer transactions simultaneously with our fast and efficient barcode billing system, perfect for busy hours in supermarkets." },
        { title: "Tax Compliance:", text: "Create Tax-compliant invoices effortlessly, simplifying tax reporting and ensuring your business stays on the right side of the law." },
      ],
    },
  },
  {
    id: 5,
    name: "Electric and Electronics",
    icon: <Laptop className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-5.webp",
    content: {
      subTitle: "Optimize Your Business with Smart Billing",
      description: "Managing a mobile or electrical shop involves keeping track of diverse inventory and handling numerous transactions efficiently. Our billing application is tailored to meet these needs with features designed for the retail industry:",
      features: [
        { title: "Inventory Tracking:", text: "Monitor the availability of each smartphone model or electrical equipment in real-time. Ensure you stock high-demand items and avoid over-purchasing by having clear insights into current inventory levels." },
        { title: "Efficient Billing:", text: "Process transactions quickly and accurately, from high-value smartphones to various electrical tools. Streamline the checkout experience for your customers with a user-friendly billing system." },
        { title: "Supplier Management:", text: "Manage orders with ease by keeping track of equipment and tools already in stock. Avoid unnecessary purchases and maintain a smooth supply chain with automated order suggestions based on inventory levels." },
        { title: "Sales Reporting:", text: "Analyze sales data to understand which products are performing well and adjust your inventory strategy accordingly. This helps you stay competitive and maximize profits." },
      ],
    },
  },
  {
    id: 6,
    name: "Healthcare",
    icon: <HeartPulse className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-6.webp",
    content: {
      subTitle: "Streamline Your Healthcare Operations with Dedicated PC Billing Software",
      description: "Managing a healthcare organization or software that involves juggling numerous tasks, from patient care to inventory management. Our billing app for PC is designed to streamline these processes with features tailored specifically for the healthcare industry:",
      features: [
        { title: "Automated Billing:", text: "Generate accurate and detailed invoices for services and treatments with ease, ensuring smooth and transparent transactions." },
        { title: "Inventory Management:", text: "Keep track of medical supplies and pharmaceuticals efficiently. Set up automatic alerts for expiring medicines or low stock to avoid shortages and maintain optimal inventory levels." },
        { title: "Patient Management:", text: "Record and manage patient details, appointments, and billing information in one place, improving overall efficiency and customer service." },
        { title: "Reporting and Analytics:", text: "Generate comprehensive reports on expenses, and revenue. Make data-driven decisions to improve cost-effective operations." },
      ],
    },
  },
  {
    id: 7,
    name: "Automotive",
    icon: <Car className="w-6 h-6" />,
    imageSrc: "/Desktop/Section11-7.webp",
    content: {
      subTitle: "Bring Speed to Your Automobile Business Operations",
      description: "Running an automobile shop involves managing a range of products and transactions efficiently. Our Vyapar PC billing software is designed to enhance operations in this industry with features tailored to your needs:",
      features: [
        { title: "Detailed Sales Tracking:", text: "Easily record and track sales of vehicles, spare parts, and tools, ensuring accuracy and efficiency in every transaction." },
        { title: "Inventory Management:", text: "Monitor your inventory in real-time, including spare parts and tools, with automated alerts for low stock levels to prevent disruptions." },
        { title: "Efficient Billing:", text: "Generate invoices quickly with clear, itemized details for each transaction, streamlining the checkout process for both you and your customers." },
        { title: "Tax Reporting:", text: "Simplify tax filing with automated tax reports that save you time and ensure compliance with tax regulations." },
        { title: "Service Management:", text: "Track repair orders, labor costs, and parts used. Improve service efficiency and customer satisfaction." },
      ],
    },
  },
]

export default function IndustrySolutions() {
  const [activeIndustryId, setActiveIndustryId] = useState(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const activeIndustry = industryData.find((i) => i.id === activeIndustryId)

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (!activeIndustry) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--background-section-gray)]">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          Ultimate Desktop Billing Solution for Every Industry
        </h2>

        <div className="relative mb-8">
          <button onClick={() => handleScroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div ref={scrollContainerRef} className="flex items-center gap-8 overflow-x-auto scrollbar-hide py-2 px-12">
            {industryData.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveIndustryId(industry.id)}
                className={`flex items-center gap-3 py-3 whitespace-nowrap border-b-2 transition-all duration-300 ${
                  activeIndustryId === industry.id
                    ? "border-[var(--text-link-active)] text-[var(--text-link-active)]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <span className={`p-2 rounded-full ${activeIndustryId === industry.id ? "bg-blue-100" : "bg-gray-100"}`}>
                  {industry.icon}
                </span>
                <span className="font-medium">{industry.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => handleScroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <div key={activeIndustryId} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
          <div className="bg-white p-4 border border-gray-100">
            <img src={activeIndustry.imageSrc} alt={activeIndustry.name} className="w-96 h-96 rounded-xl" />
          </div>
          <div className="bg-white p-8 rounded-2xl  border border-gray-100 max-h-[450px] overflow-y-auto thin-scrollbar">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">{activeIndustry.name}</h3>
              <div className="space-y-4 text-[var(--text-foreground)]">
                <p className="font-semibold">{activeIndustry.content.subTitle}</p>
                <p>{activeIndustry.content.description}</p>
              </div>
              <div className="space-y-4">
                {activeIndustry.content.features.map((feature, index) => (
                  <div key={index}>
                    <p className="text-sm">
                      <strong className="text-[var(--text-primary)] font-semibold">{feature.title}</strong>{" "}
                      <span className="text-[var(--text-foreground)]">{feature.text}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}