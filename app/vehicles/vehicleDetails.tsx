"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Separator } from "@/components/ui/separator";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, Phone, Mail, MapPin } from "lucide-react";

type Vehicle = {
  adId: number;
  price: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  vehicleType: string;
  engine: number;
  details: string;
  posted: boolean;
  postedAt: string;
  images: string[];
  gear: string;
  fuelType: string;
  startType: string | null;
  bikeType: string | null;
  user: {
    userId: number;
    username: string;
    userEmail: string;
    userPhone: string;
    userCity: string;
    userDistrict: string;
  };
  promoted: boolean;
  featured: boolean;
};

export default function VehicleDetailsClient({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString("en-GB");
  };

  const formatPrice = (price: string) => {
    return `Rs. ${parseInt(price).toLocaleString()}`;
  };

  return (
    <>
      <Card
        className={`max-w-4xl mx-auto ${
          vehicle.featured ? "border-2 border-yellow-500" : ""
        }`}
      >
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {vehicle.featured && (
                <Badge className="bg-yellow-500 text-black">
                  <Star className="w-4 h-4 mr-1" />
                  Featured
                </Badge>
              )}
              {vehicle.promoted && !vehicle.featured && (
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
              images={vehicle.images}
              alt={`${vehicle.brand} ${vehicle.model}`}
              onImageClick={handleImageClick}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="font-medium text-gray-500">Price</dt>
                <dd className="font-semibold text-xl text-green-600">
                  {formatPrice(vehicle.price)}
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
              <dl className="space-y-2">
                <div className="flex items-center">
                  <dt className="font-medium text-gray-500 w-24">Seller</dt>
                  <dd>{vehicle.user.username}</dd>
                </div>
                <div className="flex items-center">
                  <dt className="font-medium text-gray-500 w-24 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </dt>
                  <dd>{vehicle.user.userCity}</dd> <span> - </span>
                  <dd>{vehicle.user.userDistrict}</dd>
                </div>
                <div className="flex items-center">
                  <dt className="font-medium text-gray-500 w-24 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </dt>
                  <dd>{vehicle.user.userPhone}</dd>
                </div>
                <div className="flex items-center">
                  <dt className="font-medium text-gray-500 w-24 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </dt>
                  <dd className="break-all">{vehicle.user.userEmail}</dd>
                </div>
              </dl>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {vehicle.details || "No details provided."}
            </p>
          </div>

          <Separator className="my-6" />

          <div className="text-sm text-gray-500">
            Posted on: {vehicle.postedAt ? formatDate(vehicle.postedAt) : "N/A"}
          </div>
        </CardContent>
      </Card>

      <Modal open={isOpen} onClose={closeModal} center>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged vehicle"
            className="max-w-full max-h-[90vh] object-contain"
          />
        )}
      </Modal>
    </>
  );
}
