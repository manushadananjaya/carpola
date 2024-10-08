import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newBike = await prisma.bike.create({
      data,
    });
    return NextResponse.json(newBike, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add bike" }, { status: 500 });
  }
}
