// import { Suspense } from "react";
// import { Metadata } from "next";
// import SearchFilters from "./search-filters";
// import SearchResults from "./search-results";
// import MainSearch from "./main-search";
// import { Loader2, Search, SlidersHorizontal } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// interface SearchPageProps {
//   searchParams: {
//     query?: string;
//     category?: string;
//     brand?: string;
//     page?: string;
//   };
// }

// export async function generateMetadata({
//   searchParams,
// }: SearchPageProps): Promise<Metadata> {
//   const { query, category, brand } = searchParams;

//   const title = query
//     ? `Search Results for "${query}" in ${
//         category || "All Categories"
//       } - Carpola`
//     : `Explore ${category || "All"} Vehicles for Sale in Sri Lanka - Carpola`;

//   const description = query
//     ? `Find the best deals on ${
//         category || "vehicles"
//       } matching "${query}". Discover top brands like ${
//         brand || "Toyota, Nissan, Honda"
//       } and compare prices on Carpola.`
//     : `Explore a wide range of ${
//         category || "vehicles"
//       } for sale in Sri Lanka. Browse top brands, compare prices, and find your next vehicle with Carpola.`;

//   const openGraphTitle = query
//     ? `Results for "${query}" in ${category || "All Categories"}`
//     : `Explore ${category || "All"} Vehicles for Sale`;

//   const openGraphDescription = query
//     ? `Looking for ${
//         category || "vehicles"
//       }? See results for "${query}". Find top deals, compare prices, and explore vehicle options on Carpola.`
//     : `Discover a variety of ${
//         category || "vehicles"
//       } for sale in Sri Lanka. Find top brands, best prices, and your next vehicle on Carpola.`;

//   const ogImageUrl = `https://carpola.lk/api/og?title=${encodeURIComponent(
//     openGraphTitle
//   )}&description=${encodeURIComponent(
//     openGraphDescription
//   )}&category=${encodeURIComponent(category || "")}`;

//   return {
//     title,
//     description,
//     openGraph: {
//       title: openGraphTitle,
//       description: openGraphDescription,
//       url: `https://carpola.lk/search?${new URLSearchParams(
//         searchParams
//       ).toString()}`,
//       images: [
//         {
//           url: ogImageUrl,
//           width: 1200,
//           height: 630,
//           alt: `${category || "Vehicle"} Search Results`,
//         },
//       ],
//       type: "website",
//       siteName: "Carpola",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: openGraphTitle,
//       description: openGraphDescription,
//       images: [ogImageUrl],
//     },
//     alternates: {
//       canonical: `https://carpola.lk/search?${new URLSearchParams(
//         searchParams
//       ).toString()}`,
//     },
//   };
// }

// export default function SearchPage({ searchParams }: SearchPageProps) {
//   return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Vehicle Search</h1>
//       <Suspense fallback={<MainSearchSkeleton />}>
//         <MainSearch />
//       </Suspense>
//       <div className="flex flex-col md:flex-row gap-8">
//         <aside className="w-full md:w-1/4">
//           <Suspense fallback={<FiltersSkeleton />}>
//             <SearchFilters
//               initialCategory={searchParams.category || ""}
//               initialBrand={searchParams.brand || ""} initialDistrict={""} initialCity={""}            />
//           </Suspense>
//         </aside>
//         <section className="w-full md:w-3/4">
//           <Suspense fallback={<ResultsSkeleton />}>
//             <SearchResults />
//           </Suspense>
//         </section>
//       </div>
//     </main>
//   );
// }

// function MainSearchSkeleton() {
//   return (
//     <div className="flex items-center justify-center h-16 mb-8 bg-muted rounded-md">
//       <Search className="h-6 w-6 text-muted-foreground animate-pulse" />
//     </div>
//   );
// }

// function FiltersSkeleton() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
//         <Skeleton className="h-4 w-24" />
//       </div>
//       {[...Array(5)].map((_, i) => (
//         <Skeleton key={i} className="h-10 w-full" />
//       ))}
//     </div>
//   );
// }

// function ResultsSkeleton() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Skeleton className="h-6 w-48" />
//         <Skeleton className="h-10 w-32" />
//       </div>
//       {[...Array(5)].map((_, i) => (
//         <div key={i} className="flex items-center space-x-4">
//           <Skeleton className="h-20 w-20 rounded-md" />
//           <div className="space-y-2">
//             <Skeleton className="h-4 w-48" />
//             <Skeleton className="h-4 w-32" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
