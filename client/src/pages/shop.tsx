import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ExternalLink, Sparkles, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

type ShopCategory = "All" | "Curl Care" | "Color Protection" | "Styling Tools" | "Scalp Health";

const categories: ShopCategory[] = ["All", "Curl Care", "Color Protection", "Styling Tools", "Scalp Health"];

interface Product {
  name: string;
  brand: string;
  price: number;
  description: string;
  category: ShopCategory;
  gradient: string;
  iconGradient: string;
}

const products: Product[] = [
  {
    name: "Olaplex No.3",
    brand: "Olaplex",
    price: 30,
    description: "Hair perfector treatment that repairs and strengthens damaged hair from the inside out.",
    category: "Color Protection",
    gradient: "from-violet-500/20 to-blue-500/20",
    iconGradient: "from-violet-500 to-blue-500",
  },
  {
    name: "SuperCream Coconut Curl Styler",
    brand: "DevaCurl",
    price: 28,
    description: "Rich, creamy styler that defines curls, reduces frizz, and adds beautiful shine.",
    category: "Curl Care",
    gradient: "from-rose-500/20 to-orange-500/20",
    iconGradient: "from-rose-500 to-orange-500",
  },
  {
    name: "Moroccan Oil Treatment",
    brand: "Moroccanoil",
    price: 34,
    description: "The original argan oil-infused treatment for all hair types. Conditions, smooths, and adds shine.",
    category: "Curl Care",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconGradient: "from-amber-500 to-yellow-500",
  },
  {
    name: "Airwrap Multi-Styler",
    brand: "Dyson",
    price: 600,
    description: "Revolutionary multi-styler that curls, waves, smooths, and dries with no extreme heat damage.",
    category: "Styling Tools",
    gradient: "from-pink-500/20 to-violet-500/20",
    iconGradient: "from-pink-500 to-violet-500",
  },
  {
    name: "Color Extend Magnetics Shampoo",
    brand: "Redken",
    price: 22,
    description: "Sulfate-free shampoo that gently cleanses while protecting and extending vibrant color.",
    category: "Color Protection",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Scalp Serum",
    brand: "Ouai",
    price: 38,
    description: "Hydrating scalp serum with probiotics and AHA to balance, soothe, and nourish the scalp.",
    category: "Scalp Health",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconGradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Curl ID Curling Iron",
    brand: "T3",
    price: 150,
    description: "Smart curling iron with adjustable heat and interchangeable barrels for every curl style.",
    category: "Styling Tools",
    gradient: "from-orange-500/20 to-rose-500/20",
    iconGradient: "from-orange-500 to-rose-500",
  },
  {
    name: "Don't Despair, Repair! Mask",
    brand: "Briogeo",
    price: 42,
    description: "Clinically proven deep conditioning mask that repairs and hydrates severely damaged hair.",
    category: "Scalp Health",
    gradient: "from-teal-500/20 to-green-500/20",
    iconGradient: "from-teal-500 to-green-500",
  },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("All");
  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-salon.jpg" alt="Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/70 via-rose-900/50 to-amber-900/70" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm mb-6">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200 text-xs tracking-[0.2em] uppercase font-medium">Salon Favorites</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-shop-title">
            Our <span className="italic text-amber-200">Shop</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg max-w-xl mx-auto">
            Professional-grade products handpicked by our stylists for your best hair days.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-8 px-4 sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover-elevate"
                }`}
                data-testid={`button-shop-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
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
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover-elevate overflow-visible" data-testid={`card-product-${i}`}>
                    <div className={`h-44 rounded-t-md bg-gradient-to-br ${product.gradient} flex items-center justify-center relative`}>
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${product.iconGradient} flex items-center justify-center`}>
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]" data-testid={`badge-category-${i}`}>
                        {product.category}
                      </Badge>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{product.brand}</p>
                      <h3 className="font-serif text-base mb-1.5" data-testid={`text-product-name-${i}`}>{product.name}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-4 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-lg font-bold" data-testid={`text-product-price-${i}`}>${product.price}</span>
                        <a href="#" data-testid={`link-shop-now-${i}`}>
                          <Button size="sm">
                            Shop Now <ExternalLink className="w-3 h-3 ml-1.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.div variants={fadeUp} custom={0} className="flex justify-center gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-serif mb-3" data-testid="text-shop-recommendation">
              Stylist <span className="italic">Approved</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Every product in our shop is personally tested and recommended by our team of expert stylists.
              We only carry what we use and love.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-violet-900 via-rose-900 to-amber-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-shop-cta-heading">
              Need Help <span className="italic text-amber-200">Choosing?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-stone-300 mb-8 text-lg max-w-xl mx-auto">
              Book a consultation and our stylists will recommend the perfect products for your hair type and goals.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-book-consultation">
                  Book a Consultation
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
