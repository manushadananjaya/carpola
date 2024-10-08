import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch the vehicle by ID first
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicleId: Number(id) },
      include: {
        user: true, // Include user information (e.g., city)
      },
    });

    // If vehicle is not found, check for a bike with the same ID
    if (!vehicle) {
      const bike = await prisma.bike.findUnique({
        where: { bikeId: Number(id) },
        include: {
          user: true, // Include user information
        },
      });

      // If neither vehicle nor bike is found, return 404
      if (!bike) {
        return NextResponse.json(
          { error: "Vehicle or bike not found" },
          { status: 404 }
        );
      }

      // If a bike is found, return bike data
      return NextResponse.json(bike);
    }

    // Return the vehicle data if found
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle or bike:", error);
    return NextResponse.json(
      { error: "Error fetching vehicle or bike" },
      { status: 500 }
    );
  }
}
