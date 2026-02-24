import { Button } from "@/components/ui/button";
import { Scissors, Palette, Sparkles, Crown, Flower2, HandMetal, Heart, Waves } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "The Camacho Curly Cut",
    description: "Our signature dry + wet technique tailored for every curl type. Precision cutting that respects your natural curl pattern for shape, volume, and movement.",
    tag: "Signature",
  },
  {
    icon: Palette,
    title: "Balayage & Highlights",
    description: "Soft, hand-painted highlights for that effortless, sun-kissed glow. Custom placement for a natural, dimensional finish that grows out beautifully.",
    tag: "Popular",
  },
  {
    icon: Sparkles,
    title: "Blonding Services",
    description: "From bold, bright blondes to dimensional blends and color corrections. Our specialists create stunning blonde results while maintaining hair integrity.",
    tag: null,
  },
  {
    icon: Crown,
    title: "Men's Grooming",
    description: "Scissor cuts, precision fades, straight razor shaves with hot towel treatment, beard grooming, and more. Sharp looks for the modern gentleman.",
    tag: null,
  },
  {
    icon: Flower2,
    title: "Braids & Installs",
    description: "Knotless braids, box braids, cornrows, wig installs, custom units, and extensions including hand-tied, sew-in, and tape-in options.",
    tag: null,
  },
  {
    icon: HandMetal,
    title: "Kids' Cuts",
    description: "Fresh, fun styles for little ones in a comfortable, friendly environment. We make sure your kids leave looking and feeling great.",
    tag: null,
  },
  {
    icon: Heart,
    title: "Bridal Services",
    description: "Your dream wedding hair, perfected. In-salon or we travel to you. Trial runs, updos, blowouts, and styling for the entire bridal party.",
    tag: "Premium",
  },
  {
    icon: Waves,
    title: "Scalp Therapy Experience",
    description: "Unwind with our luxe 1-hour scalp treatment featuring massage bed bliss, two nourishing hair masks, a refreshing facial, and a blowout of your choice.",
    tag: "Luxe",
  },
];

const waxingServices = [
  "Eyebrow Waxing",
  "Lip Waxing",
  "Chin Waxing",
  "Sideburn Waxing",
  "Full Face Waxing",
];

export default function Services() {
  return (
    <div className="min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-amber-300/90 tracking-[0.3em] uppercase text-sm mb-4 font-medium">What We Offer</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6" data-testid="text-services-title">
            Our Services
          </h1>
          <p className="text-stone-300 text-lg">From cuts to color, braids to bridal - we do it all.</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="group p-6 rounded-md border border-border bg-card hover-elevate"
                data-testid={`card-service-${i}`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-lg font-serif">{service.title}</h3>
                      {service.tag && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {service.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3 font-medium">Smooth & Clean</p>
            <h2 className="text-3xl font-serif" data-testid="text-waxing-heading">Waxing Services</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {waxingServices.map((service, i) => (
              <div
                key={i}
                className="px-5 py-3 rounded-md border border-border bg-background text-sm font-medium hover-elevate"
                data-testid={`text-wax-${i}`}
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4" data-testid="text-cta-heading">
            Ready for a Transformation?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Whether you're here for a transformation or a touch-up, you'll leave feeling like your best self.
          </p>
          <a
            href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="px-8" data-testid="button-book-services">
              Book Your Appointment
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
