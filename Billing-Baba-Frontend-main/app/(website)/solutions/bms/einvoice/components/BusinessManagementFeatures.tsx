import React from "react";
interface FeatureItem {
  title: string;
  description: string;
  iconSrc: string;
  bgColor: string;
}

const featuresData: FeatureItem[] = [
  {
    title: "Multiple Features",
    description:
      "Vyapar’s e-invoicing app offers small businesses features like multi-invoice formats, sales reporting, data storage, and GST bill printing, making it a versatile tool for various business needs.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Icon-Other.png",
    bgColor: "bg-cyan-100",
  },
  {
    title: "People-Efficient",
    description:
      "Starting small businesses often means managing tasks alone or with a tiny team. Vyapar’s e-invoicing app keeps your business organised and synced across all devices, updating data in real-time efficiently.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/People-Efficient.png",
    bgColor: "bg-pink-100",
  },
  {
    title: "Easy-To-Use",
    description:
      "Starting a business with no knowledge of e-invoicing can be complex. Vyapar simplifies it for MSMEs, making e-invoicing and account management easy for anyone, regardless of their sales, marketing, or accounting experience.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Easy-to-Use.png",
    bgColor: "bg-green-100",
  },
  {
    title: "Better Control and Invoicing Procedure",
    description:
      "Vyapar’s e-invoicing software solution centralises your invoices, accessible anytime on any device. Its business dashboard and automated reports offer real-time insights into your cash flow and financial health.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Better-Control-and-Invoicing-Procedure.png",
    bgColor: "bg-indigo-100",
  },
  {
    title: "Track Invoices Easily",
    description:
      "Vyapar’s electronic invoicing system simplifies invoice tracking, allowing you to monitor sending, viewing, and payment status. The business dashboard tracks pending payments and sends reminders to maintain cash flow.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Track-Invoices-Easily.png",
    bgColor: "bg-orange-100",
  },
  {
    title: "Seamless Auditing",
    description:
      "Vyapar’s cloud invoicing dashboard lets you manage estimates, expenses, and invoices from one place. Easily handle multiple businesses or clients by adding them to a single account for streamlined management.",
    iconSrc:
      "https://vyaparapp.in/v/z/wp-content/uploads/2024/07/Seamless-Auditing.png",
    bgColor: "bg-red-100",
  },
];

// Helper component for individual feature cards to keep code clean
const FeatureCard: React.FC<FeatureItem> = ({
  title,
  description,
  iconSrc,
  bgColor,
}) => {
  return (
    <div className="bg-background-light p-8 rounded-2xl shadow-sm text-center h-full">
      <div
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${bgColor}`}
      >
        <img src={iconSrc} alt={title} className="w-12 h-12" />
      </div>
      <h3 className="mt-6 text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </div>
  );
};

// Main Component
const BusinessManagementFeatures: React.FC = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Best E-invoicing Software for Business Management
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              iconSrc={feature.iconSrc}
              bgColor={feature.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessManagementFeatures;
