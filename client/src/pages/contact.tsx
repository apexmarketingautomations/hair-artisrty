import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin, Clock, Send, Navigation } from "lucide-react";
import { SiInstagram, SiFacebook } from "react-icons/si";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-salon.jpg" alt="Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} className="text-amber-300/90 tracking-[0.3em] uppercase text-xs mb-4 font-semibold">Get In Touch</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-serif text-white mb-4" data-testid="text-contact-title">
            Contact <span className="italic">Us</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg">We'd love to hear from you</motion.p>
        </motion.div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-serif mb-8" data-testid="text-info-heading">
                Salon<br /><span className="italic">Information</span>
              </motion.h2>

              <div className="space-y-6">
                <motion.div variants={fadeUp} custom={1} className="flex gap-4 items-start p-4 rounded-md border border-border bg-card hover-elevate">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-muted-foreground mb-1 uppercase tracking-wider">Address</h3>
                    <p className="text-sm" data-testid="text-address">909 SE 47th Terr<br />Cape Coral, FL 33904 #104</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} custom={2} className="flex gap-4 items-start p-4 rounded-md border border-border bg-card hover-elevate">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-muted-foreground mb-1 uppercase tracking-wider">Phone</h3>
                    <a href="tel:+12396779902" className="text-sm text-primary font-medium" data-testid="text-phone">(239) 677-9902</a>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} custom={3} className="flex gap-4 items-start p-4 rounded-md border border-border bg-card hover-elevate">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-muted-foreground mb-1 uppercase tracking-wider">Hours</h3>
                    <div className="text-sm space-y-0.5" data-testid="text-hours">
                      <p>Tuesday - Friday: 10am - 7pm</p>
                      <p>Saturday: 9am - 6pm</p>
                      <p className="text-muted-foreground">Sunday & Monday: Closed</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} custom={4} className="flex gap-3 mt-6">
                <a href="https://www.instagram.com/hairartistrysaloncapecoral" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover-elevate" data-testid="link-instagram">
                  <SiInstagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/hairartistrysaloncapecoral" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover-elevate" data-testid="link-facebook">
                  <SiFacebook className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div variants={fadeUp} custom={5} className="mt-8">
                <a href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full h-12" data-testid="button-book-contact">
                    <Navigation className="w-4 h-4 mr-2" /> Book Online
                  </Button>
                </a>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} custom={2} className="lg:col-span-3">
              <div className="p-8 rounded-md border border-border bg-card">
                <div className="flex items-center gap-2 mb-6">
                  <Send className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-serif" data-testid="text-form-heading">Send Us a Message</h2>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input placeholder="Your name" {...field} data-testid="input-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl><Input type="tel" placeholder="(239) 555-0123" {...field} data-testid="input-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us how we can help..." className="min-h-[140px] resize-none" {...field} data-testid="input-message" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" size="lg" className="w-full h-12" disabled={mutation.isPending} data-testid="button-submit-contact">
                      <Send className="w-4 h-4 mr-2" />
                      {mutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
