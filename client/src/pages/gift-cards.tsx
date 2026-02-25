import { useState } from "react";
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
import { Gift, Check, Sparkles, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const amounts = [25, 50, 75, 100, 150];

const giftCardFormSchema = z.object({
  amount: z.number().min(25),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientEmail: z.string().email("Valid email required"),
  senderName: z.string().min(2, "Your name is required"),
  senderEmail: z.string().email("Valid email required"),
  personalMessage: z.string().optional(),
});

type GiftCardFormValues = z.infer<typeof giftCardFormSchema>;

export default function GiftCards() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [giftCardCode, setGiftCardCode] = useState<string | null>(null);

  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(giftCardFormSchema),
    defaultValues: {
      amount: 50,
      recipientName: "",
      recipientEmail: "",
      senderName: "",
      senderEmail: "",
      personalMessage: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: GiftCardFormValues) => {
      const res = await apiRequest("POST", "/api/gift-cards", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGiftCardCode(data.code);
      toast({ title: "Gift card created!", description: `Code: ${data.code}` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create gift card.", variant: "destructive" });
    },
  });

  if (giftCardCode) {
    return (
      <div className="min-h-screen">
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-rose-950/80 to-amber-900" />
          <div className="relative z-10 max-w-xl mx-auto text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-serif text-white mb-4">Gift Card Created!</h1>
            <div className="bg-white/10 backdrop-blur-md rounded-md p-8 border border-white/20 mb-6">
              <p className="text-white/60 text-sm mb-2">Your gift card code</p>
              <p className="text-3xl font-mono text-amber-200 font-bold tracking-widest" data-testid="text-gift-code">{giftCardCode}</p>
              <p className="text-white/60 text-sm mt-3">Amount: ${selectedAmount}</p>
            </div>
            <p className="text-stone-300 text-sm mb-6">
              Present this code at Hair Artistry to redeem. The recipient will love it!
            </p>
            <Button onClick={() => { setGiftCardCode(null); form.reset(); setSelectedAmount(50); }} variant="outline" className="bg-white/5 border-white/20 text-white" data-testid="button-new-gift-card">
              Create Another Gift Card
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-rose-950/80 to-amber-900" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-4">
              <Gift className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200 tracking-[0.2em] uppercase text-xs font-semibold">E-Gift Cards</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-serif text-white mb-4" data-testid="text-gift-title">
              Give the Gift of<br /><span className="italic text-amber-200">Beauty</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg max-w-xl mx-auto">
              The perfect gift for birthdays, holidays, or any occasion. Redeemable for any service at Hair Artistry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl mb-2 text-center">Choose an Amount</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Select how much you'd like to give</p>
            <div className="flex flex-wrap justify-center gap-3">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); form.setValue("amount", amount); }}
                  className={`px-6 py-3 rounded-md border text-base font-semibold transition-all ${
                    selectedAmount === amount
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover-elevate"
                  }`}
                  data-testid={`button-amount-${amount}`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-md border border-border bg-card">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg">Gift Card Details</h3>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate({ ...data, amount: selectedAmount }))} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="recipientName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient's Name</FormLabel>
                      <FormControl><Input placeholder="Their name" {...field} data-testid="input-recipient-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="recipientEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient's Email</FormLabel>
                      <FormControl><Input type="email" placeholder="their@email.com" {...field} data-testid="input-recipient-email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="senderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl><Input placeholder="Your name" {...field} data-testid="input-sender-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="senderEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl><Input type="email" placeholder="your@email.com" {...field} data-testid="input-sender-email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="personalMessage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Message (optional)</FormLabel>
                    <FormControl><Textarea placeholder="Add a personal touch..." className="resize-none min-h-[80px]" {...field} data-testid="input-personal-message" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" size="lg" className="w-full h-12" disabled={mutation.isPending} data-testid="button-purchase-gift">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {mutation.isPending ? "Creating..." : `Create $${selectedAmount} Gift Card`}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Payment will be collected at the salon when the gift card is redeemed.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
