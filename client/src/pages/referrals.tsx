import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share2, CalendarCheck, DollarSign, Copy, Check, ArrowRight, Gift, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const steps = [
  {
    icon: Share2,
    title: "Share Your Link",
    description: "Get your unique referral code and share it with friends, family, or on social media.",
    gradient: "from-rose-500 to-amber-500",
  },
  {
    icon: CalendarCheck,
    title: "Friend Books",
    description: "When your friend books their first appointment using your code, you both get rewarded.",
    gradient: "from-violet-500 to-blue-500",
  },
  {
    icon: DollarSign,
    title: "Both Save $10",
    description: "You and your friend each receive $10 off your next service. It's a win-win!",
    gradient: "from-amber-500 to-rose-500",
  },
];

export default function Referrals() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await apiRequest("POST", "/api/referrals", { name, email });
      const data = await res.json();
      setReferralCode(data.referralCode);
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/work/work-17.jpg" alt="Hair Artistry referrals" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/70 via-amber-900/50 to-violet-900/70" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm mb-6">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200 text-xs tracking-[0.2em] uppercase font-medium">Referral Program</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-referrals-title">
            Share the <span className="italic text-amber-200">Love</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg max-w-xl mx-auto">
            Refer a friend and you both save $10 on your next visit. Because great hair should be shared.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">How It Works</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif" data-testid="text-how-it-works">
              Three Simple <span className="italic">Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} custom={i}>
                <Card className="p-6 text-center h-full hover-elevate" data-testid={`card-step-${i}`}>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-5`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-2">Step {i + 1}</div>
                  <h3 className="text-lg font-serif mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
              <h2 className="text-3xl font-serif mb-2" data-testid="text-get-code">Get Your Referral Code</h2>
              <p className="text-muted-foreground text-sm">Enter your info below and we'll generate your unique code.</p>
            </motion.div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="p-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-serif mb-2" data-testid="text-success-heading">You're All Set!</h3>
                  <p className="text-muted-foreground text-sm mb-6">Share this code with friends and family:</p>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="px-6 py-3 rounded-md bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-border font-mono text-lg font-bold tracking-wider" data-testid="text-referral-code">
                      {referralCode}
                    </div>
                    <Button size="icon" variant="outline" onClick={handleCopy} data-testid="button-copy-code">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  {copied && <p className="text-xs text-green-600 dark:text-green-400 mt-2">Copied to clipboard!</p>}
                </Card>
              </motion.div>
            ) : (
              <motion.div variants={fadeUp} custom={1}>
                <Card className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        data-testid="input-referral-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        data-testid="input-referral-email"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={status === "loading"} data-testid="button-get-referral-code">
                      {status === "loading" ? "Generating..." : "Get My Referral Code"}
                      {status !== "loading" && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                    {status === "error" && <p className="text-destructive text-xs text-center" data-testid="text-referral-error">{errorMsg}</p>}
                  </form>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-rose-900 via-violet-900 to-amber-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-cta-heading">
              Spread the <span className="italic text-amber-200">Word</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-stone-300 mb-8 text-lg max-w-xl mx-auto">
              The more friends you refer, the more you save. There's no limit to the love you can share.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-book-referral">
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
