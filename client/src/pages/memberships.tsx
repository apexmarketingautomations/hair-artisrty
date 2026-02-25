import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Crown, Sparkles, Star, ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const plans = [
  {
    id: "essential",
    name: "Essential",
    price: 59,
    gradient: "from-amber-500 to-orange-400",
    gradientBg: "from-amber-500/10 to-orange-400/10",
    iconColor: "text-amber-500",
    icon: Star,
    features: [
      "1 blowout per month",
      "10% off all services",
      "Priority booking",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 99,
    gradient: "from-rose-500 to-pink-400",
    gradientBg: "from-rose-500/10 to-pink-400/10",
    iconColor: "text-rose-500",
    icon: Sparkles,
    features: [
      "1 blowout + 1 treatment per month",
      "15% off all services",
      "Priority booking",
      "Free waxing",
    ],
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: 149,
    gradient: "from-violet-500 to-purple-400",
    gradientBg: "from-violet-500/10 to-purple-400/10",
    iconColor: "text-violet-500",
    icon: Crown,
    features: [
      "2 blowouts + 1 treatment per month",
      "20% off all services",
      "Priority booking",
      "Free waxing",
      "Quarterly scalp therapy",
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: "How does billing work?",
    answer: "Your membership is billed monthly on the date you sign up. You can pay via credit card, and your card will be charged automatically each month.",
  },
  {
    question: "Can I cancel my membership?",
    answer: "Yes, you can cancel your membership at any time. Your benefits will remain active until the end of your current billing cycle. There are no cancellation fees.",
  },
  {
    question: "What's included in each plan?",
    answer: "Each plan includes a set number of monthly services, a discount on all additional services, and priority booking. Higher tiers include additional perks like free waxing and quarterly scalp therapy treatments.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Absolutely! You can change your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Do unused services roll over?",
    answer: "Monthly included services do not roll over to the next month. We encourage you to use your benefits each month to get the most value from your membership.",
  },
];

export default function Memberships() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", plan: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setFormData((prev) => ({ ...prev, plan: planId }));
    setTimeout(() => {
      document.getElementById("membership-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.plan) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setStatus("loading");
    try {
      await apiRequest("POST", "/api/memberships", formData);
      setStatus("success");
      toast({ title: "Welcome to the family!", description: "Your membership request has been submitted." });
    } catch {
      setStatus("error");
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 via-violet-900/70 to-amber-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.p variants={fadeUp} custom={0} className="text-amber-200 tracking-[0.2em] uppercase text-xs mb-4 font-semibold">
            Exclusive Memberships
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-memberships-title">
            Invest in <span className="italic text-rose-200">Your Beauty</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-white/70 text-lg max-w-xl mx-auto" data-testid="text-memberships-subtitle">
            Save more with monthly plans designed for every lifestyle. Priority booking, exclusive discounts, and VIP perks.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div key={plan.id} variants={fadeUp} custom={i}>
                  <Card
                    className={`relative p-6 h-full flex flex-col ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-rose-500 to-pink-400 text-white border-0" data-testid="badge-popular">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl font-serif mb-1" data-testid={`text-plan-name-${plan.id}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" data-testid={`text-feature-${plan.id}-${j}`}>
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.iconColor}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full bg-gradient-to-r ${plan.gradient} text-white border-0`}
                      onClick={() => handleSelectPlan(plan.id)}
                      data-testid={`button-join-${plan.id}`}
                    >
                      Join Now
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPlan && status !== "success" && (
          <motion.section
            id="membership-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-20 overflow-hidden"
          >
            <div className="max-w-lg mx-auto">
              <Card className="p-6">
                <h3 className="text-2xl font-serif mb-2" data-testid="text-form-heading">
                  Join the <span className="italic">{plans.find((p) => p.id === selectedPlan)?.name}</span> Plan
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Fill in your details and we'll get you started.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      data-testid="input-membership-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      data-testid="input-membership-email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      data-testid="input-membership-phone"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Selected Plan</label>
                    <select
                      value={formData.plan}
                      onChange={(e) => {
                        setFormData({ ...formData, plan: e.target.value });
                        setSelectedPlan(e.target.value);
                      }}
                      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      data-testid="select-membership-plan"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ${p.price}/mo
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading"}
                    data-testid="button-submit-membership"
                  >
                    {status === "loading" ? "Submitting..." : "Complete Sign Up"}
                  </Button>
                </form>
              </Card>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "success" && (
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 pb-20"
          >
            <div className="max-w-lg mx-auto text-center">
              <Card className="p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-serif mb-2" data-testid="text-success-heading">Welcome to the Family!</h3>
                <p className="text-muted-foreground text-sm" data-testid="text-success-message">
                  Your membership request has been submitted. We'll reach out shortly to finalize your plan and get you booked for your first appointment.
                </p>
              </Card>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">
              FAQ
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-serif" data-testid="text-faq-heading">
              Common <span className="italic">Questions</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  <AccordionItem value={`faq-${i}`} className="border border-border rounded-md px-4" data-testid={`accordion-faq-${i}`}>
                    <AccordionTrigger className="text-sm font-medium" data-testid={`button-faq-${i}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground" data-testid={`text-faq-answer-${i}`}>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}