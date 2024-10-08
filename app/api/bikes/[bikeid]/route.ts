import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { bikeid: string } }
) {
  try {
    const bike = await prisma.bike.findUnique({
      where: {
        bikeid: parseInt(params.bikeid),
      },
    });
    if (!bike) {
      return NextResponse.json({ error: "Bike not found" }, { status: 404 });
    }
    return NextResponse.json(bike, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bike" },
      { status: 500 }
    );
  }
}
