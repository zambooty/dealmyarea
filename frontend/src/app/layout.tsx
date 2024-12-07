import { Providers } from "@/app/providers";
import { Navigation } from "@/components/common/Navigation";
import { Footer } from "@/components/common/Footer";
import { PerformanceMonitor } from "@/components/common/PerformanceMonitor";
import { RoutePrefetch } from "@/components/common/RoutePrefetch";
import { registerServiceWorker } from "@/lib/utils/serviceWorker";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

// Register service worker
if (typeof window !== 'undefined') {
  registerServiceWorker();
}

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

// Metadata for SEO and performance
export const metadata = {
  title: "DealmyArea - Your Ultimate Local Shopping Companion",
  description: "Discover the best local deals and make informed shopping decisions",
  manifest: "/manifest.json",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dealmyarea.com",
    title: "DealmyArea - Your Ultimate Local Shopping Companion",
    description: "Discover the best local deals and make informed shopping decisions",
    siteName: "DealmyArea",
  },
};

// Viewport configuration
export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://firebasestorage.googleapis.com"
          crossOrigin="anonymous"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased light`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Suspense fallback={null}>
          <PerformanceMonitor />
          <RoutePrefetch />
        </Suspense>
      </body>
    </html>
  );
}
