import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure your prisma client is set up properly in lib/prisma.ts

// Function to sanitize strings by removing NULL bytes
function sanitizeString(input: string | null): string | null {
  if (!input) return input;
  return input.replace(/\0/g, ""); // Remove all NULL bytes
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

  

    // Extract the data fields for the ad
    const {
      price,
      brand,
      model,
      year,
      mileage,
      type, // AdType Enum: CAR, VAN, JEEP, LORRY, BIKE, CREWCAB, PICKUP, etc.
      engineCC,
      details,
      userId, // Foreign key referencing User
      images, // Array of images (assume you send an array from the frontend)
      gearType, // Only for relevant vehicles
      fuelType, // Only for relevant vehicles
      startType, // Only for bikes
      bikeType, // Only for bikes
    } = body;

    const parsedUserId = parseInt(userId, 10);

    // Sanitize image strings
    const sanitizedImages =
      images?.map((img: string) => sanitizeString(img)) || [];

    // Determine if the type is a vehicle that should include gearType and fuelType
    const isVehicleWithGearAndFuel = [
      "CAR",
      "VAN",
      "JEEP",
      "LORRY",
      "CREWCAB",
      "PICKUP",
      "BUS",
      "TRUCK",
      "THREEWHEEL",
      "TRACTOR",
      "HEAVYDUTY",
    ].includes(type);

    // Create a new ad using Prisma
    const ad = await prisma.ad.create({
      data: {
        price,
        brand: sanitizeString(brand) || "",
        model: sanitizeString(model) ?? "",
        year,
        mileage,
        vehicleType: type,
        engine: engineCC,
        details: sanitizeString(details) || null,
        posted: false,
        user: {
          connect: { userId: parsedUserId }, // Connect to an existing user by userId
        },
        images: sanitizedImages, // Store all images in the array field
        gear: isVehicleWithGearAndFuel ? gearType : null, // Only include if it's a relevant vehicle
        fuelType: isVehicleWithGearAndFuel ? fuelType : null, // Only include if it's a relevant vehicle
        startType: type === "BIKE" ? startType : null, // Only include if it's a bike
        bikeType: type === "BIKE" ? bikeType : null, // Only include if it's a bike
      },
    });

    // Return the newly created ad as a JSON response
    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
