// app/api/vehicles/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure prisma is correctly imported

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch the vehicle by ID
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicleId: Number(id) },
      include: {
        user: true, // Include user information (e.g., city)
      },
    });

    // If the vehicle is not found, return a 404 response
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Return the vehicle data if found
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Error fetching vehicle" },
      { status: 500 }
    );
  }
}
