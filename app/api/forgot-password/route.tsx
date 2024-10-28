import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { userEmail: email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate token and expiration
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

  // Update user with reset token and expiration date
  await prisma.user.update({
    where: { userEmail: email },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    },
  });

  // Construct the password reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  // Configure Nodemailer with Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Send the email
  try {
    await transporter.sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });


    return NextResponse.json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
