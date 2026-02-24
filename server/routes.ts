import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertGiftCardSchema, insertReviewSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SALON_SYSTEM_PROMPT = `You are the AI concierge for Hair Artistry Full Service Salon, located at 909 SE 47th Terr, Cape Coral, FL 33904 #104. Phone: (239) 677-9902.

Hours: Tuesday-Friday 10am-7pm, Saturday 9am-6pm, Sunday-Monday Closed.

About: Hair Artistry is a full service salon where you're not just a client, you're family! Certified specialists in curly hair, extensions, braiding, natural hair styles, fades, and blending. All new clients receive $10 off their first visit.

Specialties:
- CAMACHO CURLY CUT: Signature dry + wet technique for every curl type
- BALAYAGE: Hand-painted highlights for effortless glow
- MEN'S GROOMING: Scissor cuts, fades, straight razor shaves with hot towel
- KIDS' CUTS: Fresh styles for little ones
- BRAIDS & INSTALLS: Knotless braids, wig installs, custom units, extensions (hand-tied, sew-in, tape-ins)
- WAXING: Brows, lips, chins, sideburns
- BLONDING: Bold highlights, dimensional blends, color corrections
- BRIDAL: In salon or travel to you
- SCALP THERAPY: Luxe 1-hour treatment with massage, masks, facial, blowout

Gift Cards: Available on our website in amounts of $25, $50, $75, $100, and $150. Perfect for any occasion!

Booking: https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl

You are a warm, knowledgeable AI concierge. Help with service questions, recommendations, booking info, and hair care tips. Keep responses concise but personable. Use a warm, welcoming tone. When recommending services, be specific about what would work for the client's needs.`;

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await storage.seedReviews();

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
