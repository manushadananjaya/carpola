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

export default function SearchFilters({
  initialCategory,
  initialBrand,
}: {
  initialCategory: string;
  initialBrand: string;
}) {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 100000000000]);
  const [yearRange, setYearRange] = useState([1980, new Date().getFullYear()]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [brandOptions, setBrandOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    setSelectedType(searchParams.get("category") || initialCategory);
    setSelectedBrand(searchParams.get("brand") || initialBrand);
    setSelectedDistrict(searchParams.get("district") || "ALL");
    setSelectedCity(searchParams.get("city") || "ALL");
    setPriceRange([
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "100000000000"),
    ]);
    setYearRange([
      parseInt(searchParams.get("minYear") || "1980"),
      parseInt(
        searchParams.get("maxYear") || new Date().getFullYear().toString()
      ),
    ]);
  }, [searchParams, initialCategory, initialBrand]);

  useEffect(() => {
    if (selectedType === "BIKE") {
      setBrandOptions(motoBrands.data);
    } else {
      setBrandOptions(vehicleBrands.data);
    }
  }, [selectedType]);

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

  const handleFilterChange = () => {
    const searchParams = new URLSearchParams();
    if (selectedType !== "ALL") searchParams.set("category", selectedType);
    if (selectedBrand !== "ALL") searchParams.set("brand", selectedBrand);
    if (selectedDistrict !== "ALL")
      searchParams.set("district", selectedDistrict);
    if (selectedCity !== "ALL") searchParams.set("city", selectedCity);
    searchParams.set("minPrice", priceRange[0].toString());
    searchParams.set("maxPrice", priceRange[1].toString());
    searchParams.set("minYear", yearRange[0].toString());
    searchParams.set("maxYear", yearRange[1].toString());

    router.push(`/search?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setSelectedType("ALL");
    setSelectedBrand("ALL");
    setSelectedDistrict("ALL");
    setSelectedCity("ALL");
    setPriceRange([0, 100000000000]);
    setYearRange([1980, new Date().getFullYear()]);
    router.push("/search");
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
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
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

      <div>
        <Label>Price Range</Label>
        <Slider
          min={0}
          max={100000000000}
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

      <Button onClick={handleFilterChange} className="w-full">
        Apply Filters
      </Button>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}
