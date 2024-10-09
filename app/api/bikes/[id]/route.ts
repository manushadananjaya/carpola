// app/api/bikes/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure prisma is correctly imported

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch the bike by ID
    const bike = await prisma.bike.findUnique({
      where: { bikeId: Number(id) },
      include: {
        user: true, // Include user information (e.g., city)
      },
    });

    // If the bike is not found, return a 404 response
    if (!bike) {
      return NextResponse.json({ error: "Bike not found" }, { status: 404 });
    }

    // Return the bike data if found
    console.log("Bike found:", bike);
    return NextResponse.json(bike);
  } catch (error) {
    console.error("Error fetching bike:", error);
    return NextResponse.json({ error: "Error fetching bike" }, { status: 500 });
  }
}
