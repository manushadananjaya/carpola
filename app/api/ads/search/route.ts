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
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    // Parse query parameters
    const parsedMinPrice = minPrice ? parseInt(minPrice, 10) : undefined;
    const parsedMaxPrice = maxPrice ? parseInt(maxPrice, 10) : undefined;
    const parsedMinYear = minYear ? parseInt(minYear, 10) : undefined;
    const parsedMaxYear = maxYear ? parseInt(maxYear, 10) : undefined;

    // Define valid vehicle types
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

    const vehicleTypeFilter =
      type &&
      validVehicleTypes.includes(type as (typeof validVehicleTypes)[number])
        ? type
        : undefined;

    const searchTerms = searchTerm ? searchTerm.trim().split(/\s+/) : [];

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
      OR:
        searchTerms.length > 0
          ? searchTerms.map((term) => ({
              OR: [
                { brand: { contains: term, mode: "insensitive" } },
                { model: { contains: term, mode: "insensitive" } },
              ],
            }))
          : undefined,
      posted: true,
    };

    const userFilter: any = {
      userDistrict: district !== "ALL" ? district : undefined,
      userCity: city !== "ALL" ? city : undefined,
    };

    if (Object.values(userFilter).some((val) => val !== undefined)) {
      filters.user = userFilter;
    }

    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === undefined ||
          (typeof filters[key] === "object" &&
            Object.keys(filters[key]).length === 0)) &&
        delete filters[key]
    );

    const totalAds = await prisma.ad.count({ where: filters });

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
        user: { select: { userCity: true, userDistrict: true } },
        PromotedItem: { select: { featured: true, promotionExpiresAt: true } },
      },
      orderBy: { postedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const adsWithPromotionStatus = ads.map((ad) => ({
      ...ad,
      isPromoted: ad.PromotedItem.length > 0,
      isFeatured: ad.PromotedItem.some((item) => item.featured),
      promotionExpiresAt:
        ad.PromotedItem.length > 0
          ? ad.PromotedItem[0].promotionExpiresAt
          : null,
    }));

    return NextResponse.json(
      { ads: adsWithPromotionStatus, total: totalAds },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
