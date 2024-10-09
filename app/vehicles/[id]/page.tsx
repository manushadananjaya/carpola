// app/vehicles/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchVehicle } from "@/services/fetchItemDetailsVehicle"; // Import the service

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

export default function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [item, setItem] = useState<Vehicle | Bike | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchVehicle(id); // Use the service to fetch data
        setItem(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto mt-10 p-4 border rounded shadow-lg bg-white">
        <img
          src={item.image1}
          alt={`${item.brand} ${item.model}`}
          className="w-full h-64 object-cover mb-6 rounded"
        />
        <h2 className="text-3xl font-bold mb-4">
          {item.brand} {item.model} ({item.year})
        </h2>
        <p className="text-lg font-bold text-blue-500 mb-2">
          Price: ${item.price}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Location: {item.user.userCity}
        </p>
        <p className="text-sm text-gray-500">
          Posted on: {new Date(item.postedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
