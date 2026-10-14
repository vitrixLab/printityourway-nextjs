# Print Custom — Next.js catalog migration

This branch adds a native Next.js App Router catalog alongside the untouched WordPress HTML mirror. The original HTML files remain reference material and are not used as runtime templates.

## Run locally
- Node.js 20.9+ (required by Next.js 16)
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm test` (data-integrity tests against the mirror extraction)

## Implemented
- Shared responsive header/footer and catalog styling, rebuilt to source parity (top bar, logo, search + category dropdown, tools, mobile menu; footer columns, socials, credit)
- Home page with the source hero slider, steps, product rows, promo banners, and category tiles
- Searchable/sortable/paginated shop honoring header-search params; four category archives with breadcrumbs, counts, and sort
- All 13 product detail routes with clickable galleries, real description-tab copy, accurate attribute selects, and variation-resolved pricing/stock (honest no-matrix notice for cozy three-panel)
- About/contact pages with the real source copy; contact FAQ accordion and form that never fakes submission
- Product data generated from the HTML mirror: `scripts/extract-mirror-data.ps1` → `scripts/mirror-products.json` → `scripts/generate-products.mjs` → `data/products.json` + `data/products.ts` (do not hand-edit product records)
- Explicit non-purchasable cart/checkout placeholders plus wishlist/compare placeholders
- No WordPress, WooCommerce, Elementor, Woodmart, Slider Revolution, or Contact Form 7 runtime is carried over

## Deliberate limitations
This is a conversion slice, not a production commerce launch. The mirror has no checkout form and the cozy three-panel hoodie variation matrix is genuinely absent (`data-product_variations="false"`) — prices/stock by option are not fabricated for it. Popularity/rating/latest shop sorts, reviews, and shipping-tab content are blocked: that data does not exist in the mirror. Add-to-cart, payments, orders, stock reservation, contact email delivery, wishlist persistence, and comparison persistence are not implemented. Decide between headless WooCommerce, SaaS commerce, or static-catalog scope before commerce work.

Product images temporarily hotlink to the original public WordPress media URLs; migrate approved/licensed assets into `public/images/products/<slug>/` before cutover. Keep the original mirror until visual comparison and route/build checks pass.
