import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users, Mail, Phone, MessageSquare, Gift, Crown, UserPlus,
  ArrowLeft, Search, Download, ExternalLink, Calendar, TrendingUp,
  MailOpen, UserCheck, DollarSign
} from "lucide-react";
import { Link } from "wouter";
import type { NewsletterSubscriber, ContactSubmission, Referral, Membership, GiftCard } from "@shared/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

type TabType = "all" | "newsletter" | "contacts" | "referrals" | "memberships" | "gift-cards";

interface LeadsData {
  newsletter: NewsletterSubscriber[];
  contacts: ContactSubmission[];
  referrals: Referral[];
  memberships: Membership[];
  giftCards: GiftCard[];
}

interface UnifiedLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  sourceIcon: typeof Mail;
  sourceColor: string;
  details: string;
  date: string;
  status?: string;
  raw: any;
}

function unifyLeads(data: LeadsData): UnifiedLead[] {
  const leads: UnifiedLead[] = [];

  data.newsletter.forEach((s) => {
    leads.push({
      id: `newsletter-${s.id}`,
      name: s.name || "Subscriber",
      email: s.email,
      source: "Newsletter",
      sourceIcon: MailOpen,
      sourceColor: "text-blue-500 bg-blue-500/10",
      details: "Signed up for email newsletter",
      date: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
      raw: s,
    });
  });

  data.contacts.forEach((c) => {
    leads.push({
      id: `contact-${c.id}`,
      name: c.name,
      email: c.email,
      phone: c.phone || undefined,
      source: "Contact Form",
      sourceIcon: MessageSquare,
      sourceColor: "text-emerald-500 bg-emerald-500/10",
      details: c.message.length > 80 ? c.message.slice(0, 80) + "..." : c.message,
      date: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
      raw: c,
    });
  });

  data.referrals.forEach((r) => {
    leads.push({
      id: `referral-${r.id}`,
      name: r.referrerName,
      email: r.referrerEmail,
      source: "Referral",
      sourceIcon: UserPlus,
      sourceColor: "text-violet-500 bg-violet-500/10",
      details: `Code: ${r.referralCode}${r.redeemed ? " (Redeemed)" : " (Pending)"}`,
      date: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      status: r.redeemed ? "redeemed" : "pending",
      raw: r,
    });
  });

  data.memberships.forEach((m) => {
    leads.push({
      id: `membership-${m.id}`,
      name: m.name,
      email: m.email,
      phone: m.phone,
      source: "Membership",
      sourceIcon: Crown,
      sourceColor: "text-amber-500 bg-amber-500/10",
      details: `${m.plan.charAt(0).toUpperCase() + m.plan.slice(1)} plan — ${m.status}`,
      date: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
      status: m.status,
      raw: m,
    });
  });

  data.giftCards.forEach((g) => {
    leads.push({
      id: `gift-${g.id}`,
      name: g.senderName,
      email: g.senderEmail,
      source: "Gift Card",
      sourceIcon: Gift,
      sourceColor: "text-rose-500 bg-rose-500/10",
      details: `$${g.amount} gift to ${g.recipientName} (${g.code})`,
      date: g.createdAt ? new Date(g.createdAt).toISOString() : new Date().toISOString(),
      status: g.redeemed ? "redeemed" : "active",
      raw: g,
    });
  });

  leads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return leads;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function exportCSV(leads: UnifiedLead[]) {
  const headers = ["Name", "Email", "Phone", "Source", "Details", "Date"];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.phone || "",
    l.source,
    l.details.replace(/,/g, ";"),
    new Date(l.date).toLocaleDateString(),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hair-artistry-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const tabs: { key: TabType; label: string; icon: typeof Mail }[] = [
  { key: "all", label: "All Leads", icon: Users },
  { key: "newsletter", label: "Newsletter", icon: MailOpen },
  { key: "contacts", label: "Contact Forms", icon: MessageSquare },
  { key: "memberships", label: "Memberships", icon: Crown },
  { key: "referrals", label: "Referrals", icon: UserPlus },
  { key: "gift-cards", label: "Gift Cards", icon: Gift },
];

export default function AdminLeads() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<LeadsData>({
    queryKey: ["/api/admin/leads"],
  });

  const allLeads = data ? unifyLeads(data) : [];

  const filtered = allLeads.filter((lead) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "newsletter" && lead.source === "Newsletter") ||
      (activeTab === "contacts" && lead.source === "Contact Form") ||
      (activeTab === "referrals" && lead.source === "Referral") ||
      (activeTab === "memberships" && lead.source === "Membership") ||
      (activeTab === "gift-cards" && lead.source === "Gift Card");

    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.details.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const stats = data
    ? {
        total: allLeads.length,
        newsletter: data.newsletter.length,
        contacts: data.contacts.length,
        memberships: data.memberships.length,
        referrals: data.referrals.length,
        giftCards: data.giftCards.length,
        revenue: data.memberships.length * 99 + data.giftCards.reduce((sum, g) => sum + g.amount, 0),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-xl font-semibold" data-testid="text-leads-title">Prospect Leads</h1>
              <p className="text-muted-foreground text-xs">All captured leads from your website in one place</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/gallery">
              <Button variant="outline" size="sm" data-testid="button-go-gallery">
                Content Manager
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)} disabled={filtered.length === 0} data-testid="button-export-csv">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="border-b border-border bg-card/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total Leads", value: stats.total, icon: TrendingUp, color: "text-primary" },
                { label: "Newsletter", value: stats.newsletter, icon: MailOpen, color: "text-blue-500" },
                { label: "Contacts", value: stats.contacts, icon: MessageSquare, color: "text-emerald-500" },
                { label: "Members", value: stats.memberships, icon: Crown, color: "text-amber-500" },
                { label: "Referrals", value: stats.referrals, icon: UserPlus, color: "text-violet-500" },
                { label: "Gift Cards", value: stats.giftCards, icon: Gift, color: "text-rose-500" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                  <Card className="p-3 text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                    <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover-elevate"
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
                {data && (
                  <span className="opacity-70">
                    ({tab.key === "all" ? allLeads.length :
                      tab.key === "newsletter" ? data.newsletter.length :
                      tab.key === "contacts" ? data.contacts.length :
                      tab.key === "memberships" ? data.memberships.length :
                      tab.key === "referrals" ? data.referrals.length :
                      data.giftCards.length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="pl-9 h-8 text-sm"
              data-testid="input-search-leads"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-lg mb-2">{search ? "No Matches" : "No Leads Yet"}</h3>
            <p className="text-muted-foreground text-sm">
              {search
                ? "Try adjusting your search terms."
                : "Leads from newsletter signups, contact forms, referrals, memberships, and gift cards will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={Math.min(i, 15)}
                className="rounded-lg border border-border bg-card hover-elevate"
                data-testid={`row-lead-${lead.id}`}
              >
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${lead.sourceColor}`}>
                    <lead.sourceIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{lead.name}</span>
                      <Badge variant="outline" className="text-[10px] py-0 shrink-0">{lead.source}</Badge>
                      {lead.status && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] py-0 shrink-0 ${
                            lead.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                            lead.status === "redeemed" ? "bg-green-500/10 text-green-600" :
                            lead.status === "active" ? "bg-blue-500/10 text-blue-600" : ""
                          }`}
                        >
                          {lead.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{lead.details}</p>
                  </div>

                  <div className="shrink-0 text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">{formatDate(lead.date)}</p>
                  </div>
                </div>

                {expandedId === lead.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border px-4 py-3 bg-muted/30"
                  >
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <a href={`mailto:${lead.email}`} className="text-primary text-sm truncate" data-testid={`link-email-${lead.id}`}>
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <a href={`tel:${lead.phone}`} className="text-primary text-sm" data-testid={`link-phone-${lead.id}`}>
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground text-sm">
                            {new Date(lead.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-medium">Details</p>
                        <p className="text-sm">{lead.source === "Contact Form" ? lead.raw.message : lead.details}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <a href={`mailto:${lead.email}`}>
                        <Button size="sm" variant="outline" data-testid={`button-email-${lead.id}`}>
                          <Mail className="w-3 h-3 mr-1.5" /> Email
                        </Button>
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`}>
                          <Button size="sm" variant="outline" data-testid={`button-call-${lead.id}`}>
                            <Phone className="w-3 h-3 mr-1.5" /> Call
                          </Button>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
