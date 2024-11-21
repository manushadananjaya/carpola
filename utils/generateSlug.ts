export function generateVehicleSlug(vehicle: {
  brand: string;
  model: string;
  year: number;
  adId: number;
}) {
  return `${vehicle.brand.toLowerCase()}-${vehicle.model
    .toLowerCase()
    .replace(/\s+/g, "-")}-${vehicle.year}-${vehicle.adId}`;
}
