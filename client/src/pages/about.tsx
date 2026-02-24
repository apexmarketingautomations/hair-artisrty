import { Button } from "@/components/ui/button";
import { Heart, Award, Users, Star } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-amber-300/90 tracking-[0.3em] uppercase text-sm mb-4 font-medium">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6" data-testid="text-about-title">
            About Us
          </h1>
          <p className="text-stone-300 text-lg">More than a salon. We're family.</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-8" data-testid="text-story-heading">
              Hair Artistry Full Service Salon
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-base">
              <p data-testid="text-about-p1">
                Hair Artistry is a full service salon with quality work where you're not just a client &mdash; you're family! 
                We offer services from balayage, haircuts, men's cuts, waxing and more.
              </p>
              <p data-testid="text-about-p2">
                We are also proud to announce we have certified specialists in curly hair, extensions (tape-ins), 
                braiding, natural hair styles, fades, and blending. We will go ABOVE and BEYOND to make our guests happy!
              </p>
              <p className="text-foreground font-semibold text-lg" data-testid="text-about-discount">
                All new clients receive $10 off their first visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3 font-medium">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-serif" data-testid="text-values-heading">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Family First", desc: "We treat every client like family, creating a warm and welcoming atmosphere." },
              { icon: Award, title: "Expert Team", desc: "Certified specialists in curly hair, extensions, braiding, and natural styles." },
              { icon: Users, title: "Inclusive Space", desc: "Services for everyone - women, men, and kids of all hair types and textures." },
              { icon: Star, title: "Quality Work", desc: "We go above and beyond to ensure every guest leaves feeling their best." },
            ].map((value, i) => (
              <div key={i} className="text-center p-6 rounded-md border border-border bg-background hover-elevate" data-testid={`card-value-${i}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to Join the Family?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Experience the Hair Artistry difference. Book your appointment today.
          </p>
          <a
            href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="px-8" data-testid="button-book-about">
              Book Your Visit
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
