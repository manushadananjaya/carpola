import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await prisma.ad.findMany({
      where: {
        OR: [
          { brand: { contains: query, mode: "insensitive" } },
          { model: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        brand: true,
        model: true,
      },
      take: 5, // Limit results for performance
    });

    const formattedSuggestions = suggestions.map((suggestion) => ({
      label: `${suggestion.brand} ${suggestion.model}`,
    }));

    return NextResponse.json(formattedSuggestions);
  } catch (error) {
    console.error("Error fetching main search suggestions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
