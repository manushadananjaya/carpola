// services/fetchPromotedItems.ts
export async function fetchPromotedItems() {
  const res = await fetch("/api/vehicles/promoted");
  const vehicleData = await res.json();

  const bikeRes = await fetch("/api/bikes/promoted");
  const bikeData = await bikeRes.json();

  if (!res.ok || !bikeRes.ok) {
    throw new Error("Failed to fetch promoted items");
  }

  return {
    vehicles: vehicleData,
    bikes: bikeData,
  };
}
