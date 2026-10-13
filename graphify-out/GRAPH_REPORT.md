# Graph Report - printityourway-bp  (2026-10-13)

## Corpus Check
- 28 files · ~143,060 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 155 edges · 8 communities
- Extraction: 88% EXTRACTED · 12% INFERRED · 1% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Site Shell & Utility Pages
- Home & Shop Templates
- Category Archives & Filters
- Conversion Plan Docs
- Bag Product Catalog
- Front-Hat Product Catalog
- Hoodie Product Catalog
- Shirt Product Catalog

## God Nodes (most connected - your core abstractions)
1. `Homepage - Print Custom` - 20 edges
2. `Shop Product Archive` - 20 edges
3. `Products Catalog — 13-product inventory extracted from the HTML mirror` - 19 edges
4. `Shared Woodmart Sticky Header (whb-header_422309)` - 14 edges
5. `VariationPicker — client-side size/color variation component` - 14 edges
6. `Shared Footer (Elementor CMS block 29049)` - 12 edges
7. `Bag Category Archive` - 10 edges
8. `Front Hat Category Archive` - 10 edges
9. `Hoodie Category Archive` - 10 edges
10. `Shirt Category Archive` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Compare Page (empty compare list)` --semantically_similar_to--> `Wishlist Page (empty wishlist)`  [INFERRED] [semantically similar]
  compare/index.html → wishlist/index.html
- `About Us Page` --semantically_similar_to--> `Contact Us Page (FAQ accordion + contact form)`  [INFERRED] [semantically similar]
  about-us/index.html → contact-us/index.html
- `Checkout Page (mirrors cart page, empty state)` --conceptually_related_to--> `Cart Page (empty cart state with checkout steps)`  [AMBIGUOUS]
  checkout/index.html → cart/index.html
- `Camo Trucker Hat — Classic Embroidered Camouflage Mesh Cap (front-hat, $32, variable)` --conceptually_related_to--> `VariationPicker — client-side size/color variation component`  [INFERRED]
  product/camo-trucker-hat-classic-embroidered-camouflage-mesh-cap/index.html → docs/CONVERSION_PLAN.md
- `Classic Sponge Fleece Hoodie — Cozy Pullover Sweatshirt (hoodie, $75.48/$86.35, variable)` --conceptually_related_to--> `VariationPicker — client-side size/color variation component`  [INFERRED]
  product/classic-sponge-fleece-hoodie-cozy-pullover-sweatshirt/index.html → docs/CONVERSION_PLAN.md

## Hyperedges (group relationships)
- **Shop and Category Archives Share One Woodmart Archive Template** — shop_shop_archive, product_category_bag_category_archive, product_category_front_hat_category_archive, product_category_hoodie_category_archive, product_category_shirt_category_archive [INFERRED 0.85]
- **WooCommerce Commerce Utility Flow (browse -> cart -> checkout plus saved items)** — shop_shop_archive, cart_cart_page, checkout_checkout_page, compare_compare_page, wishlist_wishlist_page [INFERRED 0.85]
- **All Pages Render the Same Shared Woodmart Header and Footer** — shared_woodmart_header, shared_woodmart_footer, index_home_page, shop_shop_archive, product_category_bag_category_archive, product_category_front_hat_category_archive, product_category_hoodie_category_archive, product_category_shirt_category_archive, cart_cart_page, checkout_checkout_page, compare_compare_page, wishlist_wishlist_page, about_us_about_page, contact_us_contact_page [EXTRACTED 1.00]
- **All 13 mirrored products participate in the Products Catalog** — product_camo_trucker_hat_classic_embroidered_camouflage_mesh_cap_product, product_classic_sponge_fleece_hoodie_cozy_pullover_sweatshirt_product, product_classic_white_backpack_minimalist_everyday_school_travel_bag_product, product_cozy_three_panel_fleece_hoodie_lightweight_white_pullover_product, product_duffel_bag_product, product_heather_gray_full_zip_hoodie_classic_casual_zip_up_hooded_jacket_product, product_i_love_you_with_all_my_butt_t_shirt_funny_romantic_graphic_tee_product, product_laptop_sleeve_product, product_leather_patch_dad_hat_classic_rectangle_patch_baseball_cap_product, product_low_profile_baseball_cap_classic_minimalist_white_dad_hat_for_everyday_wear_product, product_personalized_weekend_tote_bag_large_canvas_weekender_with_rope_handles_product, product_sweet_dreams_t_shirt_retro_cozy_sleepwear_graphic_tee_product, product_white_crewneck_t_shirt_product, docs_products_catalog [EXTRACTED 1.00]
- **SITE_MAP, PRODUCTS, and CONVERSION_PLAN form the conversion-prep inventory** — docs_site_map_route_map, docs_products_catalog, docs_conversion_plan [EXTRACTED 1.00]
- **All 13 variable products require the VariationPicker component** — product_camo_trucker_hat_classic_embroidered_camouflage_mesh_cap_product, product_classic_sponge_fleece_hoodie_cozy_pullover_sweatshirt_product, product_classic_white_backpack_minimalist_everyday_school_travel_bag_product, product_cozy_three_panel_fleece_hoodie_lightweight_white_pullover_product, product_duffel_bag_product, product_heather_gray_full_zip_hoodie_classic_casual_zip_up_hooded_jacket_product, product_i_love_you_with_all_my_butt_t_shirt_funny_romantic_graphic_tee_product, product_laptop_sleeve_product, product_leather_patch_dad_hat_classic_rectangle_patch_baseball_cap_product, product_low_profile_baseball_cap_classic_minimalist_white_dad_hat_for_everyday_wear_product, product_personalized_weekend_tote_bag_large_canvas_weekender_with_rope_handles_product, product_sweet_dreams_t_shirt_retro_cozy_sleepwear_graphic_tee_product, product_white_crewneck_t_shirt_product, docs_conversion_plan_variation_picker [INFERRED 0.85]

## Communities (8 total, 0 thin omitted)

### Community 0 - "Site Shell & Utility Pages"
Cohesion: 0.23
Nodes (15): About Us Page, Cart Page (empty cart state with checkout steps), Checkout Page (mirrors cart page, empty state), Checkout Steps Progress (Shopping cart -> Checkout -> Order complete), Compare Page (empty compare list), Contact Form 7 Plugin (6.1.4), Contact Us Page (FAQ accordion + contact form), Elementor Page Builder (3.34.0) (+7 more)

### Community 1 - "Home & Shop Templates"
Cohesion: 0.23
Nodes (12): ElementsKit Lite Plugin (3.7.8), Homepage Hero Slider (3 Woodmart slides), Homepage Popular Categories Section, Find Your Perfect Design with Printify CTA Section, Homepage Product Showcase Sections (T-Shirts / Hats), Homepage - Print Custom, Shop Product Archive, Slider Revolution Plugin (6.7.38) (+4 more)

### Community 2 - "Category Archives & Filters"
Cohesion: 0.79
Nodes (8): Bag Category Archive, Front Hat Category Archive, Hoodie Category Archive, Product Category Nav with Product Counts, Shirt Category Archive, Shared Footer (Elementor CMS block 29049), Shop Sidebar Filters (price, stock status, top rated), Woodmart AJAX Shop Feature (woodmart-ajax-shop-on)

### Community 3 - "Conversion Plan Docs"
Cohesion: 0.43
Nodes (7): Conversion Plan — printityourway-bp → Next.js conversion plan, Headless WooCommerce backend (Option A — WPGraphQL/Woo REST), SaaS Commerce option (Option B — Shopify/Medusa), SearchParams Filters — dynamic /shop filters via searchParams, Static Catalog MVP (Option C — convert catalog pages only), Route Map — canonical page inventory of the wget mirror, HTML-TO-NEXTJS.md base playbook

### Community 4 - "Bag Product Catalog"
Cohesion: 0.53
Nodes (6): VariationPicker — client-side size/color variation component, Bag product category (4 products), Classic White Backpack — Minimalist Everyday School & Travel Bag (bag, $72.17, variable), Duffel Bag (bag, $77.13, variable), Laptop Sleeve (bag, $29.52, variable), Personalized Weekend Tote Bag — Large Canvas Weekender with Rope Handles (bag, $51.68, variable)

### Community 5 - "Front-Hat Product Catalog"
Cohesion: 0.70
Nodes (5): Products Catalog — 13-product inventory extracted from the HTML mirror, Front-Hat product category (3 products), Camo Trucker Hat — Classic Embroidered Camouflage Mesh Cap (front-hat, $32, variable), Leather Patch Dad Hat — Classic Rectangle Patch Baseball Cap (front-hat, $22.47, variable), Low Profile Baseball Cap — Classic Minimalist White Dad Hat for Everyday Wear (front-hat, $23.65, variable)

### Community 6 - "Hoodie Product Catalog"
Cohesion: 0.50
Nodes (4): Hoodie product category (3 products), Classic Sponge Fleece Hoodie — Cozy Pullover Sweatshirt (hoodie, $75.48/$86.35, variable), Cozy Three-Panel Fleece Hoodie — Lightweight White Pullover (hoodie, $42.57/$48.08, variable), Heather Gray Full-Zip Hoodie — Classic Casual Zip-Up Hooded Jacket (hoodie, $47.95/$58.37, variable)

### Community 7 - "Shirt Product Catalog"
Cohesion: 0.50
Nodes (4): Shirt product category (3 products), I Love You With All My Butt T-Shirt — Funny Romantic Graphic Tee (shirt, $20.68/$29.43, variable), Sweet Dreams T-Shirt — Retro Cozy Sleepwear Graphic Tee (shirt, $20.68/$29.43, variable), White Crewneck T-Shirt (shirt, $19.18/$23.75, variable)

## Ambiguous Edges - Review These
- `Cart Page (empty cart state with checkout steps)` → `Checkout Page (mirrors cart page, empty state)`  [AMBIGUOUS]
  checkout/index.html · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `Primary Navigation Menu (Home / About us / Shop / Contact us)`, `Header AJAX Product Search with Category Filter`, `Zakeke Interactive Product Designer (4.1.14)`, `Contact Form 7 Plugin (6.1.4)`, `Homepage Hero Slider (3 Woodmart slides)` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 10 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Cart Page (empty cart state with checkout steps)` and `Checkout Page (mirrors cart page, empty state)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Homepage - Print Custom` connect `Home & Shop Templates` to `Site Shell & Utility Pages`, `Category Archives & Filters`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `Shop Product Archive` connect `Home & Shop Templates` to `Site Shell & Utility Pages`, `Category Archives & Filters`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Products Catalog — 13-product inventory extracted from the HTML mirror` connect `Front-Hat Product Catalog` to `Conversion Plan Docs`, `Bag Product Catalog`, `Hoodie Product Catalog`, `Shirt Product Catalog`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `VariationPicker — client-side size/color variation component` (e.g. with `Camo Trucker Hat — Classic Embroidered Camouflage Mesh Cap (front-hat, $32, variable)` and `Classic Sponge Fleece Hoodie — Cozy Pullover Sweatshirt (hoodie, $75.48/$86.35, variable)`) actually correct?**
  _`VariationPicker — client-side size/color variation component` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Primary Navigation Menu (Home / About us / Shop / Contact us)`, `Header AJAX Product Search with Category Filter`, `Zakeke Interactive Product Designer (4.1.14)` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._