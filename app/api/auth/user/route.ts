import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    

    const session = await getServerSession(authOptions);

    // If the user is not authenticated, return an error
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }



    const { username, userEmail, userPhone, userDistrict, userCity } =
      await req.json();

    // Update user data in the database using the fields from the request
    const updatedUser = await prisma.user.update({
      where: { userEmail: session.user.email ?? "" }, // Assuming the user is identified by their email
      data: {
        username,
        userEmail,
        userPhone,
        userDistrict,
        userCity,
      },
    });

    // Update session data after successful database update
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        username: updatedUser.username,
        email: updatedUser.userEmail,
        userPhone: updatedUser.userPhone,
        district: updatedUser.userDistrict,
        city: updatedUser.userCity,
      },
    };

    return NextResponse.json(
      { message: "Profile updated successfully.", user: updatedSession },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
