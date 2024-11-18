import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AdType,
  GearType,
  FuelType,
  StartType,
  BikeType,
} from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Extract search parameters
  const category = url.searchParams.get("category") as AdType | null;
  const brand = url.searchParams.get("brand") || undefined;
  const district = url.searchParams.get("district") || undefined;
  const city = url.searchParams.get("city") || undefined;
  const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(
    url.searchParams.get("maxPrice") || "100000000000"
  );
  const minYear = parseInt(url.searchParams.get("minYear") || "1980", 10);
  const maxYear = parseInt(url.searchParams.get("maxYear") || "2024", 10);
  const query = url.searchParams.get("query") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "12", 10);
  const gear = url.searchParams.get("gear") as GearType | null;
  const fuelType = url.searchParams.get("fuelType") as FuelType | null;
  const startType = url.searchParams.get("startType") as StartType | null;
  const bikeType = url.searchParams.get("bikeType") as BikeType | null;

  // Define the filters object for Prisma query
  const filters: any = {
    posted: true,
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
    year: {
      gte: minYear,
      lte: maxYear,
    },
  };

  // Apply vehicle category filter if specified
  if (category) filters.vehicleType = category;

  // Apply brand filter if specified
  if (brand) filters.brand = { contains: brand, mode: "insensitive" };

  // Apply district and city filters
  if (district && district !== "ALL") filters.user = { userDistrict: district };
  if (city && city !== "ALL") {
    filters.user = { ...filters.user, userCity: city };
  }

  // Apply gear, fuelType, startType, and bikeType filters
  if (gear) filters.gear = gear;
  if (fuelType) filters.fuelType = fuelType;
  if (startType) filters.startType = startType;
  if (bikeType) filters.bikeType = bikeType;

  // Handle general search queries across multiple fields
  const searchTerms = query.trim().split(" ");
  if (searchTerms.length > 0 && searchTerms[0] !== "") {
    filters.AND = searchTerms.map((term) => ({
      OR: [
        { brand: { contains: term, mode: "insensitive" } },
        { model: { contains: term, mode: "insensitive" } },
        { details: { contains: term, mode: "insensitive" } },
      ],
    }));
  }

  try {
    // Fetch ads with applied filters and pagination
    const ads = await prisma.ad.findMany({
      where: filters,
      include: {
        PromotedItem: true,
        user: {
          select: {
            userCity: true,
            userDistrict: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [
        {
          PromotedItem: {
            _count: "desc",
          },
        },
        {
          postedAt: "desc",
        },
      ],
    });

    // Count total ads for pagination
    const totalAds = await prisma.ad.count({ where: filters });
    const totalPages = Math.ceil(totalAds / limit);

    // Format the ads data with promotion info
    const processedAds = ads.map((ad) => ({
      ...ad,
      isFeatured: ad.PromotedItem.some((item) => item.featured),
      isPromoted: ad.PromotedItem.length > 0,
      userCity: ad.user.userCity,
      userDistrict: ad.user.userDistrict,
    }));

    // Respond with ads and pagination info
    return NextResponse.json({
      ads: processedAds,
      total: totalAds,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
