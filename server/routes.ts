import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SALON_SYSTEM_PROMPT = `You are the AI assistant for Hair Artistry Full Service Salon, located at 909 SE 47th Terr, Cape Coral, FL 33904 #104. Phone: (239) 677-9902.

Hours of Operation:
- Tuesday-Friday: 10am-7pm
- Saturday: 9am-6pm
- Sunday-Monday: Closed

About Hair Artistry:
Hair Artistry is a full service salon where you're not just a client, you're family! We offer services from balayage, haircuts, men's cuts, waxing and more. We have certified specialists in curly hair, extensions (tape-ins), braiding, natural hair styles, fades, and blending. All new clients receive $10 off their first visit.

Our Specialties Include:
- The CAMACHO CURLY CUT: A signature dry + wet technique tailored for every curly type
- BALAYAGE: Soft, hand-painted highlights for the effortless glow
- MEN'S GROOMING: Scissor cuts, fades, straight razor shaves with hot towel, and more
- KIDS' CUTS: Fresh styles for little ones
- BRAIDS & INSTALLS: Knotless braids, wig installs, custom units, and extensions (hand-tied, sew-in, or tape-ins)
- WAXING: Brows, lips, chins, sideburns - smooth skin made easy
- BLONDING SERVICES: From bold highlights to dimensional blends, and color corrections
- BRIDAL SERVICES: In salon or we travel to you
- SCALP THERAPY EXPERIENCES: Unwind with a luxe 1-hour scalp treatment, massage bed bliss, two hair masks, a facial, and a blowout of your choice

Service Categories:
1. Hair Cutting - Simple cuts, specialty cuts, kids cuts, men's fades
2. Hair Coloring - Balayage, highlights, blonding, color corrections, creative color
3. Hair Styling - Updos, blowouts, bridal styling, special events
4. Extensions & Installs - Tape-ins, sew-ins, hand-tied, wig installs, custom units
5. Braiding - Knotless braids, box braids, cornrows
6. Waxing - Brows, lips, chin, sideburns, full face
7. Scalp Therapy - Luxe scalp treatments with massage and facial

Booking: Clients can book online at https://square.site/book/A0RGDZPMGHG28/hair-artistry-full-service-salon-cape-coral-fl

You are friendly, professional, and knowledgeable about hair care. You help clients with:
- Answering questions about services and pricing
- Recommending services based on their needs
- Providing hair care tips and advice
- Helping with booking information
- Answering questions about the salon

Keep responses concise but helpful. Use a warm, welcoming tone that reflects the salon's family-like atmosphere.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid form data", details: parsed.error.issues });
      }
      const submission = await storage.createContactSubmission(parsed.data);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.get("/api/conversations", async (_req, res) => {
    try {
      const convos = await storage.getAllConversations();
      res.json(convos);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const { title } = req.body;
      const conversation = await storage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const msgs = await storage.getMessagesByConversation(id);
      res.json({ ...conversation, messages: msgs });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Message content is required" });
      }

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
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      await storage.createMessage(conversationId, "assistant", fullResponse);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to process message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });

  return httpServer;
}
