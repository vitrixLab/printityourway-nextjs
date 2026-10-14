// Generates data/products.json and data/products.ts from scripts/mirror-products.json.
// Run: node scripts/generate-products.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mirror = JSON.parse(readFileSync(join(root, "scripts/mirror-products.json"), "utf8").replace(/^﻿/, ""));

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&#8211;/g, "–")
    .replace(/&nbsp;/g, " ");

const products = mirror.map((p) => {
  const attributes = Object.entries(p.attributes || {}).map(([key, values]) => ({
    key,
    label: decode((p.attributeLabels || {})[key] || key),
    values: values.map(decode),
  }));
  const variations =
    p.variationMatrixPresent && Array.isArray(p.variations) && p.variations.length > 0
      ? p.variations.map((v) => {
          const rec = {};
          for (const [k, val] of Object.entries(v.attributes || {})) rec[k.replace(/^attribute_/, "")] = decode(val);
          const out = { attributes: rec, price: v.price, regularPrice: v.regularPrice, inStock: v.inStock === true || v.inStock === "true" };
          if (v.image) out.image = v.image;
          return out;
        })
      : undefined;
  const gallery = (p.gallery || []).map(decode);
  const price = typeof p.price === "number" ? p.price : p.priceMin;
  const range =
    typeof p.priceMin === "number" && typeof p.priceMax === "number" && p.priceMin !== p.priceMax
      ? [p.priceMin, p.priceMax]
      : undefined;
  const rec = {
    slug: p.slug,
    name: decode(p.title),
    category: p.categorySlug,
    price,
    ...(range ? { range } : {}),
    image: gallery[0],
    gallery,
    description: (p.descriptionParagraphs || []).map((d) => decode(d).replace(/\n{2,}/g, "\n")),
    attributes,
    ...(variations ? { variations } : {}),
    sku: decode(p.sku || "N/A"),
  };
  return rec;
});

writeFileSync(join(root, "data/products.json"), JSON.stringify(products, null, 2), "utf8");

const ts = [];
ts.push(`// Generated from the WordPress HTML mirror by scripts/generate-products.mjs.`);
ts.push(`// Source: product/<slug>/index.html (attribute selects, data-product_variations, gallery, description tab).`);
ts.push(`// Do not hand-edit product records; re-run the generator after refreshing scripts/mirror-products.json.`);
ts.push(``);
ts.push(`import raw from "./products.json";`);
ts.push(``);
ts.push(`export type CategorySlug = "bag" | "front-hat" | "hoodie" | "shirt";`);
ts.push(``);
ts.push(`export type ProductAttribute = { key: string; label: string; values: string[] };`);
ts.push(``);
ts.push(`export type ProductVariation = {`);
ts.push(`  attributes: Record<string, string>;`);
ts.push(`  price: number;`);
ts.push(`  regularPrice: number;`);
ts.push(`  inStock: boolean;`);
ts.push(`  image?: string;`);
ts.push(`};`);
ts.push(``);
ts.push(`export type Product = {`);
ts.push(`  slug: string;`);
ts.push(`  name: string;`);
ts.push(`  category: CategorySlug;`);
ts.push(`  /** Lowest displayed price in USD (from the source price block / variation matrix). */`);
ts.push(`  price: number;`);
ts.push(`  /** Present when the source shows two distinct price points. */`);
ts.push(`  range?: [number, number];`);
ts.push(`  /** Primary image; always equal to gallery[0]. */`);
ts.push(`  image: string;`);
ts.push(`  /** Full gallery in source order (hotlinked to the original WordPress media library). */`);
ts.push(`  gallery: string[];`);
ts.push(`  /** Real description-tab copy, one entry per source block. */`);
ts.push(`  description: string[];`);
ts.push(`  /** Source variation attributes, in source order. */`);
ts.push(`  attributes: ProductAttribute[];`);
ts.push(`  /** Per-combination data from data-product_variations. Absent when the source matrix is false. */`);
ts.push(`  variations?: ProductVariation[];`);
ts.push(`  /** Product-level SKU as rendered (the mirror renders "N/A" for every product). */`);
ts.push(`  sku?: string;`);
ts.push(`};`);
ts.push(``);
ts.push(`export const products = raw as unknown as Product[];`);
ts.push(``);
ts.push(`export const categories = [`);
ts.push(`  { slug: "bag", name: "Bags", sourceLabel: "Bag" },`);
ts.push(`  { slug: "front-hat", name: "Hats", sourceLabel: "Front Hat" },`);
ts.push(`  { slug: "hoodie", name: "Hoodies", sourceLabel: "Hoodie" },`);
ts.push(`  { slug: "shirt", name: "T-Shirts", sourceLabel: "Shirt" },`);
ts.push(`] as const;`);
ts.push(``);
ts.push(`export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);`);
ts.push(``);
ts.push(`export const bySlug = (slug: string) => products.find((p) => p.slug === slug);`);
ts.push(``);

writeFileSync(join(root, "data/products.ts"), ts.join("\n"), "utf8");
console.log(`Wrote data/products.json and data/products.ts with ${products.length} products.`);
