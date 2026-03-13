"use client"
import React from 'react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

const featuresData = [
  { title: "Multi Store Management", imageUrl: "/Solutions/Section3.png" },
  { title: "Barcode Management", imageUrl: "/Solutions/Section3-1.png" },
  { title: "Set Retail & Whole Price", imageUrl: "/Solutions/Section3-2.png" },
  { title: "Low Stock Alert", imageUrl: "/Solutions/Section3-3.png" },
  { title: "Payment Reminder", imageUrl: "/Solutions/Section3-4.png" },
  { title: "Inventory Management", imageUrl: "/Solutions/Section3-5.png" },
  { title: "Manage Sale & Purchase", imageUrl: "/Solutions/Section3-6.png" },
  { title: "Business Dashboard", imageUrl: "/Solutions/Section3-7.png" },
  { title: "Bulk Update Items", imageUrl: "/Solutions/Section3-8.png" },
  { title: "Cash Flow Tracking", imageUrl: "/Solutions/Section3-9.png" },
  { title: "Multi User Access", imageUrl: "/Solutions/Section3-10.png" },
  { title: "Multi Payment Options", imageUrl: "/Solutions/Section3-11.png" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function AdditionalFeatures() {
  return (
    <section className="py-16 bg-[--background-beyond-billing]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Additional Features of Garment Shop Billing Software by Vyapar!
        </h2>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 text-center flex flex-col items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              variants={cardVariants}
            >
              <div className="h-20 w-20 flex items-center justify-center">
                <Image 
                  src={feature.imageUrl} 
                  alt={feature.title} 
                  width={80} 
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="mt-4 font-semibold text-foreground text-md">
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}