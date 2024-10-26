import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions); // Fetch the session

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
      where: { userEmail: userEmail! },
      include: {
        ads: {
          include: {
            PromotedItem: true, // Include PromotedItem to check promotion status
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const ads = user.ads.map((ad) => {
      const isPromoted = ad.PromotedItem.some(
        (promo) => promo.promotionExpiresAt > new Date()
      );

      const isFeatured = ad.PromotedItem.some(
        (promo) => promo.featured && promo.promotionExpiresAt > new Date()
      );

      return {
        id: ad.adId.toString(),
        title: ad.brand + " " + ad.model,
        price: ad.price,
        status: ad.posted ? "approved" : "under review",
        imageUrl: ad.images[0] || "/placeholder.jpg",
        promoted: isPromoted,
        featured: isFeatured,
      };
    });

    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { message: "Failed to load ads" },
      { status: 500 }
    );
  }
}
