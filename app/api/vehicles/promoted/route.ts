import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const promotedVehicles = await prisma.promotedItem.findMany({
      where: { vehicleId: { not: null } },
      include: {
        vehicle: true, // Fetch the full vehicle details
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promotedVehicles);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching promoted vehicles" },
      { status: 500 }
    );
  }
}
