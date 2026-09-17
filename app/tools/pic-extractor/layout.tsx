import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PicExtractor — Extract Text, Colors & Metadata from Images | Xylos AI",
  description:
    "Extract text, colors, and metadata from any image instantly. A free image utility built with Xylos AI.",
  alternates: {
    canonical: "https://xylosai.vercel.app/tools/pic-extractor",
  },
};

export default function PicExtractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}