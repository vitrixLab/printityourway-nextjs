# Comparison Findings — Next.js Branch vs Live WordPress (printityourway.com)

**Date:** 2026-10-14
**Branch under review:** `feat/html-to-nextjs-catalog` (commit `cc6f40f`) — report committed on `dev`
**Remediation branch:** `feat/parity-remediation` — commits `b671b21` (data), `192b794` (header/footer), `bfd069a` (pages/catalog), plus tests/docs commit. Statuses in §7 were verified against build output, `npm test`, and the extracted mirror data.
**Sources compared:**
- Live site: `https://printityourway.com/` (fetched 2026-10-14: home, shop, about-us, contact-us, one product page)
- Local wget mirror: `index.html`, `shop/index.html`, `about-us/index.html`, `contact-us/index.html`, `product/<slug>/index.html` ×13 (canonical list in `docs/SITE_MAP.md`)
- Next.js implementation: `app/**`, `components/**`, `data/products.ts` + `data/products.json` (generated from the mirror by `scripts/extract-mirror-data.ps1` → `scripts/generate-products.mjs`)
**Build evidence:** `npm run build` succeeds — Next.js 16.4.0, 27 routes generated (home, shop dynamic, 4 category archives, 13 SSG products, 5 static utility pages + 404). `npm test` passes (7 data-integrity tests).

**Purpose:** surgical review input. Findings below are preserved as originally reported; §7 records the verified remediation status of each.

---

## Evidence Labels

| Label | Meaning |
|---|---|
| `VERIFIED` | Directly supported by inspected evidence (mirror HTML, live fetch, or build output) |
| `PARTIAL` | Some evidence exists; the comparison claim is incomplete |
| `UNKNOWN` | Evidence missing or insufficient |
| `RECOMMENDATION` | Proposed action, not an established fact |

---

## 1. Executive Summary

*Original verdicts (pre-remediation) are preserved in §2/§3; this table reflects the remediated state — see §7 for per-finding detail.*

| Area | Original verdict | Remediated verdict |
|---|---|---|
| Route parity | **PASS** | **PASS** — unchanged |
| Base pricing | **PASS** (1 exception) | **PASS** — all 13 prices/ranges correct incl. cozy-three-panel `42.57–48.08` |
| Product option/variation data | **FAIL** (CMP-01…CMP-13) | **FIXED** — full per-product attributes + 12/13 variation matrices from the mirror; covered by `npm test` |
| Product copy (descriptions) | **FAIL** (CMP-14) | **FIXED** — real description-tab copy (features/care/GPSR blocks) rendered on product pages |
| Product imagery | **PARTIAL** (CMP-15) | **FIXED** — full galleries; clickable product gallery; card hover-swap |
| Home/shop/about/contact content | **FAIL** (CMP-17…CMP-21) | **PARTIAL** — hero slider, steps, sections, banners, categories, about copy, FAQ + form restored; remaining gaps listed in §7 (tabbed home grid, share/reviews/tabs, some about sections) |
| Header/footer feature parity | **FAIL** (CMP-22, CMP-23) | **FIXED** — top bar, logo, wired search + category dropdown, tools, mobile menu; footer columns, socials, credit; source bugs (wpmet link, "Turms" typo) fixed |
| Cart/checkout/wishlist/compare behavior | **BY DESIGN** | **BY DESIGN** — honest placeholders preserved (CMP-24 boundary) |
| Category label copy | **FAIL (cosmetic)** (CMP-16) | **FIXED** — singular source labels ("Bag", "Front Hat", "Hoodie", "Shirt") used in dropdown, breadcrumbs, category headings, and card links |

**Top risk (resolved):** fabricated option matrices and descriptions were the top data risk; they are now generated from the mirror (`data/products.json`) and guarded by `npm test`. Remaining top risk: **CMP-28 asset hotlinking** — all imagery still loads from `printityourway.com` and must be localized before cutover.

---

## 2. Findings — Product Data (`data/products.ts`)

