"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export default function RatingSection() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  return (
    <section className="py-16 bg-background">
      <div className="container flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-foreground">How Useful Was This Post?</h2>
          <p className="text-muted-foreground">Click on a star to rate it!</p>
        </div>

        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1
            return (
              <button
                key={starValue}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform duration-200 hover:scale-110"
              >
                <Star
                  className={`h-12 w-12 cursor-pointer transition-colors ${
                    starValue <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                  }`}
                />
              </button>
            )
          })}
        </div>

        <p className="text-sm text-muted-foreground">Average rating 4.47 / 5. Vote count: 30814</p>
      </div>
    </section>
  )
}