import type { Metadata } from "next";
import { Inter, Fustat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PrimaryColorProvider } from "@/components/primary-color-provider";
import { TopProgressBar } from "@/components/premium/progress-bar";
import { ToastProvider } from "@/components/ui/toast";
import { SplashLoader } from "@/components/premium/splash-loader";
import { AuthListener } from "@/components/auth-listener";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fustat = Fustat({ subsets: ["latin"], variable: "--font-fustat" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://xylos-ai.com'),
  title: {
    default: "Xylos AI — Free AI Chat & Blog Platform | Llama, Gemini, Mistral",
    template: "%s | Xylos AI",
  },
  description: "Access Llama 3, Gemini, Mistral, and 7+ elite AI models in one zero-cost premium platform. Built for professionals — AI chat, content creation, and editorial intelligence.",
  applicationName: "Xylos AI",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Xylos AI Research", url: "https://xylos-ai.com" }],
  creator: "21dev.in",
  publisher: "Xylos AI Research",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "Xylos AI", "Free AI Chat", "Llama 3 Online Free", "Gemini Pro Free",
    "Mistral AI", "AI Blog Generator", "ChatGPT Alternative Free",
    "AI Content Strategy", "Free AI Platform", "Xylos", "AI Writing Tool",
    "AI Research Tool", "Free Llama 3", "Free Gemini", "AI for professionals"
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
    canonical: 'https://xylos-ai.com',
  },
  openGraph: {
    title: "Xylos AI — Free AI Chat & Blog Platform",
    description: "Access 7+ free AI models (Llama 3, Gemini, Mistral) in one premium workspace. Zero cost, professional grade.",
    url: 'https://xylos-ai.com',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fustat.variable} antialiased selection:bg-primary/30 selection:text-primary-foreground`}>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3CBBBLM"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
        >
          <PrimaryColorProvider>
            <ToastProvider>
              <AuthListener />
              <TopProgressBar />
              <SplashLoader />
              <main className="relative min-h-screen">
                <Script
                  id="google-tag-manager"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','GTM-N3CBBBLM');
                    `,
                  }}
                />
                <Script
                  src="https://www.googletagmanager.com/gtag/js?id=G-HSZJRM7GKQ"
                  strategy="afterInteractive"
                />
                <Script
                  id="google-analytics"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-HSZJRM7GKQ');
                    `,
                  }}
                />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                      {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Xylos AI",
                        "url": "https://xylos-ai.com",
                        "description": "Free AI chat and content platform with Llama 3, Gemini, and Mistral.",
                        "potentialAction": {
                          "@type": "SearchAction",
                          "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": "https://xylos-ai.com/blog?q={search_term_string}"
                          },
                          "query-input": "required name=search_term_string"
                        }
                      },
                      {
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Xylos AI",
                        "url": "https://xylos-ai.com",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "description": "Access elite AI models including Llama 3, Gemini, and Mistral in one zero-cost generative interface.",
                        "aggregateRating": {
                          "@type": "AggregateRating",
                          "ratingValue": "4.8",
                          "ratingCount": "128"
                        },
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      },
                      {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Xylos AI Research",
                        "url": "https://xylos-ai.com",
                        "logo": {
                          "@type": "ImageObject",
                          "url": "https://xylos-ai.com/icon.svg"
                        },
                        "contactPoint": {
                          "@type": "ContactPoint",
                          "contactType": "customer support",
                          "availableLanguage": "English"
                        },
                        "sameAs": [
                          "https://twitter.com/xylos_ai",
                          "https://github.com/21devin"
                        ]
                      }
                    ])
                  }}
                />
                {children}
              </main>
            </ToastProvider>
          </PrimaryColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
