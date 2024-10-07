import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch featured vehicles and bikes
export async function GET() {
  try {
    // Fetch featured vehicles
    const vehicles = await prisma.Vehicle.findMany({
      where: { featured: true },
    });

    // Fetch featured bikes
    const bikes = await prisma.Bike.findMany({
      where: { featured: true },
    });

    // Return the data as JSON
    return NextResponse.json({ vehicles, bikes });
  } catch (error) {
    console.error("Error fetching featured vehicles and bikes:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured items" },
      { status: 500 }
    );
  }
}
