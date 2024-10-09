// app/services/fetchVehicleOrBike.ts

export async function fetchVehicle(id: string) {
  try {
    const response = await fetch(`/api/vehicles/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching vehicle or bike:", error);
    throw error;
  }
}
