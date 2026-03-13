import { Button } from "@/components/ui/button"
import { Download, ArrowRight } from "lucide-react"

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent">
      <div className="container">
        <div className="text-center space-y-8 text-white">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to Grow Your Business?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto text-pretty">
              Join over 1 Crore+ businesses that trust Vyapar for their accounting and billing needs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 h-auto">
              <Download className="h-5 w-5 mr-2" />
              Download Vyapar App Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 h-auto bg-transparent"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <p className="text-sm opacity-75">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
