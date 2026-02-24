import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors, Palette, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-amber-300/90 tracking-[0.3em] uppercase text-sm mb-4 font-medium" data-testid="text-tagline">Full Service Salon</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight" data-testid="text-hero-title">
            Hair Artistry
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-4" data-testid="text-hero-subtitle">
            Where Beauty Meets Creativity
          </p>
          <p className="text-stone-400 text-sm mb-8" data-testid="text-hours">
            Tuesday-Friday: 10am-7pm | Saturday: 9am-6pm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="text-base px-8" data-testid="button-book-now">
                Book Now
              </Button>
            </a>
            <Link href="/services">
              <Button variant="outline" size="lg" className="text-base px-8 bg-white/10 border-white/20 text-white backdrop-blur-sm" data-testid="button-view-services">
                View Services
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3 font-medium">Welcome</p>
            <h2 className="text-3xl md:text-4xl font-serif mb-6" data-testid="text-welcome-heading">
              Welcome To Hair Artistry
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-base leading-relaxed" data-testid="text-welcome-body">
              At Hair Artistry, we're more than just a salon &mdash; we're your one-stop beauty destination. 
              Our team is a powerhouse of skilled and passionate stylists who specialize in everything from 
              curls to color, cuts to custom installs and wigs, and everything in between.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Scissors className="w-8 h-8" />}
              title="Hair Cutting"
              description="A simple cut can change everything. From precision cuts to specialty techniques, we've got you covered."
              testId="card-cutting"
            />
            <ServiceCard
              icon={<Palette className="w-8 h-8" />}
              title="Hair Coloring"
              description="Dare to be different! From balayage to bold blonding and creative color, be bold, be creative, be fun."
              testId="card-coloring"
            />
            <ServiceCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Hair Styling & More"
              description="Night on the town? Wedding? Family reunion? We've got you covered with all the latest trends."
              testId="card-styling"
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg" data-testid="button-all-services">
                View All Services <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3 font-medium">Our Specialties</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-6" data-testid="text-specialties-heading">
                What Makes Us Special
              </h2>
              <ul className="space-y-4">
                {[
                  { name: "The Camacho Curly Cut", desc: "A signature dry + wet technique tailored for every curl type" },
                  { name: "Balayage", desc: "Soft, hand-painted highlights for the effortless glow" },
                  { name: "Men's Grooming", desc: "Scissor cuts, fades, straight razor shaves with hot towel" },
                  { name: "Braids & Installs", desc: "Knotless braids, wig installs, custom units, extensions" },
                  { name: "Bridal Services", desc: "In salon or we travel to you for your special day" },
                  { name: "Scalp Therapy", desc: "Luxe 1-hour treatment with massage, masks, facial & blowout" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start" data-testid={`text-specialty-${i}`}>
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-muted-foreground"> &mdash; {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-md bg-gradient-to-br from-primary/20 via-primary/10 to-amber-800/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <Scissors className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-2xl font-serif text-foreground/80">Artistry in</p>
                  <p className="text-2xl font-serif text-foreground/80">Every Strand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-md p-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3 font-medium">Special Offer</p>
            <h2 className="text-3xl md:text-4xl font-serif mb-4" data-testid="text-gift-heading">
              Give a Perfect Gift!
            </h2>
            <p className="text-muted-foreground mb-3 text-lg">
              We have amazing specials going on with our E-Gift cards!
            </p>
            <p className="text-foreground font-semibold mb-8 text-xl" data-testid="text-new-client">
              All new clients receive $10 off their first visit
            </p>
            <a
              href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="px-8" data-testid="button-book-now-cta">
                Book Your Appointment
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description, testId }: { icon: React.ReactNode; title: string; description: string; testId: string }) {
  return (
    <div className="group p-8 rounded-md bg-card border border-border text-center hover-elevate" data-testid={testId}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-serif mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      <Link href="/services">
        <span className="inline-flex items-center text-primary text-sm mt-4 font-medium gap-1">
          Learn More <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </div>
  );
}
