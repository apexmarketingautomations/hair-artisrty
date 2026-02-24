# Hair Artistry Salon - AI Demo Site

## Overview
A clone of hairartistrysalon.biz (Hair Artistry Full Service Salon, Cape Coral, FL) built with an AI chatbot assistant to demo to the salon owner.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Shadcn/UI
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI via Replit AI Integrations (no API key needed)
- **Routing**: wouter for client-side routing

## Pages
- **/** - Home page with hero, services overview, specialties, and CTA
- **/about** - About page with salon story, values
- **/services** - Full services listing (curly cut, balayage, braids, bridal, etc.)
- **/contact** - Contact form + salon info (address, phone, hours)

## AI Features
- Floating AI chat widget (bottom-right corner) on all pages
- Powered by OpenAI GPT-4o with full salon knowledge
- Knows services, hours, location, specialties, booking link
- Conversation persistence in PostgreSQL
- Streaming responses via SSE

## Database Tables
- `conversations` - AI chat conversation tracking
- `messages` - Individual chat messages (user + assistant)
- `contact_submissions` - Contact form submissions
- `users` - Basic users table (template default)

## Key Files
- `client/src/components/ai-chat.tsx` - AI chatbot widget
- `client/src/components/navigation.tsx` - Site navigation
- `client/src/components/footer.tsx` - Site footer
- `client/src/pages/` - All page components
- `server/routes.ts` - API routes including AI chat endpoint
- `server/storage.ts` - Database storage layer
- `shared/schema.ts` - Database schema definitions

## Color Theme
- Primary: Warm brown (hsl 25 45% 38%) - matches salon's warm aesthetic
- Fonts: Raleway (sans), Playfair Display (serif)

## External Links
- Booking: Square online booking system
- Social: Instagram @hairartistrysaloncapecoral, Facebook
