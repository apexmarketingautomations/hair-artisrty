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
import { Phone, MapPin, Clock, Instagram } from "lucide-react";

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
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-amber-300/90 tracking-[0.3em] uppercase text-sm mb-4 font-medium">Get In Touch</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6" data-testid="text-contact-title">
            Contact Us
          </h1>
          <p className="text-stone-300 text-lg">We'd love to hear from you</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-serif mb-8" data-testid="text-info-heading">Salon Information</h2>
              <div className="space-y-6">
                <InfoItem
                  icon={<MapPin className="w-5 h-5" />}
                  title="Address"
                  content="909 SE 47th Terr, Cape Coral, FL 33904 #104"
                  testId="text-address"
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5" />}
                  title="Phone"
                  content="(239) 677-9902"
                  href="tel:+12396779902"
                  testId="text-phone"
                />
                <InfoItem
                  icon={<Clock className="w-5 h-5" />}
                  title="Hours"
                  content={
                    <div className="space-y-1">
                      <p>Tuesday - Friday: 10am - 7pm</p>
                      <p>Saturday: 9am - 6pm</p>
                      <p className="text-muted-foreground">Sunday - Monday: Closed</p>
                    </div>
                  }
                  testId="text-hours"
                />
                <InfoItem
                  icon={<Instagram className="w-5 h-5" />}
                  title="Instagram"
                  content="@hairartistrysaloncapecoral"
                  href="https://www.instagram.com/hairartistrysaloncapecoral"
                  testId="text-instagram"
                />
              </div>

              <div className="mt-10">
                <a
                  href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full sm:w-auto px-8" data-testid="button-book-contact">
                    Book Online
                  </Button>
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif mb-8" data-testid="text-form-heading">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(239) 555-0123" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us how we can help..."
                            className="min-h-[120px] resize-none"
                            {...field}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="button-submit-contact">
                    {mutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ icon, title, content, href, testId }: { icon: React.ReactNode; title: string; content: React.ReactNode; href?: string; testId: string }) {
  const contentEl = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" data-testid={testId}>
      {content}
    </a>
  ) : (
    <div data-testid={testId}>{content}</div>
  );

  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-1">{title}</h3>
        <div className="text-foreground">{contentEl}</div>
      </div>
    </div>
  );
}
