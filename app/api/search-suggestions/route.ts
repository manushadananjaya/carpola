import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdType } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const brand = searchParams.get("brand") || "";
  const type = searchParams.get("type") || "";

  // Minimum length check for query to avoid excessive DB calls
  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Construct filter object conditionally
    const filters: any = {
      model: {
        contains: query,
        mode: "insensitive",
      },
      ...(brand && { brand: { contains: brand, mode: "insensitive" } }),
      ...(type && type !== "ALL" && { vehicleType: type as AdType }),
    };

    // Database query to find matching models
    const suggestions = await prisma.ad.findMany({
      where: filters,
      select: {
        model: true,
      },
      distinct: ["model"],
      take: 10, // Limit suggestions
    });

    const uniqueSuggestions = suggestions.map((item) => item.model);

    return NextResponse.json(uniqueSuggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
