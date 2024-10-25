import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Import prisma client if configured in a separate file

// POST method to promote an ad
export async function POST(
  request: Request,
  { params }: { params: { adId: string } }
) {
  const { adId } = params;

  try {
    // Update the Ad model by associating it with the PromotedItem
    await prisma.promotedItem.create({
      data: {
        adId: parseInt(adId),
      },
    });

    return NextResponse.json({ message: "Ad promoted successfully!" });
  } catch (error) {
    console.error("Error promoting ad:", error);
    return NextResponse.json(
      { error: "Failed to promote ad" },
      { status: 500 }
    );
  }
}
