import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([], { status: 200 }); // Return empty array if query is too short
  }

  // Split the query into brand and model parts
  const keywords = query.split(" ").filter((word) => word.length > 0);
  const brandKeyword = keywords[0]; // First word as brand
  const modelKeywords = keywords.slice(1).join(" "); // Remaining words as model

  try {
    const suggestions = await prisma.ad.findMany({
      where: {
        brand: { contains: brandKeyword, mode: "insensitive" }, // Match brand with the first keyword
        model: { contains: modelKeywords, mode: "insensitive" }, // Match model with remaining keywords
      },
      select: {
        brand: true,
        model: true,
      },
      distinct: ["brand", "model"],
      take: 10, // Limit the number of suggestions returned
    });

    // Format suggestions to include both brand and model combinations
    const formattedSuggestions = suggestions.map((suggestion) => ({
      label: `${suggestion.brand} ${suggestion.model}`,
    }));

    return NextResponse.json(formattedSuggestions, { status: 200 });
  } catch (error) {
    console.error(
      `Error fetching search suggestions for query "${query}":`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
