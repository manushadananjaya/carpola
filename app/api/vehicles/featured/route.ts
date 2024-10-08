import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const featuredVehicles = await prisma.vehicle.findMany({
      where: {
        featured:true,
      },
    });
    return NextResponse.json(featuredVehicles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured vehicles" },
      { status: 500 }
    );
  }
}
