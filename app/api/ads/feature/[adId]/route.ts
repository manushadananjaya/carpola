import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Import prisma client if configured in a separate file

// POST method to feature an ad
export async function POST(
  request: Request,
  { params }: { params: { adId: string } }
) {
  const { adId } = params;

  try {
    // Update the Ad model by associating it with the FeaturedItem
    await prisma.featuredItem.create({
      data: {
        adId: parseInt(adId),
      },
    });

    return NextResponse.json({ message: "Ad featured successfully!" });
  } catch (error) {
    console.error("Error featuring ad:", error);
    return NextResponse.json(
      { error: "Failed to feature ad" },
      { status: 500 }
    );
  }
}
