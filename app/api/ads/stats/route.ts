import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Import Prisma client

export async function GET() {
  try {
    const pendingCount = await prisma.ad.count({
      where: {
        posted: false,
        PromotedItem: { none: {} },
        FeaturedItem: { none: {} },
      },
    });

    const approvedCount = await prisma.ad.count({
      where: {
        posted: true,
        PromotedItem: { none: {} },
        FeaturedItem: { none: {} },
      },
    });

    const promotedCount = await prisma.promotedItem.count();

    const featuredCount = await prisma.featuredItem.count();

    return NextResponse.json({
      pending: pendingCount,
      approved: approvedCount,
      promoted: promotedCount,
      featured: featuredCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.error();
  }
}
