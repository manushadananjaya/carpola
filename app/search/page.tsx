import { Suspense } from "react";
import { Metadata } from "next";
import SearchFilters from "./search-filters";
import SearchResults from "./search-results";
import MainSearch from "./main-search";

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
  const { query, category } = searchParams;

  return {
    title: query
      ? `Results for "${query}" in ${category || "all categories"} - Carpola`
      : "Search Vehicles - Carpola",
    description: `Explore the best options for ${category || ""} vehicles ${
      query ? `matching "${query}"` : ""
    }. Discover Ads, compare prices in Sri Lanka, and more.`,
    openGraph: {
      title: `Results for "${query || ""}" in ${
        category || "all categories"
      } - Carpola`,
      description: `Explore the best options for ${category || ""} vehicles ${
        query ? `matching "${query}"` : ""
      }. Find out more at our website.`,
      url: `https://carpola.lk/search?${new URLSearchParams(
        searchParams
      ).toString()}`,
      images: [
        {
          url: `https://carpola.lk/images/vehicle-search-${
            category || "default"
          }.png`,
          width: 800,
          height: 600,
          alt: `${category || "Vehicle"} Search`,
        },
      ],
      type: "website",
    },
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vehicle Search</h1>
      <Suspense fallback={<div>Loading main search...</div>}>
        <MainSearch />
      </Suspense>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Suspense fallback={<div>Loading filters...</div>}>
            <SearchFilters
              initialCategory={searchParams.category || ""}
              initialBrand={searchParams.brand || ""}
            />
          </Suspense>
        </div>
        <div className="w-full md:w-3/4">
          <Suspense fallback={<div>Loading results...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
