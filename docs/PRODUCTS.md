# Products (13) — extracted from the HTML mirror

Source of truth: `product/<slug>/index.html`. Prices are USD as rendered on the product page
(two price points = sale + regular where applicable). All products are WooCommerce variable products
(variation forms with `attribute_*` fields, e.g. `attribute_sizes`, `attribute_colors`); option
values are embedded in each page's `variations` JSON. Gallery URLs point at the live site's
`wp-content/uploads`; copy the files into `public/images/products/<slug>/` during conversion and
rewrite to `/images/...`.

| Slug | Title | Category | Price(s) USD | Variations |
|---|---|---|---|---|
| `camo-trucker-hat-classic-embroidered-camouflage-mesh-cap` | Camo Trucker Hat — Classic Embroidered Camouflage Mesh Cap | front-hat | 32 | variable |
| `classic-sponge-fleece-hoodie-cozy-pullover-sweatshirt` | Classic Sponge Fleece Hoodie — Cozy Pullover Sweatshirt | hoodie | 75.48 / 86.35 | variable |
| `classic-white-backpack-minimalist-everyday-school-travel-bag` | Classic White Backpack — Minimalist Everyday School & Travel Bag | bag | 72.17 | variable |
| `cozy-three-panel-fleece-hoodie-lightweight-white-pullover` | Cozy Three-Panel Fleece Hoodie — Lightweight White Pullover | hoodie | 42.57 / 48.08 | variable |
| `duffel-bag` | Duffel Bag | bag | 77.13 | variable |
| `heather-gray-full-zip-hoodie-classic-casual-zip-up-hooded-jacket` | Heather Gray Full-Zip Hoodie — Classic Casual Zip-Up Hooded Jacket | hoodie | 47.95 / 58.37 | variable |
| `i-love-you-with-all-my-butt-t-shirt-funny-romantic-graphic-tee` | I Love You With All My Butt T‑Shirt — Funny Romantic Graphic Tee | shirt | 20.68 / 29.43 | variable |
| `laptop-sleeve` | Laptop Sleeve | bag | 29.52 | variable |
| `leather-patch-dad-hat-classic-rectangle-patch-baseball-cap` | Leather Patch Dad Hat — Classic Rectangle Patch Baseball Cap | front-hat | 22.47 | variable |
| `low-profile-baseball-cap-classic-minimalist-white-dad-hat-for-everyday-wear` | Low Profile Baseball Cap — Classic Minimalist White Dad Hat for Everyday Wear | front-hat | 23.65 | variable |
| `personalized-weekend-tote-bag-large-canvas-weekender-with-rope-handles` | Personalized Weekend Tote Bag — Large Canvas Weekender with Rope Handles | bag | 51.68 | variable |
| `sweet-dreams-t-shirt-retro-cozy-sleepwear-graphic-tee` | Sweet Dreams T-Shirt — Retro Cozy Sleepwear Graphic Tee | shirt | 20.68 / 29.43 | variable |
| `white-crewneck-t-shirt` | White Crewneck T-Shirt | shirt | 19.18 / 23.75 | variable |

## Category → products

- **bag**: `classic-white-backpack-minimalist-everyday-school-travel-bag`, `duffel-bag`, `laptop-sleeve`, `personalized-weekend-tote-bag-large-canvas-weekender-with-rope-handles`
- **front-hat**: `camo-trucker-hat-classic-embroidered-camouflage-mesh-cap`, `leather-patch-dad-hat-classic-rectangle-patch-baseball-cap`, `low-profile-baseball-cap-classic-minimalist-white-dad-hat-for-everyday-wear`
- **hoodie**: `classic-sponge-fleece-hoodie-cozy-pullover-sweatshirt`, `cozy-three-panel-fleece-hoodie-lightweight-white-pullover`, `heather-gray-full-zip-hoodie-classic-casual-zip-up-hooded-jacket`
- **shirt**: `i-love-you-with-all-my-butt-t-shirt-funny-romantic-graphic-tee`, `sweet-dreams-t-shirt-retro-cozy-sleepwear-graphic-tee`, `white-crewneck-t-shirt`

## Full gallery URL lists

Each product page embeds ~8-10 absolute gallery URLs like
`https://printityourway.com/wp-content/uploads/2026/01/<hash>_2048.jpeg`. Re-extract at conversion time with:

```powershell
$t = Get-Content product/<slug>/index.html -Raw
[regex]::Matches($t, 'https://printityourway\.com/wp-content/uploads/\d{4}/\d{2}/[^"\s?]+?\.(?:jpg|jpeg|png|webp)')
```

Filter out `Print-it.png` / `Print-it-scaled.png` / `Print-it.jpg` (site logo/watermark) and
`wd-ship-*`, `grocery-*` (Woodmart theme demo leftovers still loaded by the templates).
