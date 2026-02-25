# Hair Artistry Salon - AI Demo Site

## Overview
A cutting-edge 2026 demo clone of hairartistrysalon.biz (Hair Artistry Full Service Salon, Cape Coral, FL) built with real salon images, AI chatbot assistant, gift cards, newsletter signup, reviews, monetization suite (referrals, shop, memberships), email capture popup, service upsells, and modern animations.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI GPT-4o via Replit AI Integrations (no API key needed)
- **Routing**: wouter for client-side routing

## Pages
- **/** - Home: full-screen hero with real salon image, service showcases, specialties grid, Google Reviews carousel (4.9 stars), gift card CTA, newsletter signup
- **/about** - About: founder spotlight (Nakisha ShhmoneyCurl Camacho), Dream Team member cards with contact info, values section, $10 new client offer
- **/services** - Services: filterable categories (cuts, color, braids, specialty), real images, service upsell add-ons section
- **/gift-cards** - Gift Cards: amount selection, recipient form, code generation (no Stripe - payment at salon)
- **/contact** - Contact: info cards, social links, contact form
- **/referrals** - Referral Program: how it works, referral code generation form, $10 off for both referrer and friend
- **/shop** - Product Shop: category-filtered product grid (8 products), gradient placeholder images, affiliate-ready "Shop Now" links
- **/memberships** - Membership Plans: 3 tiers (Essential $59, Premium $99, VIP $149), signup form, FAQ accordion
- **/gallery** - Public Gallery: filterable grid (photos, videos, links), lightbox viewer, video embeds (YouTube/Instagram/TikTok), empty state messaging
- **/admin/gallery** - Admin Content Manager: add/edit/delete gallery items, image upload (base64) or URL, video URL support, category/sort/featured controls

## Features
- AI chat widget on all pages (GPT-4o streaming via SSE)
- Real salon images (hero-salon.jpg, stylist-1/2/3.jpg + 7 stock images + team photos in client/public/images/)
- Framer Motion scroll animations on all pages
- Newsletter email signup with duplicate detection
- E-Gift card creation with unique codes (HA-XXXXXXXX format)
- Seeded testimonials/reviews system with Google Reviews styling
- Transparent-to-solid nav on scroll
- Service category filtering with animations
- Responsive mobile menu with all links
- Email capture popup ($10 off, 5s delay, 7-day localStorage cooldown)
- Service upsell add-ons: Deep Conditioning +$25, Scalp Massage +$15, Olaplex Bond +$35
- Referral program with REF-XXXXXX codes
- Product shop with category filters (Curl Care, Color Protection, Styling Tools, Scalp Health)
- Membership plans with tiered pricing and FAQ

## Database Tables
- `conversations` - AI chat conversation tracking
- `messages` - Chat messages (user + assistant)
- `contact_submissions` - Contact form submissions
- `newsletter_subscribers` - Email newsletter signups (unique constraint)
- `gift_cards` - E-gift cards with codes, amounts, sender/recipient info
- `reviews` - Customer testimonials (seeded with 8 starter reviews)
- `users` - Basic users table (template default)
- `referrals` - Referral program entries (name, email, referral code REF-XXXXXX)
- `memberships` - Membership plan signups (name, email, phone, plan tier, status)

## Key Files
- `client/src/components/ai-chat.tsx` - AI chatbot widget
- `client/src/components/navigation.tsx` - Scroll-aware navigation with all page links
- `client/src/components/footer.tsx` - Footer with memberships, referrals, quick links
- `client/src/components/email-popup.tsx` - $10 off email capture popup
- `client/src/components/service-upsell.tsx` - Add-on upsell cards for services page
- `client/src/pages/` - All page components
- `server/routes.ts` - API routes (chat, contact, newsletter, gift cards, reviews, referrals, memberships)
- `server/storage.ts` - Database storage layer with all CRUD + review seeding
- `shared/schema.ts` - Database schema definitions

## Color Theme
- Primary: Vibrant warm orange (hsl 18 85% 48%) - bold, eye-catching
- Secondary: Rose/pink accents (hsl 330 65% 94%)
- Accent: Violet/purple (hsl 275 50% 94%)
- Charts: Multi-color (amber, rose, violet, gold, teal)
- Gradients: Multi-stop vibrant gradients (amber→rose→violet) throughout hero sections, cards, CTAs
- Fonts: Raleway (sans), Playfair Display (serif)

## External Links
- Booking: Square online booking (https://square.site/book/A0RGDZPMGHG28/...)
- Social: Instagram @hairartistrysaloncapecoral, Facebook

## Important Notes
- **No Stripe**: User dismissed Stripe integration. Gift cards generate codes stored in DB; payment collected at salon. If Stripe is added later, integrate with gift card purchase flow.
- **Images**: Real salon images stored in `client/public/images/` (downloaded from salon's actual website + stock images for services)
- **API pattern**: Use `apiRequest(method, url, data)` not fetch-style for mutations
- **Exports**: New pages/components use `export default`, existing components (Navigation, Footer, AiChatWidget) use named exports
