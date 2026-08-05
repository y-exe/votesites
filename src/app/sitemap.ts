import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://event.ymkw.top";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vote`,
      lastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/policy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
