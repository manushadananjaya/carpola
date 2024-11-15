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

  // Email HTML template as a string
  const generatePasswordResetEmailHtml = (resetUrl: string): string => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; background-color: #f8f8f8; text-align: center;">
            <h1 style="color: #444; margin: 0;">Password Reset Request</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <p>Hello,</p>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 20px; margin-bottom: 20px;">
              <tr>
                <td style="text-align: center;">
                  <a href="${resetUrl}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                    Reset Your Password
                  </a>
                </td>
              </tr>
            </table>
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            <p>This password reset link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request a password reset, please contact our support team immediately.</p>
            <p>Best regards,<br />Your Support Team</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; background-color: #f8f8f8; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
  };


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
      html: generatePasswordResetEmailHtml(resetUrl),
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
