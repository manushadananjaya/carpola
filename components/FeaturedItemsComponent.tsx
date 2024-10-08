"use client";

import { useEffect, useState } from "react";
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
  image1:string;
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
  image1:string;
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

  return (
    <div className="container mx-auto">
      {/* Featured Vehicles Section */}
      <h2 className="text-3xl font-bold mb-6">Featured Vehicles</h2>
      <ul className="space-y-6">
        {items.vehicles.map((vehicle) => (
          <li
            key={vehicle.vehicleId}
            className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={vehicle.image1}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-semibold">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </h3>
            <p className="text-lg">Price: ${vehicle.price}</p>
            <p className="text-sm text-gray-600">
              Location: {vehicle.user.userCity}
            </p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(vehicle.postedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Featured Bikes Section */}
      <h2 className="text-3xl font-bold mt-12 mb-6">Featured Bikes</h2>
      <ul className="space-y-6">
        {items.bikes.map((bike) => (
          <li
            key={bike.bikeId}
            className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={bike.image1}
              alt={`${bike.brand} ${bike.model}`}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-semibold">
              {bike.brand} {bike.model} ({bike.year})
            </h3>
            <p className="text-lg">Price: ${bike.price}</p>
            <p className="text-sm text-gray-600">
              Location: {bike.user.userCity}
            </p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(bike.postedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
