// src/app/api/ads/[id]/reject/route.ts
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any, { params }: any) {
  try {
    const { id } = params;
    await prisma.ad.delete({
      where: { adId: Number(id) },
    });
    return NextResponse.json({ message: "Ad rejected and deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject ad" }, { status: 500 });
  }
}
