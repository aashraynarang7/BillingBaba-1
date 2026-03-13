  "use not client"
  "use client"

  import React, { useState, useEffect, useCallback, useRef } from "react"
  import { Button } from "@/components/ui/button"
  import { ChevronLeft, ChevronRight } from "lucide-react"

  const industries = [
    {
      title: "Construction Business",
      image: "/Home/test1.webp",
      paragraphs: [
        "You can use our GST billing app to track all the required raw materials. It is good for your construction business as it helps set up pre-orders. The app provides alerts on low inventory, enabling immediate action from management.",
        "Billing Baba business billing software for construction and general contractors is a perfect tool. It helps keep track of construction materials. It will make the entire process seamless, allowing the business to make more investments. Further, it helps manage the business requirements seamlessly.",
      ],
    },
    {
      title: "Retail Stores",
      image: "/Home/test2.webp",
      paragraphs: [
        "Manage your retail inventory with precision using our barcode scanning features for faster billing. Track sales by item, category, or employee to make smarter business decisions.",
        "Our software helps you manage customer loyalty programs and send promotional offers directly via SMS or WhatsApp, increasing customer retention and sales for your retail business.",
      ],
    },
    {
      title: "Manufacturing Units",
      image: "/Home/test3.webp",
      paragraphs: [
        "Track raw materials, work-in-progress, and finished goods with our advanced inventory management system. Generate bill of materials and manage production workflows effortlessly.",
        "Billing Baba helps in managing batch numbers and expiry dates, which is crucial for quality control. Streamline your entire manufacturing process from procurement to sales with one single tool.",
      ],
    },
  ]

  export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimeout = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }, [])

    const nextSlide = useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % industries.length)
    }, [])

    const prevSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + industries.length) % industries.length)
    }

    useEffect(() => {
      resetTimeout()
      timeoutRef.current = setTimeout(() => {
        nextSlide()
      }, 6000)

      return () => {
        resetTimeout()
      }
    }, [currentIndex, nextSlide, resetTimeout])

    return (
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Built for your Industry</h2>
            <p className="text-muted-foreground text-lg">
              Billing Baba GST billing software and accounting tools have numerous features. Collectively, they help
              businesses across industries. Our app is built to serve every industry. It is customisable to meet the
              requirement of your business as per your unique business requirements.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {industries.map((industry, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="flex items-center justify-center">
                        <img src={industry.image} alt={industry.title} className="max-w-sm w-48 h-48" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-foreground">{industry.title}</h3>
                        {industry.paragraphs.map((p, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 rounded-full h-12 w-12 bg-chart-2 backdrop-blur-sm "
            >
              <ChevronLeft className="h-6 w-6 text-muted" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 rounded-full h-12 w-12 bg-chart-2 backdrop-blur-sm"
            >
              <ChevronRight className="h-6 w-6 text-muted" />
            </Button>
          </div>
        </div>
      </section>
    )
  }