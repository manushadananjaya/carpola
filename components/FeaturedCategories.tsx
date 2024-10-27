import Link from "next/link";
import {
  Car,
  Truck,
  Bus,
  Bike,
  Package,
  Tractor,
  Forklift,
  HelpCircle,
  Sailboat,
} from "lucide-react";

const VehicleType = {
  CAR: "CAR",
  VAN: "VAN",
  JEEP: "JEEP",
  LORRY: "LORRY",
  BIKE: "BIKE",
  CREWCAB: "CREWCAB",
  PICKUP: "PICKUP",
  BUS: "BUS",
  TRUCK: "TRUCK",
  THREEWHEEL: "THREEWHEEL",
  TRACTOR: "TRACTOR",
  HEAVYDUTY: "HEAVYDUTY",
  OTHER: "OTHER",
} as const;

type VehicleTypeKey = keyof typeof VehicleType;

const categoryIcons: Record<VehicleTypeKey, React.ReactNode> = {
  CAR: <Car className="w-8 h-8" />,
  VAN: <Package className="w-8 h-8" />,
  JEEP: <Car className="w-8 h-8" />,
  LORRY: <Truck className="w-8 h-8" />,
  BIKE: <Bike className="w-8 h-8" />,
  CREWCAB: <Car className="w-8 h-8" />,
  PICKUP: <Truck className="w-8 h-8" />,
  BUS: <Bus className="w-8 h-8" />,
  TRUCK: <Truck className="w-8 h-8" />,
  THREEWHEEL: <Sailboat className="w-8 h-8" />,
  TRACTOR: <Tractor className="w-8 h-8" />,
  HEAVYDUTY: <Forklift className="w-8 h-8" />,
  OTHER: <HelpCircle className="w-8 h-8" />,
};

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(VehicleType).map(([key, value]) => (
            <Link
              key={key}
              href={`/search?category=${value}`}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <div className="mb-2 text-primary">
                {categoryIcons[key as VehicleTypeKey]}
              </div>
              <span className="text-sm font-medium text-gray-900">{key}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
