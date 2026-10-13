# Surgical Review Report — Conversion Readiness

**Date:** 2026-10-13  
**Baseline:** `4037ec9` (1918 files, 185.6 MB)  
**Verdict: CONDITIONAL** — docs are accurate on routes/products/prices, but 6 items block scaffolding.

---

## 1. Site Map — VERIFIED with 3 inaccuracies

**Confirmed:** 13/13 product slugs, 12 canonical route files, checkout `<title>`="Cart", CF7 `wpcf7-f1572-p4439-o1`, 15 style blocks, 72 stylesheets, 87 e-con/section, Inter+Roboto, Elementor kit 29049 + templates 7033/7040/7047/7054, RevSlider 6.7.38, uploads 48.2 MB, oembed (38 files).

### Inaccuracies

| File:Line | Claim | Finding |
|---|---|---|
| `SITE_MAP.md:32` | Woodmart listed under `wp-content/plugins/` | Woodmart is a **theme** (`wp-content/themes/woodmart/`). `pro-elements` (Elementor Pro fork) is present but unlisted. Actual plugins: contact-form-7, elementor, elementskit-lite, **pro-elements**, revslider, woocommerce, zakeke. |
| `SITE_MAP.md:41` | "no canonical product page references [Zakeke]" | Zakeke CSS/JS **is loaded on home** (`zakeke-glide-css`, `zakeke-shop-css`, `zakeke-product-page-js`, `glide.js` enqueued in `index.html`). Unused in markup, but "unreferenced" is false for home. |
| `SITE_MAP.md:29` | `index.html?p=*` are "duplicates of the canonical pages" | Not byte-identical (~190B path-rewrite deltas). `p=8` is **Cart**, not home. Product p-files: 13. Root p-files: 18. |

### Noise volume

| Artifact | Count | Bytes |
|---|---|---|
| Filter permutations (shop + product-category) | 856 | **113.9 MB (61% of repo)** |
| Other query-string files (root p-files, xmlrpc) | 19 | 3.5 MB |
| wp-json / comments | — | 1.6 MB |
| Feeds | 20 dirs | 0.5 MB |

---

## 2. Products — VERIFIED with 1 material error

**Confirmed:** 13/13 titles (incl. `‑` in "T‑Shirt"), 13/13 categories, 13/13 price values, 140/140 gallery images present locally, 13/13 long descriptions, all SKU "N/A", all in stock.

### Errors

| File:Line | Claim | Finding |
|---|---|---|
| `PRODUCTS.md:4` | "two price points = sale + regular" | **0 of 13 have `<ins>/<del>` sale markup.** Dual prices are WooCommerce variable price ranges (`Price range: $75.48 through $86.35`). Verified via `<ins>` absence + `screen-reader-text` "Price range". |
| `PRODUCTS.md:6` | "option values embedded in each page's variations JSON" | **Exception:** `cozy-three-panel-fleece-hoodie` has `data-product_variations="false"` — matrix **missing from mirror**. Only `<select>` options (XS–3XL, White) + rendered range 42.57–48.08 recoverable. |
| `PRODUCTS.md:35` | "~8-10 gallery URLs" | Actual **7–29** (cozy=29, sponge=12, several=7). Understated. |

### Attribute heterogeneity

Doc examples `attribute_sizes`/`attribute_colors` are incomplete. Full set:

| Slug | Attribute keys |
|---|---|
| camo-trucker-hat | `attribute_hat-sizes`, `attribute_otto-colors` |
| classic-sponge-fleece-hoodie | `attribute_sizes`, `attribute_colors` |
| classic-white-backpack | `attribute_bag-size` |
| cozy-three-panel-fleece-hoodie | `attribute_sizes`, `attribute_colors` |
| duffel-bag | `attribute_sizes` |
| heather-gray-full-zip-hoodie | `attribute_district-colors`, `attribute_clothing-sizes` |
| i-love-you-with-all-my-butt-t-shirt | `attribute_comfort-colors-colors`, `attribute_clothing-sizes` |
| laptop-sleeve | `attribute_sleeve-sizes` |
| leather-patch-dad-hat | `attribute_colors`, `attribute_patch-shape` |
| low-profile-baseball-cap | `attribute_colors`, `attribute_size` |
| personalized-weekend-tote-bag | `attribute_bag-size` |
| sweet-dreams-t-shirt | `attribute_comfort-colors-colors`, `attribute_clothing-sizes` |
| white-crewneck-t-shirt | `attribute_colors`, `attribute_sizes` |

**Implication:** `ProductVariation` type must use `Record<string, string>` map, not typed `sizes`/`colors` fields.

### Variation counts

| Slug | Vars | Range? |
|---|---|---|
| camo-trucker-hat | 1 | no |
| classic-sponge-fleece-hoodie | 24 | yes (75.48–86.35) |
| classic-white-backpack | 1 | no |
| cozy-three-panel-fleece-hoodie | **matrix missing** | yes (42.57–48.08) |
| duffel-bag | 1 | no |
| heather-gray-full-zip-hoodie | 8 | yes (47.95–58.37) |
| i-love-you-with-all-my-butt-t-shirt | 7 | yes (20.68–29.43) |
| laptop-sleeve | 1 | no |
| leather-patch-dad-hat | 1 | no |
| low-profile-baseball-cap | 1 | no |
| personalized-weekend-tote-bag | 1 | no |
| sweet-dreams-t-shirt | 7 | yes (20.68–29.43) |
| white-crewneck-t-shirt | 6 | yes (19.18–23.75) |

