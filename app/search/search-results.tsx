"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Grid, List, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
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
  user: {
    userDistrict: string;
    userCity: string;
  };
  isFeatured: boolean;
  isPromoted: boolean;
};

export default function SearchResults() {
  const [isGridView, setIsGridView] = useState(true);
  const [ads, setAds] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adsPerPage] = useState(12);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchAds(1);
  }, [searchParams]);

  const fetchAds = async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("limit", adsPerPage.toString());
      

      const { data } = await axios.get("/api/ads/search", { params });

      

      const processedAds = data.ads.map((ad: any) => ({
        ...ad,
        isFeatured:
          ad.PromotedItem?.some((item: any) => item.featured) || false,
        isPromoted: ad.PromotedItem?.length > 0 || false,
      }));

      const sortedAds = processedAds.sort((a: Vehicle, b: Vehicle) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return 0;
      });

      setAds(sortedAds);
      setTotalPages(Math.ceil(data.total / adsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchAds(page);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`/search?${newSearchParams.toString()}`);
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
            onClick={() => setIsGridView(!isGridView)}
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
          <Loader className="h-8 w-4 animate-spin" />
        </div>
      ) : (
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
            >
              <VehicleCard vehicle={vehicle} isGridView={isGridView} />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
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