Ground truth for each row: the WooCommerce variation form embedded in `product/<slug>/index.html`
(`<select name="attribute_*">` option lists + `data-product_variations` JSON). Live-site fetches were
spot-checked for the same values and agreed with the mirror.

| ID | Severity | Location | Finding | Evidence | Label |
|---|---|---|---|---|---|
| CMP-01 | **High** | `data/products.ts:16` `white-crewneck-t-shirt` | Sizes listed `S,M,XL,2XL` (missing `3XL`). Mirror: `S M L XL 2XL 3XL` (`attribute_sizes`). Live product page confirms `3XL`. | `product/white-crewneck-t-shirt/index.html` select; live fetch | `VERIFIED` |
| CMP-02 | **High** | `data/products.ts:15` `sweet-dreams-…-graphic-tee` | Sizes missing `3XL`,`4XL`; Color lists `White, Black` but mirror has **White only** (`attribute_comfort-colors-colors`). `Black` is fabricated. Mirror sizes: `S M L XL 2XL 3XL 4XL`. | `product/sweet-dreams-…/index.html` | `VERIFIED` |
| CMP-03 | **High** | `data/products.ts:10` `i-love-you-with-all-my-butt-…` | Same defect as CMP-02: sizes missing `3XL`,`4XL`; Color `Black` fabricated (mirror: White only); attribute name is `comfort-colors-colors`, not `colors`. | `product/i-love-you-…/index.html` | `VERIFIED` |
| CMP-04 | **High** | `data/products.ts:9` `heather-gray-full-zip-…` | Sizes missing `XS`,`3XL`,`4XL` (mirror: `XS S M L XL 2XL 3XL 4XL`, `attribute_clothing-sizes`). Color value `Heather Gray` is wrong; mirror value is **`Dark Heather Grey`** (`attribute_district-colors`). | `product/heather-gray-…/index.html` | `VERIFIED` |
| CMP-05 | **High** | `data/products.ts:7` `cozy-three-panel-…` | Two defects: (a) price `range:[42.57,86.35]` — upper bound `86.35` is the *sponge fleece hoodie's* max; mirror shows **`$42.57 – $48.08`**. (b) Color list is `["White"]`; mirror has **6 colors**: White, Heather Grey, Black, Army Green, Blue Mist, Sports Green. Sizes `XS…3XL` are correct. `variationDataComplete:false` is correct (`data-product_variations="false"` in mirror). | `product/cozy-three-panel-…/index.html` price block + selects | `VERIFIED` |
| CMP-06 | **Medium** | `data/products.ts:5` `classic-sponge-fleece-…` | Color list `Black, White, Heather Gray, Navy` is wrong. Mirror (`attribute_colors`): **White, True Royal, Team Purple, Maroon**. Sizes `XS…2XL` are correct. | `product/classic-sponge-fleece-…/index.html` | `VERIFIED` |
| CMP-07 | **Medium** | `data/products.ts:4` `camo-trucker-hat-…` | Only `Hat size: One size` is modeled. Mirror has two attributes: `hat-sizes = One size` **and** `otto-colors = Camo Olive`. | `product/camo-trucker-hat-…/index.html` | `VERIFIED` |
| CMP-08 | **Medium** | `data/products.ts:12` `leather-patch-dad-hat-…` | `options` is undefined. Mirror has three attributes: `colors = White / Grey patch`, `patch-shape = Rectangle`, `sizes = One size`. | `product/leather-patch-dad-hat-…/index.html` | `VERIFIED` |
| CMP-09 | **Medium** | `data/products.ts:13` `low-profile-baseball-cap-…` | `options` undefined. Mirror: `colors = White`, `size = One size` (note singular attribute name `size`). | `product/low-profile-baseball-cap-…/index.html` | `VERIFIED` |
| CMP-10 | **Low** | `data/products.ts:8` `duffel-bag` | `options` undefined. Mirror: `sizes = Small`. | `product/duffel-bag/index.html` | `VERIFIED` |
| CMP-11 | **Low** | `data/products.ts:11` `laptop-sleeve` | `options` undefined. Mirror: `sleeve-sizes = 13"`. | `product/laptop-sleeve/index.html` | `VERIFIED` |
| CMP-12 | **Low** | `data/products.ts:6` `classic-white-backpack-…` | `options` undefined. Mirror: `bag-size = One size`. | `product/classic-white-backpack-…/index.html` | `VERIFIED` |
| CMP-13 | **Low** | `data/products.ts:14` `personalized-weekend-tote-…` | `options` undefined. Mirror: `bag-size = 24" × 13"`. | `product/personalized-weekend-tote-…/index.html` | `VERIFIED` |
| CMP-14 | **High** | `data/products.ts` (all `description` fields) | Descriptions are short invented summaries (e.g. "A versatile white crewneck tee with a timeless fit."). The mirror's `woocommerce-product-details__short-description` is **empty for all 13 products**; the real copy lives in the WooCommerce **description tab** (long-form text with "Product features" and "Care instructions" sections — verified on `white-crewneck-t-shirt`). None of that copy is in the branch. | mirror description tab; live product page | `VERIFIED` |
| CMP-15 | **Medium** | `data/products.ts` (single `image` field) | Each product stores one image. Mirror pages expose 4–10 distinct gallery images per product (e.g. white-crewneck: 4 gallery images `3566317684954824995`, `16843150591813151545`, `3590567772590046954`, `7612444954626730136`). Gallery hover-swap on product cards is therefore impossible. | mirror gallery markup; `docs/PRODUCTS.md` gallery note | `VERIFIED` |
| CMP-16 | Info | `data/products.ts:18` category labels | Original taxonomy labels are singular and specific: **Bag, Front Hat, Hoodie, Shirt** (visible in header dropdown, breadcrumbs, product-card category links, and shop sidebar). Branch renders "Bags", "Hats", "Hoodies", "T-Shirts". Slugs (`bag`, `front-hat`, `hoodie`, `shirt`) are correct — only display copy differs. | live home/shop/product pages; mirror | `VERIFIED` |

