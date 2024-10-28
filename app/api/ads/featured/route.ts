import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Adjust the path to match your Prisma client location

// GET method to fetch all featured ads
export async function GET() {
  try {
    // Fetch all featured items from the database
    const featuredItems = await prisma.promotedItem.findMany({
      where: {
        featured: true,
        promotionExpiresAt: {
          gt: new Date(), // Ensure promotions are still active
        },
      },
      include: {
        ad: {
          include: {
            user: true, // Include user details related to each ad
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Sort by createdAt in ascending order
      },
    });

    return NextResponse.json(featuredItems);
  } catch (error) {
    console.error("Error fetching featured items:", error);
    return NextResponse.json(
      { error: "Failed to retrieve featured items" },
      { status: 500 }
    );
  }
}
