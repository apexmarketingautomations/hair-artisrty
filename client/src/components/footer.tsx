import { Link } from "wouter";
import { Scissors, Phone, MapPin, Clock, Gift, ArrowRight } from "lucide-react";
import { SiInstagram, SiFacebook } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg font-semibold">Hair Artistry</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              A full service salon where you're not just a client &mdash; you're family.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/hairartistrysaloncapecoral" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover-elevate" data-testid="link-instagram">
                <SiInstagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/hairartistrysaloncapecoral" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover-elevate" data-testid="link-facebook">
                <SiFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Gift Cards", href: "/gift-cards" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer py-1 hover:text-primary transition-colors" data-testid={`link-footer-${link.label.toLowerCase().replace(" ", "-")}`}>
                    <ArrowRight className="w-3 h-3" /> {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="tel:+12396779902" className="text-muted-foreground" data-testid="text-footer-phone">(239) 677-9902</a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground" data-testid="text-footer-address">909 SE 47th Terr<br />Cape Coral, FL 33904 #104</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-muted-foreground" data-testid="text-footer-hours">
                  <p>Tue-Fri: 10am-7pm</p>
                  <p>Sat: 9am-6pm</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold mb-4">Gift Cards</h3>
            <p className="text-muted-foreground text-sm mb-4">Give the perfect gift of beautiful hair. E-Gift cards available now.</p>
            <Link href="/gift-cards">
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium cursor-pointer">
                <Gift className="w-4 h-4" /> Shop Gift Cards
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center" data-testid="text-copyright">
            Hair Artistry Full Service Salon &middot; Cape Coral, FL &middot; hairartistrysalon.biz
          </p>
        </div>
      </div>
    </footer>
  );
}
