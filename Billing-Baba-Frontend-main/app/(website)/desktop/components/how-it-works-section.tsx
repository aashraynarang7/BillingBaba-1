import React from "react"

const howItWorksData = {
  mainTitle: "Tap on Your Desktop Billing Software Delivers Business Financial Efficiency",
  graphicImage: {
    src: "/Desktop/Section7.webp",
    alt: "A person showcasing the four simple steps to create a Vyapar invoice on a laptop",
  },
  description: {
    paragraph1:
      "Vyapar for PC brings your business finances together in one user-friendly place. Easily create bills, track inventory, and monitor expenses. With automated reminders, you can boost cash flow, and advanced reports help you make better decisions. You can manage your money with ease and focus on growing your business.",
    subTitle: "4 Taps to Create a Bill on Your Desktop App",
    paragraph2: "Here are four simple clicks to create your bill:",
    list: [
      {
        title: "Begin Your Invoice:",
        text: "From the main dashboard, simply click the “Add Sale” button to start.",
      },
      {
        title: "Add Your Items:",
        text: "Select your products or services with the auto-populate feature; all the details fill in automatically for you.",
      },
      {
        title: "Review and Save:",
        text: "Check the invoice quickly for any corrections, then tap “Save” to finalize it.",
      },
      {
        title: "Share with a Click:",
        text: "Instantly send the professional bill to your customer via WhatsApp, or print the hard copy.",
      },
    ],
  },
}

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-16">
          {howItWorksData.mainTitle}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex items-center justify-center">
            <img
              src={howItWorksData.graphicImage.src}
              alt={howItWorksData.graphicImage.alt}
              className="max-w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <p className="text-[var(--text-foreground)] leading-relaxed">
              {howItWorksData.description.paragraph1}
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--primary-red)]">
                {howItWorksData.description.subTitle}
              </h3>
              <p className="text-[var(--text-foreground)]">{howItWorksData.description.paragraph2}</p>
              <ol className="space-y-3 text-base">
                {howItWorksData.description.list.map((item, index) => (
                  <li key={index} className="flex">
                    <span className="text-[var(--text-primary)] font-bold mr-2">{index + 1}.</span>
                    <p className="text-[var(--text-foreground)]">
                      <strong className="text-[var(--text-primary)]">{item.title}</strong> {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}