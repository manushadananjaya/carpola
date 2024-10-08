export async function fetchFeaturedItems() {
  const res = await fetch("/api/vehicles/featured");
  const vehicleData = await res.json();

  const bikeRes = await fetch("/api/bikes/featured");
  const bikeData = await bikeRes.json();

  if (!res.ok || !bikeRes.ok) {
    throw new Error("Failed to fetch featured items");
  }

  return {
    vehicles: vehicleData,
    bikes: bikeData,
  };
}
