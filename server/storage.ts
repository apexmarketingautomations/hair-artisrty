import { db } from "./db";
import {
  conversations, messages, contactSubmissions, newsletterSubscribers, giftCards, reviews, referrals, memberships,
  type InsertContact, type ContactSubmission, type Conversation, type Message,
  type InsertNewsletter, type NewsletterSubscriber,
  type InsertGiftCard, type GiftCard,
  type InsertReview, type Review,
  type InsertReferral, type Referral,
  type InsertMembership, type Membership,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
  createContactSubmission(data: InsertContact): Promise<ContactSubmission>;
  subscribeNewsletter(data: InsertNewsletter): Promise<NewsletterSubscriber>;
  createGiftCard(data: InsertGiftCard): Promise<GiftCard>;
  getGiftCardByCode(code: string): Promise<GiftCard | undefined>;
  getAllReviews(): Promise<Review[]>;
  createReview(data: InsertReview): Promise<Review>;
  seedReviews(): Promise<void>;
  createReferral(data: InsertReferral): Promise<Referral>;
  getReferralByCode(code: string): Promise<Referral | undefined>;
  redeemReferral(code: string, referredEmail: string, referredName: string): Promise<Referral | undefined>;
  createMembership(data: InsertMembership): Promise<Membership>;
}

export class DatabaseStorage implements IStorage {
  async getConversation(id: number) {
    const [c] = await db.select().from(conversations).where(eq(conversations.id, id));
    return c;
  }
  async getAllConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }
  async createConversation(title: string) {
    const [c] = await db.insert(conversations).values({ title }).returning();
    return c;
  }
  async deleteConversation(id: number) {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }
  async getMessagesByConversation(conversationId: number) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }
  async createMessage(conversationId: number, role: string, content: string) {
    const [m] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return m;
  }
  async createContactSubmission(data: InsertContact) {
    const [s] = await db.insert(contactSubmissions).values(data).returning();
    return s;
  }
  async subscribeNewsletter(data: InsertNewsletter) {
    const [s] = await db.insert(newsletterSubscribers).values(data).returning();
    return s;
  }
  async createGiftCard(data: InsertGiftCard) {
    const code = "HA-" + randomBytes(4).toString("hex").toUpperCase();
    const [g] = await db.insert(giftCards).values({ ...data, code }).returning();
    return g;
  }
  async getGiftCardByCode(code: string) {
    const [g] = await db.select().from(giftCards).where(eq(giftCards.code, code));
    return g;
  }
  async getAllReviews() {
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }
  async createReview(data: InsertReview) {
    const [r] = await db.insert(reviews).values(data).returning();
    return r;
  }
  async seedReviews() {
    const existing = await db.select().from(reviews);
    if (existing.length > 0) return;
    const seedData: InsertReview[] = [
      { name: "Maria C.", rating: 5, comment: "The Camacho Curly Cut changed my life! My curls have never looked so defined and bouncy. The team truly understands curly hair.", service: "Camacho Curly Cut" },
      { name: "Ashley R.", rating: 5, comment: "Got my bridal hair done here and it was absolutely perfect. They even traveled to our venue! The whole bridal party looked stunning.", service: "Bridal Services" },
      { name: "James T.", rating: 5, comment: "Best fade in Cape Coral, hands down. The hot towel straight razor shave is next level. I won't go anywhere else.", service: "Men's Grooming" },
      { name: "Sophia L.", rating: 5, comment: "My balayage came out so natural and beautiful. The color transition is seamless. Everyone asks me where I got it done!", service: "Balayage" },
      { name: "Keisha W.", rating: 5, comment: "The knotless braids were done perfectly. Took their time to make sure every braid was neat. Love this salon - truly feels like family!", service: "Braids & Installs" },
      { name: "Rachel M.", rating: 5, comment: "I've been a member for 3 months and the VIP plan is worth every penny. The scalp therapy alone is incredible, and I save so much on my regular services.", service: "Membership" },
      { name: "David P.", rating: 5, comment: "Brought my son for his first real haircut and they were so patient and great with him. He actually wants to go back! Amazing with kids.", service: "Kids' Cuts" },
      { name: "Nicole F.", rating: 4, comment: "Great color correction work! I came in with a botched dye job from another salon and they fixed it beautifully. Very honest about what to expect.", service: "Color Correction" },
    ];
    await db.insert(reviews).values(seedData);
  }
  async createReferral(data: InsertReferral) {
    const referralCode = "REF-" + randomBytes(3).toString("hex").toUpperCase();
    const [r] = await db.insert(referrals).values({ ...data, referralCode }).returning();
    return r;
  }
  async getReferralByCode(code: string) {
    const [r] = await db.select().from(referrals).where(eq(referrals.referralCode, code));
    return r;
  }
  async redeemReferral(code: string, referredEmail: string, referredName: string) {
    const [r] = await db
      .update(referrals)
      .set({ redeemed: true, referredEmail, referredName })
      .where(eq(referrals.referralCode, code))
      .returning();
    return r;
  }
  async createMembership(data: InsertMembership) {
    const [m] = await db.insert(memberships).values(data).returning();
    return m;
  }
}

export const storage = new DatabaseStorage();
