import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newVehicle = await prisma.vehicle.create({
      data,
    });
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add vehicle" },
      { status: 500 }
    );
  }
}
