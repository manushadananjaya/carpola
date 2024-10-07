// app/api/vehicles/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Assuming prisma is set up in /lib/prisma

// POST /api/vehicles
export async function POST(req: Request) {
  try {
    const {
      contactNo,
      price,
      brand,
      model,
      year,
      mileage,
      gear,
      fuelType,
      options,
      engine,
      details,
      posted,
    } = await req.json();

    // Create the vehicle record in the database
    const vehicle = await prisma.vehicle.create({
      data: {
        contactNo,
        price: parseFloat(price),
        brand,
        model,
        year: parseInt(year),
        mileage: parseInt(mileage),
        gear,
        fuelType,
        options,
        engine,
        details,
        posted: posted || false, // Defaults to false if not provided
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Unable to create vehicle" },
      { status: 500 }
    );
  }
}

// GET /api/vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        posted: true,  // Only fetch vehicles that are posted
      },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Unable to fetch vehicles' }, { status: 500 });
  }
}