# Hair Artistry Salon - AI Demo Site

## Overview
A cutting-edge 2026 demo clone of hairartistrysalon.biz (Hair Artistry Full Service Salon, Cape Coral, FL) built with real salon images, AI chatbot assistant, gift cards, newsletter signup, reviews, and modern animations.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI GPT-4o via Replit AI Integrations (no API key needed)
- **Routing**: wouter for client-side routing

## Pages
- **/** - Home: full-screen hero with real salon image, service showcases, specialties grid, testimonials, gift card CTA, newsletter signup
- **/about** - About: story, real images, values cards, $10 new client offer
- **/services** - Services: filterable categories (cuts, color, braids, specialty), real images on featured services
- **/gift-cards** - Gift Cards: amount selection, recipient form, code generation (no Stripe - payment at salon)
- **/contact** - Contact: info cards, social links, contact form

## Features
- AI chat widget on all pages (GPT-4o streaming via SSE)
- Real salon images (hero-salon.jpg, stylist-1/2/3.jpg in client/public/images/)
- Framer Motion scroll animations on all pages
- Newsletter email signup with duplicate detection
- E-Gift card creation with unique codes (HA-XXXXXXXX format)
- Seeded testimonials/reviews system
- Transparent-to-solid nav on scroll
- Service category filtering with animations
- Responsive mobile menu with gift cards link

## Database Tables
- `conversations` - AI chat conversation tracking
- `messages` - Chat messages (user + assistant)
- `contact_submissions` - Contact form submissions
- `newsletter_subscribers` - Email newsletter signups (unique constraint)
- `gift_cards` - E-gift cards with codes, amounts, sender/recipient info
- `reviews` - Customer testimonials (seeded with 5 starter reviews)
- `users` - Basic users table (template default)

## Key Files
- `client/src/components/ai-chat.tsx` - AI chatbot widget
- `client/src/components/navigation.tsx` - Scroll-aware navigation
- `client/src/components/footer.tsx` - Footer with gift cards section
- `client/src/pages/` - All page components
- `server/routes.ts` - API routes (chat, contact, newsletter, gift cards, reviews)
- `server/storage.ts` - Database storage layer with all CRUD + review seeding
- `shared/schema.ts` - Database schema definitions

## Color Theme
- Primary: Warm brown (hsl 25 45% 38%) - matches salon's warm aesthetic
- Fonts: Raleway (sans), Playfair Display (serif)

## External Links
- Booking: Square online booking (https://square.site/book/A0RGDZPMGHG28/...)
- Social: Instagram @hairartistrysaloncapecoral, Facebook

## Important Notes
- **No Stripe**: User dismissed Stripe integration. Gift cards generate codes stored in DB; payment collected at salon. If Stripe is added later, integrate with gift card purchase flow.
- **Images**: Real salon images stored in `client/public/images/` (downloaded from salon's actual website)
- **API pattern**: Use `apiRequest(method, url, data)` not fetch-style for mutations
