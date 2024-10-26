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
import { Grid, List, Car, Bike, Truck } from "lucide-react";

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
  id: string;
  type: keyof typeof VehicleType;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  district: string;
  city: string;
};

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    type: "CAR",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    price: 20000,
    mileage: 30000,
    image: "/placeholder.svg?height=200&width=300",
    district: "Colombo",
    city: "Colombo 01",
  },
  {
    id: "2",
    type: "BIKE",
    brand: "Honda",
    model: "CBR",
    year: 2021,
    price: 15000,
    mileage: 5000,
    image: "/placeholder.svg?height=200&width=300",
    district: "Gampaha",
    city: "Negombo",
  },
  {
    id: "3",
    type: "TRUCK",
    brand: "Ford",
    model: "F-150",
    year: 2019,
    price: 35000,
    mileage: 40000,
    image: "/placeholder.svg?height=200&width=300",
    district: "Kandy",
    city: "Kandy",
  },
  {
    id: "4",
    type: "VAN",
    brand: "Mercedes",
    model: "Sprinter",
    year: 2022,
    price: 45000,
    mileage: 10000,
    image: "/placeholder.svg?height=200&width=300",
    district: "Galle",
    city: "Galle",
  },
];

// Import the location data
import locationData from "../../../data/sri-lanka-districts.json";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [isGridView, setIsGridView] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [yearRange, setYearRange] = useState([2000, new Date().getFullYear()]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [cities, setCities] = useState<string[]>([]);

useEffect(() => {
    if (selectedDistrict) {
        setCities(locationData[selectedDistrict as keyof typeof locationData]?.cities || []);
    } else {
        setCities([]);
    }
}, [selectedDistrict]);

  const filteredVehicles = mockVehicles.filter(
    (vehicle) =>
      (selectedType === "ALL" || vehicle.type === selectedType) &&
      vehicle.price >= priceRange[0] &&
      vehicle.price <= priceRange[1] &&
      vehicle.year >= yearRange[0] &&
      vehicle.year <= yearRange[1] &&
      (vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDistrict === "ALL" || vehicle.district === selectedDistrict) &&
      (selectedCity === "ALL" || vehicle.city === selectedCity)
  );


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
              min={2000}
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
              {filteredVehicles.length} results found
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
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  isGridView ? "" : "flex"
                }`}
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className={`object-cover ${
                    isGridView ? "w-full h-48" : "w-48 h-full"
                  }`}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                  <div className="flex items-center mb-2">
                    {vehicle.type === "CAR" && <Car className="w-4 h-4 mr-1" />}
                    {vehicle.type === "BIKE" && (
                      <Bike className="w-4 h-4 mr-1" />
                    )}
                    {vehicle.type === "TRUCK" && (
                      <Truck className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm text-gray-500">
                      {vehicle.type}
                    </span>
                  </div>
                  <p className="text-gray-600">Year: {vehicle.year}</p>
                  <p className="text-gray-600">Mileage: {vehicle.mileage} km</p>
                  <p className="text-gray-600">
                    Location: {vehicle.city}, {vehicle.district}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    ${vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
