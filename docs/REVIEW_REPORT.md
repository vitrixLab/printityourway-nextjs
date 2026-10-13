# Surgical Review Report — Conversion Readiness

**Date:** 2026-10-13  
**Baseline:** `4037ec9` → `f8d78f5` (2 commits, 1918 files, 185.6 MB)  
**Verdict: CONDITIONAL / HOLD** — 1 implementation blocker (Decision A), 1 documentation-governance decision (Decision B), 1 release-readiness condition (Decision C), and 1 optional maintenance item (Decision D).

---

## Evidence Labels

| Label | Meaning |
|---|---|
| `VERIFIED` | Directly supported by inspected evidence in current checkout |
| `PARTIAL` | Some evidence exists; claim is incomplete |
| `UNKNOWN` | Evidence missing or insufficient |
| `RECOMMENDATION` | Proposed action, not an established fact |
| `REMEDIATED` | Specific change made and verified (none in this report) |

---

## 1. Route Reconciliation

The terms "12 canonical route files" and "12 route templates" from earlier materials are **inaccurate**. Corrected counts:

| Category | Count | Evidence |
|---|---|---|
| **Template-level routes** | **10** | home, shop, category archive, product detail, cart, checkout, wishlist, compare, about, contact |
| **Canonical URLs** | **25** | 1 home + 1 shop + 4 categories + 13 products + 1 cart + 1 checkout + 1 wishlist + 1 compare + 1 about + 1 contact |
| **Source HTML files** | **46** | 25 canonical routes + 20 feed directories + 1 wp-json index |

### Route Inventory

| URL | Source File | Template | Implementation Status |
|---|---|---|---|
| `/` | `index.html` | Elementor home | `NOT STARTED` |
| `/shop` | `shop/index.html` | WooCommerce shop archive | `NOT STARTED` |
| `/product-category/bag` | `product-category/bag/index.html` | Category archive | `NOT STARTED` |
| `/product-category/front-hat` | `product-category/front-hat/index.html` | Category archive | `NOT STARTED` |
| `/product-category/hoodie` | `product-category/hoodie/index.html` | Category archive | `NOT STARTED` |
| `/product-category/shirt` | `product-category/shirt/index.html` | Category archive | `NOT STARTED` |
| `/product/<slug>` ×13 | `product/<slug>/index.html` | Single product (variable) | `NOT STARTED` |
| `/cart` | `cart/index.html` | WooCommerce cart (empty state) | `BLOCKED` (Decision A) |
| `/checkout` | `checkout/index.html` | Empty-cart placeholder (not a checkout form) | `BLOCKED` (Decision A) |
| `/wishlist` | `wishlist/index.html` | Woodmart wishlist | `NOT STARTED` |
| `/compare` | `compare/index.html` | Woodmart compare | `NOT STARTED` |
| `/about-us` | `about-us/index.html` | Elementor page | `NOT STARTED` |
| `/contact-us` | `contact-us/index.html` | Elementor page + CF7 | `NOT STARTED` |

**Note:** `/checkout` source is a mis-captured copy of the cart empty-state page (same `page-id-8`, no `billing_first_name`, no checkout form). No checkout UI reference exists in mirror.

---

## 2. Site Map Findings

| ID | Severity | File:Line | Claim | Finding | Status |
|---|---|---|---|---|---|
| SM-1 | Medium | `SITE_MAP.md:32` | Woodmart under `wp-content/plugins/` | Woodmart is a theme (`wp-content/themes/woodmart/`). `pro-elements` present but unlisted. Actual plugins: contact-form-7, elementor, elementskit-lite, **pro-elements**, revslider, woocommerce, zakeke. | `VERIFIED` |
| SM-2 | Low | `SITE_MAP.md:41` | "no canonical product page references [Zakeke]" | Zakeke CSS/JS loaded on home (`zakeke-glide-css`, `zakeke-shop-css`, `zakeke-product-page-js`, `glide.js` in `index.html`). Unused in markup; "unreferenced" is false for home. | `VERIFIED` |
| SM-3 | Low | `SITE_MAP.md:29` | `index.html?p=*` are "duplicates of the canonical pages" | Not byte-identical (~190B path-rewrite deltas). `p=8` is Cart, not home. 18 root p-files + 13 product p-files. | `VERIFIED` |
| SM-4 | Info | — | Route count | Earlier "12 canonical route files" is wrong. Correct: 10 templates, 25 URLs, 46 HTML files. | `VERIFIED` |

### Noise Volume

