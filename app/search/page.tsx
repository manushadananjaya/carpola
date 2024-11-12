import { Suspense } from "react";
import { Metadata } from "next";
import SearchFilters from "./search-filters";
import SearchResults from "./search-results";
import MainSearch from "./main-search";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropagateLoader } from "react-spinners";

interface SearchPageProps {
  searchParams: {
    query?: string;
    category?: string;
    brand?: string;
    page?: string;
  };
}
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { query, category, brand } = searchParams;

  // Constructing dynamic titles and descriptions for better SEO
  const title = query
    ? `Search Results for "${query}" in ${
        category || "All Categories"
      } - Carpola`
    : `Explore ${category || "All"} Vehicles for Sale in Sri Lanka - Carpola`;

  const description = query
    ? `Find the best deals on ${
        category || "vehicles"
      } matching "${query}". Discover top brands like ${
        brand || "Toyota, Nissan, Honda"
      } and compare prices on Carpola.`
    : `Explore a wide range of ${
        category || "vehicles"
      } for sale in Sri Lanka. Browse top brands, compare prices, and find your next vehicle with Carpola.`;

  // Open Graph properties for better social media sharing
  const openGraphTitle = query
    ? `Results for "${query}" in ${category || "All Categories"}`
    : `Explore ${category || "All"} Vehicles for Sale`;

  const openGraphDescription = query
    ? `Looking for ${
        category || "vehicles"
      }? See results for "${query}". Find top deals, compare prices, and explore vehicle options on Carpola.`
    : `Discover a variety of ${
        category || "vehicles"
      } for sale in Sri Lanka. Find top brands, best prices, and your next vehicle on Carpola.`;

  return {
    title,
    description,
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: `https://carpola.lk/search?${new URLSearchParams(
        searchParams
      ).toString()}`,
      images: [
        {
          url: `https://carpola.lk/images/vehicle-search-${
            category?.toLowerCase() || "default"
          }.png`,
          width: 1200,
          height: 630,
          alt: `${category || "Vehicle"} Search Results`,
        },
      ],
      type: "website",
      siteName: "Carpola",
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
      images: [
        `https://carpola.lk/images/vehicle-search-${
          category?.toLowerCase() || "default"
        }.png`,
      ],
    },
    alternates: {
      canonical: `https://carpola.lk/search?${new URLSearchParams(
        searchParams
      ).toString()}`,
    },
  };
}


export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vehicle Search</h1>
        <Suspense
          fallback={
            <div>
              <PropagateLoader />
            </div>
          }
        >
          <MainSearch />
        </Suspense>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <Suspense
              fallback={
                <div>
                  <PropagateLoader />
                </div>
              }
            >
              <SearchFilters
                initialCategory={searchParams.category || ""}
                initialBrand={searchParams.brand || ""}
              />
            </Suspense>
          </div>
          <div className="w-full md:w-3/4">
            <Suspense
              fallback={
                <div>
                  <PropagateLoader />
                </div>
              }
            >
              <SearchResults />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
