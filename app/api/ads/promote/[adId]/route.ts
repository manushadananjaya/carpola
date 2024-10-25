import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { adId } = req.query;

  if (req.method === "POST") {
    try {
      // Check if the ad is already promoted
    const existingPromotion = await prisma.promotedItem.findUnique({
        where: {
            id: Number(adId), // Add the 'id' property
        },
    });

    if (existingPromotion) {
        return res.status(400).json({ message: "Ad is already promoted" });
    }

      // Promote the ad by adding an entry in the PromotedItem table
      await prisma.promotedItem.create({
        data: {
          adId: Number(adId),
        },
      });

      res.status(200).json({ message: "Ad promoted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to promote ad" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
