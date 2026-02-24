import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors, Palette, Sparkles, ArrowRight, Star, Gift, ChevronRight, Zap, Crown, Waves } from "lucide-react";
import type { Review } from "@shared/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { data: reviews } = useQuery<Review[]>({ queryKey: ["/api/reviews"] });

  return (
    <div className="min-h-screen">
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-salon.jpg" alt="Hair Artistry Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm mb-6">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200 text-xs tracking-[0.2em] uppercase font-medium" data-testid="text-tagline">Cape Coral's Premier Salon</span>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-4 leading-[0.9] tracking-tight" data-testid="text-hero-title">
            Hair<br /><span className="italic text-amber-200/90">Artistry</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-3" data-testid="text-hero-subtitle">
            Where Beauty Meets Creativity
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-3 text-white/50 text-sm mb-10">
            <span>Tue-Fri 10am-7pm</span>
            <span className="w-1 h-1 rounded-full bg-amber-400/60" />
            <span>Sat 9am-6pm</span>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base px-10 h-12" data-testid="button-book-now">
                Book Now
              </Button>
            </a>
            <Link href="/services">
              <Button variant="outline" size="lg" className="text-base px-10 h-12 bg-white/5 border-white/20 text-white backdrop-blur-md" data-testid="button-view-services">
                Explore Services <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Welcome</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-welcome-heading">
              More Than a Salon &mdash;<br />We're <span className="italic">Family</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed" data-testid="text-welcome-body">
              At Hair Artistry, our team is a powerhouse of skilled and passionate stylists who specialize in 
              everything from curls to color, cuts to custom installs and wigs, and everything in between.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            <ServiceShowcase
              image="/images/stylist-1.jpg"
              title="Hair Cutting"
              description="From precision cuts to the signature Camacho Curly Cut, your transformation starts here."
              index={0}
            />
            <ServiceShowcase
              image="/images/stylist-2.jpg"
              title="Hair Coloring"
              description="Balayage, blonding, creative color, and corrections. Dare to be bold."
              index={1}
            />
            <ServiceShowcase
              image="/images/stylist-3.jpg"
              title="Styling & Beyond"
              description="Braids, extensions, bridal, scalp therapy, and so much more."
              index={2}
            />
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Our Specialties</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-8" data-testid="text-specialties-heading">
                Signature<br /><span className="italic">Experiences</span>
              </motion.h2>
              <div className="space-y-4">
                {[
                  { icon: Scissors, name: "Camacho Curly Cut", desc: "Signature dry + wet technique for every curl type" },
                  { icon: Palette, name: "Balayage & Blonding", desc: "Hand-painted highlights and dimensional color" },
                  { icon: Crown, name: "Men's Grooming", desc: "Fades, straight razor shaves with hot towel" },
                  { icon: Sparkles, name: "Braids & Installs", desc: "Knotless braids, wigs, tape-ins, sew-ins" },
                  { icon: Waves, name: "Scalp Therapy", desc: "Luxe treatment with massage, masks & facial" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i + 2} className="flex gap-4 items-center p-3 rounded-md border border-border bg-background hover-elevate" data-testid={`text-specialty-${i}`}>
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-auto" />
                  </motion.div>
                ))}
              </div>
              <motion.div variants={fadeUp} custom={8} className="mt-8">
                <Link href="/services">
                  <Button variant="outline" size="lg" data-testid="button-all-services">
                    View All Services <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} custom={2} className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <img src="/images/stylist-1.jpg" alt="Hair styling" className="w-full rounded-md object-cover aspect-[3/4]" />
                  <div className="p-4 rounded-md bg-primary text-primary-foreground">
                    <p className="font-serif text-2xl font-bold">$10</p>
                    <p className="text-xs text-primary-foreground/80">Off your first visit</p>
                  </div>
                </div>
                <div className="space-y-3 pt-8">
                  <img src="/images/stylist-2.jpg" alt="Hair coloring" className="w-full rounded-md object-cover aspect-[3/4]" />
                  <img src="/images/stylist-3.jpg" alt="Hair artistry" className="w-full rounded-md object-cover aspect-square" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {reviews && reviews.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Testimonials</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif" data-testid="text-reviews-heading">
                What Our <span className="italic">Family</span> Says
              </motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, i) => (
                <motion.div key={review.id} variants={fadeUp} custom={i} className="p-6 rounded-md border border-border bg-card hover-elevate" data-testid={`card-review-${i}`}>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{review.comment}"</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{review.name}</span>
                    {review.service && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{review.service}</span>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-24 px-4 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a574' fill-opacity='0.3'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-6">
              <Gift className="w-5 h-5 text-amber-300" />
              <span className="text-amber-200 tracking-[0.2em] uppercase text-xs font-semibold">Gift Cards Available</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-gift-heading">
              Give the Gift of<br /><span className="italic text-amber-200">Beautiful Hair</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 mb-8 text-lg max-w-xl mx-auto">
              E-Gift cards available in any amount. The perfect present for someone special.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gift-cards">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-gift-cards">
                  <Gift className="w-4 h-4 mr-2" /> Shop Gift Cards
                </Button>
              </Link>
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="px-10 h-12 text-base bg-white/5 border-white/20 text-white" data-testid="button-book-now-cta">
                  Book Appointment
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}

function ServiceShowcase({ image, title, description, index }: { image: string; title: string; description: string; index: number }) {
  return (
    <motion.div variants={fadeUp} custom={index} className="group relative overflow-hidden rounded-md" data-testid={`card-showcase-${index}`}>
      <div className="aspect-[3/4] relative">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-serif text-white mb-1">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
          <Link href="/services">
            <span className="inline-flex items-center text-amber-200 text-sm mt-3 font-medium gap-1 cursor-pointer">
              Learn More <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 409) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 rounded-md border border-border bg-card">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="font-serif text-xl mb-2">You're In!</h3>
        <p className="text-muted-foreground text-sm">Watch your inbox for exclusive offers and styling tips.</p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-md border border-border bg-card">
      <h3 className="font-serif text-xl mb-2">Stay in the Loop</h3>
      <p className="text-muted-foreground text-sm mb-6">Get exclusive offers, styling tips, and be the first to know about new services.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 h-10 px-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          data-testid="input-newsletter"
        />
        <Button type="submit" disabled={status === "loading"} data-testid="button-newsletter">
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </form>
      {status === "error" && <p className="text-destructive text-xs mt-2">Something went wrong. Try again.</p>}
    </div>
  );
}

import { useState } from "react";
