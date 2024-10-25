// app/api/ads/approve/[adId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client

// Handle POST request to approve an ad
export async function POST(
  req: Request,
  { params }: { params: { adId: string } }
) {
  const { adId } = params;

  try {
    // Update the ad's `posted` field to `true` to mark it as approved
    const updatedAd = await prisma.ad.update({
      where: {
        adId: Number(adId), // Ensure adId is treated as a number
      },
      data: {
        posted: true, // Set posted to true
      },
    });

    return NextResponse.json({
      message: "Ad approved successfully!",
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error approving ad:", error);
    return NextResponse.json(
      {
        message: "Failed to approve ad",
      },
      { status: 500 }
    );
  }
}
