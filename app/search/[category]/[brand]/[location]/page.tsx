import { Suspense } from "react";
import MainSearch from "../../../main-search";
import SearchFilters from "../../../search-filters";
import SearchResults from "../../../search-results";

export default function SearchPage({
  params,
  searchParams,
}: {
  params: { category: string; brand: string; location: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { category, brand, location } = params;
  const [district, city] = location.split("-in-");

  // Extract query from searchParams
  const query =
    typeof searchParams.query === "string" ? searchParams.query : "";
  const decodedQuery = query.replace(/-/g, " ").trim();

  // Construct the full search query
  const fullQuery =
    decodedQuery ||
    `${brand} ${category} in ${location.replace(/-/g, " ").trim()}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for {fullQuery}
      </h1>
      <MainSearch initialQuery={decodedQuery} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <SearchFilters
            initialCategory={category}
            initialBrand={brand}
            initialDistrict={district}
            initialCity={city || "ALL"}
          />
        </div>
        <div className="w-full md:w-3/4">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults
              initialQuery={fullQuery}
              category={category}
              brand={brand}
              location={location}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata({
  params,
  searchParams,
}: {
  params: { category: string; brand: string; location: string };
  searchParams: { query?: string };
}) {
  const { category, brand, location } = params;
  const query =
    typeof searchParams.query === "string" ? searchParams.query : "";
  const decodedQuery = query.replace(/-/g, " ").trim();
  const fullQuery =
    decodedQuery || `${brand} ${category} in ${location.replace(/-/g, " ")}`;

  const title = `${fullQuery} - Vehicle Search`;
  const description = `Search results for ${fullQuery}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
