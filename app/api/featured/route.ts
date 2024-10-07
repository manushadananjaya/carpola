// app/api/featured/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch featured vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: { featured: true },
    });

    // Fetch featured bikes
    const bikes = await prisma.Bike.findMany({
      where: { featured: true },
    });

    return NextResponse.json({ vehicles, bikes });
  } catch (error) {
    console.error("Error fetching featured vehicles and bikes:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured items" },
      { status: 500 }
    );
  }
}
