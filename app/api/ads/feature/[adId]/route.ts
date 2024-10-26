import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Adjust the path to match your Prisma client location

export async function POST(
  req: Request,
  { params }: { params: { adId: string } }
) {
  const { adId } = params;

  try {
    // Find or create a promoted item for the ad
    const promotedItem = await prisma.promotedItem.upsert({
    where: { id: Number(adId) },
      update: {
        featured: true,
        promotionExpiresAt: new Date(
          new Date().setDate(new Date().getDate() + 7)
        ), // Extend for 7 days, modify as needed
      },
      create: {
        adId: Number(adId),
        featured: true,
        promotionExpiresAt: new Date(
          new Date().setDate(new Date().getDate() + 7)
        ), // Set promotion expiration to 7 days from now
      },
    });

    return NextResponse.json({
      message: "Ad successfully featured",
      promotedItem,
    });
  } catch (error) {
    console.error("Error featuring ad:", error);
    return NextResponse.json(
      { error: "Failed to feature ad" },
      { status: 500 }
    );
  }
}
