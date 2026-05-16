import type { Metadata } from "next";
import { Inter, Fustat } from "next/font/google";
import "./globals.css";

import { PrimaryColorProvider } from "@/components/primary-color-provider";
import dynamic from "next/dynamic";
import { TopProgressBar } from "@/components/premium/progress-bar";
import { AuthListener } from "@/components/auth-listener";
import { GlobalEffects } from "@/components/ui/global-effects";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});
const fustat = Fustat({ 
  subsets: ["latin"], 
  variable: "--font-fustat",
  display: 'swap',
  preload: true,
});

const GlobalNavbar = dynamic(() => import("@/components/global-navbar").then(m => m.GlobalNavbar), { ssr: true });
const SplashLoader = dynamic(() => import("@/components/premium/splash-loader").then(m => m.SplashLoader), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/premium/scroll-to-top").then(m => m.ScrollToTop), { ssr: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app'),
  title: {
    default: "Xylos AI — Free AI Chat & Blog | Llama 3, Gemini, Mistral",
    template: "%s | Xylos AI",
  },
  description: "Access Llama 3, Gemini & Mistral in one free AI platform. Professional AI chat, content creation, and editorial intelligence at zero cost.",
  applicationName: "Xylos AI",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Xylos AI Research", url: "https://xylosai.vercel.app" }],
  creator: "21dev.in",
  publisher: "Xylos AI Research",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "Xylos AI", "Free AI Chat", "Llama 3 Online Free", "Gemini Pro Free",
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
    canonical: 'https://xylosai.vercel.app',
  },
  openGraph: {
    title: "Xylos AI — Free AI Chat & Blog Platform",
    description: "Access 7+ free AI models (Llama 3, Gemini, Mistral) in one premium workspace. Zero cost, professional grade.",
    url: 'https://xylosai.vercel.app',
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
  category: 'technology',
};

import Script from "next/script";
import { LazyMotion, domAnimation } from "framer-motion";

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
      "url": "https://xylosai.vercel.app",
      "description": "Free AI chat and content platform with Llama 3, Gemini, and Mistral.",
    },
    // ... other schemas
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${fustat.variable} antialiased selection:bg-primary/30 selection:text-primary-foreground`}>
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N3CBBBLM');`}
        </Script>

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
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3CBBBLM"
            height="0" 
            width="0" 
            className="hidden"
          />
        </noscript>

        <LazyMotion features={domAnimation} strict>
          <PrimaryColorProvider>
            <ToastProvider>
              <AuthListener />
              <TopProgressBar />
              <SplashLoader />
              <ScrollToTop />
              <GlobalNavbar />
              <main className="relative min-h-screen">
                {children}
              </main>
            </ToastProvider>
          </PrimaryColorProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
