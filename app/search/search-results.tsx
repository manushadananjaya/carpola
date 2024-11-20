"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Grid, List, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import VehicleCard from "./components/vehicle-card";
import { generateVehicleSlug } from "@/utils/generateSlug";

type Vehicle = {
  adId: number;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  user: { userDistrict: string; userCity: string };
  isFeatured: boolean;
  isPromoted: boolean;
  postedAt: string;
};

export default function SearchResults({
  initialQuery,
  category,
  brand,
  location,
}: {
  initialQuery: string;
  category: string;
  brand: string;
  location: string;
}) {
  const [isGridView, setIsGridView] = useState(true);
  const [ads, setAds] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const adsPerPage = 12;

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchAds(1);
  }, [initialQuery, category, brand, location]);

  const fetchAds = async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      params.set("limit", adsPerPage.toString());
      params.set("query", initialQuery);
      params.set("category", category);
      params.set("brand", brand);
      params.set("location", location);

      console.log("Fetching ads with params:", params.toString());

      const response = await fetch(`/api/ads/search?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ads: ${response.statusText}`);
      }

      const data = await response.json();

      // Process the ads for UI
      const processedAds = data.ads.map((ad: any) => ({
        ...ad,
        isFeatured:
          ad.PromotedItem?.some((item: any) => item.featured) || false,
        isPromoted: ad.PromotedItem?.length > 0 || false,
      }));

      // Update state with fetched data
      setAds(processedAds);
      setTotalPages(Math.ceil(data.total / adsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchAds(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(
      `/search/${category}/${brand}/${location}?${params.toString()}`,
      { scroll: false }
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          {ads.length} results found
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Grid View</span>
          <Switch checked={isGridView} onCheckedChange={setIsGridView} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsGridView((prev) => !prev)}
          >
            {isGridView ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : ads.length > 0 ? (
        <div
          className={`grid gap-6 ${
            isGridView
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {ads.map((vehicle) => (
            <Link
              key={vehicle.adId}
              href={`/vehicles/${generateVehicleSlug(vehicle)}`}
              className="block"
            >
              <VehicleCard vehicle={vehicle} isGridView={isGridView} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No results found</div>
      )}

      <div className="mt-8 flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
