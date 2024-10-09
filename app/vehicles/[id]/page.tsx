"use client";

import { useEffect, useState } from "react";
import { fetchVehicle } from "@/services/fetchItemDetailsVehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";

// Type definition
type Vehicle = {
  vehicleId: number;
  contactNo: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  gear: string;
  fuelType: string;
  engine: string;
  details: string;
  posted: boolean;
  postedAt: string;
  userId: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  user: {
    userId: number;
    username: string;
    userEmail: string;
    userPhone: string;
    userCity: string;
  };
};

export default function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchVehicle(id);
        setVehicle(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, [id]);

  if (error)
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Error: {error}
      </div>
    );
  if (!vehicle)
    return <div className="text-center text-xl mt-10">Loading...</div>;

  const images = [
    vehicle.image1,
    vehicle.image2,
    vehicle.image3,
    vehicle.image4,
    vehicle.image5,
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ImageCarousel
                images={images}
                alt={`${vehicle.brand} ${vehicle.model}`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-gray-500">Price</dt>
                  <dd className="font-semibold">${vehicle.price}</dd>
                  <dt className="font-medium text-gray-500">Mileage</dt>
                  <dd>{vehicle.mileage} km</dd>
                  <dt className="font-medium text-gray-500">Gear</dt>
                  <dd>{vehicle.gear}</dd>
                  <dt className="font-medium text-gray-500">Fuel Type</dt>
                  <dd>{vehicle.fuelType}</dd>
                  <dt className="font-medium text-gray-500">Engine</dt>
                  <dd>{vehicle.engine}</dd>
                </dl>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Seller Information
                </h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-gray-500">Seller</dt>
                  <dd>{vehicle.user.username}</dd>
                  <dt className="font-medium text-gray-500">Location</dt>
                  <dd>{vehicle.user.userCity}</dd>
                  <dt className="font-medium text-gray-500">Phone</dt>
                  <dd>{vehicle.contactNo}</dd>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="break-all">{vehicle.user.userEmail}</dd>
                </dl>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{vehicle.details}</p>
            </div>

            <Separator className="my-6" />

            <div className="text-sm text-gray-500">
              Posted on: {new Date(vehicle.postedAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
