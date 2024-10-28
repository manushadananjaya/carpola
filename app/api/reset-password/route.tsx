import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { token, password } = await request.json();

  // Find the user by reset token and check if the token is still valid
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // Hash the new password and update the user
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return NextResponse.json({ message: "Password reset successful" });
}
