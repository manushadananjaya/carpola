import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin/dashboard", "/admin/*", "/my-ads/", "/post-ad/"],
      },
    ],
    sitemap: "https://carpola.lk/sitemap.xml",
  };
}
