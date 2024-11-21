import { PrismaClient } from "@prisma/client";
import { MetadataRoute } from "next";

const prisma = new PrismaClient();

// Function to generate vehicle slug based on the given ad details
function generateVehicleSlug(ad: {
  brand: string;
  model: string;
  year: number;
  adId: number;
}): string {
  return `${ad.brand}-${ad.model}-${ad.year}-price-in-sri-lanka-${ad.adId}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Function to generate sitemap entries for a specific page
export async function generateSitemapEntries(
  page: number
): Promise<MetadataRoute.Sitemap> {
  const pageSize = 5000; // Adjust based on your needs
  const skip = page * pageSize;

  const ads = await prisma.ad.findMany({
    where: { posted: true },
    select: {
      adId: true,
      brand: true,
      model: true,
      year: true,
      postedAt: true,
    },
    skip,
    take: pageSize,
  });

  return ads.map((ad) => ({
    url: `https://carpola.lk/vehicles/${generateVehicleSlug(ad)}`,
    lastModified: ad.postedAt ?? new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));
}

// Static URLs for your website pages
const staticUrls: MetadataRoute.Sitemap = [
  {
    url: "https://carpola.lk/",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "https://carpola.lk/about",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "https://carpola.lk/search",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: "https://carpola.lk/contact",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "https://carpola.lk/privacy-policy",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: "https://carpola.lk/terms-and-conditions",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return staticUrls;
}

export async function generateSitemaps(): Promise<MetadataRoute.Sitemap> {
  const totalAds = await prisma.ad.count({ where: { posted: true } });
  const totalPages = Math.ceil(totalAds / 5000);

  return Array.from({ length: totalPages }, (_, i) => ({
    url: `https://carpola.lk/sitemap-${i}.xml`, 
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.5,
  }));
}