| Artifact | Count | Bytes | % of Repo |
|---|---|---|---|
| Filter permutations (shop + product-category) | 856 | 113.9 MB | 61% |
| Other query-string files (root p-files, xmlrpc) | 19 | 3.5 MB | 1.9% |
| wp-json / comments | — | 1.6 MB | 0.9% |
| Feeds | 20 dirs | 0.5 MB | 0.3% |

---

## 3. Product Findings

### Catalog Completeness

| Metric | Value | Status |
|---|---|---|
| Total products | 13 | `VERIFIED` |
| Titles match doc | 13/13 | `VERIFIED` |
| Categories match doc | 13/13 | `VERIFIED` |
| Price values match doc | 13/13 | `VERIFIED` |
| Long descriptions present | 13/13 | `VERIFIED` |
| Gallery slots (figure elements) | 72 | `PARTIAL` — rerun against source HTML |
| Per-product unique image paths (sum of appendix counts) | 140 | `PARTIAL` — not a global distinct-path total |
| Referenced image files present locally | 140/140 per-product references | `PARTIAL` — rerun inventory; global distinct-path total not established |
| Products with `<ins>/<del>` sale markup | 0/13 | `VERIFIED` |
| Products with variation matrix | 12/13 | `VERIFIED` |
| Products with out-of-stock state | 0/13 | `VERIFIED` |

### Doc Inaccuracies

| ID | Severity | File:Line | Claim | Finding | Status |
|---|---|---|---|---|---|
| PR-1 | **High** | `PRODUCTS.md:4` | "two price points = sale + regular" | **0 of 13 have `<ins>/<del>` sale markup.** Dual prices are WooCommerce variable price ranges (`Price range: $75.48 through $86.35`). Verified via `<ins>` absence + `screen-reader-text` "Price range". | `VERIFIED` |
| PR-2 | **High** | `PRODUCTS.md:6` | "option values embedded in each page's variations JSON" | **Exception:** `cozy-three-panel-fleece-hoodie` has `data-product_variations="false"` — matrix **missing from mirror**. Only `<select>` options (XS–3XL × 6 colors = 42 combinations) + rendered range $42.57–$86.35 recoverable. Per-variation prices: `UNKNOWN`. Per-variation stock: `UNKNOWN`. | `VERIFIED` |
| PR-3 | Medium | `PRODUCTS.md:35` | "~8-10 gallery URLs" | Actual gallery slots per product: 2–24 (cozy=24, sponge=8, several=2–5). The appendix's per-product image counts sum to 140, which conflicts with the 72-slot total if treated as the same metric. Keep slots, per-product unique paths, and globally deduplicated paths separate; the global distinct-path total is not established by this report. | `VERIFIED` |
| PR-4 | Medium | `PRODUCTS.md:5` | `attribute_sizes`/`attribute_colors` examples | Attribute keys are heterogeneous across products (see table below). `ProductVariation` type must use `Record<string, string>` map. | `VERIFIED` |

### Attribute Key Heterogeneity

| Slug | Attribute Keys |
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

### Variation Data Status

| Product | Variations | Price Range | Per-Variation Prices | Per-Variation Stock | Data Quality |
|---|---|---|---|---|---|
| camo-trucker-hat | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| classic-sponge-fleece-hoodie | 24 | Yes ($75.48–$86.35) | `VERIFIED` | `VERIFIED` | Complete |
| classic-white-backpack | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| **cozy-three-panel-fleece-hoodie** | **0 (matrix missing)** | Yes ($42.57–$86.35) | **`UNKNOWN`** | **`UNKNOWN`** | **Partial — options only** |
| duffel-bag | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| heather-gray-full-zip-hoodie | 8 | Yes ($47.95–$58.37) | `VERIFIED` | `VERIFIED` | Complete |
| i-love-you-with-all-my-butt-t-shirt | 7 | Yes ($20.68–$29.43) | `VERIFIED` | `VERIFIED` | Complete |
| laptop-sleeve | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| leather-patch-dad-hat | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| low-profile-baseball-cap | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| personalized-weekend-tote-bag | 1 | No | `VERIFIED` | `VERIFIED` | Complete |
| sweet-dreams-t-shirt | 7 | Yes ($20.68–$29.43) | `VERIFIED` | `VERIFIED` | Complete |
| white-crewneck-t-shirt | 6 | Yes ($19.18–$23.75) | `VERIFIED` | `VERIFIED` | Complete |

**Note:** For cozy-three-panel, do not derive or fabricate a variation matrix from the price range. Option combinations are selectable in the form but have no purchasable matrix in the mirror.

