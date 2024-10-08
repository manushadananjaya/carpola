import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const featuredVehicles = await prisma.featuredItem.findMany({
    where: { vehicleId: { not: null } },
    include: {
      vehicle: {
        include: {
          user: true,
        },
      },
    },
  });

  return NextResponse.json(
    featuredVehicles
      .filter((item) => item.vehicle !== null) 
      .map((item) => ({
        vehicleId: item.vehicle?.vehicleId,
        model: item.vehicle?.model,
        price: item.vehicle?.price,
        brand: item.vehicle?.brand,
        year: item.vehicle?.year,
        postedAt: item.vehicle?.postedAt,
        image1: item.vehicle?.image1,
        user: {
          userCity: item.vehicle?.user?.userCity,
        },
      }))
  );
}
