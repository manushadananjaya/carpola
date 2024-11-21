import { MetadataRoute } from "next";
import { generateSitemapEntries } from "../../sitemap";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = parseInt(params.id, 10);
  const sitemapEntries = await generateSitemapEntries(id);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries
            .map(
                (entry) => `
            <url>
                <loc>${entry.url}</loc>
                <lastmod>${entry.lastModified?.toString()}</lastmod>
                <changefreq>${entry.changeFrequency}</changefreq>
                <priority>${entry.priority}</priority>
            </url>
        `
            )
            .join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}
