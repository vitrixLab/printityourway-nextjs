# Print Custom — Next.js catalog migration

This branch adds a native Next.js App Router catalog alongside the untouched WordPress HTML mirror. The original HTML files remain reference material and are not used as runtime templates.

## Run locally
- Node.js 20.9+ (required by Next.js 16)
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Implemented
- Shared responsive header/footer and catalog styling
- Home page, searchable/sortable shop, four category routes, all 13 product detail routes
- Static route generation for products and categories
- Product catalog data seeded from `docs/PRODUCTS.md`
- About/contact information pages
- Explicit non-purchasable cart/checkout placeholders plus wishlist/compare placeholders
- No WordPress, WooCommerce, Elementor, Woodmart, Slider Revolution, or Contact Form 7 runtime is carried over

## Deliberate limitations
This is the first conversion slice, not a production commerce launch. The mirror has no checkout form and the cozy three-panel hoodie variation matrix is missing. Prices/stock must not be fabricated. Add-to-cart, payments, orders, stock reservation, contact email delivery, wishlist persistence, and comparison persistence are not implemented. Decide between headless WooCommerce, SaaS commerce, or static-catalog scope before commerce work.

Product images temporarily hotlink to the original public WordPress media URLs; migrate approved/licensed assets into `public/images/products/<slug>/` before cutover. Keep the original mirror until visual comparison and route/build checks pass.
