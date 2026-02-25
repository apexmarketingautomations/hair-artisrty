import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AiChatWidget } from "@/components/ai-chat";
import EmailPopup from "@/components/email-popup";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import GiftCards from "@/pages/gift-cards";
import Referrals from "@/pages/referrals";
import Shop from "@/pages/shop";
import Memberships from "@/pages/memberships";
import Gallery from "@/pages/gallery";
import AdminGallery from "@/pages/admin-gallery";
import AdminLeads from "@/pages/admin-leads";
import AdminLogin from "@/pages/admin-login";
import AdminGuard from "@/components/admin-guard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/gift-cards" component={GiftCards} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/shop" component={Shop} />
      <Route path="/memberships" component={Memberships} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/gallery">
        <AdminGuard><AdminGallery /></AdminGuard>
      </Route>
      <Route path="/admin/leads">
        <AdminGuard><AdminLeads /></AdminGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <AiChatWidget />
          <EmailPopup />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
