"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import {
  Grid,
  List,
  Search,
  Loader,
  Filter,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import locationData from "../../../data/sri-lanka-districts.json";
import Link from "next/link";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

import vehicleBrands from "../../../data/vehicle_brands.json";
import motoBrands from "../../../data/moto_brands.json";

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
  const [mainSearchTerm, setMainSearchTerm] = useState(initialSearchQuery);
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [ads, setAds] = useState<Vehicle[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [mainSearchSuggestions, setMainSearchSuggestions] = useState<string[]>(
    []
  );
  const [modelSearchSuggestions, setModelSearchSuggestions] = useState<
    string[]
  >([]);
  const [showMainSuggestions, setShowMainSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [brandOptions, setBrandOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adsPerPage] = useState(12);

  const [showFilters, setShowFilters] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const router = useRouter();
  const mainSearchInputRef = useRef<HTMLInputElement>(null);
  const modelSearchInputRef = useRef<HTMLInputElement>(null);

  const fetchAds = useCallback(
    async (page: number) => {
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
            mainSearchTerm,
            modelSearchTerm,
            brand: selectedBrand,
            page: page,
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
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedType,
      selectedDistrict,
      selectedCity,
      priceRange,
      yearRange,
      mainSearchTerm,
      modelSearchTerm,
      selectedBrand,
      adsPerPage,
    ]
  );

  useEffect(() => {
    fetchAds(1);
  }, [fetchAds]);

  useEffect(() => {
    if (initialCategory || initialSearchQuery) {
      setSelectedType(initialCategory);
      fetchAds(1);
    }
  }, [initialCategory, initialSearchQuery, fetchAds]);

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

  const debouncedMainSearch = debounce(async (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 2) {
      setMainSearchSuggestions([]);
      setShowMainSuggestions(false);
      return;
    }

    try {
      const response = await axios.get("/api/search-suggestions", {
        params: { query: trimmedValue },
      });

      const suggestions = response.data.map((item: any) => item.label || item);
      setMainSearchSuggestions(suggestions);
      setShowMainSuggestions(true);
    } catch (error) {
      console.error("Error fetching main search suggestions:", error);
    }
  }, 300);

  const debouncedModelSearch = debounce(async (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 2 || !selectedType || !selectedBrand) {
      setModelSearchSuggestions([]);
      setShowModelSuggestions(false);
      return;
    }

    try {
      const response = await axios.get("/api/model-search/", {
        params: {
          query: trimmedValue,
          brand: selectedBrand,
          type: selectedType,
        },
      });

      const suggestions = response.data.map((item: any) => item.label || item);
      setModelSearchSuggestions(suggestions);
      setShowModelSuggestions(true);
    } catch (error) {
      console.error("Error fetching model search suggestions:", error);
    }
  }, 300);

  const handleMainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?query=${mainSearchTerm}`);
    fetchAds(1);
    setShowMainSuggestions(false);
  };

  const handleModelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search?query=${modelSearchTerm}&category=${selectedType}&brand=${selectedBrand}`
    );
    fetchAds(1);
    setShowModelSuggestions(false);
  };

  const handleMainSuggestionClick = (suggestion: string) => {
    setMainSearchTerm(suggestion);
    router.push(`/search?query=${suggestion}`);
    fetchAds(1);
    setShowMainSuggestions(false);
  };

  const handleModelSuggestionClick = (suggestion: string) => {
    setModelSearchTerm(suggestion);
    router.push(
      `/search?query=${suggestion}&category=${selectedType}&brand=${selectedBrand}`
    );
    fetchAds(1);
    setShowModelSuggestions(false);
  };

  const handleFilterChange = () => {
    fetchAds(1);
  };

  const handleBrandChange = async (brand: string) => {
    setSelectedBrand(brand);
    setModelSearchTerm("");
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
    fetchAds(page);
  };

  const handleModelInputClick = () => {
    if (!selectedType || !selectedBrand) {
      setAlertMessage("Please select vehicle type and brand first");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vehicle Search</h1>

      {alertMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleMainSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Search for any brand, model, or keyword"
              value={mainSearchTerm}
              onChange={(e) => {
                setMainSearchTerm(e.target.value);
                debouncedMainSearch(e.target.value);
              }}
              className="w-full"
              ref={mainSearchInputRef}
            />
            {showMainSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                {mainSearchSuggestions.length > 0 ? (
                  mainSearchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleMainSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No suggestions found
                  </div>
                )}
              </div>
            )}
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:hidden mb-4"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          <div
            className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}
          >
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
              <form onSubmit={handleModelSearch} className="flex">
                <div className="relative flex-grow">
                  <Input
                    id="model"
                    ref={modelSearchInputRef}
                    placeholder="Search for a model"
                    value={modelSearchTerm}
                    onChange={(e) => {
                      setModelSearchTerm(e.target.value);
                      debouncedModelSearch(e.target.value);
                    }}
                    className="w-full"
                    disabled={!selectedType || !selectedBrand}
                    onClick={handleModelInputClick}
                  />
                  {showModelSuggestions && (
                    <div className="absolute z-10 w-full bg-white  border border-gray-300 mt-1  rounded-md shadow-lg">
                      {modelSearchSuggestions.length > 0 ? (
                        modelSearchSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              handleModelSuggestionClick(suggestion)
                            }
                          >
                            {suggestion}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No models found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="ml-2"
                  disabled={!selectedType || !selectedBrand}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
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
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
                onValueCommit={handleFilterChange}
              />
              <div className="flex justify-between mt-2">
                <span>LKR {priceRange[0].toLocaleString()}</span>
                <span>LKR {priceRange[1].toLocaleString()}</span>
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

            <Button onClick={handleFilterChange} className="w-full">
              Apply Filters
            </Button>
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
                <Link key={vehicle.adId} href={`/vehicles/${vehicle.adId}`}>
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
        </div>
      </div>
    </div>
  );
}
