// app/api/featured-ads/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Ensure Prisma client is imported correctly

export async function GET() {
  try {
    // Fetch featured ads from the database
    const featuredAds = await prisma.ad.findMany({
      where: {
        posted: true,
        PromotedItem: {
          some: {
            featured: true,
          },
        },
      },
      include: {
        user: {
          select: {
            userDistrict: true,
            userCity: true,
          },
        },
        PromotedItem: true,
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    return NextResponse.json(featuredAds);
  } catch (error) {
    console.error("Failed to fetch featured ads:", error);
    return NextResponse.json(
      { error: "Failed to load featured ads." },
      { status: 500 }
    );
  }
}