---

## 4. Architecture Findings

| ID | Severity | File:Line | Issue | Status |
|---|---|---|---|---|
| AR-1 | Medium | `CONVERSION_PLAN.md:21` | **Stale:** "Mirror is currently untracked" — now false (committed `4037ec9`, pushed to `origin/main`). | `VERIFIED` |
| AR-2 | **High** | `CONVERSION_PLAN.md:25-31` | **Material omission:** Cart *and* checkout mirrors are **empty-cart states**. Checkout has zero billing-form markup ("Your cart is currently empty" + return-to-shop). No checkout UI reference exists in mirror under any commerce option A/B/C. | `VERIFIED` |
| AR-3 | Medium | `CONVERSION_PLAN.md:77` | **Path gotcha:** HTML refs `post-29049.css%3Fver=…` but disk has `post-29049.css<U+F03F>ver=…`. Doc path `wp-content/uploads/**/post-29049.css` won't resolve. Conversion scripts must map `%3F`→U+F03F. Only 6 files in `elementor/css/` — no CSS for templates 7040/7047/7054. | `VERIFIED` |

---

## 5. Security / Hygiene

| ID | Finding | Evidence | Status |
|---|---|---|---|
| HY-1 | **No `.gitignore`** | `Test-Path .gitignore` = `False`. Playbook step 8 requires one. | `VERIFIED` |
| HY-2 | Secrets scan | No dedicated scanner (gitleaks/trufflehog/detect-secrets/semgrep) available. Manual pattern scan of docs + HEAD: 0 high-signal matches (AWS keys, GitHub tokens, OpenAI keys, private keys, Slack tokens). Generic keyword matches ("token", "password") in HTML are false positives (JS/CSS). **Qualification: `UNKNOWN` — no dedicated scanner evidence available; manual scan found no high-signal patterns but cannot prove absence.** | `UNKNOWN` |
| HY-3 | **License exposure** | 61 MB vendor code (incl. commercial Woodmart theme) pushed to GitHub with **zero license/readme files** in mirror (`Get-ChildItem wp-content -Recurse | Where-Object Name -match '^(license\|licence\|copying\|readme)'` = empty). Missing license files are a release risk, not proof of infringement. | `VERIFIED` |
| HY-4 | Git state | 2 commits (`4037ec9`, `f8d78f5`), 1918 files/185.6 MB, clean tree. 2023 loose objects (75.93 MiB, needs `gc`) + 1 garbage object warning (`.git/objects/9e/tmp_obj_tLfKTo`). **Not an implementation blocker** — optional maintenance. | `VERIFIED` |
| HY-5 | graphify | 61 nodes / 155 edges / 8 communities. `graph.json` / `manifest.json` / `labels.json` free of absolute paths. `.graphify_python` holds machine path `C:\Program Files\Python312\python.exe` (non-portable, benign). `.sig` = content hashes. | `VERIFIED` |

---

## 6. Decision Register

### Decision A — Commerce Architecture

**Status: `NOT DECIDED`** — blocks cart/checkout implementation.

| Option | Product Data | Variants | Cart | Checkout | Inventory | Payments | Hosting |
|---|---|---|---|---|---|---|---|
| **A. Headless WooCommerce** | Same products/prices/stock via WPGraphQL or Woo REST | Same variation data (requires re-extraction of cozy hoodie from live WP) | Woo REST / Store API | Woo REST / Store API (no UI in mirror) | Real-time via Woo | Woo payments | WP backend required |
| **B. SaaS commerce (Shopify/Medusa)** | Re-enter 13 products | Re-create variations manually | SaaS-provided | SaaS-provided | SaaS-managed | SaaS-managed | SaaS-hosted |
| **C. Static catalog** | Static `data/products.ts` | Static variation data (cozy hoodie: options only, no matrix) | Placeholder or link out | Placeholder or link out | None | None | Static hosting only |

**Until Decision A is recorded, cart/checkout implementation remains `BLOCKED`.** Decision B governs whether the three source documents are corrected in this PR or separately; it does not independently block unrelated scaffolding.

### Decision B — Documentation Authority

**Status: `NOT DECIDED`** — documentation-governance decision; not itself a commerce implementation blocker.

- If **advisory**: corrections to `SITE_MAP.md`, `PRODUCTS.md`, `CONVERSION_PLAN.md` require separate approval.
- If **authoritative**: this report supersedes claims in those files; they should be marked or corrected.

