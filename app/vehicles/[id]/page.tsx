"use client";

import { useEffect, useState } from "react";
import { fetchVehicle } from "@/services/fetchItemDetailsVehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

// Type definition
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
};

export default function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Selected image for modal
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

  console.log("fetched vehicle:", vehicle);

  if (error)
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Error: {error}
      </div>
    );
  if (!vehicle)
    return <div className="text-center text-xl mt-10">Loading...</div>;

  // Vehicle image array
  const images = vehicle.images || [];

  // Function to handle image click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsOpen(true); // Open modal
  };

  // Function to close modal
  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

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
                onImageClick={handleImageClick} // Attach click handler
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

        {/* Modal for Enlarged Image */}
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
