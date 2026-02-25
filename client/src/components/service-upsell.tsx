import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, Hand, Zap, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const addOns = [
  {
    icon: Droplets,
    title: "Deep Conditioning",
    price: "+$25",
    description: "Intensive moisture treatment that restores softness, shine, and elasticity to dry or damaged hair.",
    gradient: "from-rose-500 to-orange-400",
  },
  {
    icon: Hand,
    title: "Scalp Massage",
    price: "+$15",
    description: "Relaxing scalp massage with essential oils to stimulate circulation and relieve tension.",
    gradient: "from-violet-500 to-blue-400",
  },
  {
    icon: Zap,
    title: "Olaplex Bond Builder",
    price: "+$35",
    description: "Professional bond-building treatment that repairs and strengthens hair from the inside out.",
    gradient: "from-amber-500 to-rose-400",
  },
];

const BOOKING_URL = "https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl";

export default function ServiceUpsell() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-10">
            <p className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Add-Ons</p>
            <h2 className="text-3xl md:text-4xl font-serif mb-2" data-testid="text-upsell-heading">
              Enhance Your <span className="italic">Visit</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Elevate your appointment with one of our luxurious add-on treatments.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.title}
                variants={fadeUp}
                custom={i + 1}
                className="relative rounded-md border border-border bg-card p-6 hover-elevate"
                data-testid={`card-addon-${i}`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-md overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-r ${addon.gradient}`} />
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${addon.gradient} flex items-center justify-center mb-4`}>
                  <addon.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-serif text-lg">{addon.title}</h3>
                  <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                    {addon.price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{addon.description}</p>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" data-testid={`button-addon-book-${i}`}>
                    Add to Booking <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
