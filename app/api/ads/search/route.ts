import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdType } from "@prisma/client";

export async function GET(request: Request) {
  console.log("Request URL: ", request.url);

  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const query = searchParams.get("query")?.trim() || "";
  let category = searchParams.get("category") || "all";
  const brand = searchParams.get("brand") || "all-brands";
  let location = searchParams.get("location") || "sri-lanka";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 12);

  // Default filters
  let minPrice = 0;
  let maxPrice = 100000000;
  let minYear = 1930;
  let maxYear = new Date().getFullYear();

  const filters = query.toLowerCase().split("+");

  // Parse filters
  filters.forEach((filter) => {
    if (Object.values(AdType).includes(filter.toUpperCase() as AdType)) {
      if (category === "all") {
        category = filter;
      }
    } else if (filter.includes("in")) {
      const locParts = filter.split("in").map((part) => part.trim());
      if (locParts[1]) {
        location = locParts[1].replace(/\s+/g, "-");
      }
    } else if (!isNaN(Number(filter))) {
      const value = Number(filter);
      if (value >= 1930 && value <= maxYear) {
        minYear = value;
      } else if (value >= 0 && value <= maxPrice) {
        minPrice = value;
      }
    }
  });

  const [district, city] = location.split("-in-").map((part) => part.trim());

  // Construct the Prisma `where` filter
  const where: any = {
    posted: true,
    price: { gte: minPrice, lte: maxPrice },
    year: { gte: minYear, lte: maxYear },
  };

  if (category !== "all") {
    where.vehicleType = category.toUpperCase();
  }

  // Exclude the brand filter if "all-brands" is specified
  if (brand !== "all-brands") {
    where.brand = { equals: brand, mode: "insensitive" };
  }

  if (district && district !== "sri-lanka") {
    where.user = { userDistrict: district };
    if (city && city !== "all") {
      where.user.userCity = city;
    }
  }

  // Refine the query to avoid irrelevant model filters
  if (query) {
    const queryParts = query.split(" ");
    const possibleBrand = queryParts[0];
    const possibleModel = queryParts.slice(1).join(" ").trim();

    // Apply model filter only if it seems meaningful
    const modelFilter =
      possibleModel &&
      !possibleModel.toLowerCase().includes("in") && // Avoid irrelevant terms
      possibleModel.length > 2 // Ensure it's a valid model name
        ? { model: { contains: possibleModel, mode: "insensitive" } }
        : null;

    where.AND = [
      // Match the brand if not "all-brands"
      brand === "all-brands"
        ? {}
        : { brand: { contains: possibleBrand, mode: "insensitive" } },
      // Include model filter only if valid
      modelFilter || {},
    ].filter((condition) => Object.keys(condition).length > 0); // Remove empty conditions
  }

  console.log("Generated `where` filter: ", JSON.stringify(where, null, 2));

  try {
    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        include: {
          user: {
            select: {
              userDistrict: true,
              userCity: true,
            },
          },
          PromotedItem: true,
        },
        orderBy: [{ PromotedItem: { _count: "desc" } }, { postedAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ]);

    if (!ads.length) {
      console.warn("No results found for the provided query.");
    }

    return NextResponse.json({ ads, total, page, limit });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
