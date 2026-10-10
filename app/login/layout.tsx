import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Xylos AI Editorial Portal",
  description: "Access your Xylos AI editorial dashboard. Sign in with Google or email to manage content, chat with AI models, and monitor platform analytics.",
  // Auth page: noindex, and no canonical (a canonical on a noindex URL only
  // confuses the "Excluded by noindex" report in Search Console).
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
