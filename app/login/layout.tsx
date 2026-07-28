import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Xylos AI Editorial Portal",
  description: "Access your Xylos AI editorial dashboard. Sign in with Google or email to manage content, chat with AI models, and monitor platform analytics.",
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://xylosai.vercel.app/login' },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
