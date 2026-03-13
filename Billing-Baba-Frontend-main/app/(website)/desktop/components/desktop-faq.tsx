import React from "react"

const faqData = [
  {
    question: "What is billing software for PC?",
    answer: "Billing software for PCs is a computer program designed to streamline the billing and invoicing process for businesses. It helps generate invoices, track payments, and manage financial transactions.",
  },
  {
    question: "Why do I need billing software for my PC?",
    answer: "Billing software simplifies and automates the invoicing process, reduces errors, saves time, and provides better financial overview for businesses of all sizes.",
  },
  {
    question: "What features I can able to access using billing software for PC offline?",
    answer: "With Vyapar billing software for pc offline use, you can access the following features: GST Compliance Billing, automated billing, reports, printing and sharing, customizable billing templates, barcode scanning, cash flow management, data backup on the local drive, client management, expense management, sales and purchase orders.",
  },
  {
    question: "Can I use Vyapar as a lifetime free billing software for offline use?",
    answer: "Yes, Vyapar offers you lifetime free billing software for your offline usage if you go for the mobile version of the app. If you want to enjoy premium features, you will get them at a very affordable price.",
  },
  {
    question: "Does the software support multiple payment methods?",
    answer: "Vyapar software accommodates various payment methods, including credit cards, cash, checks, and digital wallets.",
  },
  {
    question: "What key features can I expect from Vyapar-integrated billing software for PC?",
    answer: "It offers many useful features such as invoice generation, expense tracking, payment reminders, comprehensive reporting, tax calculations, and customer management.",
  },
  {
    question: "Is the Vyapar-integrated billing software compatible with Windows PCs?",
    answer: "Yes, Vyapar software is fully compatible with the Windows operating system running on your PC.",
  },
  {
    question: "Is there a mobile app or web access for remote billing management with Vyapar integration?",
    answer: "Vyapar software offers a mobile app, that allows you to manage billing and invoicing remotely, which complements Vyapar’s functionality.",
  },
  {
    question: "Which is the best free billing software for PC?",
    answer: "The billing software by Vyapar is the best. It is best suited to manage billing requirements for a business. The best part is that the app offers customers a 7-day free trial with no restrictions. So, before making a payment for the software, businesses can try out the app's features. It will ensure that the app is useful for their business. All of it makes Vyapar the best choice among free billing software available.",
  },
  {
    question: "How to create a bill on a PC?",
    answer: {
      intro: "Creating a bill in simple billing software for PC is an easy process. Here are the steps involved:",
      steps: [
        "Open the Software or App",
        "Go to the Sales Section",
        "Create a New Sale",
        "Add Customer Details",
        "Add Products or Services",
        "Apply Discounts or Taxes",
        "Review the Bill",
        "Share the Bill and Receive Payment",
      ],
    },
  },
  {
    question: "Can you prepare a bill on the computer?",
    answer: "Yes, you can generate a bill using our computer billing software. You can customize your invoice and can choose built-in templates that suit your business needs.",
  },
  {
    question: "Can we make a bill in Excel?",
    answer: "Yes, with Vyapar's free billing application for PC, you can export or download the invoice Excel.",
  },
  {
    question: "How much does a computer bill cost?",
    answer: "To generate unlimited bills using the Vyapar PC billing software costs you INR 283, and you can access multiple features to manage your business effectively. In the desktop trial version, you can create at zero cost.",
  },
]

export default function DesktopFAQ() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          Frequently Asked Questions (FAQs')
        </h2>
        <div className="space-y-8">
          {faqData.map((item, index) => (
            <div key={index}>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{item.question}</h3>
              {typeof item.answer === "string" ? (
                <p className="text-sm text-[var(--text-foreground)] leading-relaxed">{item.answer}</p>
              ) : (
                <div className="text-sm text-[var(--text-foreground)] leading-relaxed space-y-2">
                  <p>{item.answer.intro}</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    {item.answer.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}