import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email"; // import the email helper

export async function POST(req: Request) {
  try {
    const { username, email, phone, city, password, district } =
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
      where: { userEmail: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", error: "User already exists" },
        { status: 409 }
      );
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Store user with verification token, but set `isVerified` to false
    const user = await prisma.user.create({
      data: {
        username,
        userEmail: email,
        userPhone: phone,
        userCity: city,
        userDistrict: district,
        password: hashedPassword,
        isOnboarded: false,
        isVerified: false,
        verificationToken,
      },
    });

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: "Verification email sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
