// Example file path: src/components/jewellery-page/BusinessEfficiencySection.tsx
"use effect"
import React from 'react';

// --- Type Definitions for TypeScript ---
interface DetailPoint {
  heading: string;
  text: string;
}

interface EfficiencyFeature {
  title: string;
  imageSrc: string;
  details: DetailPoint[];
  layout: 'textLeft' | 'textRight';
  bgColor: string;
}

// --- Data for the Component, transcribed from your image ---
const efficiencyData: EfficiencyFeature[] = [
  {
    title: 'Design-Wise Inventory Management',
    imageSrc: 'https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Design-Wise-Inventory-Management-01-1-1024x583.webp',
    details: [
      {
        heading: 'Fast and Error-Free Billing:',
        text: 'With each item linked to a barcode, the business enables instant scanning during checkout. It speeds up your billing process, avoids all manual entry errors, and ensures that every sale is accurately recorded.',
      },
      {
        heading: 'Real-Time Inventory Updates:',
        text: 'The barcode inventory system keeps your stock data accurate and up-to-date. You can easily track fast-moving items, monitor current stock levels, and avoid overstocking or stockout situations.',
      },
      {
        heading: 'Better Inventory Control:',
        text: 'It helps you fully manage your jewellery shop’s stock. You can quickly find any item and keep your records clean and simple. It also helps you catch mistakes early and run your shop better.',
      },
    ],
    layout: 'textLeft',
    bgColor: 'bg-background-light',
  },
  {
    title: 'Reporting and Analytics',
    imageSrc: 'https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Reporting-and-Analytics-01-1024x583.webp',
    details: [
      {
        heading: 'Track Sales & Profits:',
        text: 'With this Vyapar feature, you can easily figure out what is working in your business and where improvements are needed. You can also check daily, weekly, and monthly sales reports along with profit summaries.',
      },
      {
        heading: 'Monitor Stock Movement:',
        text: 'Stay on top of fast- and slow-moving items to plan purchases better and avoid overstocking.',
      },
      {
        heading: 'Identify Top Performers:',
        text: 'Identify the jewellery products or categories in your shop that are generating the most revenue. This helps you to improve your sales strategy and focus more on the best-performing items.',
      },
    ],
    layout: 'textRight',
    bgColor: 'bg-blue-50', // Alternating background color
  },
  {
    title: 'Jewellery Shop Cash Flow Management',
    imageSrc: 'https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Jewellery-Shop-Cash-Flow-Management-01-1-1024x583.webp',
    details: [
      {
        heading: 'Track Daily Cash Flow:',
        text: 'Record each cash in and cash out for every sale and expense in real time. Whether it is gold bangles or custom designs, you always know where the money is going out and coming in.',
      },
      {
        heading: 'Monitor Due Payments & Credits:',
        text: 'Always know the pending payments, bookings, and customers. Current balance It helps you to take the customer-friendly follow-ups and your future financial planning.',
      },
      {
        heading: 'Manage Supplier payments and costs:',
        text: 'Keep a close eye on your vendors’ payments and the raw materials you purchase. Always check for the making charges to overpay for the products and maintain profits.',
      },
    ],
    layout: 'textLeft',
    bgColor: 'bg-background-light',
  },
];


// Main Component
const BusinessEfficiencySection: React.FC = () => {
  return (
    <section className="bg-background-light">
      <div className="container mx-auto px-4 text-center py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
          Maximise Your Jewellery Business Efficiency with the Vyapar App
        </h2>
      </div>

      <div className="space-y-12">
        {efficiencyData.map((feature, index) => (
          <div key={index} className={feature.bgColor}>
            <div className="container mx-auto px-4 py-16">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                {/* Text Column */}
                <div className={`space-y-6 text-left ${feature.layout === 'textLeft' ? 'lg:order-1' : 'lg:order-2'}`}>
                  <h3 className="text-2xl font-bold text-primary-red">{feature.title}</h3>
                  <ul className="space-y-3 text-text-secondary">
                    {feature.details.map(detail => (
                      <li key={detail.heading}>
                        <strong className="font-semibold text-text-primary">{detail.heading}</strong> {detail.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image Column */}
                <div className={`flex justify-center ${feature.layout === 'textLeft' ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                     <img src={feature.imageSrc} alt={feature.title} className="w-full max-w-lg h-auto rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusinessEfficiencySection;