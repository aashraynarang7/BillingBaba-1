"use client"

import React from 'react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'

const featuresData = [
  {
    title: "Multi Store Management",
    description: "Simplify multi-store management, making it effortless to oversee multiple locations from a single platform. Track sales, inventory, and performance across all stores in real-time. Centralized control ensures consistent pricing, promotions, and customer service.",
    imageUrl: "/Solutions/Section4.webp",
  },
  {
    title: "Barcode Management",
    description: "Our software includes robust barcode management features. Generate and print barcodes for all products, ensuring quick and accurate scanning at checkout. This simplifies inventory tracking and minimizes manual errors with seamless barcode scanning.",
    imageUrl: "/Solutions/Section4-1.webp",
  },
  {
    title: "Online Store",
    description: "Manage your online store and streamline e-commerce inventory management operations. Integrate your online store with Vyapar to synchronize inventory, sales, and customer data in real time across multiple online platforms.",
    imageUrl: "/Solutions/Section4-2.webp",
  },
  {
    title: "Low Stock Alert",
    description: "Our software offers proactive low stock alerts. You'll receive automatic notifications when stock levels fall below predefined thresholds, allowing you to reorder products before running out, preventing stockouts and ensuring product availability.",
    imageUrl: "/Solutions/Section4-3.webp",
  },
  {
    title: "Payment Reminder",
    description: "Includes automated payment reminders, helping you manage receivables efficiently. Set up customized reminders for overdue invoices and upcoming payments, ensuring timely follow-ups. Automated notifications reduce the risk of missed payments and improve cash flow.",
    imageUrl: "/Solutions/Section4-4.webp",
  },
  {
    title: "Inventory Management",
    description: "Comes with robust inventory management features to keep your stock levels optimized. You can monitor inventory in real-time, set automatic reorder points, and receive alerts for low stock levels. Easily track stock movements and manage multiple warehouses.",
    imageUrl: "/Solutions/Section4-5.webp",
  },
  {
    title: "Manage Sale & Purchase",
    description: "Simplifies the management of sales and purchases. With this software, you can efficiently track and record each transaction, receiving real-time updates on stock levels and financials. Automate invoicing, monitor purchase orders, and analyze sales performance.",
    imageUrl: "/Solutions/Section4-6.webp",
  },
  {
    title: "Business Dashboard",
    description: "Features a comprehensive business dashboard that provides real-time insights into your operations. You can monitor sales, inventory levels, and financial performance from a single, easy-to-navigate interface.",
    imageUrl: "/Solutions/Section4-7.webp",
  },
  {
    title: "Bulk Update Items",
    description: "Allows for efficient bulk updates of items, enabling you to quickly update prices, descriptions, or stock levels for multiple products at once. This functionality saves time and reduces manual errors, making it an essential billing software for clothing stores.",
    imageUrl: "/Solutions/Section4-8.webp",
  },
  {
    title: "Cash Flow Tracking",
    description: "Includes robust cash flow tracking tools to help you manage your finances effectively. With this garment shop software, you can monitor incoming and outgoing cash, track payments and receipts, and analyze cash flow trends.",
    imageUrl: "/Solutions/Section4-9.webp",
  },
  {
    title: "Multi User Access",
    description: "Offers multi-user access to enhance team collaboration and operational efficiency. With this multi-user management system, you can assign different roles and permissions to team members, ensuring secure and controlled access to various features.",
    imageUrl: "/Solutions/Section4-10.webp",
  },
  {
    title: "Multi Payment Options",
    description: "Supports multiple payment options to cater to diverse customer preferences. With this billing software for readymade garments, you can accept payments via cash, credit/debit cards, digital wallets, and more, ensuring a smooth and flexible checkout experience.",
    imageUrl: "/Solutions/Section4-11.webp",
  },
  {
    title: "Print Share Invoices",
    description: "Simplifies the process of printing and sharing invoices. With this free billing software, you can easily generate and print professional invoices directly from the app or share them digitally via email or messaging platforms.",
    imageUrl: "/Solutions/Section4-12.webp",
  },
  {
    title: "Sales Analysis and Reporting",
    description: "Provides powerful sales analysis and reporting tools to help you manage your business effectively. With this billing software for retail clothing stores, you can analyze sales trends, track revenue, and identify top-performing products and customers.",
    imageUrl: "/Solutions/Section3-12.webp",
  }
];

const featureVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' } 
  },
};

export default function ProductFeaturesSection() {
  return (
    <section className="bg-background-section-gray py-16">
      <div className="container mx-auto space-y-12">
        <h2 className="text-4xl font-bold text-center text-foreground mb-12">
          Enhance Your Cloth Shop’s Productivity with Vyapar’s Garment Billing Software
        </h2>
        {featuresData.map((feature, index) => {
          const isImageLeft = index % 2 !== 0; // The second, fourth, etc., items will have the image on the left
          return (
            <motion.div
              key={index}
              className="bg-card rounded-2xl shadow-lg overflow-hidden"
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8">
                <div className={`text-content ${isImageLeft ? 'md:order-first' : 'md:order-last'}`}>
                  <h3 className="text-2xl font-bold text-[--primary-red] mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
                <div className="image-content">
                  <div className="bg-muted/50 p-6 rounded-xl border border-border/50 shadow-inner">
                    <Image
                      src={feature.imageUrl}
                      alt={`${feature.title} feature showcase`}
                      width={600}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}