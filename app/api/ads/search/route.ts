import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Extract search parameters
  const type = url.searchParams.get("type") || undefined;
  const district = url.searchParams.get("district") || undefined;
  const city = url.searchParams.get("city") || undefined;
  const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(
    url.searchParams.get("maxPrice") || "100000000000"
  );
  const minYear = parseInt(url.searchParams.get("minYear") || "1980", 10);
  const maxYear = parseInt(url.searchParams.get("maxYear") || "2024", 10);
  const mainSearchTerm = url.searchParams.get("mainSearchTerm") || "";
  const modelSearchTerm = url.searchParams.get("modelSearchTerm") || "";
  const brand = url.searchParams.get("brand") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "12", 10);

  // Define the filters object for Prisma query
  const filters: any = {
    posted: true, // Only return posted ads
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
    year: {
      gte: minYear,
      lte: maxYear,
    },
  };

  // Conditional filters based on query params
  if (type) filters.vehicleType = type.toUpperCase();
  if (district && district !== "ALL") filters.user = { userDistrict: district };
  if (city && city !== "ALL")
    filters.user = { ...filters.user, userCity: city };
  if (brand) filters.brand = { contains: brand, mode: "insensitive" };

  // Search by main and model terms (partial match across brand, model, details)
  const searchTerms = (mainSearchTerm + " " + modelSearchTerm)
    .trim()
    .split(" ");
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
        PromotedItem: true, // To determine if the ad is promoted
        user: true, // Include user information for city and district
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        postedAt: "desc",
      },
    });

    // Format the ads data with promotion info, safely accessing `user` properties
    const processedAds = ads.map((ad) => ({
      ...ad,
      isFeatured: ad.PromotedItem.some((item) => item.featured),
      isPromoted: ad.PromotedItem.length > 0,
      userCity: ad.user?.userCity || null,
      userDistrict: ad.user?.userDistrict || null,
    }));

    // Count total ads for pagination
    const total = await prisma.ad.count({ where: filters });

    // Respond with ads and pagination info
    return NextResponse.json({
      ads: processedAds,
      total,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
