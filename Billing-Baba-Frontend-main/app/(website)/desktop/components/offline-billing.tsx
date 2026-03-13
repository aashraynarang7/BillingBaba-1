import React from "react"

const offlineData = {
  title: "Why Vyapar is the Best Offline Billing Software for Your PC?",
  description:
    "Vyapar is a popular choice for offline billing software for small businesses in India. Our desktop software is designed to work offline, so you can continue your business operation and process, no matter where you are or what the internet connectivity is.",
  features: [
    "Generate invoices, record transactions offline",
    "Stores data on your local drive",
    "Syncs data automatically when online",
  ],
  image: {
    src: "/Desktop/Section-12.webp",
    alt: "A laptop showcasing the online and offline billing capabilities of Vyapar software.",
  },
}

export default function OfflineBilling() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text-foreground)] mb-12">
          {offlineData.title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-[var(--text-foreground)] leading-relaxed">{offlineData.description}</p>
            <ul className="space-y-2 list-disc list-inside text-[var(--text-foreground)]">
              {offlineData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img src={offlineData.image.src} alt={offlineData.image.alt} className="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}