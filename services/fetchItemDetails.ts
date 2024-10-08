// services/fetchItemDetails.ts

export async function fetchItemDetails(id: string) {
  try {
    const response = await fetch(`/api/vehicles/${id}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch item details: ${(error as Error).message}`
    );
  }
}
