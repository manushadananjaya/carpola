import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.carpola.lk"),
  title: {
    default: "Carpola - Buy and Sell Vehicles in Sri Lanka",
    template: "%s | Carpola.lk",
  },
  description:
    "Carpola is Sri Lanka's leading vehicle marketplace for buying and selling cars, bikes, and other vehicles.",
  keywords: [
    "Carpola.lk",
    "buy cars Sri Lanka",
    "sell cars Sri Lanka",
    "vehicle marketplace",
  ],
  openGraph: {
    title: "Carpola - Buy and Sell Vehicles in Sri Lanka",
    description:
      "Find the best deals on cars, bikes, vans, and trucks at Carpola.lk.",
    url: "https://www.carpola.lk",
    siteName: "Carpola.lk",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.carpola.lk/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Carpola.lk - Buy and Sell Vehicles in Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carpola - Buy and Sell Vehicles in Sri Lanka",
    description:
      "Explore a wide range of cars, bikes, and trucks in Sri Lanka on Carpola.lk.",
    images: ["https://www.carpola.lk/assets/twitter-image.jpg"],
  },
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
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.carpola.lk",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
  verification: {
    google: "Xx7TLgjj_xPx3k43ykTw6PkqKZuik8m9UJhGaXNyH9Q",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Carpola.lk",
  url: "https://www.carpola.lk",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.carpola.lk/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="Carpola" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VXPVFPQGJH"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VXPVFPQGJH');
          `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F7F8FA] text-[#2C3E50] antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
