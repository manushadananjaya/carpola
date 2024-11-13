import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch the vehicle ad by ID and include promotion details
    const vehicle = await prisma.ad.findUnique({
      where: { adId: Number(id) },
      include: {
        user: true, // Include the associated user's information
        PromotedItem: {
          select: {
            featured: true, // Include if the ad is featured
          },
        },
      },
    });

    // If the vehicle ad is not found, return a 404 response
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    

    // Determine promotion status
    const promoted = vehicle.PromotedItem.length > 0;
    const featured = promoted
      ? vehicle.PromotedItem.some((item) => item.featured)
      : false;

    // Return the vehicle ad data with `promoted` and `featured` status
    const response = {
      ...vehicle,
      promoted,
      featured,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Error fetching vehicle" },
      { status: 500 }
    );
  }
}
