import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Scissors, Gift, ShoppingBag, Crown, Users, Camera, Lock } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "Memberships", href: "/memberships" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent border-b border-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg font-semibold">Hair Artistry</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5" data-testid="nav-desktop">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`px-2.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                {item.label}
              </span>
            </Link>
          ))}
          <Link href="/referrals">
            <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer bg-gradient-to-r from-primary/10 to-rose-500/10 border border-primary/20 ${location === "/referrals" ? "text-primary" : "text-primary/80"}`} data-testid="link-nav-refer">
              Refer & Save
            </span>
          </Link>
          <Link href="/admin/login">
            <span className="px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-muted-foreground/50 hover:text-primary" data-testid="link-nav-admin">
              <Lock className="w-3 h-3 inline mr-1" />Admin
            </span>
          </Link>
          <a
            href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            <Button size="sm" data-testid="button-book-nav">
              Book Now
            </Button>
          </a>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button size="icon" variant="ghost" data-testid="button-mobile-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-1 mt-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-md text-sm font-medium cursor-pointer ${
                      location === item.href ? "text-primary bg-primary/5" : "text-muted-foreground"
                    }`}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.label === "Gallery" && <Camera className="w-4 h-4 inline mr-2" />}
                    {item.label === "Gift Cards" && <Gift className="w-4 h-4 inline mr-2" />}
                    {item.label === "Shop" && <ShoppingBag className="w-4 h-4 inline mr-2" />}
                    {item.label === "Memberships" && <Crown className="w-4 h-4 inline mr-2" />}
                    {item.label}
                  </span>
                </Link>
              ))}
              <Link href="/referrals">
                <span
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-md text-sm font-medium cursor-pointer text-primary bg-gradient-to-r from-primary/5 to-rose-500/5"
                  data-testid="link-mobile-refer"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Refer & Save $10
                </span>
              </Link>
              <Link href="/admin/login">
                <span
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-md text-sm font-medium cursor-pointer text-muted-foreground/50"
                  data-testid="link-mobile-admin"
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Admin Login
                </span>
              </Link>
              <a
                href="https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4"
              >
                <Button className="w-full" data-testid="button-book-mobile">
                  Book Now
                </Button>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
