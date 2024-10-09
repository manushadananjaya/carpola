"use client";

import { useEffect, useState } from "react";
import { fetchBike } from "@/services/fetchItemDetailsBike";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";

// Type definition
type Bike = {
  bikeId: number;
  contactNo: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  startType: string;
  bikeType: string;
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

export default function BikeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [bike, setBike] = useState<Bike | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchBike(id);
        setBike(data);
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
  if (!bike) return <div className="text-center text-xl mt-10">Loading...</div>;

  const images = [
    bike.image1,
    bike.image2,
    bike.image3,
    bike.image4,
    bike.image5,
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {bike.brand} {bike.model} ({bike.year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ImageCarousel
                images={images}
                alt={`${bike.brand} ${bike.model}`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Bike Details</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-gray-500">Price</dt>
                  <dd className="font-semibold">${bike.price}</dd>
                  <dt className="font-medium text-gray-500">Mileage</dt>
                  <dd>{bike.mileage} km</dd>
                  <dt className="font-medium text-gray-500">Start Type</dt>
                  <dd>{bike.startType}</dd>
                  <dt className="font-medium text-gray-500">Bike Type</dt>
                  <dd>{bike.bikeType}</dd>
                  <dt className="font-medium text-gray-500">Engine</dt>
                  <dd>{bike.engine}</dd>
                </dl>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Seller Information
                </h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-gray-500">Seller</dt>
                  <dd>{bike.user.username}</dd>
                  <dt className="font-medium text-gray-500">Location</dt>
                  <dd>{bike.user.userCity}</dd>
                  <dt className="font-medium text-gray-500">Phone</dt>
                  <dd>{bike.contactNo}</dd>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="break-all">{bike.user.userEmail}</dd>
                </dl>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{bike.details}</p>
            </div>

            <Separator className="my-6" />

            <div className="text-sm text-gray-500">
              Posted on: {new Date(bike.postedAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
