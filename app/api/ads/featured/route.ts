import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to match your Prisma client location

// GET method to fetch all promoted ads
export async function GET() {
  try {
    // Fetch all promoted items from the database
    const featuredItems = await prisma.featuredItem.findMany({
      include: {
        ad: {
          include: {
            user: true, // Include user details related to each ad
          },
        },
      },
    });

    return NextResponse.json(featuredItems);
  } catch (error) {
    console.error("Error fetching promoted items:", error);
    return NextResponse.json(
      { error: "Failed to retrieve promoted items" },
      { status: 500 }
    );
  }
}
