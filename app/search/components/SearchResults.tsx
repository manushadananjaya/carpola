"use client";

import { useState, useEffect, useRef } from "react";
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
import { Grid, List, Search, Loader } from "lucide-react";
import axios from "axios";
import locationData from "../../../data/sri-lanka-districts.json";
import Link from "next/link";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

// Import brand data
import vehicleBrands from "../../../data/vehicle_brands.json";
import motoBrands from "../../../data/moto_brands.json";

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

// Import the new VehicleCard component
import VehicleCard from "./vehicle-card";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearchQuery = searchParams.get("query") || "";
  const [loading, setLoading] = useState(false);

  const [isGridView, setIsGridView] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 100000000000]);
  const [yearRange, setYearRange] = useState([1980, new Date().getFullYear()]);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [ads, setAds] = useState<Vehicle[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [brandOptions, setBrandOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adsPerPage] = useState(12);

  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCategory || initialSearchQuery) {
      setSelectedType(initialCategory);
      fetchAds();
    }
  }, [initialCategory, initialSearchQuery]);

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
    if (selectedType === "BIKE") {
      setBrandOptions(motoBrands.data);
    } else {
      setBrandOptions(vehicleBrands.data);
    }
    setSelectedBrand("");
    setModelOptions([]);
  }, [selectedType]);

  const debouncedSearch = debounce(async (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/search-suggestions", {
        params: {
          query: trimmedValue,
          brand: selectedBrand,
          type: selectedType,
        },
      });

      const suggestions = response.data.map((item: any) => item.label || item);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const fetchAds = async () => {
    setLoading(true);
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
          brand: selectedBrand,
          page: currentPage,
          limit: adsPerPage,
        },
      });

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
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    router.push(
      `/search?query=${searchTerm}&category=${selectedType}&brand=${selectedBrand}`
    );
    fetchAds();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setCurrentPage(1);
    router.push(
      `/search?query=${suggestion}&category=${selectedType}&brand=${selectedBrand}`
    );
    fetchAds();
    setShowSuggestions(false);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchAds();
  };

  const handleBrandChange = async (brand: string) => {
    setSelectedBrand(brand);
    setSearchTerm("");
    setModelOptions([]);

    if (brand) {
      try {
        const response = await axios.get("/api/models", {
          params: { brand, type: selectedType },
        });
        setModelOptions(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAds();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div>
            <Label htmlFor="type">Vehicle Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value);
                handleFilterChange();
              }}
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
            <Label htmlFor="brand">Brand</Label>
            <Select value={selectedBrand} onValueChange={handleBrandChange}>
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Brands</SelectItem>
                {brandOptions.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Label htmlFor="model">Model</Label>
            <form onSubmit={handleSearch} className="flex">
              <Input
                id="model"
                ref={searchInputRef}
                placeholder="Search for a model"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="flex-grow"
              />
              <Button type="submit" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                {loading ? (
                  <div className="px-4 py-2 text-gray-500">Searching...</div>
                ) : searchSuggestions.length > 0 ? (
                  searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No Ads found</div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Select
              value={selectedDistrict}
              onValueChange={(value) => {
                setSelectedDistrict(value);
                setSelectedCity("ALL");
                handleFilterChange();
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
              onValueChange={(value) => {
                setSelectedCity(value);
                handleFilterChange();
              }}
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
              max={100000000000}
              step={100000}
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={handleFilterChange}
            />
            <div className="flex justify-between mt-2">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
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
              onValueCommit={handleFilterChange}
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                isGridView
                  ? "grid-cols-1 sm:grid-cols-2  lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {ads.map((vehicle) => (
                <Link key={vehicle.adId} href={`/vehicles/${vehicle.adId}`}>
                  <VehicleCard vehicle={vehicle} isGridView={isGridView} />
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="join space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    className={`join-item mx-1 ${
                      currentPage === page
                        ? "btn-primary bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
