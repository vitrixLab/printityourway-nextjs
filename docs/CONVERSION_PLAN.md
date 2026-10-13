# Conversion Plan — printityourway-bp → Next.js

Base playbook: `D:\citrixlabph\HTML-TO-NEXTJS.md` (single-file `index.html` → Next.js).
That playbook was written for a **single static landing page** (`hopkinstalentgroup/`).
This project is a **full WooCommerce store mirror** (13 variable products, 4 categories,
cart/checkout/wishlist/compare, ~860 filter-state HTML artifacts). The playbook's
component-extraction and verification steps still apply per template, but the structure,
routing, and data layers need the extensions below.

## Verdict on HTML-TO-NEXTJS.md for this project

| Playbook step | Fits this project? | Adjustment |
|---|---|---|
| 1. Scaffold (Next 16, TS, ESLint CLI) | Yes, as-is | Add `@/*` path alias; no changes |
| 2. Extract CSS verbatim | Partially | There is no single `<style>` block — home page has 15 inline `<style>` blocks + **72 external stylesheets** (Elementor kit CSS, Woodmart theme CSS under `wp-content/`). Consolidation strategy needed (see "CSS strategy" below) |
| 3. Fonts/metadata → `layout.tsx` | Partially | Original uses **Inter + Roboto** (Google Fonts link), not Barlow/DM Sans from the playbook example. Map to `next/font/google` the same way |
| 4. Component split | Per page | Playbook assumes one page. Here: 12 route templates (see "Route map") sharing `SiteHeader` / `SiteFooter` / product-card components |
| 5. Images → `public/images` | Yes | Plus: product galleries (~10 images × 13 products) extracted per `PRODUCTS.md`; use `next/image` + remotePatterns for any hotlinked originals during transition |
| 6. Keep original `index.html` | Yes | Keep the whole mirror as reference until visual diff passes |
| 7. Verify (build + lint + class-diff) | Yes | Run the class-sequence diff **per route** (home, shop, one product, one category at minimum) |
| 8. Git | Yes | Mirror is currently untracked inside the citrixlabph repo — decide: separate repo for the Next.js app |

**Gaps the playbook does not cover (commerce-specific):**

1. **No commerce backend decision.** Cart/checkout/wishlist/compare in the mirror are
   server-rendered WooCommerce pages with AJAX fragments (`cart-fragments.min.js`,
   `woodmart-ajax-shop-on`). Static HTML cannot recreate them. Options:
   - **A. Headless WooCommerce** (WPGraphQL or Woo REST) — keeps the same products/prices/stock; most faithful.
   - **B. SaaS commerce** (Shopify, Medusa) — cleaner DX, product data must be re-entered (13 products is small).
   - **C. MVP static catalog** — convert only home/shop/product/category/about/contact; cart/checkout/wishlist/compare become placeholder routes or link out. Fastest path, matches "preparation" scope.
   Decide before scaffolding; the route map below assumes A or C.
2. **Variable products.** All 13 products are variable (size/color variations with per-variation
   prices). Needs a `ProductVariation` type + client-side variation picker in `data/products.ts`.
3. **Shop filters.** The mirror's ~860 `index.html?per_page=…&per_row=…&shop_view=…&stock_status=…`
   files represent one dynamic page. In Next.js: `/shop` reads `searchParams`
   (`per_page`, `stock_status`, `orderby`) — never enumerate them as static files.
4. **Slider Revolution on home.** Replace with a plain React hero (extract slides' images/copy);
   do not port the RevSlider JS.
5. **Contact Form 7.** Becomes a `<form>` + Next.js route handler (`app/api/contact/route.ts`);
   the CF7 endpoint in the mirror (`…p=4439.html#wpcf7-f1572-p4439-o1`) is WordPress-only.
6. **WooCommerce AJAX behaviors** (add-to-cart fragments, quick view, mini-cart) → React state /
   server actions; the Woodmart JS must not be carried over.

## Target structure (extends the playbook's layout)

```
printityourway-bp/            # or a new sibling repo: printityourway-next/
├── app/
│   ├── layout.tsx            # Inter + Roboto via next/font; SiteHeader/SiteFooter
│   ├── page.tsx              # home (Elementor sections → components)
│   ├── shop/page.tsx         # product grid; searchParams: per_page, stock_status, orderby
│   ├── product-category/[slug]/page.tsx   # bag | front-hat | hoodie | shirt
│   ├── product/[slug]/page.tsx            # generateStaticParams from data/products.ts
│   ├── cart/page.tsx  checkout/page.tsx   # only if headless commerce (option A)
│   ├── wishlist/page.tsx  compare/page.tsx
│   ├── about-us/page.tsx  contact-us/page.tsx
│   ├── api/contact/route.ts  # replaces Contact Form 7
│   └── globals.css          # consolidated CSS (see below)
├── components/
│   ├── SiteHeader.tsx  SiteFooter.tsx  Brand.tsx
│   ├── ProductCard.tsx  ProductGallery.tsx  VariationPicker.tsx
│   ├── ShopFilters.tsx   # client: per_page / stock_status / sort controls
│   └── sections/…         # one per home-page Elementor section
├── data/
│   ├── products.ts         # 13 products, typed; from docs/PRODUCTS.md
│   └── site.ts             # nav, footer, categories, contact info
├── public/images/products/<slug>/…
├── docs/                   # SITE_MAP.md, PRODUCTS.md, CONVERSION_PLAN.md (this file)
├── index.html + product/…  # original mirror, kept as reference (not served)
└── next.config.ts  tsconfig.json  eslint.config.mjs  package.json
```

## CSS strategy (replaces playbook step 2's single-block copy)

1. Copy the home page's 15 inline `<style>` blocks verbatim into `globals.css` (byte-for-byte, then Prettier) — same rule as the playbook.
2. Extract the **theme-level** rules the pages actually depend on from
   `wp-content/themes/woodmart/css/…` and `wp-content/uploads/**/post-29049.css` (Elementor kit).
   Do not import the full Elementor/Woodmart stylesheets (they carry 90% dead rules for this store).
3. Keep original class names (`woodmart-*`, `wd-*`, `elementor-*`, `woocommerce-*`) so the
   class-sequence verification from the playbook still works.
4. Visual-diff each converted route against the mirror file with the playbook's step-7 script.

## Phases

1. **Prep (done)**: graphify knowledge graph + `docs/` inventory (this folder).
2. **Scaffold** per playbook step 1; `data/products.ts` + `data/site.ts` from `PRODUCTS.md`/`SITE_MAP.md`.
3. **Static pages**: home, about-us, contact-us (+ `/api/contact`), shop shell, product detail shell, category pages.
4. **Commerce decision** (A/B/C above) → implement or stub cart/checkout/wishlist/compare.
5. **Verification**: `npm run build`, `npm run lint`, class-diff per route, image 200-check per `PRODUCTS.md`.
6. **Cleanup**: delete wget artifacts (`index.html?p=*`, filter permutations, `wp-includes`, `wp-content`).
