"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Grid, List, Car, Bike, Truck, Star } from "lucide-react";
import axios from "axios";
import locationData from "../../../data/sri-lanka-districts.json";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";


// Vehicle Type Enum
const VehicleType = {
  CAR: "CAR",
  VAN: "VAN",
  JEEP: "JEEP",
  LORRY: "LORRY",
  BIKE: "BIKE",
  CREWCAB: "CREWCAB",
  PICKUP: "PICKUP",
  BUS: "BUS",
  TRUCK: "TRUCK",
  THREEWHEEL: "THREEWHEEL",
  TRACTOR: "TRACTOR",
  HEAVYDUTY: "HEAVYDUTY",
  OTHER: "OTHER",
} as const;

type Vehicle = {
  adId: number;
  vehicleType: keyof typeof VehicleType;
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
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearchQuery = searchParams.get("query") || "";

  const [isGridView, setIsGridView] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [yearRange, setYearRange] = useState([1980, new Date().getFullYear()]);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [ads, setAds] = useState<Vehicle[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const router = useRouter();

  
  // Other state definitions for filters

  // Debounce function: delays the effect until the user stops typing
  const debouncedSearch = debounce((value) => {
    setDebouncedSearchTerm(value);
  }, 300);

  // Fetch ads from the API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get("/api/ads/search", {
          params: {
            type: selectedType,
            district: selectedDistrict,
            city: selectedCity,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            minYear: yearRange[0],
            maxYear: yearRange[1],
            searchTerm,
          },
        });

        // Process and sort the ads
        const processedAds = data.map((ad: any) => ({
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
        console.log("Fetched ads:", sortedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, [
    selectedType,
    selectedDistrict,
    selectedCity,
    priceRange,
    yearRange,
    searchTerm,
  ]);

  useEffect(() => {
    if (selectedDistrict) {
      setCities(
        locationData[selectedDistrict as keyof typeof locationData]?.cities ||
          []
      );
    } else {
      setCities([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    // Set up a new search term as the user types
    debouncedSearch(searchTerm);

    // Clean up debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  // Effect to update the ads list based on the debounced search term
   useEffect(() => {
     if (debouncedSearchTerm) {
       router.push(`/search?query=${debouncedSearchTerm}`);
     }
   }, [debouncedSearchTerm, router]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by brand or model"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="type">Vehicle Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {Object.entries(VehicleType).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Select
              value={selectedDistrict}
              onValueChange={(value) => {
                setSelectedDistrict(value);
                setSelectedCity("ALL");
              }}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sri Lanka</SelectItem>
                {Object.keys(locationData).map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Select
              value={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price Range</Label>
            <Slider
              min={0}
              max={100000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <Label>Year Range</Label>
            <Slider
              min={1980}
              max={new Date().getFullYear()}
              step={1}
              value={yearRange}
              onValueChange={setYearRange}
            />
            <div className="flex justify-between mt-2">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-3/4">
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

          <div
            className={`grid gap-6 ${
              isGridView
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {ads.map((vehicle) => (
              <Link key={vehicle.adId} href={`/vehicles/${vehicle.adId}`}>
                <div
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    isGridView ? "" : "flex"
                  } ${
                    vehicle.isFeatured
                      ? "border-2 border-yellow-500 transform hover:scale-105 transition-transform duration-200"
                      : "hover:shadow-lg transition-shadow duration-200"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className={`object-cover ${
                        isGridView ? "w-full h-48" : "w-48 h-full"
                      }`}
                    />
                    {vehicle.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded-full flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {vehicle.isPromoted && !vehicle.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full">
                        Sponsored
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">
                      {vehicle.brand} {vehicle.model}
                    </h2>
                    <div className="flex items-center mb-2">
                      {vehicle.vehicleType === "CAR" && (
                        <Car className="w-4 h-4 mr-1" />
                      )}
                      {vehicle.vehicleType === "BIKE" && (
                        <Bike className="w-4 h-4 mr-1" />
                      )}
                      {vehicle.vehicleType === "TRUCK" && (
                        <Truck className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-sm text-gray-500">
                        {vehicle.vehicleType}
                      </span>
                    </div>
                    <p className="text-gray-600">Year: {vehicle.year}</p>
                    <p className="text-gray-600">
                      Mileage: {vehicle.mileage} km
                    </p>
                    <p className="text-gray-600 font-semibold text-lg">
                      Price: ${vehicle.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Location: {vehicle.user.userCity},{" "}
                      {vehicle.user.userDistrict}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
