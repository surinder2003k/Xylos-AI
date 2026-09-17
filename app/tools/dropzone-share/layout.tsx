import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dropzone Share — Instant File Sharing | Xylos AI",
  description:
    "Share files instantly with a drag-and-drop link. Dropzone Share is a free utility built with Xylos AI.",
  alternates: {
    canonical: "https://xylosai.vercel.app/tools/dropzone-share",
  },
};

export default function DropzoneShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}