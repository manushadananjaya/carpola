import  LandingPageComponent  from "@/components/landing-page";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Carpola - Buy and Sell Vehicles in Sri Lanka",
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
    "toyota cars",
    "honda cars",
    "bajaj bikes",
    "yamaha bikes",
    "nissan trucks",
    "mitsubishi trucks",
    "suzuki vans",
    "car prices",
  ],
  openGraph: {
    title: "Carpola - Buy and Sell Vehicles in Sri Lanka",
    description:
      "Find the best deals on cars, bikes, vans, and trucks at Carpola.lk. Sri Lanka's top platform for vehicle listings and promotions.",
    url: "https://www.carpola.lk",
    type: "website",
    images: [
      {
        url: "/assets/logo.jpg", // Replace with your cover image path
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
    images: ["/assets/logo.jpg"], // Replace with your cover image path
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Home() {
  return (
    <div>
      <LandingPageComponent />
    </div>
  );
}