---

## 3. Architecture — plan sound, 3 gaps

**Confirmed:** Playbook `HTML-TO-NEXTJS.md` step-table accurate (Next 16 + ESLint CLI, Barlow/DM Sans example, step-7 class-diff, `.gitignore` requirement). All route-map files exist. `cart-fragments.min.js` + `woodmart-ajax-shop-on` referenced on all checked pages.

### Gaps

| File:Line | Issue |
|---|---|
| `CONVERSION_PLAN.md:21` | **Stale:** "Mirror is currently untracked" — now false (committed `4037ec9`, pushed to `origin/main`). |
| `CONVERSION_PLAN.md:25-31` | **Material omission:** Cart *and* checkout mirrors are **empty-cart states**. Checkout has zero billing-form markup ("Your cart is currently empty" + return-to-shop link). No checkout UI reference exists in mirror under any commerce option A/B/C. |
| `CONVERSION_PLAN.md:77` | **Path gotcha:** HTML refs `post-29049.css%3Fver=…` but disk has `post-29049.css<U+F03F>ver=…`. Doc path `wp-content/uploads/**/post-29049.css` won't resolve. Conversion scripts must map `%3F`→U+F03F. Only 6 files in `elementor/css/` — no CSS for templates 7040/7047/7054. |

---

## 4. Security / hygiene / graphify

| Finding | Detail |
|---|---|
| **No `.gitignore`** | Playbook step 8 requires one. Add at scaffold to cover `/node_modules`, `/.next`, `next-env.d.ts`, `*.tsbuildinfo`, `.env*`. |
| Secrets scan | Clean (docs, authored files, graphify cache). No `wp-config.php` / `.env` in mirror. |
| **License exposure** | 61 MB vendor code (incl. commercial Woodmart theme) pushed to GitHub with **zero license/readme files** in mirror. Compliance note; Phase 6 cleanup resolves it. |
| Git state | 1 commit, 1918 files/185.6 MB, clean tree. 2019 loose objects (75.9 MiB, needs `gc`) + 1 garbage object warning. |
| graphify | 61 nodes / 155 edges / 8 communities. `graph.json` / `manifest.json` / `labels.json` free of absolute paths. `.graphify_python` holds machine path `C:\Program Files\Python312\python.exe` (non-portable, benign). `.sig` = content hashes. `graphify update .` reproduces AST layer at zero token cost. |

---

## 5. Decisions needed

| # | Decision | Blocks |
|---|---|---|
| 1 | **Commerce A/B/C** (headless Woo / SaaS / static catalog) | cart/checkout routing, data layer |
| 2 | Approve doc corrections (§1–3 above) | `products.ts` / `site.ts` data accuracy |
| 3 | Retain vs schedule deletion of `wp-content` vendor (113.9 MB noise) | repo size, Phase 6 scope |
| 4 | Optional: `git gc` + remove garbage object | repo hygiene |

---

## Appendix — Per-product extraction

| Slug | Title match | Cat | Prices | Vars | Gallery | Desc | Local imgs |
|---|---|---|---|---|---|---|---|
| camo-trucker-hat-classic-embroidered-camouflage-mesh-cap | ✓ | front-hat | 32 | 1 | 7 | ✓ | 7/7 |
| classic-sponge-fleece-hoodie-cozy-pullover-sweatshirt | ✓ | hoodie | 75.48/86.35 | 24 | 12 | ✓ | 12/12 |
| classic-white-backpack-minimalist-everyday-school-travel-bag | ✓ | bag | 72.17 | 1 | 11 | ✓ | 11/11 |
| cozy-three-panel-fleece-hoodie-lightweight-white-pullover | ✓ | hoodie | 42.57/48.08 | **missing** | 29 | ✓ | 29/29 |
| duffel-bag | ✓ | bag | 77.13 | 1 | 10 | ✓ | 10/10 |
| heather-gray-full-zip-hoodie-classic-casual-zip-up-hooded-jacket | ✓ | hoodie | 47.95/58.37 | 8 | 7 | ✓ | 7/7 |
| i-love-you-with-all-my-butt-t-shirt-funny-romantic-graphic-tee | ✓ | shirt | 20.68/29.43 | 7 | 8 | ✓ | 8/8 |
| laptop-sleeve | ✓ | bag | 29.52 | 1 | 9 | ✓ | 9/9 |
| leather-patch-dad-hat-classic-rectangle-patch-baseball-cap | ✓ | front-hat | 22.47 | 1 | 8 | ✓ | 8/8 |
| low-profile-baseball-cap-classic-minimalist-white-dad-hat-for-everyday-wear | ✓ | front-hat | 23.65 | 1 | 10 | ✓ | 10/10 |
| personalized-weekend-tote-bag-large-canvas-weekender-with-rope-handles | ✓ | bag | 51.68 | 1 | 11 | ✓ | 11/11 |
| sweet-dreams-t-shirt-retro-cozy-sleepwear-graphic-tee | ✓ | shirt | 20.68/29.43 | 7 | 9 | ✓ | 9/9 |
| white-crewneck-t-shirt | ✓ | shirt | 19.18/23.75 | 6 | 9 | ✓ | 9/9 |

**Totals:** 13/13 verified, 140/140 gallery images present, 1 missing variation matrix (cozy-three-panel).
