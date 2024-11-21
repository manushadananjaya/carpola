import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log("Fetching vehicle ad with ID:", id);

  try {
    const vehicle = await prisma.ad.findUnique({
      where: { adId: Number(id) },
      include: {
        user: true,
        PromotedItem: {
          select: {
            featured: true,
            promotionExpiresAt: true,
          },
        },
      },
    });

    if (!vehicle) {
      console.error("Vehicle not found:", id);
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Determine if the ad is promoted and featured
    const promoted = vehicle.PromotedItem.length > 0;
    const featured = promoted
      ? vehicle.PromotedItem.some(
          (item) =>
            item.featured && new Date(item.promotionExpiresAt) > new Date() // Check if promotion is still valid
        )
      : false;

    // Construct the response
    const response = {
      adId: vehicle.adId,
      price: vehicle.price,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      vehicleType: vehicle.vehicleType,
      engine: vehicle.engine,
      details: vehicle.details,
      posted: vehicle.posted,
      postedAt: vehicle.postedAt,
      images: vehicle.images,
      gear: vehicle.gear,
      fuelType: vehicle.fuelType,
      startType: vehicle.startType,
      bikeType: vehicle.bikeType,
      user: {
        userId: vehicle.user.userId,
        username: vehicle.user.username,
        userEmail: vehicle.user.userEmail,
        userPhone: vehicle.user.userPhone,
        userCity: vehicle.user.userCity,
        userDistrict: vehicle.user.userDistrict,
      },
      promoted,
      featured,
    };

    console.log("Returning vehicle data:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Error fetching vehicle" },
      { status: 500 }
    );
  }
}
