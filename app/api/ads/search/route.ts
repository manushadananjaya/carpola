// app/api/ads/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Ensure Prisma is correctly imported
import { AdType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Extract query parameters
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
  const brand = url.searchParams.get("brand") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  console.log({
    type,
    district,
    city,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    mainSearchTerm,
    modelSearchTerm,
    brand,
    page,
    limit,
  });

  try {
    const ads = await prisma.ad.findMany({
      where: {
        posted: true,
        price: { gte: minPrice, lte: maxPrice },
        year: { gte: minYear, lte: maxYear },
        vehicleType: type ? { equals: type as AdType } : undefined,
        brand: brand ? { contains: brand, mode: "insensitive" } : undefined,
        model: modelSearchTerm
          ? { contains: modelSearchTerm, mode: "insensitive" }
          : undefined,
        user: {
          is: {
            userDistrict: district
              ? { equals: district, mode: "insensitive" }
              : undefined,
            userCity: city ? { equals: city, mode: "insensitive" } : undefined,
          },
        },
        OR: mainSearchTerm
          ? [
              { brand: { contains: mainSearchTerm, mode: "insensitive" } },
              { model: { contains: mainSearchTerm, mode: "insensitive" } },
            ]
          : undefined,
      },
      skip,
      take: limit,
      include: { PromotedItem: true },
      orderBy: { postedAt: "desc" },
    });

    const total = await prisma.ad.count({
      where: {
        posted: true,
        price: { gte: minPrice, lte: maxPrice },
        year: { gte: minYear, lte: maxYear },
        vehicleType: type ? { equals: type as AdType } : undefined,
        brand: brand ? { contains: brand, mode: "insensitive" } : undefined,
        model: modelSearchTerm
          ? { contains: modelSearchTerm, mode: "insensitive" }
          : undefined,
        user: {
          is: {
            userDistrict: district
              ? { equals: district, mode: "insensitive" }
              : undefined,
            userCity: city ? { equals: city, mode: "insensitive" } : undefined,
          },
        },
        OR: mainSearchTerm
          ? [
              { brand: { contains: mainSearchTerm, mode: "insensitive" } },
              { model: { contains: mainSearchTerm, mode: "insensitive" } },
            ]
          : undefined,
      },
    });

    const processedAds = ads.map((ad) => ({
      ...ad,
      isFeatured: ad.PromotedItem?.some((item) => item.featured) || false,
      isPromoted: ad.PromotedItem?.length > 0 || false,
    }));

    const sortedAds = processedAds.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      return 0;
    });

    console.log({ ads: sortedAds, total });
    return NextResponse.json({ ads: sortedAds, total });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Error fetching ads" }, { status: 500 });
  }
}
