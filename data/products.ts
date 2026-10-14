// Generated from the WordPress HTML mirror by scripts/generate-products.mjs.
// Source: product/<slug>/index.html (attribute selects, data-product_variations, gallery, description tab).
// Do not hand-edit product records; re-run the generator after refreshing scripts/mirror-products.json.

import raw from "./products.json";

export type CategorySlug = "bag" | "front-hat" | "hoodie" | "shirt";

export type ProductAttribute = { key: string; label: string; values: string[] };

export type ProductVariation = {
  attributes: Record<string, string>;
  price: number;
  regularPrice: number;
  inStock: boolean;
  image?: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Lowest displayed price in USD (from the source price block / variation matrix). */
  price: number;
  /** Present when the source shows two distinct price points. */
  range?: [number, number];
  /** Primary image; always equal to gallery[0]. */
  image: string;
  /** Full gallery in source order (hotlinked to the original WordPress media library). */
  gallery: string[];
  /** Real description-tab copy, one entry per source block. */
  description: string[];
  /** Source variation attributes, in source order. */
  attributes: ProductAttribute[];
  /** Per-combination data from data-product_variations. Absent when the source matrix is false. */
  variations?: ProductVariation[];
  /** Product-level SKU as rendered (the mirror renders "N/A" for every product). */
  sku?: string;
};

export const products = raw as unknown as Product[];

export const categories = [
  { slug: "bag", name: "Bags", sourceLabel: "Bag" },
  { slug: "front-hat", name: "Hats", sourceLabel: "Front Hat" },
  { slug: "hoodie", name: "Hoodies", sourceLabel: "Hoodie" },
  { slug: "shirt", name: "T-Shirts", sourceLabel: "Shirt" },
] as const;

export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
