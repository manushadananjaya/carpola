import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import Prisma client

// POST method to promote an ad
export async function POST(
  request: Request,
  { params }: { params: { adId: string } }
) {
  const { adId } = params;

  try {
    // Parse request body to get the duration
    const { duration } = await request.json();

    // Calculate the expiration date by adding duration days to the current date
    const promotionExpiresAt = new Date();
    promotionExpiresAt.setDate(promotionExpiresAt.getDate() + duration);

    // Create a PromotedItem entry and associate it with the specified Ad
    const promotedItem = await prisma.promotedItem.create({
      data: {
        adId: parseInt(adId),
        promotionExpiresAt,
      },
    });

    // Respond with success and include the expiration date
    return NextResponse.json({
      message: "Ad promoted successfully!",
      promotionExpiresAt,
    });
  } catch (error) {
    console.error("Error promoting ad:", error);
    return NextResponse.json(
      { error: "Failed to promote ad" },
      { status: 500 }
    );
  }
}
