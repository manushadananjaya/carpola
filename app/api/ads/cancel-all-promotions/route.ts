import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST() {
  try {
    const currentDate = new Date();

    // Delete all expired promotions
    await prisma.promotedItem.deleteMany({
      where: {
        promotionExpiresAt: {
          lt: currentDate,
        },
      },
    });

    return NextResponse.json({
      message: "All expired promotions cancelled successfully!",
    });
  } catch (error) {
    console.error("Error cancelling all promotions:", error);
    return NextResponse.json(
      { error: "Failed to cancel all promotions" },
      { status: 500 }
    );
  }
}
