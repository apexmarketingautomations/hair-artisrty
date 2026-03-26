import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Award, Users, Star, Sparkles, MapPin, Phone, Scissors, Crown, ExternalLink, ArrowRight } from "lucide-react";
import { SiInstagram } from "react-icons/si";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const teamMembers = [
  {
    name: "Nakisha Camacho",
    aka: "ShhmoneyCurl",
    role: "Founder & Master Colorist",
    specialties: ["Curly Hair Expert", "Master Colorist", "Color Corrections", "The Camacho Curly Cut"],
    phone: "(239) 677-9902",
    instagram: "shhmoneycurl",
    gradient: "from-amber-500 to-rose-500",
    image: "/images/nakisha-profile.jpg",
  },
  {
    name: "Michael",
    aka: "Mac Daddy",
    role: "Senior Artist",
    specialties: ["Precision Cuts", "Men's Grooming", "Fades", "Beard Design"],
    phone: "(239) 277-9494",
    instagram: null,
    gradient: "from-violet-500 to-indigo-500",
    image: "/images/team-member-4.jpg",
  },
  {
    name: "Jenae",
    aka: null,
    role: "Senior Artist & Braider",
    specialties: ["Knotless Braids", "Box Braids", "Cornrows", "Protective Styles"],
    phone: "(309) 336-4440",
    instagram: null,
    gradient: "from-teal-500 to-emerald-500",
    image: "/images/team-member-5.jpg",
  },
  {
    name: "Hayley",
    aka: null,
    role: "Junior Artist",
    specialties: ["Blowouts", "Styling", "Treatments", "Waxing"],
    phone: "(239) 738-1661",
    instagram: null,
    gradient: "from-amber-400 to-orange-500",
    image: "/images/team-member-8.jpg",
  },
  {
    name: "Kaylee",
    aka: null,
    role: "Master Barber",
    specialties: ["Precision Fades", "Skin Fades", "Beard Sculpting", "Hair Design", "Razor Work", "Men's Styling"],
    phone: "(239) 699-3321",
    instagram: null,
    gradient: "from-red-500 to-rose-600",
    image: "/images/team-kaylee.jpg",
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/team-group.jpg" alt="The Hair Artistry Dream Team" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-rose-900/10 to-violet-900/15" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.3em] uppercase text-xs mb-4 font-semibold">Est. 2017 &middot; Cape Coral, FL</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-about-title">
            Meet the <span className="italic text-amber-200/90">Dream Team</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg max-w-xl mx-auto">Where passion meets precision, and every client becomes family.</motion.p>
        </motion.div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} custom={0} className="relative">
              <div className="relative overflow-hidden rounded-lg">
                <img src="/images/founder-nakisha.jpg" alt="Nakisha ShhmoneyCurl Camacho, Founder of Hair Artistry" className="w-full object-cover object-top aspect-[4/5]" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-amber-200 text-xs tracking-[0.2em] uppercase font-semibold">Founder</p>
                  <p className="text-white font-serif text-xl">Nakisha Camacho</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gradient-to-br from-primary to-rose-500 rounded-lg flex flex-col items-center justify-center text-white shadow-lg">
                <span className="text-2xl font-bold">8+</span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">Years</span>
              </div>
            </motion.div>

            <div>
              <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">The Founder</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-2" data-testid="text-founder-heading">
                Nakisha<br /><span className="italic">ShhmoneyCurl</span> Camacho
              </motion.h2>
              <motion.p variants={fadeUp} custom={1.5} className="text-primary font-medium text-sm mb-6">Master Colorist &middot; Curly Hair Expert &middot; Entrepreneur</motion.p>
              <motion.div variants={fadeUp} custom={2} className="space-y-4 text-muted-foreground leading-relaxed">
                <p data-testid="text-founder-p1">
                  Hair Artistry was born from a dream. In July 2017, at just 24 years old, Nakisha turned her 
                  lifelong passion for hair into reality and opened the doors of Hair Artistry Full Service Salon 
                  in Cape Coral, Florida.
                </p>
                <p data-testid="text-founder-p2">
                  As a certified Master Colorist and Curly Hair Expert, Nakisha's mission goes beyond styling. 
                  She educates every client on how to care for and celebrate their natural hair, 
                  delivering results that are nothing short of extraordinary.
                </p>
                <p data-testid="text-founder-p3">
                  Her signature creation, <span className="text-foreground font-medium">The Camacho Curly Cut</span>, 
                  is a precision dry-and-wet technique that honors each curl pattern — giving shape, 
                  volume, and movement that transforms the way clients see their hair.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mt-6">
                <a href="https://shhmoneycurl.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" data-testid="link-founder-website">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> ShhmoneyCurl.com
                  </Button>
                </a>
                <a href="https://www.instagram.com/shhmoneycurl" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" data-testid="link-founder-instagram">
                    <SiInstagram className="w-3.5 h-3.5 mr-1.5" /> @shhmoneycurl
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Our Artists</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif mb-4" data-testid="text-team-heading">
              The Hair Artistry <span className="italic">Dream Team</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto">
              Every artist at Hair Artistry is an independent specialist who brings unique expertise to the team. 
              They set their own appointments and pricing — reach out directly to book with your preferred stylist.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-lg border border-border bg-background overflow-hidden hover-elevate ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
                data-testid={`card-team-${i}`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${member.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={member.image} alt={member.name} className="shrink-0 w-14 h-14 rounded-full object-cover object-top border-2 border-border" />
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg leading-tight">{member.name}</h3>
                      {member.aka && <p className="text-primary text-xs font-semibold">"{member.aka}"</p>}
                      <p className="text-muted-foreground text-sm">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.specialties.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{s}</span>
                    ))}
                  </div>

                  {"bio" in member && member.bio && (
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4" data-testid={`text-team-bio-${i}`}>{member.bio}</p>
                  )}

                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    {member.phone && (
                      <a href={`tel:${member.phone.replace(/[^0-9]/g, "")}`} className="inline-flex items-center gap-1.5 text-sm text-primary font-medium" data-testid={`link-team-phone-${i}`}>
                        <Phone className="w-3.5 h-3.5" /> {member.phone}
                      </a>
                    )}
                    {member.instagram && (
                      <a href={`https://www.instagram.com/${member.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid={`link-team-instagram-${i}`}>
                        <SiInstagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-primary tracking-[0.2em] uppercase text-xs mb-3 font-semibold">Why Hair Artistry</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif" data-testid="text-values-heading">
              The <span className="italic">Difference</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-5">
            {[
              { icon: Heart, title: "Family-First Culture", desc: "From the moment you walk in, you're treated like family. We create a warm, inclusive environment where every guest feels valued, seen, and celebrated." },
              { icon: Award, title: "Certified Specialists", desc: "Our team holds advanced certifications in curly hair care, color correction, hand-tied extensions, precision barbering, and protective styling." },
              { icon: Users, title: "All Hair Types Welcome", desc: "We proudly serve women, men, and children of every hair type and texture. Whether it's curls, coils, color, braids, or a fresh fade — we've got you." },
              { icon: Star, title: "Above & Beyond", desc: "We don't just style hair — we educate, empower, and ensure you leave looking and feeling like the best version of yourself. Every single time." },
            ].map((value, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-5 p-6 rounded-lg border border-border bg-card hover-elevate" data-testid={`card-value-${i}`}>
                <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-rose-500/10 text-primary flex items-center justify-center">
                  <value.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1.5">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-stone-900 via-rose-950/80 to-violet-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a574' fill-opacity='0.3'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.2em] uppercase text-xs mb-4 font-semibold">New Clients</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-serif text-white mb-4">
              Ready to Experience<br />the <span className="italic text-amber-200">Artistry?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 mb-4 text-lg max-w-xl mx-auto">
              Book your first appointment today and discover why our clients keep coming back.
            </motion.p>
            <motion.div variants={fadeUp} custom={2.5} className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200 font-semibold text-sm" data-testid="text-about-discount">All new clients receive $10 off their first visit</span>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-10 h-12 text-base" data-testid="button-book-about">
                  Book Your Visit <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="tel:+12396779902">
                <Button variant="outline" size="lg" className="px-10 h-12 text-base bg-white/5 border-white/20 text-white" data-testid="button-call-about">
                  <Phone className="w-4 h-4 mr-2" /> Call the Salon
                </Button>
              </a>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-6 text-stone-400 text-sm">
              909 SE 47th Terr, Cape Coral, FL 33904 #104
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
