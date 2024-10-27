// src/app/api/ads/pending/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingAds = await prisma.ad.findMany({
      where: { posted: true },
      include: { user: true },
    });
    return NextResponse.json(pendingAds);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pending ads" },
      { status: 500 }
    );
  }
}