**Investigation notes for §2:**
- `attribute_*` names differ per product (`sizes` vs `clothing-sizes` vs `hat-sizes` vs `sleeve-sizes` vs `bag-size` vs `size`; `colors` vs `comfort-colors-colors` vs `otto-colors` vs `district-colors` vs `patch-shape`). A flat `options: Record<string,string[]>` works, but the extraction script must read attribute names per page, not assume a fixed schema.
- The cozy-three-panel upper-bound error (CMP-05a) is a copy-paste defect from a sibling hoodie product — worth grepping for other cross-product value bleed during remediation.
- Whether to model the full `data-product_variations` matrix (per-combination price/stock/image) vs. option lists only is an open design decision; the mirror supports the full matrix for 12/13 products.

---

## 3. Findings — Page Content & Features

| ID | Severity | Route / Component | Gap vs original | Evidence | Label |
|---|---|---|---|---|---|
| CMP-17 | **High** | `/` (`app/page.tsx`) | Original home is an 87-section Elementor page with: (1) Slider Revolution hero, 3 slides — "Trendsetting T-Shirts Drop" (shirt), "Shade in Your Perfect Hat" (front-hat), "Stay Cozy Essential Hoodie" (hoodie), each with Shop Now CTA; (2) 3-step how-it-works (Choose Product / Upload Design / Get Customized); (3) "T SHIRTS" product row (3 products); (4) "Find Your Perfect Design with Printify" copy block + image; (5) "HATS" product row (3); (6) two promo banners (New T-Shirts / Hoodies Stay Cozy); (7) tabbed "New offers" grid (tabs: New Arrival / T Shirts / Hats / Hoodies / Bags, 12 products); (8) "POPULAR CATEGORIES" with product counts (Shirt 3, Hoodie 3, Front Hat 3, Bag 4). Branch home = invented hero ("Little things. Made personal."), category tiles without images, and a single 8-product grid. None of the original section copy or imagery was carried over. | live home fetch; branch `app/page.tsx` | `VERIFIED` |
| CMP-18 | **High** | `/shop` (`app/shop/page.tsx`) | Original shop has: sidebar filter (category list with counts, min/max price range + Filter, stock status On sale / In stock, Top rated products widget); result count "Showing 1–12 of 13 results"; pagination to `/shop/page/2/`; per-page selector 9/12/18/24; grid-width toggles (2/3/4 columns); sort options: Default, popularity, average rating, latest, price low→high, price high→low; card hover actions (Add to compare, Quick view, Add to wishlist, "Select options"). Branch shop has: text search, category select, sort (Featured / price asc / price desc), a disclaimer line, and plain product cards with no actions. No pagination, no price/stock/rating filters, no grid toggles. | live shop fetch; branch `app/shop/page.tsx` | `VERIFIED` |
| CMP-19 | **High** | `/product/[slug]` (`app/product/[slug]/page.tsx`) | Original product page has: image gallery (4 thumbs + zoom + "Click to enlarge"), breadcrumbs (Home / Shirt / name), prev/next product navigation, price, attribute selects, quantity selector, **Add to cart**, Add to compare, Add to wishlist, tabbed Description / Shipping and Delivery content, SKU (N/A), category, social share (Facebook, X, Pinterest, LinkedIn, Telegram), Reviews block ("There are no reviews yet" + review form), Related products row. Branch product page has: breadcrumb line, single image, price, invented one-line description, option selects (no live price-by-variant), disabled "Purchasing unavailable" button, "You may also like" row. Missing: gallery, quantity, cart actions, tabs, share, reviews, prev/next, SKU. | live product fetch; mirror; branch page | `VERIFIED` |
| CMP-20 | **High** | `/about-us` (`app/about-us/page.tsx`) | Original about page has real brand copy ("Welcome to **Print It Your Way**, where creativity meets fashion…", tagline "**Customize Your Design**", paragraphs on target audience), a "We Print Customized / T-Shirts, Apparel / And / Much More" icon-row section, an explanatory paragraph ("We will print any of your images, photos, company logo…"), Shop Now CTAs, and a "The Shirt Is a Staple for Man's" banner. Branch about page is two generic paragraphs plus a migration notice — none of the original copy present. | live about fetch; branch page | `VERIFIED` |
| CMP-21 | **High** | `/contact-us` (`app/contact-us/page.tsx`) | Original contact page has: FAQ accordion with 5 real Q&As (fabric quality, print fading, bulk orders, delivery time, customization) and a contact form (Your Name, Your Email, Phone Number, Company, Your Message) backed by Contact Form 7 (`wpcf7-f1572-p4439-o1`). Branch contact page is an email link plus a note about CF7. FAQ copy and form UI are absent. | live contact fetch; `docs/SITE_MAP.md:43`; branch page | `VERIFIED` |
| CMP-22 | **High** | `components/Shell.tsx` header | Original header (all pages): top bar (email `Contact@printityourway.com`, "United States America" location, 5 social icons); logo image (`Print-it-scaled.png`); category dropdown ("Select category" → Bag / Front Hat / Hoodie / Shirt); search control; Wishlist link; Compare link with count; mini-cart link "0 items $0.00"; mobile Menu with logo + cart. Branch header: text wordmark "PRINT CUSTOM", 8 inline nav links (adds category links inline), text "Cart" link. Missing: top bar, logo image, category dropdown, search, wishlist, compare, cart count/total, mobile menu. | live fetches (all pages); `components/Shell.tsx:2` | `VERIFIED` |
| CMP-23 | **High** | `components/Shell.tsx` footer | Original footer: brand image + "**Print it Your Way** where fashion meets individuality."; Company column (Home, About Us, Shop, Contact Us — note: Home link on the live site points at a `wpmet.com` plugin demo URL, a pre-existing source bug); Quick Links column (FAQ, Support, Privacy Policy, "Turms & Condition" — typo is in the source); Contact column (email, "United States America"); social row (Facebook, Instagram, tiktok, Youtube); credit line "Developed By **Voxturr** 2025 **Print Custom**."; footer brand image. Branch footer: wordmark, one sentence, 3 links, email, dynamic copyright. Missing columns, socials, location, credit. | live fetches; `components/Shell.tsx:3` | `VERIFIED` |
| CMP-24 | Info | `/cart`, `/checkout`, `/wishlist`, `/compare` | Original: WooCommerce empty cart; checkout page in the mirror is a duplicate of the empty-cart page with `<title>` still "Cart" (no billing form exists in source); Woodmart wishlist/compare. Branch ships honest "not configured" placeholders. This matches the declared limitation in `README-NEXTJS.md:22`. No action required beyond the existing commerce-backend decision. | mirror; branch pages; `README-NEXTJS.md` | `VERIFIED` |
| CMP-25 | **Medium** | `/product-category/[slug]` | Original category archives are full shop archives: breadcrumb, sidebar filters, result count, sorting, pagination — same feature set as `/shop` (CMP-18). Branch category pages render a heading + product grid only, with no filters, count, or sort. | mirror category pages; live category URLs; branch page | `VERIFIED` |
| CMP-26 | **Medium** | Product cards (`components/Catalog.tsx`) | Original cards: hover image swap (second gallery image), Add to compare, Quick view, Add to wishlist, "Select options" button + variant hint text ("This product has multiple variants…"), product name, linked category label, price or price range with "Price range: X through Y" screen-reader text. Branch cards: image, category text (not a link), name, price. No hover swap, no actions, no category link. | live shop/home fetches; `components/Catalog.tsx` | `VERIFIED` |
| CMP-27 | Info | Metadata / SEO | Original titles follow WordPress patterns: "Shop – Print Custom", "About us – Print Custom", "White Crewneck T-Shirt – Print Custom". Branch uses a title template `%s | Print Custom` — equivalent structure, different separator (`|` vs `–`). No `<title>` regression risk; flag only for pixel-exact SERP parity. | live `<title>`s; `app/layout.tsx:2` | `VERIFIED` |
| CMP-28 | Info | Imagery hosting | All product images hotlink `https://printityourway.com/wp-content/uploads/…` (`data/products.ts:2`). Already documented as a temporary measure in `README-NEXTJS.md:24`; still a cutover blocker (external dependency, licensing, and origin hotlink-protection risk). | `data/products.ts:2`; `README-NEXTJS.md` | `VERIFIED` |

