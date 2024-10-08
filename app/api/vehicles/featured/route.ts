import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Assumes you have prisma setup

export async function GET() {
  try {
    const featuredVehicles = await prisma.featuredItem.findMany({
      where: { vehicleId: { not: null } },
      include: {
        vehicle: true, // Fetch the full vehicle details
      },
      orderBy: { createdAt: "desc" }, // Order by when it was featured
    });

    return NextResponse.json(featuredVehicles);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching featured vehicles" },
      { status: 500 }
    );
  }
}
