import React from "react"

const bannerData = {
  imageSrc: "/Banner.png",
  altText: "Final Sale promotion banner for Vyapar software, offering 60% off.",
  link: "#",
}

export default function FinalSaleBanner() {
  return (
    <section className="bg-white">
      <div className="w-full">
        <a href={bannerData.link} className="block">
          <img
            src={bannerData.imageSrc}
            alt={bannerData.altText}
            className="w-full h-auto shadow-lg"
          />
        </a>
      </div>
    </section>
  )
}