/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.carpola.lk", // Your site URL
  generateRobotsTxt: true, // Enable robots.txt file generation
  sitemapSize: 7000, // Limit sitemap size if you have a very large site
  exclude: ["/admin", "/dashboard"], // Exclude these routes from sitemap
  changefreq: "weekly", // Default change frequency for URLs
  priority: 0.8, // Default priority for URLs
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/dashboard"] }, // Excluded paths
    ],
  },
  transform: async (config, path) => {
    // Set custom priority for specific paths
    const highPriorityPaths = [
      "/",
      "/search",
      "/my-ads",
      "/about",
      "/contact",
      "/post-ad",
      "/privacy-policy",
      "/terms-and-conditions",
    ];

    const isHighPriority = highPriorityPaths.includes(path);

    return {
      loc: path,
      changefreq: "daily", // You can customize frequency for different paths
      priority: isHighPriority ? 1.0 : config.priority,
      lastmod: new Date().toISOString(), // Set current date as last modified
    };
  },
  additionalPaths: async (config) => {
    // Add custom paths for categories and specific searches dynamically
    const categories = [
      "CAR",
      "VAN",
      "JEEP",
      "LORRY",
      "BIKE",
      "CREWCAB",
      "PICKUP",
      "BUS",
      "TRUCK",
      "THREEWHEEL",
      "TRACTOR",
      "HEAVYDUTY",
    ];

    const categoryPaths = categories.map((category) => ({
      loc: `/search?category=${category}`,
      changefreq: "daily",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));

    return categoryPaths;
  },
};
