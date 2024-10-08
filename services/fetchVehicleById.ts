// services/fetchVehicleById.ts
export async function fetchVehicleById(vehicleId: number) {
  const res = await fetch(`/api/vehicles/${vehicleId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch vehicle");
  }

  return res.json();
}
