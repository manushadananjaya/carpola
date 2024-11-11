// app/search/page.tsx

import { Footer } from "@/components/Footer";
import SearchResults from "./components/SearchResults";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";
import LoadingMessage from "@/components/ui/loading-massage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Vehicles - Carpola",
  description: "Find the best vehicles across different categories and brands",
  keywords: [
    "vehicles",
    "search",
    "cars",
    "trucks",
    "motorcycles",
    "Sri Lanka",
    "buy",
    "sell",
    "Bikes",
    "Vans",
    "Motorbikes",
    "top vehicles",
    "best vehicles",
    "price range",
    "price in Sri Lanka",
  ],
  openGraph: {
    title: "Search Vehicles - Carpola",
    description: "Discover a wide variety of vehicles available for sale.",
    url: "https://carpola.lk/search",
    images: [
      {
        url: "https://carpola.lk/images/vehicle-search-og.png",
        width: 800,
        height: 600,
        alt: "Vehicles Search",
      },
    ],
    type: "website",
  },
};

export default function SearchPage() {
        
    return (
      <Suspense fallback={<div><LoadingMessage /></div>}>
        <div>
          <Navbar />
          <SearchResults />
          <Footer />
        </div>
      </Suspense>
    );
  
}
