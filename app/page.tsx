import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Search, Car, DollarSign } from "lucide-react";
import Link from "next/link";
import FeaturedCategories from "@/components/FeaturedCategories";
import Image from "next/image";
import { AnimatedSection } from "@/components/animation-section";
import FeaturedAds from "@/components/FeaturedAds";

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
        url: "/assets/logo.jpg",
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
    images: ["/assets/logo.jpg"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center relative overflow-hidden">
          <Image
            src="/assets/mainImage.jpg"
            alt="Background of cars"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/70 z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <AnimatedSection className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-lg">
                  Find Your Perfect Ride
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl drop-shadow-md">
                  Browse thousands of cars from trusted sellers. Buy or sell
                  with ease on Carpola.lk
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/search" passHref>
                  <Button
                    className="w-full bg-black text-white border hover:bg-[#370617] transition-colors duration-300"
                    size="lg"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Your Vehicle
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F5F5] justify-center items-center flex">
          <div className="container px-4 md:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-[#333333]">
                Find Your Next Vehicle Today
              </h2>
              <FeaturedCategories />
            </AnimatedSection>
          </div>
        </section>
        <section className="w-full pb-24 md:pb-32 lg:pb-32 sm:pb-4 bg-[#F5F5F5] justify-center items-center flex">
          <div className="container px-4 md:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-[#333333]">
                Our Featured Ads
              </h2>
              <FeaturedAds />
            </AnimatedSection>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 justify-center items-center flex bg-white">
          <div className="container px-4 md:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6 text-[#333333]">
                How It Works
              </h2>
              <div className="grid p-10 grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    icon: Search,
                    title: "Search",
                    description:
                      "Browse our extensive catalog of vehicles from trusted sellers.",
                  },
                  {
                    icon: Car,
                    title: "Connect",
                    description:
                      "Contact sellers directly and schedule test drives.",
                  },
                  {
                    icon: DollarSign,
                    title: "Purchase",
                    description: "Complete your purchase securely.",
                  },
                ].map((item, index) => (
                  <AnimatedSection
                    key={item.title}
                    className="flex flex-col items-center"
                  >
                    <item.icon className="h-12 w-12 mb-4 text-[#9D0208]" />
                    <h3 className="text-xl font-bold mb-2 text-[#333333]">
                      {item.title}
                    </h3>
                    <p className="text-[#333333]">{item.description}</p>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#03071E] flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <AnimatedSection className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Ready to Sell Your Vehicle?
                </h2>
                <p className="mx-auto max-w-[600px] text-[#ffb703] md:text-xl lg:text-base xl:text-xl">
                  List your vehicle on Carpola and reach thousands of potential
                  buyers.
                </p>
              </div>
              <Button
                className="w-full sm:w-auto bg-[#03071E] text-white hover:bg-[#370617] border-white border transition-colors duration-300"
                size="lg"
              >
                <Link href="/post-ad">List Your Vehicle</Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </div>
  );
}
