import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertGiftCardSchema, insertReviewSchema, insertReferralSchema, insertMembershipSchema, insertGalleryItemSchema } from "@shared/schema";
import OpenAI from "openai";

declare module "express-session" {
  interface SessionData {
    adminAuth: boolean;
    adminName: string;
  }
}

const ADMIN_USERNAME = "nakisha";
const ADMIN_PASSWORD = "HairArtistry2026!";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.adminAuth) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SALON_SYSTEM_PROMPT = `You are the AI concierge for Hair Artistry Full Service Salon, located at 909 SE 47th Terr, Cape Coral, FL 33904 #104. Phone: (239) 677-9902.

Hours: Tuesday-Friday 10am-7pm, Saturday 9am-6pm, Sunday-Monday Closed.

About: Hair Artistry is a full service salon where you're not just a client, you're family! Certified specialists in curly hair, extensions, braiding, natural hair styles, fades, and blending. All new clients receive $10 off their first visit.

Services:
- CAMACHO CURLY CUT: Signature dry + wet technique for every curl type
- BALAYAGE & HIGHLIGHTS: Hand-painted highlights for effortless glow
- BLONDING: Bold highlights, dimensional blends, color corrections
- MEN'S GROOMING: Scissor cuts, fades, straight razor shaves with hot towel
- KIDS' CUTS: Fresh styles for little ones
- BRAIDS & INSTALLS: Knotless braids, wig installs, custom units, extensions (hand-tied, sew-in, tape-ins)
- WAXING: Brows, lips, chins, sideburns
- BRIDAL: In salon or travel to you
- SCALP THERAPY: Luxe 1-hour treatment with massage, masks, facial, blowout
- COLOR CORRECTIONS: Expert fix for unwanted tones, banding, damage

Premium Add-Ons:
- Deep Conditioning Treatment (+$25)
- Scalp Massage Add-On (+$15)
- Olaplex Bond Treatment (+$35)

Gift Cards: Available on our website ($25, $50, $75, $100, $150). Perfect for any occasion!

Membership Plans (monthly):
- Essential ($59/mo): 1 blowout/month, 10% off services, priority booking
- Premium ($99/mo): 1 blowout + 1 treatment/month, 15% off services, priority booking, free waxing
- VIP ($149/mo): 2 blowouts + 1 treatment/month, 20% off services, priority booking, free waxing, quarterly scalp therapy

Referral Program: Share your unique referral link - when a friend books, BOTH get $10 off!

Shop: We recommend professional hair products on our website including Olaplex, DevaCurl, Moroccan Oil, Redken, and more.

Booking: https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl

You are a warm, knowledgeable AI concierge. Help with service questions, recommendations, booking info, memberships, referrals, gift cards, and hair care tips. Keep responses concise but personable. Use a warm, welcoming tone. Actively suggest relevant upsells, memberships, and referral program when appropriate.`;

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await storage.seedReviews();

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (
      username?.toLowerCase() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      req.session.adminAuth = true;
      req.session.adminName = "Nakisha";
      res.json({ success: true, name: "Nakisha" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (req.session?.adminAuth) {
      res.json({ authenticated: true, name: req.session.adminName });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid form data", details: parsed.error.issues });
      const submission = await storage.createContactSubmission(parsed.data);
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const parsed = insertNewsletterSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid email" });
      const sub = await storage.subscribeNewsletter(parsed.data);
      res.status(201).json(sub);
    } catch (error: any) {
      if (error?.code === "23505") return res.status(409).json({ error: "Already subscribed" });
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/gift-cards", async (req, res) => {
    try {
      const parsed = insertGiftCardSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid gift card data" });
      const card = await storage.createGiftCard(parsed.data);
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gift card" });
    }
  });

  app.get("/api/gift-cards/:code", async (req, res) => {
    try {
      const card = await storage.getGiftCardByCode(req.params.code);
      if (!card) return res.status(404).json({ error: "Gift card not found" });
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to lookup gift card" });
    }
  });

  app.get("/api/reviews", async (_req, res) => {
    try {
      const revs = await storage.getAllReviews();
      res.json(revs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const parsed = insertReviewSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid review data" });
      const review = await storage.createReview(parsed.data);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  app.post("/api/referrals", async (req, res) => {
    try {
      const parsed = insertReferralSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid referral data" });
      const referral = await storage.createReferral(parsed.data);
      res.status(201).json(referral);
    } catch (error) {
      res.status(500).json({ error: "Failed to create referral" });
    }
  });

  app.get("/api/referrals/:code", async (req, res) => {
    try {
      const referral = await storage.getReferralByCode(req.params.code);
      if (!referral) return res.status(404).json({ error: "Referral not found" });
      res.json(referral);
    } catch (error) {
      res.status(500).json({ error: "Failed to lookup referral" });
    }
  });

  app.post("/api/referrals/:code/redeem", async (req, res) => {
    try {
      const { referredEmail, referredName } = req.body;
      if (!referredEmail || !referredName) return res.status(400).json({ error: "Name and email required" });
      const referral = await storage.redeemReferral(req.params.code, referredEmail, referredName);
      if (!referral) return res.status(404).json({ error: "Referral not found" });
      res.json(referral);
    } catch (error) {
      res.status(500).json({ error: "Failed to redeem referral" });
    }
  });

  app.post("/api/memberships", async (req, res) => {
    try {
      const parsed = insertMembershipSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid membership data" });
      const membership = await storage.createMembership(parsed.data);
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership" });
    }
  });

  app.get("/api/admin/leads", requireAdmin, async (_req, res) => {
    try {
      const [newsletter, contacts, referrals, memberships, giftCards] = await Promise.all([
        storage.getAllNewsletterSubscribers(),
        storage.getAllContactSubmissions(),
        storage.getAllReferrals(),
        storage.getAllMemberships(),
        storage.getAllGiftCards(),
      ]);
      res.json({ newsletter, contacts, referrals, memberships, giftCards });
    } catch {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/gallery", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const items = category && category !== "all"
        ? await storage.getGalleryItemsByCategory(category)
        : await storage.getAllGalleryItems();
      res.json(items);
    } catch {
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", requireAdmin, async (req, res) => {
    try {
      const parsed = insertGalleryItemSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid gallery data", details: parsed.error.issues });
      const item = await storage.createGalleryItem(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gallery item" });
    }
  });

  app.patch("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateGalleryItem(id, req.body);
      if (!item) return res.status(404).json({ error: "Item not found" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "Failed to update gallery item" });
    }
  });

  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id);
      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  });

  app.get("/api/conversations", async (_req, res) => {
    try { res.json(await storage.getAllConversations()); }
    catch { res.status(500).json({ error: "Failed to fetch conversations" }); }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversation = await storage.createConversation(req.body.title || "New Chat");
      res.status(201).json(conversation);
    } catch { res.status(500).json({ error: "Failed to create conversation" }); }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      if (!conversation) return res.status(404).json({ error: "Not found" });
      const msgs = await storage.getMessagesByConversation(id);
      res.json({ ...conversation, messages: msgs });
    } catch { res.status(500).json({ error: "Failed to fetch conversation" }); }
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      await storage.deleteConversation(parseInt(req.params.id));
      res.status(204).send();
    } catch { res.status(500).json({ error: "Failed to delete conversation" }); }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;
      if (!content) return res.status(400).json({ error: "Content required" });

      await storage.createMessage(conversationId, "user", content);
      const existingMessages = await storage.getMessagesByConversation(conversationId);
      const chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: SALON_SYSTEM_PROMPT },
        ...existingMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: chatHistory,
        stream: true,
        max_tokens: 1024,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const c = chunk.choices[0]?.delta?.content || "";
        if (c) {
          fullResponse += c;
          res.write(`data: ${JSON.stringify({ content: c })}\n\n`);
        }
      }

      await storage.createMessage(conversationId, "assistant", fullResponse);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });

  return httpServer;
}
