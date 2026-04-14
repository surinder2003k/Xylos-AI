# Xylos AI - The Ultimate Free AI Editorial Architecture

![Xylos AI Banner](https://xylosai.vercel.app/og-image.png)

## 🚀 Overview
**Xylos** is a high-performance, generative editorial intelligence platform. It empowers creators and businesses with an elite suite of AI models—including **Llama 3, Gemini, and Mistral**—all within a premium, zero-cost workspace. Built with a focus on investigative analysis and architectural design, Xylos transforms raw data into polished, high-fidelity editorial content.

## ✨ Key Features
- **Multi-Model Intelligence**: Seamless access to 7+ top-tier AI providers (Groq, Google, Mistral, Cerebras, etc.).
- **Strategic Workspace**: A professional-grade Tiptap editor with custom SEO link management (Do-Follow/No-Follow).
- **Automated Engagement**: Integrated **Resend** pipeline for instant newsletter subscriptions and welcome briefings.
- **Neural Branding**: A dynamic, animated logo system and glassmorphism-inspired UI for an immersive dashboard experience.
- **Deep SEO Architecture**: Built-in Robots.txt, dynamic Sitemap.xml, and injected JSON-LD Structured Data for maximum search visibility.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Animejs](https://animejs.com/)
- **Email Service**: [Resend](https://resend.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏗️ Getting Started

### 1. Supabase Initialization
To ensure the platform is stable, run the migration scripts found in the `database/` folder in your Supabase SQL Editor.

#### Essential Tables:
- `blogs`: Stores your intellectual property and editorial articles.
- `automation_logs`: Tracks neural processing and event logs.

### 2. Storage Setup
The editorial engine requires a storage bucket for visual assets.
1. Create a **New Bucket** named `blog-images`.
2. Set the bucket to **Public**.

### 3. Local Configuration
Create a `.env.local` file with the following neural keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
RESEND_API_KEY=your_key
# API keys for AI Providers (Groq, Google, etc.)
```

## 🔍 SEO & Standards
Xylos is built for visibility. 
- **Sitemap**: Auto-generated at `/sitemap.xml`.
- **Robots**: Configured at `/robots.txt`.
- **Schema**: JSON-LD `SoftwareApplication` and `BlogPosting` markup injected for rich snippets.

---

## ⚖️ Ethics & Protocol
Xylos AI follows a strict protocol of **Human Intelligence Amplified**. We believe in using AI to augment human creativity, not replace it.

---
*Created by the Xylos AI Intelligence Team.*
