import type { MetadataRoute } from "next";
import { categories, products } from "@/data/products";

const siteUrl = "https://printityourway.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((category) => ({
      url: `${siteUrl}/product-category/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