---

## 4. What Already Matches (no action)

| Item | Evidence |
|---|---|
| All 25 canonical URLs implemented; product and category slugs identical to the mirror | build output; `docs/SITE_MAP.md` route table vs `app/**` tree |
| All 13 base prices and the 6 two-point price ranges match the mirror, except the cozy-three-panel upper bound (CMP-05a) | mirror `<p class="price">` extraction vs `data/products.ts` |
| Category product counts (bag 4, front-hat 3, hoodie 3, shirt 3) match the shop sidebar counts on the live site | live shop fetch |
| Cart/checkout/wishlist/compare deliberately non-functional and honestly labeled — consistent with `README-NEXTJS.md` limitations | branch pages |
| Build is green: TypeScript passes, 27 routes prerendered | `npm run build` 2026-10-14 |
| Breadcrumb-style product navigation (Home / Shop / name) exists on product pages | `app/product/[slug]/page.tsx` |
| "You may also like" related-products row approximates the original Related products section | branch product page; live product page |

---

## 5. Recommended Remediation Order (`RECOMMENDATION`)

1. **Fix product data (CMP-01…CMP-13)** — regenerate `data/products.ts` option matrices directly from each mirror page's `<select name="attribute_*">` lists and `data-product_variations` JSON; correct the cozy-three-panel range (CMP-05a); decide on naming/label normalization for category display copy (CMP-16).
2. **Extract real descriptions and galleries (CMP-14, CMP-15)** — parse the description tab per product; store gallery image arrays; update `Catalog.tsx` for hover-swap.
3. **Rebuild header/footer to feature parity (CMP-22, CMP-23)** — top bar, logo, category dropdown, search entry point, wishlist/compare/cart slots, footer columns + socials. Note the two pre-existing source bugs (wpmet.com Home link, "Turms & Condition" typo) and decide whether to preserve or fix.
4. **Port page content (CMP-17…CMP-21)** — home sections in original order with real copy; shop filters/pagination/sort; product gallery/tabs/share/reviews; about copy; contact FAQ + form UI (form *delivery* stays blocked on the CF7/mail-provider decision).
5. **Category archives as shop views (CMP-25)** and **card actions (CMP-26)**.
6. **Asset localization (CMP-28)** before any cutover.

