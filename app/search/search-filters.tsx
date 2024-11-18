"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import locationData from "@/data/sri-lanka-districts.json";
import vehicleBrands from "@/data/vehicle_brands.json";
import motoBrands from "@/data/moto_brands.json";

const VehicleType = {
  CAR: "car",
  VAN: "van",
  JEEP: "jeep",
  LORRY: "lorry",
  BIKE: "bike",
  CREWCAB: "crewcab",
  PICKUP: "pickup",
  BUS: "buse",
  TRUCK: "truck",
  THREEWHEEL: "threewheeler",
  TRACTOR: "tractor",
  HEAVYDUTY: "heavyduty",
  OTHER: "othervehicle",
} as const;

export default function SearchFilters({
  initialCategory,
  initialBrand,
  initialDistrict,
  initialCity,
}: {
  initialCategory: string;
  initialBrand: string;
  initialDistrict: string;
  initialCity: string;
}) {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [yearRange, setYearRange] = useState([1930, 2024]);
  const [selectedDistrict, setSelectedDistrict] =
    useState<string>(initialDistrict);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [brandOptions, setBrandOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    setSelectedType(initialCategory);
    setSelectedBrand(initialBrand);
    setSelectedDistrict(initialDistrict);
    setSelectedCity(initialCity);
    setPriceRange([
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "100000000"),
    ]);
    setYearRange([
      parseInt(searchParams.get("minYear") || "1930"),
      parseInt(searchParams.get("maxYear") || "2024"),
    ]);
  }, [
    searchParams,
    initialCategory,
    initialBrand,
    initialDistrict,
    initialCity,
  ]);

  useEffect(() => {
    if (selectedType === "bikes") {
      setBrandOptions(motoBrands.data);
    } else {
      setBrandOptions(vehicleBrands.data);
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "ALL") {
      setCities(
        locationData[selectedDistrict as keyof typeof locationData]?.cities ||
          []
      );
    } else {
      setCities([]);
    }
  }, [selectedDistrict]);

  const handleFilterChange = () => {
    const category = selectedType === "all" ? "" : selectedType;
    const brand =
      selectedBrand === "all-brands"
        ? ""
        : selectedBrand.toLowerCase().replace(" ", "-");
    const location =
      selectedDistrict === "ALL"
        ? "sri-lanka"
        : `${selectedDistrict.toLowerCase()}${
            selectedCity !== "ALL" ? `-in-${selectedCity.toLowerCase()}` : ""
          }`;

    const baseUrl = `/search/${category || "all"}/${
      brand || "all-brands"
    }/${location}`;
    const queryParams = new URLSearchParams();

    if (priceRange[0] !== 0)
      queryParams.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 100000000)
      queryParams.set("maxPrice", priceRange[1].toString());
    if (yearRange[0] !== 1930)
      queryParams.set("minYear", yearRange[0].toString());
    if (yearRange[1] !== 2024)
      queryParams.set("maxYear", yearRange[1].toString());

    const queryString = queryParams.toString();
    const fullUrl = `${baseUrl}${queryString ? `?${queryString}` : ""}`;

    router.push(fullUrl);
  };

  const clearFilters = () => {
    router.push("/search/all/all-brands/sri-lanka");
  };

  return (
    <div className="space-y-6">
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
            <SelectItem value="all">All Types</SelectItem>
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
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger id="brand">
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-brands">All Brands</SelectItem>
            {brandOptions.map((brand) => (
              <SelectItem key={brand.id} value={brand.name}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range (LKR)</Label>
        <Slider
          min={0}
          max={100000000}
          step={1000}
          value={priceRange}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between mt-2">
          <span>LKR {priceRange[0].toLocaleString()}</span>
          <span>LKR {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div>
        <Label>Year Range</Label>
        <Slider
          min={1930}
          max={2024}
          step={1}
          value={yearRange}
          onValueChange={setYearRange}
        />
        <div className="flex justify-between mt-2">
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>

      <div>
        <Label htmlFor="district">District</Label>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger id="district">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Districts</SelectItem>
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
        <Select value={selectedCity} onValueChange={setSelectedCity}>
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

      <Button onClick={handleFilterChange} className="w-full">
        Apply Filters
      </Button>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}
