import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import your Prisma client instance
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import { getSession } from "next-auth/react"; // Import getSession to update the session

// Function to handle POST requests for user registration
export async function POST(req: Request) {
  try {
    const { username, email, phone, city, password, district, isOnboarded } =
      await req.json();

    // Validate required fields, password is optional for Google sign-in
    if (!username || !email || !phone || !city || !district) {
      return NextResponse.json(
        { message: "All fields except password are required" },
        { status: 400 }
      );
    }

    // Check if the user with the same email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userEmail: email }, { userPhone: phone }],
      },
    });

    if (existingUser) {
      // Update the existing user's information if they already exist (useful for Google sign-in)
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

    let hashedPassword = null;

    // If password is provided (non-Google sign-in), hash it
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new user with or without password
    const newUser = await prisma.user.create({
      data: {
        username,
        userEmail: email,
        userPhone: phone,
        userCity: city,
        userDistrict: district,
        password: hashedPassword, // This will be null if no password is provided
        isOnboarded, // Set to true if profile is completed
      },
    });

    // Sign the user in immediately using credentials if a password was provided
    if (password) {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password, // Use the raw password here for validation
      });

      if (result?.error) {
        console.log(result.error);
        return NextResponse.json(
          { message: "Error creating session after registration" },
          { status: 500 }
        );
      }
    }

    // Get the session after sign-in to update it
    const session = await getSession();

    // Return a success response
    return NextResponse.json(
      { message: "User registered successfully", user: newUser, session },
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
