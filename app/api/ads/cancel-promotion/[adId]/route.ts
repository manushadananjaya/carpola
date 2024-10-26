import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { adId: string } }
) {
  try {
    const { adId } = params;

    // Validate adId
    if (!adId) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 });
    }

    await prisma.promotedItem.deleteMany({
      where: { adId: parseInt(adId, 10) },
    });

    return NextResponse.json({ message: "Promotion cancelled successfully!" });
  } catch (error) {
    console.error("Error cancelling promotion:", error);
    return NextResponse.json(
      { error: "Failed to cancel promotion" },
      { status: 500 }
    );
  }
}
