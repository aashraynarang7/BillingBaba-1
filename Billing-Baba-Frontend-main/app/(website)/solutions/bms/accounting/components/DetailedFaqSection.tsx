import React from "react";

// --- ✨ Data for the Detailed FAQ Section ---
const faqData = [
  {
    question: "What is accounting software?",
    answer:
      "Accounting software automates financial tasks like recording transactions, tracking income/expenses, generating reports, and managing budgets. It improves efficiency, reduces errors, and provides insights into financial health.",
  },
  {
    question: "Why do we need an accounting program for small business?",
    answer:
      "An accounting app makes the process efficient. You can complete your process with a few steps. As you enter the transactions in the app, it computes all totals itself, ensuring accuracy.",
  },
  {
    question: "What are the benefits of accounting software?",
    answer:
      "Accounting software allows simple data entry and generates comprehensive financial reports. It will enable automated record keeping. Using our software improves efficiency and increases accuracy by eliminating manual procedures.",
  },
  {
    question: "Which is the easiest accounting software for small businesses?",
    answer:
      "Simplicity is the reason why our software is considered the easiest accounting tool. Using it is as simple as using a social media app.",
  },
  {
    question: "Is your accounting app compatible for a large business?",
    answer:
      "Yes, our accounting software for large business comes with compatible features that suit your large business needs, including multi-user access and advanced reporting.",
  },
  {
    question: "What is desktop-based accounting software?",
    answer:
      "Desktop-based accounting software is a type of software you install directly on your computer. Unlike online tools, it works without an internet connection, making it a great option for small businesses that want full control over their data.",
  },
];

const DetailedFaqSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[color:var(--text-primary)] md:text-4xl">
            Frequently Asked Questions (FAQs)
          </h2>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {faqData.map((faq, index) => (
            <div key={index}>
              <h3 className="mb-2 text-xl font-bold text-[color:var(--text-primary)]">
                {faq.question}
              </h3>
              <p className="text-[color:var(--text-secondary)]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedFaqSection;
