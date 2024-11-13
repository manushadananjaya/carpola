"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import VehicleCard from "../app/search/components/vehicle-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateVehicleSlug } from "@/utils/generateSlug";

// Define the Vehicle type
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



// Fetch function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FeaturedAds() {
  const { data: featuredAds, error } = useSWR<Vehicle[]>(
    "/api/featured-ads",
    fetcher
  );

  if (error) {
    return (
      <Card className="w-full p-4">
        <h2 className="text-2xl font-bold mb-4">Featured Ads</h2>
        <div className="text-red-500">
          Failed to load featured ads. Please try again later.
        </div>
      </Card>
    );
  }

  if (!featuredAds) {
    return (
      <Card className="w-full p-4">
        <h2 className="text-2xl font-bold mb-4">Featured Ads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {featuredAds.map((vehicle) => (
            <CarouselItem
              key={vehicle.adId}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Link href={`/vehicles/${generateVehicleSlug(vehicle)}`}>
                  <VehicleCard vehicle={vehicle} isGridView={true} />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Card>
  );
}
