import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const featuredBikes = await prisma.bike.findMany({
      where: {
        featured: true,
      },
    });
    return NextResponse.json(featuredBikes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured bikes" },
      { status: 500 }
    );
  }
}
