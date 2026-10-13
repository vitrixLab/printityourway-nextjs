# Print Custom — Site Map (wget mirror)

Source: wget mirror of https://printityourway.com (WordPress 7.1 + WooCommerce 10.4.3
+ Elementor 3.34 + Woodmart theme). This doc is the canonical inventory for the
Next.js conversion; see `CONVERSION_PLAN.md` for the target structure.

## Canonical pages (the only HTML files that matter)

| Route (WordPress) | Mirror file | Template |
|---|---|---|
| `/` | `index.html` | Elementor home (87 e-con/section, Slider Revolution) |
| `/shop` | `shop/index.html` | WooCommerce shop archive (Woodmart ajax shop) |
| `/product-category/bag` | `product-category/bag/index.html` | Product category archive |
| `/product-category/front-hat` | `product-category/front-hat/index.html` | Product category archive |
| `/product-category/hoodie` | `product-category/hoodie/index.html` | Product category archive |
| `/product-category/shirt` | `product-category/shirt/index.html` | Product category archive |
| `/product/<slug>` ×13 | `product/<slug>/index.html` | Single product (all `product-type-variable`) |
| `/cart` | `cart/index.html` | WooCommerce cart |
| `/checkout` | `checkout/index.html` | WooCommerce checkout (note: `<title>` still says "Cart" in the mirror) |
| `/wishlist` | `wishlist/index.html` (also `index.html?p=60.html`) | Woodmart wishlist |
| `/compare` | `compare/index.html` (also `index.html?p=45.html`) | Woodmart compare |
| `/about-us` | `about-us/index.html` (also `index.html?p=4400.html`) | Elementor page |
| `/contact-us` | `contact-us/index.html` (also `index.html?p=4439.html`) | Elementor page + Contact Form 7 (`wpcf7-f1572-p4439-o1`) |

Products list: see `PRODUCTS.md`.

## Mirror noise (do NOT convert)

- `index.html?p=NNNN.html` — wget saved query-string URLs as files; duplicates of the canonical pages above.
- `shop/index.html?per_page=*&per_row=*&shop_view=*&stock_status=*.html` and the same under `product-category/*/` — ~860 filter-state permutations of the shop/category archives. The filter UI is dynamic in Next.js (searchParams), not static files.
- `*/feed/`, `comments/`, `wp-json/oembed/**`, `xmlrpc.php*` — WordPress feeds/API artifacts.
- `wp-includes/`, `wp-content/plugins/` (Elementor, WooCommerce, Woodmart, Slider Revolution, ElementsKit, Zakeke, CF7), `wp-content/themes/woodmart/js/**` — vendor runtime; only referenced as "what the original page loaded".
- `wp-content/uploads/` (~48 MB) — media; product gallery images are catalogued in `PRODUCTS.md`.

## Stack facts extracted from the mirror

- Theme: **Woodmart** (`wp-theme-woodmart`), ajax shop on (`woodmart-ajax-shop-on`).
- Page builder: **Elementor** (kit id 29049; header/footer/sections templates 7033, 7040, 7047, 7054).
- Slider Revolution 6.7.38 on the home page.
- Google Fonts requested by the original pages: **Inter**, **Roboto** (plus Elementor/Woodmart font CSS in `wp-content/uploads/**/xts-term-*.css` and `post-29049.css`).
- Product customizer: **Zakeke** plugin files are present under `wp-content/plugins/zakeke-interactive-product-designer/` but no canonical product page references it — treat as optional/unused unless product requirements say otherwise.
- All 13 products are **variable products** (`product-type-variable`) with variation forms (`attribute_colors`, `attribute_sizes`, etc. — see `PRODUCTS.md`).
- Contact page uses **Contact Form 7**; in Next.js this becomes a route handler + form component (see `CONVERSION_PLAN.md`).
- Cart/checkout/wishlist/compare are WooCommerce dynamic pages — they have **no static HTML equivalent** worth porting; they must be rebuilt against a commerce backend.

## Footer facts

- Email: `Contact@printityourway.com`
- Footer nav links: About us, Shop, Contact us (plus social links rendered by ElementsKit with `href="#"` placeholders in the mirror).
