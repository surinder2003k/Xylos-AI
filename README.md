<p align="center">
  <img src="public/screenshots/landing-hero.png" alt="Xylos AI" width="700" />
</p>

<p align="center">
  <strong>Free AI Chat &amp; Blog Platform</strong><br/>
  Llama 3 · Gemini · Mistral — Zero cost, professional grade.
</p>

<p align="center">
  <a href="https://xylosai.vercel.app"><img src="https://img.shields.io/badge/Live-xylosai.vercel.app-000?style=flat-square" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Next.js%2015-000?style=flat-square&logo=next.js" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Supabase-000?style=flat-square&logo=supabase" /></a>
  <a href="https://github.com/surinder2003k/Xylos-AI"><img src="https://img.shields.io/badge/52%20tests-passing-22c55e?style=flat-square" /></a>
</p>

---

## Overview

**Xylos AI** is a high-performance generative editorial intelligence platform. It brings 7+ AI models together under one premium workspace — completely free. Built for creators, analysts, and developers who need professional-grade AI tools without the paywall.

| Feature | Detail |
|---|---|
| AI Models | Llama 3.3 70B, Gemini Pro, Mistral, Cerebras, and more |
| Chat | Multi-model chat with automatic failover routing |
| Blog Engine | AI-powered generation, rich editing, SEO optimization |
| Dashboard | Post management, analytics, AI settings |
| Automation | Cron-based auto-publishing pipeline |
| Auth | Email/password + Google OAuth via Supabase |

---

## Screenshots

| Landing Page | Blog Archive |
|---|---|
| <img src="public/screenshots/landing-full.png" width="340"/> | <img src="public/screenshots/blog-archive.png" width="340"/> |

| Blog Post | Login |
|---|---|
| <img src="public/screenshots/blog-post.png" width="340"/> | <img src="public/screenshots/login.png" width="340"/> |

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, ISR, React 19) |
| **Database / Auth** | Supabase (Postgres, SSR auth, Storage) |
| **Styling** | Tailwind CSS 3 + `@tailwindcss/typography` |
| **Animations** | Framer Motion 11, Animejs 4 |
| **Editor** | TipTap 3 (ProseMirror) |
| **AI Providers** | Groq, OpenRouter, Google Gemini, Mistral, Fireworks, Cerebras, Hugging Face, Cloudflare |
| **Email** | Resend |
| **Icons** | Lucide React |
| **Testing** | Playwright (52 E2E tests) |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- API keys for desired AI providers

### Setup

```bash
git clone https://github.com/surinder2003k/Xylos-AI.git
cd Xylos-AI
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
GROQ_API_KEY=your_groq_key
# See DESIGN.md for all supported variables
```

### Database

Run the migration files in `database/` via Supabase SQL Editor:

| File | Purpose |
|---|---|
| `cms_v3_migration.sql` | Core tables: blogs, profiles, chats, conversations, messages, app_settings |
| `fix_columns_and_indexes.sql` | Column fixes and performance indexes |
| `supabase-init.sql` | Storage buckets, triggers, policies |

### Storage

Create a **public** bucket named `blog-images` in Supabase Storage for image uploads.

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
app/                  Next.js App Router pages and API routes
├── page.tsx          Landing page (ISR: 30 min)
├── layout.tsx        Root layout with providers
├── blog/             Blog archive + individual posts
├── chat/             Multi-model AI chat
├── dashboard/        Protected dashboard (editor, posts, settings)
├── login/            Authentication page
├── about/            About page
├── privacy/          Privacy policy
└── api/              API routes (chat, blog/generate, automate, subscribe, upload)

components/           React components
├── landing/          Navbar, hero, blog-grid, newsletter-form
├── blog/             AuthorBio, NewsletterCard, ShareButtons
├── premium/          Animated logo, splash loader, tilt cards, mouse glow
├── ui/               Toast, modal, select, text animations
└── editor/           TipTap editor, Pexels library, image upload

tests/                Playwright E2E tests (52 tests, all passing)
lib/                  Server utilities (AI providers, image generation, utils)
database/             SQL migration files
```

---

## Testing

Playwright runs against the live production site:

```bash
npx playwright test
```

10 test suites covering landing, blog, auth, about, chat, static pages, API endpoints, navigation, performance, and dashboard — all 52 tests passing with zero console errors.

---

## Design System

See [DESIGN.md](DESIGN.md) for the complete design documentation — color tokens, typography, component architecture, and visual guidelines.

---

## License

This project is provided for educational and research purposes. All trademarks and model rights belong to their respective owners.
