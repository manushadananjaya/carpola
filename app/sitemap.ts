// import { PrismaClient } from "@prisma/client";
// import type { MetadataRoute } from "next";

// const prisma = new PrismaClient();

// // Function to generate vehicle slug based on the given ad details
// function generateVehicleSlug(ad: any): string {
//   // Create a slug like "toyota-corolla-2012-price-in-sri-lanka-123"
//   return `${ad.brand}-${ad.model}-${ad.year}-price-in-sri-lanka-${ad.adId}`
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, ""); // Remove any special characters
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   // Fetch ads data from your Prisma database
//   const ads = await prisma.ad.findMany({
//     where: { posted: true },
//     select: {
//       adId: true,
//       brand: true,
//       model: true,
//       year: true,
//       postedAt: true,
//     },
//   });

//   // Generate URLs for each ad
//   const adUrls = ads.map((ad) => ({
//     url: `https://carpola.lk/vehicles/${generateVehicleSlug(ad)}`,
//     // Handle null `postedAt` with a fallback to the current date
//     lastModified: ad.postedAt ? new Date(ad.postedAt) : new Date(),
//     changeFrequency: "daily" as const, // Explicitly type the change frequency
//     priority: 0.8,
//   }));

//   // Static URLs for your website pages
//   const staticUrls = [
//     {
//       url: "https://carpola.lk/",
//       lastModified: new Date(),
//       changeFrequency: "daily" as const,
//       priority: 1,
//     },
//     {
//       url: "https://carpola.lk/about",
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.8,
//     },
//     {
//         url:"https://carpola.lk/search",
//         lastModified: new Date(),
//         changeFrequency: "daily" as const,
//         priority: 0.8,

//     },
//     {
//       url: "https://carpola.lk/contact",
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.8,
//     },
//     {
//       url: "https://carpola.lk/privacy-policy",
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.5,
//     },
//     {
//       url: "https://carpola.lk/terms-and-conditions",
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.5,
//     },
//   ];

//   // Combine both dynamic and static URLs
//   return [...adUrls, ...staticUrls];
// }
