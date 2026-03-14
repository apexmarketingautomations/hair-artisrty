import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors, Palette, Sparkles, Crown, Flower2, Heart, Waves, Droplets, Star, ArrowRight } from "lucide-react";
import ServiceUpsell from "@/components/service-upsell";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

type Category = "all" | "cuts" | "color" | "braids" | "specialty";

const services = [
  { icon: Scissors, title: "The Camacho Curly Cut", description: "Our signature dry-and-wet technique, designed for every curl type. Precision cutting that honors your natural pattern for defined shape, effortless volume, and beautiful movement.", tag: "Signature", category: "cuts" as Category, image: "/images/work/work-08.jpg" },
  { icon: Palette, title: "Balayage & Highlights", description: "Hand-painted, sun-kissed highlights customized for your complexion and style. Natural, dimensional color with seamless grow-out — the kind of color people can't stop complimenting.", tag: "Popular", category: "color" as Category, image: "/images/work/work-11.jpg" },
  { icon: Sparkles, title: "Blonding Services", description: "From icy platinum to warm, lived-in blondes and everything in between. Our colorists deliver stunning results while preserving hair health and integrity.", tag: null, category: "color" as Category, image: "/images/work/work-14.jpg" },
  { icon: Crown, title: "Men's Grooming", description: "Precision scissor cuts, clean fades, straight razor shaves with a hot towel treatment, and expert beard design. Refined grooming for the modern gentleman.", tag: null, category: "cuts" as Category, image: "/images/mens-grooming.jpg" },
  { icon: Flower2, title: "Braids & Installs", description: "Knotless braids, box braids, cornrows, custom wig installs, and professional extensions — including hand-tied, sew-in, and tape-in applications.", tag: null, category: "braids" as Category, image: "/images/braids-installs.jpg" },
  { icon: Scissors, title: "Kids' Cuts", description: "Fun, fresh styles for your little ones in a comfortable, kid-friendly environment. We make sure every child leaves the chair looking great and feeling confident.", tag: null, category: "cuts" as Category, image: "/images/kids-cuts.jpg" },
  { icon: Heart, title: "Bridal Services", description: "Flawless wedding day hair, perfected down to the last detail. In-salon or on location at your venue. Trial consultations, elegant updos, blowouts, and full bridal party styling.", tag: "Premium", category: "specialty" as Category, image: "/images/bridal-services.jpg" },
  { icon: Waves, title: "Scalp Therapy Experience", description: "A luxurious one-hour scalp treatment — featuring massage bed relaxation, two nourishing hair masks, a refreshing facial, and a blowout of your choice. Pure indulgence.", tag: "Luxe", category: "specialty" as Category, image: "/images/scalp-therapy.jpg" },
  { icon: Droplets, title: "Waxing Services", description: "Professional waxing for brows, lips, chin, sideburns, and full face. Smooth, precise results with minimal discomfort — every time.", tag: null, category: "specialty" as Category, image: "/images/waxing-services.jpg" },
  { icon: Palette, title: "Color Corrections", description: "Expert-level color correction to resolve unwanted tones, banding, or damage from previous treatments. We'll restore your hair and get you exactly where you want to be.", tag: null, category: "color" as Category, image: "/images/color-corrections.jpg" },
];

const categories = [
  { key: "all" as Category, label: "All Services" },
  { key: "cuts" as Category, label: "Cuts & Grooming" },
  { key: "color" as Category, label: "Color" },
  { key: "braids" as Category, label: "Braids & Extensions" },
  { key: "specialty" as Category, label: "Specialty" },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const filtered = activeCategory === "all" ? services : services.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/work/work-03.jpg" alt="Salon services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.3em] uppercase text-xs mb-4 font-semibold">What We Offer</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-services-title">
            Our <span className="italic">Services</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg max-w-xl mx-auto">Expert cuts, stunning color, flawless braids, and luxury treatments — tailored to every hair type, texture, and vision.</motion.p>
        </motion.div>
      </section>

      <section className="py-8 px-4 sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover-elevate"
                }`}
                data-testid={`button-category-${cat.key}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-5"
            >
              {filtered.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-md border border-border bg-card overflow-hidden hover-elevate"
                  data-testid={`card-service-${i}`}
                >
                  {service.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <service.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-lg font-serif">{service.title}</h3>
                          {service.tag && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
                              {service.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <ServiceUpsell />

      <section className="py-24 px-4 bg-gradient-to-br from-stone-900 via-rose-900/80 to-violet-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
              <Star className="w-5 h-5 text-amber-300" />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-cta-heading">
              Ready for Your<br /><span className="italic text-amber-200">Transformation?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 mb-8 text-lg max-w-xl mx-auto">
              Whether you're looking for a bold transformation or a polished refresh, you'll leave looking and feeling like the best version of yourself.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-book-services">
                  Book Your Appointment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
