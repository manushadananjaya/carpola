import { Metadata, Viewport } from "next";
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
    "Carpola is Sri Lanka's leading vehicle marketplace for buying and selling cars, bikes, and other vehicles. Explore thousands of listings and find your perfect vehicle today.",
  keywords: [
    "Carpola.lk",
    "buy cars Sri Lanka",
    "sell cars Sri Lanka",
    "vehicle marketplace",
    "cars for sale",
    "motorbikes",
    "vans",
    "trucks",
    "Sri Lanka vehicles",
    "automobiles",
    "vehicles",
    "buy vehicles",
    "Price in Sri Lanka",
    "car prices in Sri Lanka",
    "bike prices in Sri Lanka",
    "truck prices in Sri Lanka",
    "vehicle prices in Sri Lanka",
    "Sri Lanka vehicle marketplace",
    "Sri Lanka vehicle listings",
    "Sri Lanka vehicle promotions",
    "Toyota cars",
    "Honda cars",
    "Bajaj bikes",
    "Yamaha bikes",
    "Nissan trucks",
    "Mitsubishi trucks",
    "Suzuki vans",
    "car prices",
  ],
  openGraph: {
    title: "Carpola - Buy and Sell Vehicles in Sri Lanka",
    description:
      "Find the best deals on cars, bikes, vans, and trucks at Carpola.lk. Sri Lanka's top platform for vehicle listings and promotions.",
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
      "Explore a wide range of cars, bikes, and trucks in Sri Lanka on Carpola.lk. Buy or sell your vehicle with ease!",
    images: ["https://www.carpola.lk/assets/twitter-image.jpg"],
    creator: "@carpola_lk",
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
  verification: {
    google: "Xx7TLgjj_xPx3k43ykTw6PkqKZuik8m9UJhGaXNyH9Q",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Carpola.lk",
  url: "https://www.carpola.lk",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.carpola.lk/search?q={search_term_string}",
    },
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
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Carpola" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
