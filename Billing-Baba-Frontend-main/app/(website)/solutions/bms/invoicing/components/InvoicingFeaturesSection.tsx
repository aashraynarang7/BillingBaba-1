import React from "react";
import Image from "next/image";

// --- ✨ Data for the Features Section ---
const featuresData = [
  {
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Custom-invoice-1534x1536.webp", // IMPORTANT: Image path
    title: "Professional & Customisable Invoices",
    description: (
      <>
        Billing Baba makes creating professional-looking invoices for your
        customers easy. With our{" "}
        <strong className="text-gray-700">GST billing software</strong>, you can
        easily add your business logo, modify the invoice themes, color scheme,
        and add your professional signature. Our app offers 10+ multiple invoice
        templates in both online & offline modes, which are entirely
        customizable. Customization is possible to a great extent based on your
        specific business requirements.
      </>
    ),
  },
  {
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Quick-billing-1534x1536.webp", // IMPORTANT: Image path
    title: "Instant Invoicing",
    description: (
      <>
        Our instant invoicing software reduces effort, eliminates errors,
        secures timely billing, and improves your cash flow. It helps you follow
        the data you have entered and process it automatically. The best part is
        that you don't have to spend a lot of time on the invoice as our
        software provides an ultimate customer experience.
      </>
    ),
  },
  {
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/QR-Code-1536x1536.webp", // IMPORTANT: Image path
    title: "Print QR Code",
    description: (
      <>
        Customers always look for a popular and easy way to make payments. You
        can make it easy for them by providing a{" "}
        <strong className="text-gray-700">QR code</strong> on the invoice. This
        QR code payment option lets your customers pay using UPIs, mobile
        wallets, NEFT, IMPS, etc. Our QR code integration enhances the customer
        experience, secures payments, and ensures a faster transaction process.
      </>
    ),
  },
  {
    imageSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/08/Multi-Print-Compatibility-1024x1024.webp",
    title: "Multi-Type Printer Support",
    description: (
      <>
        Billing Baba app offers extensive print compatibility, providing over{" "}
        <strong className="text-gray-700">10+ themes</strong> for regular
        printing, including{" "}
        <strong className="text-gray-700">A4/A5 themes</strong>. You can change
        the print orientation in your business needs, with options available in
        both portrait and landscape. Additionally, our software supports the
        printing of thermal prints to provide receipts based on your specific
        business requirements.
      </>
    ),
  },
];

const InvoicingFeaturesSection: React.FC = () => {
  return (
    <section className="bg-[color:var(--background-section-gray)] py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Best Features of Invoicing Software Makes Life Easy
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {featuresData.map((feature, index) => (
            <div key={index}>
              <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-lg">
                <Image
                  src={feature.imageSrc}
                  alt={feature.title}
                  width={600}
                  height={400}
                  className="h-auto w-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
                  {feature.title}
                </h3>
                <div className="mt-4 text-[color:var(--text-secondary)]">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvoicingFeaturesSection;
