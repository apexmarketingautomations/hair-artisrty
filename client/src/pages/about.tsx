import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Award, Users, Star, Sparkles, MapPin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-salon.jpg" alt="Hair Artistry Salon Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.3em] uppercase text-xs mb-4 font-semibold">Est. Cape Coral, FL</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-about-title">
            Our <span className="italic">Story</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg">More than a salon. We're family.</motion.p>
        </motion.div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">About Us</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-8" data-testid="text-story-heading">
                Hair Artistry<br /><span className="italic">Full Service Salon</span>
              </motion.h2>
              <motion.div variants={fadeUp} custom={2} className="space-y-5 text-muted-foreground leading-relaxed">
                <p data-testid="text-about-p1">
                  Hair Artistry is a full service salon with quality work where you're not just a client &mdash; you're family! 
                  We offer services from balayage, haircuts, men's cuts, waxing and more.
                </p>
                <p data-testid="text-about-p2">
                  We are proud to have certified specialists in curly hair, extensions (tape-ins), 
                  braiding, natural hair styles, fades, and blending. We go ABOVE and BEYOND to make our guests happy!
                </p>
              </motion.div>
              <motion.div variants={fadeUp} custom={3} className="mt-8 p-5 rounded-md bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold" data-testid="text-about-discount">All new clients receive $10 off their first visit</p>
                    <p className="text-sm text-muted-foreground">Walk-ins welcome. Appointments recommended.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 gap-3">
              <img src="/images/stylist-1.jpg" alt="Salon work" className="w-full rounded-md object-cover aspect-[3/4]" />
              <img src="/images/stylist-2.jpg" alt="Salon styling" className="w-full rounded-md object-cover aspect-[3/4] mt-8" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Why Us</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif" data-testid="text-values-heading">
              Our <span className="italic">Values</span>
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Heart, title: "Family First", desc: "We treat every client like family, creating a warm and welcoming atmosphere." },
              { icon: Award, title: "Expert Team", desc: "Certified specialists in curly hair, extensions, braiding, and natural styles." },
              { icon: Users, title: "All Welcome", desc: "Services for everyone - women, men, and kids of all hair types and textures." },
              { icon: Star, title: "Excellence", desc: "We go above and beyond to ensure every guest leaves feeling their best." },
            ].map((value, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="text-center p-6 rounded-md border border-border bg-background hover-elevate" data-testid={`card-value-${i}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-primary tracking-[0.2em] uppercase text-xs font-semibold">Visit Us</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-6">
              Ready to Join<br />the <span className="italic">Family?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
              909 SE 47th Terr, Cape Coral, FL 33904 #104
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-book-about">
                  Book Your Visit
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
