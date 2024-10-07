// components/FeaturedItemsComponent.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchFeaturedItems } from "@/services/fetchFeaturedItems";

type Vehicle = {
  vehicleid: number;
  model: string;
  price: number;
  brand: string;
};

type Bike = {
  bikeid: number;
  model: string;
  price: number;
  brand: string;
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
      <h2 className="text-3xl font-bold mb-6">Featured Vehicles</h2>
      <ul className="space-y-4">
        {items.vehicles.map((vehicle) => (
          <li key={vehicle.vehicleid}>
            <h3 className="text-xl font-semibold">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p>Price: ${vehicle.price}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-6">Featured Bikes</h2>
      <ul className="space-y-4">
        {items.bikes.map((bike) => (
          <li key={bike.bikeid}>
            <h3 className="text-xl font-semibold">
              {bike.brand} {bike.model}
            </h3>
            <p>Price: ${bike.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
