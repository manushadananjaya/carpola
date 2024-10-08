import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const promotedBikes = await prisma.promotedItem.findMany({
      where: { bikeId: { not: null } },
      include: {
        bike: true, // Fetch the full bike details
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promotedBikes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching promoted bikes" },
      { status: 500 }
    );
  }
}
