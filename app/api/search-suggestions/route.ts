import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  // Check if the query is valid
  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  const queryParts = query
    .trim()
    .split(" ")
    .map((part) => part.toLowerCase());

  try {
    const suggestions = await prisma.ad.findMany({
      where: {
        AND: queryParts.map((part) => ({
          OR: [
            { brand: { contains: part, mode: "insensitive" } },
            { model: { contains: part, mode: "insensitive" } },
          ],
        })),
      },
      select: {
        brand: true,
        model: true,
      },
      take: 5, // Limit results to optimize performance
    });

    // Format the suggestions with a label field
    const formattedSuggestions = suggestions.map((suggestion) => ({
      label: `${suggestion.brand} ${suggestion.model} `,
    }));

    return NextResponse.json(formattedSuggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
