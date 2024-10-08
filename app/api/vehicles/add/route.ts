import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newVehicle = await prisma.vehicle.create({
      data: {
        contactNo: body.contactNo,
        price: body.price,
        brand: body.brand,
        model: body.model,
        year: body.year,
        mileage: body.mileage,
        gear: body.gear,
        fuelType: body.fuelType,
        engine: body.engine,
        details: body.details,
        posted: body.posted ?? true,
        userId: body.userId,
      },
    });

    return NextResponse.json(newVehicle);
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding vehicle" },
      { status: 500 }
    );
  }
}
