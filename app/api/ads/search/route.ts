import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    // Parse query parameters to appropriate types
    const parsedMinPrice = minPrice ? parseInt(minPrice, 10) : undefined;
    const parsedMaxPrice = maxPrice ? parseInt(maxPrice, 10) : undefined;
    const parsedMinYear = minYear ? parseInt(minYear, 10) : undefined;
    const parsedMaxYear = maxYear ? parseInt(maxYear, 10) : undefined;

    // Valid vehicle types
    const validVehicleTypes = [
      "CAR",
      "VAN",
      "JEEP",
      "LORRY",
      "BIKE",
      "CREWCAB",
      "PICKUP",
      "BUS",
      "TRUCK",
      "THREEWHEEL",
      "TRACTOR",
      "HEAVYDUTY",
      "OTHER",
    ] as const;

    // Ensure `type` parameter is a valid enum value
    const vehicleTypeFilter =
      type &&
      validVehicleTypes.includes(type as (typeof validVehicleTypes)[number])
        ? type
        : undefined;

    // Split search term into brand and model
    const searchTerms = searchTerm ? searchTerm.trim().split(" ") : [];
    const brandKeyword = searchTerms[0];
    const modelKeywords = searchTerms.slice(1).join(" ");

    // Construct main filters for ads
    const filters: any = {
      vehicleType: vehicleTypeFilter,
      price:
        parsedMinPrice || parsedMaxPrice
          ? { gte: parsedMinPrice, lte: parsedMaxPrice }
          : undefined,
      year:
        parsedMinYear || parsedMaxYear
          ? { gte: parsedMinYear, lte: parsedMaxYear }
          : undefined,
      OR: searchTerm
        ? [
            { brand: { contains: brandKeyword, mode: "insensitive" } },
            modelKeywords && {
              model: { contains: modelKeywords, mode: "insensitive" },
            },
          ].filter(Boolean)
        : undefined,
      posted: true, // Only fetch posted ads
    };

    // Construct nested user filters if district or city specified
    const userFilter: any = {
      userDistrict: district !== "ALL" ? district : undefined,
      userCity: city !== "ALL" ? city : undefined,
    };

    // Add user filters to main filter if there are any user-specific criteria
    if (Object.values(userFilter).some((val) => val !== undefined)) {
      filters.user = userFilter;
    }

    // Remove undefined or empty filters from `filters` object
    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === undefined ||
          (typeof filters[key] === "object" &&
            Object.keys(filters[key]).length === 0)) &&
        delete filters[key]
    );

    console.log("Filters applied:", filters);

    // Fetch ads with the specified filters
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
        PromotedItem: {
          select: {
            featured: true,
            promotionExpiresAt: true,
          },
        },
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    // Format ads with promotion details
    const adsWithPromotionStatus = ads.map((ad) => ({
      ...ad,
      isPromoted: ad.PromotedItem.length > 0,
      isFeatured: ad.PromotedItem.some((item) => item.featured),
      promotionExpiresAt:
        ad.PromotedItem.length > 0
          ? ad.PromotedItem[0].promotionExpiresAt
          : null,
    }));

    return NextResponse.json(adsWithPromotionStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
