import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Ensure this points to your Prisma client instance

// This handles the GET request for ads
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const district = searchParams.get("district");
  const city = searchParams.get("city");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const searchTerm = searchParams.get("searchTerm");

  try {
    // Convert query parameters to appropriate types
    const parsedMinPrice = minPrice ? parseInt(minPrice, 10) : undefined;
    const parsedMaxPrice = maxPrice ? parseInt(maxPrice, 10) : undefined;
    const parsedMinYear = minYear ? parseInt(minYear, 10) : undefined;
    const parsedMaxYear = maxYear ? parseInt(maxYear, 10) : undefined;

    // Construct filters dynamically
    const filters: any = {
      vehicleType: type !== "ALL" ? type : undefined, // If "ALL", ignore filter
      price: {
        gte: parsedMinPrice,
        lte: parsedMaxPrice,
      },
      year: {
        gte: parsedMinYear,
        lte: parsedMaxYear,
      },
      OR: searchTerm
        ? [
            { brand: { contains: searchTerm, mode: "insensitive" } },
            { model: { contains: searchTerm, mode: "insensitive" } },
          ]
        : undefined,
      user: {
        userDistrict: district !== "ALL" ? district : undefined, // If "ALL", ignore filter
        userCity: city !== "ALL" ? city : undefined, // If "ALL", ignore filter
      },
      posted: true, // Only fetch posted ads
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === undefined ||
          (typeof filters[key] === "object" &&
            Object.keys(filters[key]).length === 0)) &&
        delete filters[key]
    );

    if (filters.user) {
      Object.keys(filters.user).forEach(
        (key) =>
          filters.user[key as keyof typeof filters.user] === undefined &&
          delete filters.user[key as keyof typeof filters.user]
      );
    }

    const ads = await prisma.ad.findMany({
      where: filters,
      select: {
        adId: true,
        price: true,
        brand: true,
        model: true,
        year: true,
        mileage: true,
        vehicleType: true,
        images: true,
        user: {
          select: {
            userCity: true,
            userDistrict: true,
          },
        },
      },
      orderBy: {
        postedAt: "desc", // Order by most recently posted ads
      },
    });

    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
