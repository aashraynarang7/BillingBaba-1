import React from "react";

// --- ✨ Data for the Section ---
const faqPageData = {
  cta: {
    topText: "Looking for the Best Invoice Software?",
    mainText: "Take Your Business to the Next Level with Billing Baba.",
  },
  faqs: [
    {
      question: "What software is used to create an invoice?",
      answer:
        "Billing Baba's free invoicing app can help create invoices for your business. You can use the Android mobile app or Windows Desktop software to create professional invoices. Further, you can send them over to your customers online or print them.",
    },
    {
      question: "What can invoicing software do?",
      answer:
        "The primary objective of using the invoicing software is to create invoices for customers. However, the Billing Baba app brings various useful features with it. You can manage all your business accounting requirements on the app.",
    },
    {
      question: "When is an invoice used?",
      answer:
        "An invoice is used as a binding agreement between two parties. You can use a professional invoice to include all the details of the transaction. A seller creates an invoice for the buyer every time a transaction occurs.",
    },
    {
      question: "Which is the best free invoicing software in India?",
      answer:
        "Keeping the requirements of small business owners in India in mind, Billing Baba is one of the best invoicing software options available in the market. It lets you create GST-compliant bills, manage inventory, and track payments easily.",
    },
    {
      question: "How do I identify the best invoice software?",
      answer:
        "Good software brings a set of useful qualities. It makes business management seamless for business owners. Billing Baba's invoicing solutions help manage all invoicing needs seamlessly.",
    },
    {
      question: "Can clients make invoice payments online?",
      answer:
        "Yes, our online digital invoicing app allows customers to pay through digital mediums, including UPIs, mobile wallets, NEFT, and IMPS. You can insert a QR code on your invoice for quick payments, and you can also directly share the invoice link in a WhatsApp message.",
    },
    {
      question: "How do I calculate taxes on my invoices?",
      answer:
        "You don't need to have added knowledge of GST rates and how to calculate them. Our free invoice software will do the auto calculation of all the taxes. If you know your product's or service's applicable GST rates and select on the app, the rest of the process our application will do for you.",
    },
  ],
};

const InvoicingFaqSection: React.FC = () => {
  return (
    <>
      {/* Section 1: Call to Action Banner */}
      <section className="bg-[color:var(--background-faq-accent)] py-12">
        <div className="container text-center">
          <p className="text-sm font-semibold text-[color:var(--primary-red)]">
            {faqPageData.cta.topText}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[color:var(--text-primary)] md:text-3xl">
            {faqPageData.cta.mainText}
          </h2>
        </div>
      </section>

      {/* Section 2: Frequently Asked Questions */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-8">
            {faqPageData.faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="mb-2 text-lg font-bold text-[color:var(--text-primary)]">
                  {faq.question}
                </h3>
                <p className="text-[color:var(--text-secondary)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default InvoicingFaqSection;
