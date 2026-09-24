import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { PrimaryColorProvider } from "@/components/primary-color-provider";
import dynamic from "next/dynamic";
import { TopProgressBar } from "@/components/premium/progress-bar";
import { AuthListener } from "@/components/auth-listener";
import { GlobalEffects } from "@/components/ui/global-effects";
import { ToastProvider } from "@/components/ui/toast";
import { OfflineNotice } from "@/components/ui/offline-notice";
import { PageFade } from "@/components/ui/motion-primitives";

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR, SITE_EMAIL, absoluteUrl } from "@/lib/site-config";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: 'swap',
  preload: true,
  weight: ['400', '700', '800'],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
});

const GlobalNavbar = dynamic(() => import("@/components/global-navbar").then(m => m.GlobalNavbar));
const ScrollToTop = dynamic(() => import("@/components/premium/scroll-to-top").then(m => m.ScrollToTop));

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app'),
  title: {
    default: "Xylos AI (xylosai) — Free AI Chat & Blog | Llama 3, Gemini, Mistral",
    template: "%s | Xylos AI",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Xylos AI",
  referrer: "origin-when-cross-origin",
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  publisher: "Xylos AI",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "xylosai", "xylos-ai", "xylos.ai", "xylos ai", "Xylos AI", "Free AI Chat", "Llama 3 Online Free", "Gemini Pro Free",
    "Mistral AI", "AI Blog Generator", "ChatGPT Alternative Free",
    "AI Content Strategy", "Free AI Platform", "AI Writing Tool",
    "AI Research Tool", "Free Llama 3", "Free Gemini"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Xylos AI — Free AI Chat & Blog Platform",
    description: "Access 7+ free AI models (Llama 3, Gemini, Mistral) in one premium workspace. Zero cost, professional grade.",
    url: SITE_URL,
    siteName: 'Xylos AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Xylos AI — Free AI Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@xylos_ai',
    creator: '@xylos_ai',
    title: 'Xylos AI — Free AI Chat Platform',
    description: 'Access 7+ free AI models in one premium workspace. Zero cost, professional grade.',
    images: [{ url: '/og-image.png', alt: 'Xylos AI Platform' }],
  },
  verification: {
    google: '7DDDhNUg6jYfqTlpcjhcRviMdzzUvxJd2Y-rKmNEqdk',
  },
  other: {
    // Geo-targeting metadata (India primary audience)
    'geo.region': 'IN',
    'geo.placename': 'India',
    'geo.position': '20.5937;78.9629',
    ICBM: '20.5937, 78.9629',
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : {}),
  },
  category: 'technology',
};

import Script from "next/script";
import { LazyMotion, domMax } from "framer-motion";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Xylos AI",
      "alternateName": ["xylosai", "xylos-ai", "XylosAI"],
      "url": SITE_URL,
      "description": SITE_DESCRIPTION,
      "inLanguage": "en",
      "publisher": { "@type": "Organization", "name": "Xylos AI" }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Xylos AI",
      "alternateName": "xylosai",
      "url": SITE_URL,
      "logo": absoluteUrl('/icon.svg'),
      "email": SITE_EMAIL,
      "foundingDate": "2026",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": SITE_EMAIL,
          "availableLanguage": ["English", "Hindi"]
        }
      ],
      "sameAs": [
        "https://github.com/surinder2003k/Xylos-AI"
      ]
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${sora.variable} ${jetbrainsMono.variable} antialiased selection:bg-cyan-500/30 selection:text-white`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HSZJRM7GKQ"
          strategy="lazyOnload"
        />
        <Script id="ga-config" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HSZJRM7GKQ');
          `}
        </Script>

        <GlobalEffects />
        <LazyMotion features={domMax}>
          <PrimaryColorProvider>
            <ToastProvider>
              <AuthListener />
              <TopProgressBar />
              <ScrollToTop />
              <GlobalNavbar />
              <main className="relative min-h-screen">
                <PageFade>{children}</PageFade>
              </main>
            </ToastProvider>
          </PrimaryColorProvider>
        </LazyMotion>

        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3CBBBLM"
            height="0" 
            width="0" 
            className="hidden"
          />
        </noscript>
        <OfflineNotice />
      </body>
    </html>
  );
}
