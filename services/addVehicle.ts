// services/addVehicle.ts
export async function addVehicle(vehicleData: any) {
  const res = await fetch("/api/vehicles/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  });

  if (!res.ok) {
    throw new Error("Failed to add vehicle");
  }

  return res.json();
}
