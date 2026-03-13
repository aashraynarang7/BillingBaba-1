import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

const mobileFeatures = ["GST Invoicing", "Basic Reports", "Customer Management", "Mobile App Access"]

const desktopFeatures = [
  "Everything in Mobile",
  "Desktop Application",
  "Advanced Reports",
  "Inventory Management",
  "Multi-user Access",
  "Priority Support",
]

export default function PricingSnippet() {
  return (
    <section className="py-20 bg-vyapar-background-section-gray">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Simple & Affordable Pricing</h2>
          <p className="text-lg text-vyapar-text-secondary">Choose the plan that fits your business needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mobile Plan */}
          <Card className="border-vyapar-border-color bg-background">
            <CardHeader className="text-center space-y-4 pb-8">
              <h3 className="text-2xl font-bold">Mobile</h3>
              <div className="space-y-2">
                <div className="text-4xl font-bold">₹999</div>
                <div className="text-vyapar-text-secondary">per year</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {mobileFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-vyapar-success-green" />
                    <span className="text-vyapar-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          {/* Desktop + Mobile Plan */}
          <Card className="border-primary bg-background relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </div>
            <CardHeader className="text-center space-y-4 pb-8 pt-8">
              <h3 className="text-2xl font-bold">Desktop + Mobile</h3>
              <div className="space-y-2">
                <div className="text-4xl font-bold">₹1999</div>
                <div className="text-vyapar-text-secondary">per year</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {desktopFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-vyapar-success-green" />
                    <span className="text-vyapar-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-vyapar-accent-dark-orange">
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
