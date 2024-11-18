import { Suspense } from "react";
import { Metadata } from "next";
import SearchFilters from "../search-filters";
import SearchResults from "../search-results";
import MainSearch from "../main-search";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchPageProps {
  params: { slug: string[] };
  searchParams: {
    query?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { slug } = params;
  const { query } = searchParams;

  const category = slug[0] || "all";
  const brand = slug[1] || "all-brands";
  const location = slug[2] || "sri-lanka";

  const title = query
    ? `${query} - ${category} ${brand} in ${location} | Carpola`
    : `${category} ${brand} for Sale in ${location} | Carpola`;

  const description = query
    ? `Find the best deals on ${category} ${brand} matching "${query}" in ${location}. Compare prices and options on Carpola.`
    : `Explore a wide range of ${category} ${brand} for sale in ${location}. Browse top brands, compare prices, and find your next vehicle with Carpola.`;

  const ogImageUrl = `https://carpola.lk/api/og?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://carpola.lk/search/${slug.join("/")}${
        query ? `?query=${query}` : ""
      }`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category} ${brand} Search Results`,
        },
      ],
      type: "website",
      siteName: "Carpola",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://carpola.lk/search/${slug.join("/")}${
        query ? `?query=${query}` : ""
      }`,
    },
  };
}

export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const { slug } = params;
  const category = slug[0] || "all";
  const brand = slug[1] || "all-brands";
  const location = slug[2] || "sri-lanka";

  const [district, city] = location.split("-in-");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category} {brand} in {location.replace("-", " ")}
      </h1>
      <Suspense fallback={<MainSearchSkeleton />}>
        <MainSearch />
      </Suspense>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Suspense fallback={<FiltersSkeleton />}>
            <SearchFilters
              initialCategory={category}
              initialBrand={brand}
              initialDistrict={district}
              initialCity={city}
            />
          </Suspense>
        </aside>
        <section className="w-full md:w-3/4">
          <Suspense fallback={<ResultsSkeleton />}>
            <SearchResults />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function MainSearchSkeleton() {
  return (
    <div className="flex items-center justify-center h-16 mb-8 bg-muted rounded-md">
      <Search className="h-6 w-6 text-muted-foreground animate-pulse" />
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-4 w-24" />
      </div>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
