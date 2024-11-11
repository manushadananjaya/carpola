/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.carpola.lk", // Replace with your actual site URL
  generateRobotsTxt: true, // (Optional) Generate a `robots.txt` file
  sitemapSize: 7000, // Adjust this if you have a very large site
  exclude: ["/admin", "/dashboard"], // (Optional) Pages to exclude from sitemap
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/dashboard"] }, // Adjust paths as needed
    ],
  },
};
