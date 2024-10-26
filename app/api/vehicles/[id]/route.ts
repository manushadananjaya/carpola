// app/api/vehicles/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch the vehicle ad by ID
    const vehicle = await prisma.ad.findUnique({
      where: { adId: Number(id) },
      include: {
        user: true, // Include the associated user's information
      },
    });

    // If the vehicle ad is not found, return a 404 response
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    console.log("Vehicle ad found:", vehicle);

    // Return the vehicle ad data if found
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Error fetching vehicle" },
      { status: 500 }
    );
  }
}
