import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors, Palette, Sparkles, Crown, Flower2, Heart, Waves, Droplets, Star, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

type Category = "all" | "cuts" | "color" | "braids" | "specialty";

const services = [
  { icon: Scissors, title: "The Camacho Curly Cut", description: "Our signature dry + wet technique tailored for every curl type. Precision cutting that respects your natural curl pattern for shape, volume, and movement.", tag: "Signature", category: "cuts" as Category, image: "/images/stylist-1.jpg" },
  { icon: Palette, title: "Balayage & Highlights", description: "Soft, hand-painted highlights for that effortless, sun-kissed glow. Custom placement for a natural, dimensional finish that grows out beautifully.", tag: "Popular", category: "color" as Category, image: "/images/stylist-2.jpg" },
  { icon: Sparkles, title: "Blonding Services", description: "From bold, bright blondes to dimensional blends and color corrections. Stunning results while maintaining hair integrity.", tag: null, category: "color" as Category, image: "/images/stylist-3.jpg" },
  { icon: Crown, title: "Men's Grooming", description: "Scissor cuts, precision fades, straight razor shaves with hot towel treatment, beard grooming, and more. Sharp looks for the modern gentleman.", tag: null, category: "cuts" as Category, image: "/images/mens-grooming.jpg" },
  { icon: Flower2, title: "Braids & Installs", description: "Knotless braids, box braids, cornrows, wig installs, custom units, and extensions including hand-tied, sew-in, and tape-in options.", tag: null, category: "braids" as Category, image: "/images/braids-installs.jpg" },
  { icon: Scissors, title: "Kids' Cuts", description: "Fresh, fun styles for little ones in a comfortable, friendly environment. We make sure your kids leave looking and feeling great.", tag: null, category: "cuts" as Category, image: "/images/kids-cuts.jpg" },
  { icon: Heart, title: "Bridal Services", description: "Your dream wedding hair, perfected. In-salon or we travel to you. Trial runs, updos, blowouts, and styling for the entire bridal party.", tag: "Premium", category: "specialty" as Category, image: "/images/bridal-services.jpg" },
  { icon: Waves, title: "Scalp Therapy Experience", description: "Luxe 1-hour scalp treatment featuring massage bed bliss, two nourishing hair masks, a refreshing facial, and a blowout of your choice.", tag: "Luxe", category: "specialty" as Category, image: "/images/scalp-therapy.jpg" },
  { icon: Droplets, title: "Waxing Services", description: "Eyebrows, lips, chin, sideburns, and full face waxing. Professional waxing for smooth, clean results every time.", tag: null, category: "specialty" as Category, image: "/images/waxing-services.jpg" },
  { icon: Palette, title: "Color Corrections", description: "Expert color correction services to fix unwanted tones, banding, or damage from previous color treatments. We'll get you where you want to be.", tag: null, category: "color" as Category, image: "/images/color-corrections.jpg" },
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
          <img src="/images/hero-salon.jpg" alt="Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.3em] uppercase text-xs mb-4 font-semibold">What We Offer</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-services-title">
            Our <span className="italic">Services</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg">From cuts to color, braids to bridal &mdash; we do it all.</motion.p>
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

      <section className="py-24 px-4 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
              <Star className="w-5 h-5 text-amber-300" />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-cta-heading">
              Ready for Your<br /><span className="italic text-amber-200">Transformation?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 mb-8 text-lg max-w-xl mx-auto">
              Whether you're here for a transformation or a touch-up, you'll leave feeling like your best self.
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
