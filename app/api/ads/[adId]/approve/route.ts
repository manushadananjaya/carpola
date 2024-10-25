// src/app/api/ads/[id]/approve/route.ts
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any, { params }: any) {
  try {
    const { id } = params;
    const updatedAd = await prisma.ad.update({
      where: { adId: Number(id) },
      data: { posted: true },
    });
    return NextResponse.json(updatedAd);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to approve ad" },
      { status: 500 }
    );
  }
}
