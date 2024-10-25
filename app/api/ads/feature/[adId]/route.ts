import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { adId } = req.query;

  if (req.method === "POST") {
    try {
      // Check if the ad is already featured
    const existingFeature = await prisma.featuredItem.findUnique({
        where: {
            id: Number(adId), // Add the 'id' property
        },
    });

    if (existingFeature) {
        return res.status(400).json({ message: "Ad is already featured" });
    }

      // Feature the ad by adding an entry in the FeaturedItem table
      await prisma.featuredItem.create({
        data: {
          adId: Number(adId),
        },
      });

      res.status(200).json({ message: "Ad featured successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to feature ad" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
