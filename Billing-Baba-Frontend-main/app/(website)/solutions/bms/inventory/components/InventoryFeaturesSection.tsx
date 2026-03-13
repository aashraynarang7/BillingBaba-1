import React from "react";
import Image from "next/image";

// --- ✨ Data for the Features Grid Section ---
const featuresData = [
  {
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/11/manage-godown-2.svg", // IMPORTANT: Icon path
    title: "Godown/Store Management",
    description:
      "Our inventory management system streamlines the management of multiple godowns or stores from a single location. Check how our App helps:",
    points: [
      {
        bold: "Centralised Management:",
        text: "Download our Inventory Control software for free and add multiple godowns from a single central hub for improved oversight.",
      },
      {
        bold: "Stock Transfer and Deliveries:",
        text: "Manage stock movements between godowns and shipments directly to customers.",
      },
      {
        bold: "Real-Time Inventory Tracking:",
        text: "Monitor available stocks, batch numbers, serial numbers, colours, models, sizes and more in real-time.",
      },
      {
        bold: "Online Store Management:",
        text: "Manage your online store with real-time inventory updates for customers, enabling a wider business reach.",
      },
    ],
  },
  {
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/11/stock-management.svg", // IMPORTANT: Icon path
    title: "Streamlined Stock Management",
    description:
      "Efficient stock management is key to balancing the customer supply and demand while minimising costs. See how our stock management system helps:",
    points: [
      {
        bold: "Inventory Balancing:",
        text: "Check previous item sales trends and maintain required stocks to fulfil customer demands without overstocking.",
      },
      {
        bold: "Barcode Integration:",
        text: "Our barcode inventory tool helps you to generate, print labels and use barcode scanners to simplify item tracking.",
      },
      {
        bold: "Low Stock Alerts:",
        text: "Get the notification when an item meets its minimum stock quantity and set re-orders for items to control stockouts.",
      },
      {
        bold: "Useful Reports:",
        text: "Access stock history, sales pattern, valuation, and ageing summary reports.",
      },
    ],
  },
  {
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/11/order-management.svg", // IMPORTANT: Icon path
    title: "Effortless Order Management",
    description:
      "Simplify your sales and purchase processes with our simplified order management tools. Here's how it helps:",
    points: [
      {
        bold: "Package and Shipment Tracking:",
        text: "Monitor packages and freight to ensure on-time deliveries and satisfied customers.",
      },
      {
        bold: "Customizable Invoices:",
        text: "Create professional invoices with your logo, signature, and terms for a personalised experience.",
      },
      {
        bold: "Order Tracking:",
        text: "Stay on top of pending deliveries and salesmen tracking for efficient management.",
      },
      {
        bold: "Integrated Inventory Management:",
        text: "Inventory and orders are auto-linked, so it keeps the reserved stocks for orders available.",
      },
    ],
  },
  {
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/11/gst-compliant.svg", // IMPORTANT: Icon path
    title: "Stay GST Compliant with Ease",
    description:
      "Our billing system simplifies GST compliance, making sure that your business operations are aligned with regulatory requirements. See how it helps:",
    points: [
      {
        bold: "Centralised GSTIN Management:",
        text: "Keep a record of GSTINs for registered businesses for seamless GST transactions.",
      },
      {
        bold: "GST-Compliant Invoicing:",
        text: "Generate professional invoices and bills by following GST regulations and complete tax details.",
      },
      {
        bold: "E-Way Bills and E-Invoices:",
        text: "Create GST-compliant E-way bills and E-invoices without any effort.",
      },
      {
        bold: "Tax Filing Made Easy:",
        text: "Get the important GST reports to the GST portal with the required JSON file directly from the app.",
      },
    ],
  },
];

const InventoryFeaturesSection: React.FC = () => {
  return (
    <section className="bg-sky-50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            How Inventory Management Made Easy, Efficient, Effective by Us
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {featuresData.map((feature, index) => (
            <div key={index} className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Image
                    src={feature.iconSrc}
                    alt={`${feature.title} icon`}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--text-primary)]">
                  {feature.title}
                </h3>
              </div>

              <p className="mb-6 text-sm text-[color:var(--text-secondary)]">
                {feature.description}
              </p>

              <ul className="space-y-3">
                {feature.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start">
                    <span className="mr-3 mt-1.5 block h-2 w-2 flex-shrink-0 rounded-full bg-sky-500"></span>
                    <span className="text-sm text-[color:var(--text-secondary)]">
                      <strong className="font-bold text-[color:var(--text-primary)]">
                        {point.bold}
                      </strong>{" "}
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InventoryFeaturesSection;
