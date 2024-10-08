// services/addBike.ts
export async function addBike(bikeData: any) {
  const res = await fetch("/api/bikes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bikeData),
  });

  if (!res.ok) {
    throw new Error("Failed to add bike");
  }

  return res.json();
}
