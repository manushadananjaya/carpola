// services/fetchBikeById.ts
export async function fetchBikeById(bikeId: number) {
  const res = await fetch(`/api/bikes/${bikeId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch bike");
  }

  return res.json();
}
