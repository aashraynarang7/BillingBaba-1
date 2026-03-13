import React from 'react';

// --- ✨ Data for the GST Compliance Section ---
const gstFeaturesData = [
  {
    title: 'GSTIN',
    points: [
      'GST-compliant inventory control software for small businesses helps you keep a central record of the GSTIN for registered businesses.',
      'Save the GSTIN of customers and vendors.',
      'GSTIN gets added to the documents automatically.',
      'Documents like invoices, bills, sales and purchase orders.',
    ]
  },
  {
    title: 'HSN/SAC CODES',
    points: [
      'Using this online stock control software, you can include your HSN or SAC code for the things you offer and remain compliant with GST standards.',
      'Add HSN or SAC when you add an item or service.',
      'Select the thing when making a receipt or an order.',
      'Use our free HSN/SAC code finder tool.',
    ]
  },
  {
    title: 'INVOICES',
    points: [
      'Create invoices that will help you to get paid on time and also be ready for the GST requirements.',
      'Convert sales orders to invoices in easy steps.',
      'Designed to meet the 16 obligatory necessities issued by the CBIC.',
    ]
  },
  {
    title: 'TAXES',
    points: [
      'When you plan a deal arrangement, the CGST, IGST or SGST rates get calculated automatically, sparing you time and manual calculations.',
      'Our inventory control software for small businesses supports multiple tax rates.',
      'Mention the tax rate.',
      'The applicable taxes will be calculated automatically.',
    ]
  },
  {
    title: 'E-WAY BILLS',
    points: [
      'You can make an e-Way charge with all the data almost like the transport company, whereas you make an invoice.',
      'You can also make it for a credit note and a conveyance challan.',
      'See the step-by-step e-Way bill creation process.',
    ]

  },
  {
    title: 'DELIVERY CHALLAN',
    points: [
      'Delivery challans created in the App follow all the GST format requirements, and the item details are auto-filled during creation.',
      'Select the customer name.',
      'Decide the challan number and type.',
      'Select the item details.',
    ]
  },
];

const GstComplianceSection: React.FC = () => {
  return (
    <section className="bg-rose-50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            What Makes Our App Inventory GST Compliant
          </h2>
          <p className="mt-4 text-[color:var(--text-secondary)]">
            Our Inventory Management Tool combines smart automation with simplicity, designed for growing businesses that want to streamline their stock tracking and management effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {gstFeaturesData.map((feature, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-[color:var(--text-primary)]">
                {feature.title}
              </h3>
              <ul className="space-y-3">
                {feature.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start">
                    <span className="mr-3 mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                    <span className="text-sm text-[color:var(--text-secondary)]">{point}</span>
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

export default GstComplianceSection;