This PR corrects `REVIEW_REPORT.md` but does not modify the other three docs (pending Decision B).

### Decision C — Vendor Retention and Licensing

**Status: `NOT DECIDED`** — release-readiness condition, not an implementation blocker.

| Component | Provenance | License Evidence | Redistribution Status | Follow-up |
|---|---|---|---|---|
| Woodmart theme | Commercial (Mikemst) | **None in mirror** | **`UNKNOWN`** — cannot confirm license terms without evidence | Obtain license or remove from repo |
| WooCommerce | GPL v3 | License file not present in mirror (but GPL allows redistribution) | **`UNKNOWN`** — compliance likely but unverified | Verify GPL compliance |
| Elementor | GPL v2 (free) / Commercial (Pro) | License file not present | **`UNKNOWN`** | Verify which version is present |
| pro-elements | Elementor Pro fork | License file not present | **`UNKNOWN`** — may be commercial | Obtain license or remove |
| Slider Revolution | Commercial | License file not present | **`UNKNOWN`** | Obtain license or remove |
| Contact Form 7 | GPL v2 | License file not present | **`UNKNOWN`** — compliance likely | Verify GPL compliance |

**Missing license files are a release risk, not proof of infringement.**

### Decision D — Git Hygiene

**Status: `RECOMMENDATION`** — optional maintenance, not an implementation blocker.

- 2023 loose objects (75.93 MiB) — `git gc` would pack them.
- 1 garbage object (`.git/objects/9e/tmp_obj_tLfKTo`) — safe to remove with `git prune`.
- **Not performed** in this PR per non-negotiable boundaries.

---

## 7. Blocker Summary

| Category | Count | Items |
|---|---|---|
| **Implementation blockers** | **1** | Decision A (commerce architecture; cart/checkout only) |
| **Documentation-governance decision** | **1** | Decision B (authority and disposition of the three source docs) |
| **Release-readiness conditions** | **1** | Decision C (vendor licensing) |
| **Documentation findings** | **11** | SM-1–SM-4 (4), PR-1–PR-4 (4), AR-1–AR-3 (3); across 3 docs |
| **Optional maintenance** | **2** | Decision D (git gc), `.gitignore` addition at scaffold |

---

## Appendix — Per-Product Extraction (Revalidated at `f8d78f5`)

| Slug | Title | Cat | Prices | Vars | Gallery Slots | Unique Images | Local imgs | Desc | Sale Markup |
|---|---|---|---|---|---|---|---|---|---|
| camo-trucker-hat-classic-embroidered-camouflage-mesh-cap | ✓ | front-hat | 32 | 1 | 2 | 7 | 7/7 | ✓ | No |
| classic-sponge-fleece-hoodie-cozy-pullover-sweatshirt | ✓ | hoodie | 75.48/86.35 | 24 | 8 | 12 | 12/12 | ✓ | No |
| classic-white-backpack-minimalist-everyday-school-travel-bag | ✓ | bag | 72.17 | 1 | 4 | 11 | 11/11 | ✓ | No |
| cozy-three-panel-fleece-hoodie-lightweight-white-pullover | ✓ | hoodie | 42.57/86.35 | **0 (missing)** | 24 | 29 | 29/29 | ✓ | No |
| duffel-bag | ✓ | bag | 77.13 | 1 | 4 | 10 | 10/10 | ✓ | No |
| heather-gray-full-zip-hoodie-classic-casual-zip-up-hooded-jacket | ✓ | hoodie | 47.95/58.37 | 8 | 2 | 7 | 7/7 | ✓ | No |
| i-love-you-with-all-my-butt-t-shirt-funny-romantic-graphic-tee | ✓ | shirt | 20.68/29.43 | 7 | 4 | 8 | 8/8 | ✓ | No |
| laptop-sleeve | ✓ | bag | 29.52 | 1 | 3 | 9 | 9/9 | ✓ | No |
| leather-patch-dad-hat-classic-rectangle-patch-baseball-cap | ✓ | front-hat | 22.47 | 1 | 4 | 8 | 8/8 | ✓ | No |
| low-profile-baseball-cap-classic-minimalist-white-dad-hat-for-everyday-wear | ✓ | front-hat | 23.65 | 1 | 5 | 10 | 10/10 | ✓ | No |
| personalized-weekend-tote-bag-large-canvas-weekender-with-rope-handles | ✓ | bag | 51.68 | 1 | 4 | 11 | 11/11 | ✓ | No |
| sweet-dreams-t-shirt-retro-cozy-sleepwear-graphic-tee | ✓ | shirt | 20.68/29.43 | 7 | 4 | 9 | 9/9 | ✓ | No |
| white-crewneck-t-shirt | ✓ | shirt | 19.18/23.75 | 6 | 4 | 9 | 9/9 | ✓ | No |

