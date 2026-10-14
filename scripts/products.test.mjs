import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(root, "data/products.json"), "utf8"));
const mirror = JSON.parse(readFileSync(join(root, "scripts/mirror-products.json"), "utf8").replace(/^﻿/, ""));

const EXPECTED_SLUGS = [
  "camo-trucker-hat-classic-embroidered-camouflage-mesh-cap",
  "classic-sponge-fleece-hoodie-cozy-pullover-sweatshirt",
  "classic-white-backpack-minimalist-everyday-school-travel-bag",
  "cozy-three-panel-fleece-hoodie-lightweight-white-pullover",
  "duffel-bag",
  "heather-gray-full-zip-hoodie-classic-casual-zip-up-hooded-jacket",
  "i-love-you-with-all-my-butt-t-shirt-funny-romantic-graphic-tee",
  "laptop-sleeve",
  "leather-patch-dad-hat-classic-rectangle-patch-baseball-cap",
  "low-profile-baseball-cap-classic-minimalist-white-dad-hat-for-everyday-wear",
  "personalized-weekend-tote-bag-large-canvas-weekender-with-rope-handles",
  "sweet-dreams-t-shirt-retro-cozy-sleepwear-graphic-tee",
  "white-crewneck-t-shirt",
];

test("catalog contains exactly the 13 mirror products", () => {
  assert.equal(products.length, 13);
  assert.deepEqual(products.map((p) => p.slug).sort(), [...EXPECTED_SLUGS].sort());
  assert.equal(mirror.length, 13);
});

test("verified source prices are preserved", () => {
  const by = Object.fromEntries(products.map((p) => [p.slug, p]));
  assert.equal(by["camo-trucker-hat-classic-embroidered-camouflage-mesh-cap"].price, 32);
  assert.deepEqual(by["white-crewneck-t-shirt"].range, [19.18, 23.75]);
  assert.deepEqual(by["cozy-three-panel-fleece-hoodie-lightweight-white-pullover"].range, [42.57, 48.08]);
  assert.equal(by["duffel-bag"].price, 77.13);
  assert.equal(by["laptop-sleeve"].price, 29.52);
  assert.equal(by["personalized-weekend-tote-bag-large-canvas-weekender-with-rope-handles"].price, 51.68);
});

test("cozy-three-panel is the only product without a variation matrix", () => {
  const without = products.filter((p) => !p.variations).map((p) => p.slug);
  assert.deepEqual(without, ["cozy-three-panel-fleece-hoodie-lightweight-white-pullover"]);
  for (const p of products) {
    if (p.slug === "cozy-three-panel-fleece-hoodie-lightweight-white-pullover") continue;
    assert.ok(Array.isArray(p.variations) && p.variations.length >= 1, `${p.slug} should have variations`);
  }
});

test("every product has gallery, primary image, description, and attributes", () => {
  for (const p of products) {
    assert.ok(p.gallery.length >= 1, `${p.slug} gallery`);
    assert.equal(p.image, p.gallery[0], `${p.slug} primary image`);
    assert.ok(p.description.length >= 1 && p.description[0].length > 40, `${p.slug} description`);
    assert.ok(p.attributes.length >= 1, `${p.slug} attributes`);
    for (const a of p.attributes) {
      assert.ok(a.label.length > 0, `${p.slug} attr label`);
      assert.ok(a.values.length >= 1, `${p.slug} attr values`);
    }
  }
});

test("variation records only use declared attribute values and are unique", () => {
  for (const p of products) {
    if (!p.variations) continue;
    const attrMap = Object.fromEntries(p.attributes.map((a) => [a.key, new Set(a.values)]));
    const seen = new Set();
    for (const v of p.variations) {
      const keys = Object.keys(v.attributes).sort();
      assert.deepEqual(keys, p.attributes.map((a) => a.key).sort(), `${p.slug} variation keys`);
      for (const [k, val] of Object.entries(v.attributes)) {
        assert.ok(attrMap[k].has(val), `${p.slug} variation value ${k}=${val}`);
      }
      const sig = keys.map((k) => `${k}=${v.attributes[k]}`).join("|");
      assert.ok(!seen.has(sig), `${p.slug} duplicate variation ${sig}`);
      seen.add(sig);
      assert.ok(v.price > 0, `${p.slug} variation price`);
      assert.equal(typeof v.inStock, "boolean", `${p.slug} inStock`);
      if (p.range) {
        assert.ok(v.price >= p.range[0] - 0.001 && v.price <= p.range[1] + 0.001, `${p.slug} price in range`);
      } else {
        assert.equal(v.price, p.price, `${p.slug} price equals base`);
      }
    }
  }
});

test("variation counts match the mirror extraction", () => {
  for (const m of mirror) {
    const p = products.find((x) => x.slug === m.slug);
    const mirrorCount = m.variationMatrixPresent && Array.isArray(m.variations) ? m.variations.length : 0;
    const catalogCount = p.variations ? p.variations.length : 0;
    assert.equal(catalogCount, mirrorCount, `${m.slug} variation count`);
  }
});

test("category slugs and singular source labels are stable", () => {
  const cats = ["bag", "front-hat", "hoodie", "shirt"];
  for (const c of cats) {
    assert.ok(products.some((p) => p.category === c), `${c} has products`);
  }
  const catFile = readFileSync(join(root, "data/products.ts"), "utf8");
  for (const label of ["Bag", "Front Hat", "Hoodie", "Shirt"]) {
    assert.ok(catFile.includes(`sourceLabel: "${label}"`), `sourceLabel ${label}`);
  }
});
