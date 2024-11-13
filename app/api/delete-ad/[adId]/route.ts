import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client
import { v2 as cloudinary } from "cloudinary"; // Cloudinary SDK

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to extract the public_id from Cloudinary URL
const extractPublicIdFromUrl = (url: string) => {
  const parts = url.split("/");
  const fileWithExtension = parts.pop(); // e.g. 'image_id.jpg'
  const fileName = fileWithExtension?.split(".")[0]; // Remove the file extension
  // Check for and remove the version number (it starts with 'v' followed by digits)
  const versionRegex = /^v\d+/;
  const lastPart = parts.pop();
  if (lastPart && versionRegex.test(lastPart)) { // Check if lastPart is defined
    // Ignore version part, get the real public_id
    return fileName;
  } else {
    // Combine folder path (if any) with fileName
    return lastPart + "/" + fileName;
  }
};


// DELETE function to handle the deletion of an ad and its images
export async function DELETE(
  request: Request,
  { params }: { params: { adId: string } }
) {
  const adId = parseInt(params.adId);

  try {
    // Fetch the ad to get associated images
    const ad = await prisma.ad.findUnique({
      where: { adId },
      include: {
        PromotedItem: true,
      },
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Deleting the images from Cloudinary
    if (ad.images && ad.images.length > 0) {
   

      // Map the images to extract public_id and delete them
      const deletePromises = ad.images.map((imageUrl) => {
        const publicId = extractPublicIdFromUrl(imageUrl);
       
        if (publicId) { // Add null check
          return cloudinary.uploader.destroy(publicId);
        }
      });

      await Promise.all(deletePromises);
    }

    // Deleting related PromotedItem and FeaturedItem records (optional, if needed)
    await prisma.promotedItem.deleteMany({
      where: { adId: adId },
    });

    // Delete the ad from the database
    const deletedAd = await prisma.ad.delete({
      where: { adId },
    });

    return NextResponse.json({
      message: "Ad and images deleted successfully",
      deletedAd,
    });
  } catch (error) {
    console.error("Error deleting ad and images:", error);
    return NextResponse.json(
      { error: "Failed to delete ad or images" },
      { status: 500 }
    );
  }
}
