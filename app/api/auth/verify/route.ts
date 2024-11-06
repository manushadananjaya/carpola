import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Invalid or missing token" },
      { status: 400 }
    );
  }

  // Find user by the verification token
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  // Update user status to verified and remove the token
  await prisma.user.update({
    where: { userId: user.userId },
    data: { isVerified: true, verificationToken: null },
  });

  // Redirect to the thank you page after successful verification
  const thankYouPageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`; // Adjust this to your actual thank-you page URL
  return NextResponse.redirect(thankYouPageUrl);
}
