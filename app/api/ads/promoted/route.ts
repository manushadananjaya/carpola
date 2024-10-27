import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this path correctly matches your setup

// GET method to fetch all promoted ads with related ad and user information
export async function GET() {
  try {
    // Fetch all promoted items from the database, including ad and user details
    const promotedItems = await prisma.promotedItem.findMany({
      include: {
        ad: {
          include: {
            user: true, // Include user details related to each ad
          },
        },
      },
    });

    return NextResponse.json(promotedItems);
  } catch (error) {
    console.error("Error fetching promoted items:", error);
    return NextResponse.json(
      { error: "Failed to retrieve promoted items" },
      { status: 500 }
    );
  }
}
