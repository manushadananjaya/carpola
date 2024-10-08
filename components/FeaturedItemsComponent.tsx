"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { fetchFeaturedItems } from "@/services/fetchFeaturedItems";

// Type definitions
type Vehicle = {
  vehicleId: number;
  model: string;
  price: number;
  brand: string;
  year: number;
  postedAt: string;
  user: {
    userCity: string;
  };
  image1: string;
};

type Bike = {
  bikeId: number;
  model: string;
  price: number;
  brand: string;
  year: number;
  postedAt: string;
  user: {
    userCity: string;
  };
  image1: string;
};

type FeaturedItems = {
  vehicles: Vehicle[];
  bikes: Bike[];
};

export function FeaturedItemsComponent() {
  const [items, setItems] = useState<FeaturedItems>({
    vehicles: [],
    bikes: [],
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFeaturedItems();
        setItems(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  // Click handler for vehicles
  const handleVehicleClick = (vehicleId: number) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  // Click handler for bikes
  const handleBikeClick = (bikeId: number) => {
    router.push(`/bikes/${bikeId}`);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Featured Vehicles Section */}
      <h2 className="text-3xl font-bold mb-6">Featured Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.vehicles.map((vehicle) => (
          <div
            key={vehicle.vehicleId}
            className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
            onClick={() => handleVehicleClick(vehicle.vehicleId)} // Add click handler
          >
            <img
              src={vehicle.image1}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-semibold mb-2">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </h3>
            <p className="text-lg font-bold text-blue-500 mb-2">
              Price: ${vehicle.price}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Location: {vehicle.user.userCity}
            </p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(vehicle.postedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Featured Bikes Section */}
      <h2 className="text-3xl font-bold mt-12 mb-6">Featured Bikes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.bikes.map((bike) => (
          <div
            key={bike.bikeId}
            className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
            onClick={() => handleBikeClick(bike.bikeId)} // Add click handler
          >
            <img
              src={bike.image1}
              alt={`${bike.brand} ${bike.model}`}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-semibold mb-2">
              {bike.brand} {bike.model} ({bike.year})
            </h3>
            <p className="text-lg font-bold text-blue-500 mb-2">
              Price: ${bike.price}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Location: {bike.user.userCity}
            </p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(bike.postedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
