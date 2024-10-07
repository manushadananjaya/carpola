// services/fetchFeaturedItems.ts
export async function fetchFeaturedItems() {
  const response = await fetch("/api/featured");

  if (!response.ok) {
    throw new Error("Failed to fetch featured items");
  }

  return await response.json();
}
