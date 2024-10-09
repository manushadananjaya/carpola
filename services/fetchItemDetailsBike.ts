// app/services/fetchVehicleOrBike.ts

export async function fetchBike(id: string) {
  try {
    const response = await fetch(`/api/bikes/${id}`);
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
