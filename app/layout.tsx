import type { Metadata } from "next";
import { Inter, Fustat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PrimaryColorProvider } from "@/components/primary-color-provider";
import { TopProgressBar } from "@/components/premium/progress-bar";
import { ToastProvider } from "@/components/ui/toast";
import { SplashLoader } from "@/components/premium/splash-loader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fustat = Fustat({ subsets: ["latin"], variable: "--font-fustat" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://xylos-ai.com'),
  title: {
    default: "Xylos AI | Ultimate Free AI Arsenal",
    template: "%s | Xylos AI",
  },
  description: "Access Llama 3, Gemini, Mistral, and more in one premium, zero-cost AI platform. Built for high-performance generation and investigative analysis.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: ["Xylos AI", "Free AI", "Llama 3 Online", "Gemini Pro Free", "Mistral AI", "AI Blog Generator", "AI Content Strategy"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Xylos AI | Ultimate Free AI Arsenal",
    description: "Experience the power of 7 free AI providers in a premium workspace.",
    url: '/',
    siteName: 'Xylos AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xylos AI | Ultimate Free AI Arsenal',
    description: 'Experience the power of 7 free AI providers in a premium workspace.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fustat.variable} antialiased selection:bg-primary/30 selection:text-primary-foreground`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
        >
          <PrimaryColorProvider>
            <ToastProvider>
              <TopProgressBar />
              <SplashLoader />
              <main className="relative min-h-screen">
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "Xylos AI",
                      "url": "https://xylos-ai.com",
                      "applicationCategory": "BusinessApplication",
                      "operatingSystem": "Web",
                      "description": "Access elite AI models including Llama 3, Gemini, and Mistral in one zero-cost generative interface.",
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                      }
                    })
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
