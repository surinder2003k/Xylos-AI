import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Xylos AI Configuration",
  description: "Manage your Xylos AI account settings, API keys, and model preferences.",
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
