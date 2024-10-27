// src/app/api/ads/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { postedAt: "desc" },
      include: { user: true },
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
