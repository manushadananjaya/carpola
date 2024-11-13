import { fetchVehicle } from "@/services/fetchItemDetailsVehicle";
import VehicleDetailsClient from "../vehicleDetails";
import { Metadata } from "next";

// Extract ID from slug
function getIdFromSlug(slug: string): string {
  return slug.split("-").pop() || "";
}

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const id = getIdFromSlug(params.slug);
  const vehicle = await fetchVehicle(id);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found - Carpola",
      description: "The requested vehicle listing could not be found.",
    };
  }

  const formattedPrice = `Rs. ${vehicle.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  return {
    title: `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${formattedPrice} - ${vehicle.user.userCity} - ${vehicle.user.userDistrict} - Carpola`,
    description: `Find details about the ${vehicle.brand} ${vehicle.model} from ${vehicle.year}. Available for ${formattedPrice} in ${vehicle.user.userCity} - ${vehicle.user.userDistrict}, Sri Lanka.`,
    openGraph: {
      title: `${vehicle.brand} ${vehicle.model} - ${formattedPrice}`,
      description: `Check out this ${vehicle.brand} ${
        vehicle.model
      }, available for ${formattedPrice}. It has ${vehicle.mileage.toLocaleString()} km mileage and ${
        vehicle.fuelType || "unknown"
      } fuel type.`,
      images: vehicle.images.length
        ? [
            {
              url: vehicle.images[0],
              alt: `${vehicle.brand} ${vehicle.model}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
      description: `Discover this ${vehicle.vehicleType}, available for ${formattedPrice}.`,
      images: vehicle.images[0] || "",
    },
  };
}

export default async function VehicleDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const id = getIdFromSlug(params.slug);
  const vehicle = await fetchVehicle(id);

  if (!vehicle) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <VehicleDetailsClient vehicle={vehicle} />
      </main>
    </div>
  );
}
