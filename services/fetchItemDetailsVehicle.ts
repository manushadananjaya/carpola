export async function fetchVehicle(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/vehicles/${id}`
    );

    console.log("Fetching vehicle with ID:", id);

    console.log("Response status:", response);

    // Ensure the response body is only consumed once
    const data = await response.json();
    console.log("Response data:", data);

    // Handle errors in the response
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching vehicle or bike:", error);
    throw error;
  }
}
