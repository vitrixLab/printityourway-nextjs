// Generates data/products.ts from scripts/mirror-products.json (extracted from the HTML mirror).
// Run: node scripts/generate-products.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = JSON.parse(readFileSync(join(root, "scripts/mirror-products.json"), "utf8").replace(/^﻿/, ""));

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&#8211;/g, "–")
    .replace(/&nbsp;/g, " ");

const tsStr = (s) => JSON.stringify(s);

const out = [];
out.push(`// Generated from the WordPress HTML mirror by scripts/generate-products.mjs.`);
out.push(`// Source: product/<slug>/index.html (attribute selects, data-product_variations, gallery, description tab).`);
out.push(`// Do not hand-edit product records; re-run the generator after refreshing scripts/mirror-products.json.`);
out.push(``);
out.push(`export type CategorySlug = "bag" | "front-hat" | "hoodie" | "shirt";`);
out.push(``);
out.push(`export type ProductAttribute = { key: string; label: string; values: string[] };`);
out.push(``);
out.push(`export type ProductVariation = {`);
out.push(`  attributes: Record<string, string>;`);
out.push(`  price: number;`);
out.push(`  regularPrice: number;`);
out.push(`  inStock: boolean;`);
out.push(`  image?: string;`);
out.push(`};`);
out.push(``);
out.push(`export type Product = {`);
out.push(`  slug: string;`);
out.push(`  name: string;`);
out.push(`  category: CategorySlug;`);
out.push(`  /** Lowest displayed price in USD (from the source price block / variation matrix). */`);
out.push(`  price: number;`);
out.push(`  /** Present when the source shows two distinct price points. */`);
out.push(`  range?: [number, number];`);
out.push(`  /** Primary image; always equal to gallery[0]. */`);
out.push(`  image: string;`);
out.push(`  /** Full gallery in source order (hotlinked to the original WordPress media library). */`);
out.push(`  gallery: string[];`);
out.push(`  /** Real description-tab copy, one entry per source block. */`);
out.push(`  description: string[];`);
out.push(`  /** Source variation attributes, in source order. */`);
out.push(`  attributes: ProductAttribute[];`);
out.push(`  /** Per-combination data from data-product_variations. Absent when the source matrix is false. */`);
out.push(`  variations?: ProductVariation[];`);
out.push(`  /** Product-level SKU as rendered (the mirror renders "N/A" for every product). */`);
out.push(`  sku?: string;`);
out.push(`};`);
out.push(``);

out.push(`export const products: Product[] = [`);
for (const p of raw) {
  const name = decode(p.title);
  const attrs = Object.entries(p.attributes || {}).map(([key, values]) => ({
    key,
    label: decode((p.attributeLabels || {})[key] || key),
    values: values.map(decode),
  }));
  const variations = (p.variations || []).map((v) => {
    const rec = {};
    for (const [k, val] of Object.entries(v.attributes || {})) {
      rec[k.replace(/^attribute_/, "")] = decode(val);
    }
    const parts = [
      `attributes: ${JSON.stringify(rec)}`,
      `price: ${v.price}`,
      `regularPrice: ${v.regularPrice}`,
      `inStock: ${v.inStock === true || v.inStock === "true"}`,
    ];
    if (v.image) parts.push(`image: ${tsStr(v.image)}`);
    return `{ ${parts.join(", ")} }`;
  });
  const gallery = (p.gallery || []).map(tsStr);
  const desc = (p.descriptionParagraphs || []).map((d) => tsStr(decode(d).replace(/\n{2,}/g, "\n")));
  const range =
    typeof p.priceMin === "number" && typeof p.priceMax === "number" && p.priceMin !== p.priceMax
      ? `range: [${p.priceMin}, ${p.priceMax}], `
      : "";
  const minPrice = typeof p.price === "number" ? p.price : p.priceMin;
  const variationsField =
    p.variationMatrixPresent && variations.length > 0 ? `variations: [\n    ${variations.join(",\n    ")}\n  ], ` : "";
  out.push(
    `  { slug: ${tsStr(p.slug)}, name: ${tsStr(name)}, category: ${tsStr(p.categorySlug)}, price: ${minPrice}, ${range}image: ${gallery[0]}, gallery: [${gallery.join(", ")}], description: [${desc.join(", ")}], attributes: [${attrs
      .map((a) => `{ key: ${tsStr(a.key)}, label: ${tsStr(a.label)}, values: ${JSON.stringify(a.values)} }`)
      .join(", ")}], ${variationsField}sku: ${tsStr(decode(p.sku || "N/A"))} },`
  );
}
out.push(`];`);
out.push(``);
out.push(`export const categories = [`);
out.push(`  { slug: "bag", name: "Bags", sourceLabel: "Bag" },`);
out.push(`  { slug: "front-hat", name: "Hats", sourceLabel: "Front Hat" },`);
out.push(`  { slug: "hoodie", name: "Hoodies", sourceLabel: "Hoodie" },`);
out.push(`  { slug: "shirt", name: "T-Shirts", sourceLabel: "Shirt" },`);
out.push(`] as const;`);
out.push(``);
out.push(`export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);`);
out.push(``);
out.push(`export const bySlug = (slug: string) => products.find((p) => p.slug === slug);`);
out.push(``);

writeFileSync(join(root, "data/products.ts"), out.join("\n"), "utf8");
console.log(`Wrote data/products.ts with ${raw.length} products.`);
