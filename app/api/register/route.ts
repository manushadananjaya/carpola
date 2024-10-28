import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, email, phone, city, password, district, isOnboarded } =
      await req.json();

    // Validate required fields
    if (!username || !email || !phone || !city || !district) {
      return NextResponse.json(
        { message: "All fields except password are required" },
        { status: 400 }
      );
    }

    // Check if the user with the same email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userEmail: email }],
      },
    });

    if (existingUser) {
      if (password) {
        return NextResponse.json(
          { message: "User-already-exists", error: "User-already-exists" },
          { status: 409 }
        );
      }

      // For Google sign-in, update the existing user's profile
      const updatedUser = await prisma.user.update({
        where: { userEmail: email },
        data: {
          username,
          userPhone: phone,
          userCity: city,
          userDistrict: district,
          isOnboarded: true,
        },
      });

      return NextResponse.json(
        { message: "User profile updated successfully", user: updatedUser },
        { status: 200 }
      );
    }

    // If a password is provided, hash it
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        userEmail: email,
        userPhone: phone,
        userCity: city,
        userDistrict: district,
        password: hashedPassword, // Set password as null if not provided
        isOnboarded,
      },
    });

    // Return success response, handle sign-in on client-side
    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
