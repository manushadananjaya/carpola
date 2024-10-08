import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicleId: Number(id) },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching vehicle" },
      { status: 500 }
    );
  }
}
