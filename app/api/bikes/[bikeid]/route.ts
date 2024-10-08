import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const bike = await prisma.bike.findUnique({
      where: { bikeId: Number(id) },
    });

    if (!bike) {
      return NextResponse.json({ error: "Bike not found" }, { status: 404 });
    }

    return NextResponse.json(bike);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching bike" }, { status: 500 });
  }
}
