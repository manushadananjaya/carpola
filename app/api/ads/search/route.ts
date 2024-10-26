import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this points to your Prisma client instance

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
      price:
        parsedMinPrice || parsedMaxPrice
          ? {
              gte: parsedMinPrice,
              lte: parsedMaxPrice,
            }
          : undefined,
      year:
        parsedMinYear || parsedMaxYear
          ? {
              gte: parsedMinYear,
              lte: parsedMaxYear,
            }
          : undefined,
      OR: searchTerm
        ? [
            { brand: { contains: searchTerm, mode: "insensitive" } },
            { model: { contains: searchTerm, mode: "insensitive" } },
          ]
        : undefined,
      posted: true, // Only fetch posted ads
    };

    // User filter is created separately to handle cases where both district and city might be "ALL"
    const userFilter: any = {
      userDistrict: district !== "ALL" ? district : undefined,
      userCity: city !== "ALL" ? city : undefined,
    };

    // Remove undefined properties from the user filter
    Object.keys(userFilter).forEach(
      (key) => userFilter[key] === undefined && delete userFilter[key]
    );

    // Include the user filter only if it has valid entries
    if (Object.keys(userFilter).length > 0) {
      filters.user = userFilter;
    }

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === undefined ||
          (typeof filters[key] === "object" &&
            Object.keys(filters[key]).length === 0)) &&
        delete filters[key]
    );

    // Log filters to debug
    console.log("Filters applied:", filters);

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
