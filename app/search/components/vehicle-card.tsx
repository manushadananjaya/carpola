import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Car, Bike, Truck, MapPin, Calendar, Gauge } from "lucide-react";

type Vehicle = {
  adId: number;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  user: {
    userDistrict: string;
    userCity: string;
  };
  isFeatured: boolean;
  isPromoted: boolean;
};

export default function VehicleCard({
  vehicle,
  isGridView,
}: {
  vehicle: Vehicle;
  isGridView: boolean;
}) {
  // Helper function to format the price
  const formatPrice = (price: number) => {
    return `Rs. ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <Card
      className={`overflow-hidden rounded-lg shadow-lg transition-all duration-200 ${
        isGridView ? "" : "flex items-stretch"
      } ${
        vehicle.isFeatured
          ? "border-2 border-yellow-500 hover:scale-105"
          : "hover:shadow-xl"
      }`}
    >
      {/* Image Section */}
      <div className="relative">
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={400}
          height={300}
          className={`object-cover ${
            isGridView ? "w-full h-48" : "w-48 h-full"
          } ${isGridView ? "rounded-t-lg" : "rounded-l-lg"}`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        {vehicle.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black font-semibold px-2 py-1 rounded-full flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Featured
          </Badge>
        )}
        {vehicle.isPromoted && !vehicle.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full font-semibold">
            Sponsored
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <CardContent className={`p-5 space-y-3 ${isGridView ? "" : "flex-1"}`}>
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {vehicle.brand} {vehicle.model}
        </h2>

        {/* Vehicle Type Icon */}
        <div className="flex items-center mb-3 text-gray-600">
          {vehicle.vehicleType === "CAR" && <Car className="w-5 h-5 mr-1" />}
          {vehicle.vehicleType === "BIKE" && <Bike className="w-5 h-5 mr-1" />}
          {vehicle.vehicleType === "TRUCK" && (
            <Truck className="w-5 h-5 mr-1" />
          )}
          <span className="text-sm font-medium">{vehicle.vehicleType}</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>

          {/* Location */}
          <div className="flex items-center col-span-2 sm:col-span-2">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">
              {vehicle.user.userCity}, {vehicle.user.userDistrict}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center text-primary text-base font-semibold col-span-2 sm:col-span-1">
            <span>{formatPrice(vehicle.price)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
