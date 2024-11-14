import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Car,
  Bike,
  Truck,
  MapPin,
  Calendar,
  Gauge,
  Clock,
} from "lucide-react";

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
  postedAt: string; // Add this field to your Vehicle type
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

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className={`overflow-hidden rounded-lg shadow-lg transition-all duration-200 ${
        isGridView ? "w-full" : "md:flex"
      } ${
        vehicle.isFeatured
          ? "border-2 border-yellow-500 hover:scale-105"
          : "hover:shadow-xl"
      }`}
    >
      {/* Image Section */}
      <div
        className={`relative ${
          isGridView ? "w-full" : "w-full md:w-1/3 min-w-[120px]"
        }`}
      >
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={400}
          height={300}
          className={`object-cover ${
            isGridView ? "w-full h-32 sm:h-40" : "w-full h-full"
          } ${isGridView ? "rounded-t-lg" : "md:rounded-l-lg"}`}
        />

        {/* Badges */}
        {vehicle.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black font-semibold px-2 py-1 rounded-full flex items-center text-xs">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {vehicle.isPromoted && !vehicle.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full font-semibold text-xs">
            Sponsored
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <CardContent
        className={`p-2 sm:p-4 space-y-1 sm:space-y-2 ${
          isGridView ? "" : "flex-1"
        } ${
          isGridView ? "h-[140px] sm:h-[190px]" : "h-full"
        } flex flex-col justify-between`}
      >
        <div>
          {/* Title */}
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 truncate">
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </h2>

          {/* Vehicle Type Icon */}
          <div className="flex items-center mb-1 text-gray-600">
            {vehicle.vehicleType === "CAR" && (
              <Car className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
            )}
            {vehicle.vehicleType === "BIKE" && (
              <Bike className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
            )}
            {vehicle.vehicleType === "TRUCK" && (
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
            )}
            <span className="text-xs sm:text-sm font-medium">
              {vehicle.vehicleType}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-y-1 sm:gap-y-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center">
              <Gauge className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>

            {/* Location */}
            <div className="flex items-center col-span-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
              <span className="truncate">
                {vehicle.user.userCity}, {vehicle.user.userDistrict}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center text-primary text-sm sm:text-base font-semibold col-span-2">
              <span>{formatPrice(vehicle.price)}</span>
            </div>
          </div>
        </div>

        {/* Posted Date */}
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock className="w-3 h-3 mr-1 text-gray-400" />
          <span>Posted on {formatDate(vehicle.postedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
