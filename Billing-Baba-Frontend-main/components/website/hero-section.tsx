import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-8 md:py-8 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
                GST Billing Software in India for Small Businesses
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Manage your business professionally with Vyapar, India's leading software for billing, inventory, and
                accounting. Join 1 Cr+ satisfied SMEs in India who trust Vyapar.
              </p>
            </div>

            <div>
              <Button
                size="lg"
                className="bg-destructive text-primary-foreground hover:bg-primary/90 text-lg font-semibold px-10 py-4 h-auto rounded-lg"
              >
                Download Vyapar Now!
              </Button>
            </div>
          </div>

          <div>
            <img
              src="/Home/new-vyapar-hero.webp"
              alt="Vyapar GST Billing Software on Desktop and Mobile"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}