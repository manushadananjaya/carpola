"use client";

import { useEffect, useState } from "react";
import { fetchVehicle } from "@/services/fetchItemDetailsVehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";

// Updated Type definition
type Vehicle = {
  adId: number;
  contactNo: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  gear: string | null;
  fuelType: string | null;
  engine: number;
  details: string | null;
  posted: boolean;
  postedAt: string | null;
  userId: number;
  images: string[];
  user: {
    userId: number;
    username: string;
    userEmail: string;
    userPhone: string;
    userCity: string;
  };
  PromotedItem: { featured: boolean }[];
  featured: boolean;
  promoted: boolean;
  vehicleType: string;
  bikeType: string | null;
  startType: string | null;
};

export default function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      try {
       
        const data = await fetchVehicle(id);
        setVehicle(data);
        console.log("fetched vehicle:", data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, [id]);

  console.log("fetched vehicle:", vehicle);

  if (error)
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Error: {error}
      </div>
    );
  if (!vehicle)
    return <div className="text-center text-xl mt-10">Loading...</div>;

  const images = vehicle.images || [];

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const isFeatured = vehicle.PromotedItem.some((item) => item.featured);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card
          className={`max-w-4xl mx-auto ${
            isFeatured ? "border-2 border-yellow-500" : ""
          }`}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </CardTitle>
              <div className="flex gap-2">
                {isFeatured && (
                  <Badge className="bg-yellow-500 text-black">
                    <Star className="w-4 h-4 mr-1" />
                    Featured
                  </Badge>
                )}
                {vehicle.promoted && !isFeatured && (
                  <Badge className="bg-blue-500">
                    <Zap className="w-4 h-4 mr-1" />
                    Sponsored
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ImageCarousel
                images={images}
                alt={`${vehicle.brand} ${vehicle.model}`}
                onImageClick={handleImageClick}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-gray-500">Price</dt>
                  <dd className="font-semibold text-xl text-green-600">
                    LKR {vehicle.price.toLocaleString()}
                  </dd>
                  <dt className="font-medium text-gray-500">Type</dt>
                  <dd>{vehicle.vehicleType}</dd>
                  {vehicle.bikeType && (
                    <>
                      <dt className="font-medium text-gray-500">Bike Type</dt>
                      <dd>{vehicle.bikeType}</dd>
                    </>
                  )}
                  {vehicle.startType && (
                    <>
                      <dt className="font-medium text-gray-500">Start Type</dt>
                      <dd>{vehicle.startType}</dd>
                    </>
                  )}
                  <dt className="font-medium text-gray-500">Mileage</dt>
                  <dd>{vehicle.mileage.toLocaleString()} km</dd>
                  <dt className="font-medium text-gray-500">Gear</dt>
                  <dd>{vehicle.gear || "N/A"}</dd>
                  <dt className="font-medium text-gray-500">Fuel Type</dt>
                  <dd>{vehicle.fuelType || "N/A"}</dd>
                  <dt className="font-medium text-gray-500">Engine</dt>
                  <dd>{vehicle.engine} cc</dd>
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
                  <dd>{vehicle.user.userPhone}</dd>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="break-all">{vehicle.user.userEmail}</dd>
                </dl>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">
                {vehicle.details || "No details provided."}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="text-sm text-gray-500">
              Posted on:{" "}
              {vehicle.postedAt
                ? new Date(vehicle.postedAt).toLocaleDateString()
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Modal open={isOpen} onClose={closeModal} center>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged vehicle"
              className="max-w-full max-h-screen"
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