## 6. Open Questions for Review

1. Option matrices: model full per-variation data (price/stock/image per combination) or option lists only? The mirror supports full matrices for 12/13 products; cozy-three-panel genuinely has none (`data-product_variations="false"`).
2. Source-copy fidelity: reproduce original text verbatim (including the "Turms & Condition" typo and the wpmet.com Home link), or fix while converting?
3. Category display labels: adopt the original singular labels ("Front Hat", "Shirt") for parity, or keep the current plural marketing labels?
4. Home hero: the original depends on Slider Revolution (a WordPress plugin). What is the target replacement — static section, React carousel, or CMS-driven slides?

---

## 7. Remediation Status (verified 2026-10-14 on `feat/parity-remediation`)

Statuses: `FIXED` (finding resolved and verified), `PARTIAL` (core gap closed; residual scope named), `BLOCKED` (cannot close without an external decision/data), `BY DESIGN` (no action required).

| ID | Status | Commit(s) | Verified by / residual notes |
|---|---|---|---|
| CMP-01…CMP-04, CMP-06…CMP-13 | `FIXED` | `b671b21` | Attributes extracted per product (`scripts/extract-mirror-data.ps1` → `data/products.json`); `npm test` asserts value sets, labels, uniqueness, and mirror-count parity. |
| CMP-05 | `FIXED` | `b671b21` | Range corrected to `42.57–48.08`; all 6 mirror colors present; `variations` correctly absent (`data-product_variations="false"`); product page shows the explicit no-matrix notice. |
| CMP-14 | `FIXED` | `b671b21` | Real description-tab paragraphs (intro, Product features, Care instructions, GPSR blocks where present) rendered per product; `white-space: pre-line` preserves source line breaks. |
| CMP-15 | `FIXED` | `b671b21`, `bfd069a` | Full gallery arrays in source order; product page has clickable thumbnail gallery (`ProductGallery`); cards hover-swap to the second gallery image. |
| CMP-16 | `FIXED` | `b671b21`, `bfd069a`, `192b794` | Singular `sourceLabel` now drives header dropdown, breadcrumbs, category page H1s/metadata, home tiles, and card category links. Plural `name` remains in data only (unused in UI). |
| CMP-17 | `PARTIAL` | `bfd069a` | Restored: 3-slide hero (real headlines, copy, images, Shop Now targets) as a CSS-only auto-rotating slider (no JS plugin); Choose Product / Upload Design / Get Customized steps with source lorem copy and icons; T SHIRTS + HATS rows; Printify heading + intro paragraph; both promo banners (real bg images, subtitles, copy, buttons); POPULAR CATEGORIES with counts and singular labels. Not converted: the tabbed "New offers" grid (tabs: New Arrival / T Shirts / Hats / Hoodies / Bags) — replaced by a single all-products grid under the banners; Slider Revolution transitions are approximated by a CSS crossfade. |
| CMP-18 | `PARTIAL` | `bfd069a` | Added: header-search params honored (`s`, `product_cat`), 12-per-page pagination with source count wording ("Showing 1–12 of 13 results"), sort labels aligned to source where data exists. `BLOCKED` residual: popularity / average-rating / latest sorts — the mirror carries no sales counts, ratings, or publish dates; price-range / stock / top-rated sidebar filters and per-page + column toggles not implemented (no rating/stock data; toggles are cosmetic preference UI). |
| CMP-19 | `PARTIAL` | `b671b21`, `bfd069a` | Added: clickable gallery, breadcrumbs, SKU line, real descriptions, accurate attribute selects, variation-resolved price + stock display (honest "not in matrix" fallback), no-matrix notice. `BLOCKED` residual: quantity, Add to cart, compare/wishlist actions, reviews — commerce backend (CMP-24) and no review data in mirror. Not converted: Shipping and Delivery tab content, social share links, prev/next product navigation, tabbed layout (description renders inline). |
| CMP-20 | `PARTIAL` | `bfd069a` | Restored: five real brand paragraphs + Fashion-store image + honest preview note. Not converted: "We Print Customized / T-Shirts, Apparel / And / Much More" icon row, Shop Now CTAs, "The Shirt Is a Staple for Man's" banner. |
| CMP-21 | `FIXED` | `bfd069a` | FAQ accordion with all 6 source items (incl. the unnumbered "Where can I ship my order?" lorem answer, first item open like source) + full CF7 field set (Your Name*, Your Email*, Phone Number, Company, Your Message, "ASK A QUESTION"). Submit never fakes success: shows an explicit "Not sent" notice with the direct email. |
| CMP-22 | `FIXED` | `192b794`, `bfd069a` | Top bar (email, United States America, 5 social icons), logo image, wired search form + "Select category" dropdown → `/shop`, Wishlist/Compare(0)/Cart(0 items $0.00) tools, bottom nav (Home / About us / Shop / Contact us) + Explore More, mobile Menu disclosure. Cosmetic gaps: tool icons are text-only; social icons render as labeled non-links because source hrefs are empty placeholders (no dead buttons). |
| CMP-23 | `FIXED` | `192b794` | Footer: brand image, tagline, Company / Quick Links / Contact columns, social row (Facebook, Instagram, TikTok, Youtube — exact source SVG paths), Voxturr credit. Source bugs fixed intentionally: wpmet.com Home link → `/`; "Turms & Condition" → "Terms & Conditions". FAQ/Support/Privacy Policy render as inert text (no target pages exist in source; `#` links omitted per no-dead-buttons rule). |
| CMP-24 | `BY DESIGN` | — | Honest cart/checkout/wishlist/compare placeholders preserved; card-level add-to-cart deliberately not rendered. |
| CMP-25 | `FIXED` | `bfd069a` | Category archives are shop views: breadcrumb (Home / singular label), singular H1, "Showing all N results" count, sort control. Pagination omitted — no category exceeds 12 products. |
| CMP-26 | `PARTIAL` | `bfd069a` | Added: hover image swap, linked singular category label, screen-reader "Price range: X through Y", "Select options" link to the product page (multi-variant products only; single-variant products show no fake add-to-cart). Omitted (would be dead buttons): Add to compare, Quick view, Add to wishlist. |
| CMP-27 | `PARTIAL` | `bfd069a` | Default title is now "Print Custom" (matches source home title); template separator remains `|` vs source `–` — cosmetic only. |
| CMP-28 | `BLOCKED` | — | All imagery (products, galleries, logos, banners, icons) still hotlinks `printityourway.com/wp-content/uploads/…`. Localization remains a cutover blocker (external dependency, licensing, hotlink-protection risk). |
| Header search wiring | `FIXED` | `bfd069a` | Header form GETs `/shop?s=…&product_cat=…`; shop honors both (falls back to legacy `q`/`category` params). |

**Test coverage:** `npm test` (`scripts/products.test.mjs`) guards: exact 13-slug roster, verified spot prices/ranges, cozy-only missing matrix, gallery/description/attribute invariants, variation-key/value validity and uniqueness, per-product variation-count parity with the mirror, singular source labels.

---

*Report scope: comparison + remediation status. Original findings (§2, §3) are unmodified audit record; §7 is the verified post-remediation overlay.*