**Totals:** 13/13 products; 72 reported gallery slots; per-product unique image counts sum to 140 (7+12+11+29+10+7+8+9+8+10+11+9+9); the globally deduplicated image-path total is **not established**. Appendix local counts sum to 140/140 per-product references, but this is not proof of 140 globally unique paths. Re-run the inventory below before asserting a global unique-file total. One missing variation matrix (cozy-three-panel); 0 sale markup.

---

## Validation Commands

```powershell
# Route counts
(Get-ChildItem -Directory | Where-Object { Test-Path "$($_.FullName)\index.html" }).Count  # canonical route dirs
(Get-ChildItem product -Directory).Count  # 13 products
(Get-ChildItem -Recurse -File -Filter index.html | Where-Object { $_.FullName -notmatch '[\\/](wp-content|wp-includes)[\\/]' }).Count  # expected 46 only if source inventory confirms this scope; feeds/wp-json counted explicitly

# Product verification
(Get-ChildItem product -Directory | ForEach-Object { 
  $t = Get-Content "$($_.FullName)\index.html" -Raw
  [PSCustomObject]@{
    Slug = $_.Name
    HasSaleMarkup = $t -match '<ins'
    HasVariationMatrix = $t -notmatch 'data-product_variations="false"'
    HasOutOfStock = $t -match 'outofstock|out-of-stock'
  }
}) | Format-Table

# Gallery figure slots and image paths inside those figures (run from repository root)
$pages = Get-ChildItem product -Directory | ForEach-Object { Get-Item (Join-Path $_.FullName 'index.html') }
$figures = foreach ($page in $pages) {
  $html = Get-Content $page.FullName -Raw
  foreach ($figure in [regex]::Matches($html, '<figure\b[\s\S]*?</figure>', 'IgnoreCase')) {
    [PSCustomObject]@{ Product = $page.Directory.Name; Html = $figure.Value }
  }
}
$matches = foreach ($figure in $figures) {
  foreach ($m in [regex]::Matches($figure.Html, 'wp-content/uploads/\d{4}/\d{2}/[^"''\s<>]+\.(?:jpg|jpeg|png|webp)', 'IgnoreCase')) {
    [PSCustomObject]@{ Product = $figure.Product; Path = $m.Value }
  }
}
# Keep figure slots, product/path pairs, and global paths as distinct metrics.
$globalPaths = @($matches.Path | Sort-Object -Unique)
[PSCustomObject]@{
  GalleryFigureSlots = @($figures).Count
  FigureImageReferences = @($matches).Count
  ProductPathPairs = (@($matches | Sort-Object Product, Path -Unique)).Count
  GlobalDistinctPaths = $globalPaths.Count
  MissingLocalPaths = (@($globalPaths | Where-Object {
    $local = $_ -replace '/', [IO.Path]::DirectorySeparatorChar
    -not (Test-Path -LiteralPath $local)
  })).Count
} | Format-List

# Secrets scan (manual)
Select-String -Path docs\*.md -Pattern 'AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{20,}|-----BEGIN' -AllMatches

# Git state
git log --oneline
git count-objects -vH
```

---

## Audit and Handoff Instructions

1. Run the route and gallery commands from the repository root on the exact commit being reviewed; save stdout with the commit SHA and PowerShell version in the review record.
2. Do not equate gallery `<figure>` slots, raw image references, per-product distinct paths, and globally distinct file paths. Publish each metric separately and investigate any mismatch before marking it `VERIFIED`.
3. The appendix's 140 summed per-product counts do not prove 140 globally distinct files. The previous 72 unique-file / 72-of-72 claim is withdrawn until a deduplicated inventory confirms it.
4. Keep Decision A as the only current implementation blocker, limited to cart/checkout. Resolve Decision B by recording whether the three source docs are corrected here or in a separately approved change. Do not treat governance uncertainty as a blanket blocker for unrelated scaffolding.
5. Do not claim build, runtime, security-scanner, or live-commerce validation unless the corresponding command/service was actually run; record unavailable checks as `UNKNOWN` with the reason.
6. This report is documentation-only. No source application behavior, vendor assets, credentials, or git object-store maintenance is changed by this remediation.

**Merge authorization was not granted. This PR is for review only.**
