import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Assuming you have prisma set up in lib/prisma.ts

// This function handles the DELETE request for deleting an ad
export async function DELETE(
  request: Request,
  { params }: { params: { adId: string } }
) {
  const adId = parseInt(params.adId);

  try {
    // Delete the ad from the database
    const deletedAd = await prisma.ad.delete({
      where: { adId },
    });

    return NextResponse.json({ message: "Ad deleted successfully", deletedAd });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
