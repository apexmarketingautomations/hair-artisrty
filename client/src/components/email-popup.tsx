import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ha_popup_dismissed";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const ts = parseInt(dismissed, 10);
      if (Date.now() - ts < SEVEN_DAYS_MS) return;
    }
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 409) {
        setStatus("success");
        setTimeout(() => handleClose(), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          data-testid="overlay-email-popup"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600" />
            <div className="relative bg-background/80 backdrop-blur-xl m-[1px] rounded-md p-8">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover-elevate"
                data-testid="button-popup-close"
              >
                <X className="w-4 h-4" />
              </button>

              {status === "success" ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-serif text-2xl mb-2" data-testid="text-popup-success">You're In!</h3>
                  <p className="text-muted-foreground text-sm">Check your inbox for your $10 discount code.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 mb-4">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-serif text-2xl mb-2" data-testid="text-popup-heading">
                      Welcome! Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">$10 Off</span> Your First Visit
                    </h2>
                    <p className="text-muted-foreground text-sm">Join our mailing list for exclusive deals, styling tips, and early access to new services.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full h-10 px-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50"
                      data-testid="input-popup-email"
                    />
                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-gradient-to-r from-amber-500 to-rose-500 border-amber-600 text-white"
                      data-testid="button-popup-submit"
                    >
                      {status === "loading" ? "Sending..." : "Claim My Discount"}
                    </Button>
                    {status === "error" && (
                      <p className="text-destructive text-xs text-center">Something went wrong. Please try again.</p>
                    )}
                  </form>
                  <p className="text-muted-foreground text-[10px] text-center mt-4">We respect your privacy. Unsubscribe anytime.</p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
