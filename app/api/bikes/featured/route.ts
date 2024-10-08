import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featuredBikes = await prisma.featuredItem.findMany({
      where: { bikeId: { not: null } },
      include: {
        bike: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      featuredBikes.map((item) => ({
        bikeId: item.bike?.bikeId,
        model: item.bike?.model,
        price: item.bike?.price,
        brand: item.bike?.brand,
        year: item.bike?.year,
        postedAt: item.bike?.postedAt,
        image1: item.bike?.image1,
        user: {
          userCity: item.bike?.user?.userCity,
        },
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching featured bikes" },
      { status: 500 }
    );
  }
}
