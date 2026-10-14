# UI/UX Upgrade Report v2 — `printityourway-nextjs` (dev, post-PR #7) vs. live printityourway.com

**Date:** 2026-10-14
**Repo / branch / commit:** `vitrixLab/printityourway-nextjs` · `dev` · `b746777` ("complete storefront UX and SEO phase 0-3"). v1 of this report audited `ccdc1e6`.
**Reference:** full-page screenshot of printityourway.com home (1280 × 5147 px)
**Method:** pulled the merged `dev` into a sandbox → `npm install`, `lint`, `test`, `build`, `next start` → drove the production build in headless Chromium (1440 px and 390 px): hero click paths, autoplay, tabs, gallery, contact flow, mobile menu, per-route metadata, `robots.txt`, `sitemap.xml`, keyboard order → compared against the screenshot.
**Scope boundary:** `docs/COMPARISON_FINDINGS.md` covers data/feature parity (CMP-xx). This report covers visual, interaction, accessibility, SEO-markup and journey issues (UX-xx = carried over from v1, N-xx = new in v2).

| Label | Meaning |
|---|---|
| `VERIFIED` | Reproduced in the sandbox or read directly from code |
| `OBSERVED` | Visible in the screenshot only |
| `NOT RE-MEASURED` | Was measured in v1; not re-checked against `b746777` |
| `RECOMMENDATION` | Proposed action, not a fact |

Severity: **P0** wrong behavior visitors hit now · **P1** fix before the next phase gate · **P2** quality gap · **P3** polish. Effort: **S** < 2 h · **M** ≤ 1 day · **L** > 1 day.

---

## 1. Executive summary

PR #7 was a real improvement: it fixed my P0 hero bug, replaced developer copy, added a skip link, carousel controls, tabs, canonical/OG/JSON-LD on products, `robots.txt` and a 21-URL sitemap, and brought lint to **0 errors**. It also **introduced four regressions** and left the customer journey ending at a form that says "Not sent."

| Check | v1 (`ccdc1e6`) | v2 (`b746777`) |
|---|---|---|
| `npm run build` | ✅ 27 routes | ✅ 29 routes |
| `npm test` | ✅ 7/7 | ✅ 7/7 |
| `npm run lint` | ❌ 1 error, 13 warnings | ✅ 0 errors, 14 warnings |
| Hero CTA goes where the slide says | ❌ always Hoodie | ✅ correct on all 3 slides |
| `<h1>` on home | 3 | 1 |
| Skip link / first Tab stop | none | ✅ "Skip to content" |
| Canonical URL correct | no tag | ❌ **wrong on every page except products** |
| Duplicate products on home | 6 shown twice | ❌ **all 8 shown twice** |
| Product gallery thumbnails | ✅ | ❌ **dead after choosing options** |
| Mobile menu after navigating | not tested | ❌ stays open |
| Customer journey end | disabled button | ❌ custom-order form → "Not sent" |

**Verdict against your roadmap:** the premise "PR #7 covers storefront UX and foundational SEO" is *mostly* right but not safe to assume. Four P1 defects below are exactly what a Phase 4 stabilization pass exists to catch, and one of them (canonical tags) silently damages SEO on every non-product URL. Phase 4 first, as you proposed — with this list as its backlog.

---

## 2. Status of every v1 finding

| ID | v1 finding | Status | Evidence |
|---|---|---|---|
| UX-01 | Hero "Shop Now" opens wrong category (P0) | ✅ **Fixed** | `elementFromPoint` on each visible CTA returns its own link on slides 1, 2, 3 |
| UX-02 | Hero: no controls, 3 × `<h1>`, eager images | ✅ **Fixed** (see N-11) | Prev / Next / Pause at 44 × 44 px; autoplay advances 0→1→2→0; no autoplay under `prefers-reduced-motion`; one `<h1>`; `fetchPriority` on slide 1 only |
| UX-03 | Brand drift vs. source | ⚠️ **Partial** → N-09 | Buttons now black, hero pale blue, purple accents; nav still white, hero not the source's saturated blue, green eyebrows remain |
| UX-04 | Header text-only; mobile menu is a bare `<details>` | ❌ **Open** | `Shell.tsx` unchanged: text links "Wishlist / Compare 0 / Cart", no icons or badges; menu persistence confirmed broken → N-05 |
| UX-05 | Home composition gaps | ⚠️ **Partial** | ✅ overlapping steps card with numbers · ✅ tabbed New Offers · ✅ image tiles. ❌ 3 columns (source 4) · ❌ duplicate grid → N-02 · tabs a11y → N-06 · rows/banners removed → N-10 |
| UX-06 | Printify promo stripped down | ⚠️ **Partial** | ✅ band now has image + CTA "Start a custom order". Heading still "Make It Yours Your Way" (decision D-2 unresolved) |
| UX-07 | "Print It Your Way" has no path | ⚠️ **Partial** → N-04 | CTA → `/contact-us?topic=custom&product=<slug>` pre-fills the message ✅; the form then reports "Not sent" ❌; step cards are still not links |
| UX-08 | Product action last and dead | ⚠️ **Partial** → N-07 | Desktop: action block at y = 675 px (above the 900 px fold) ✅. Mobile: y = 1,232 px ≈ 1.5 screens down, no sticky bar |
| UX-09 | "Select options" collides with price | ✅ **Fixed** | Price and action no longer on one line (new P3 alignment issue in N-11) |
| UX-10 | Migration copy shown to customers | ✅ **Fixed** | Diff replaces the "archived HTML mirror", "Purchasing unavailable in catalog preview", "source variation matrix" strings; "BUY NOW" banner is gone |
| UX-11 | Shop controls | ⚠️ **Partial** | ✅ `PER_PAGE` 24 → single page of 13, no orphan · ✅ `role="alert"` removed. ❌ duplicate header + page search and manual "Apply" remain (shop page changed only 4 lines) |
| UX-12 | Mobile/tablet regressions | ✅ **Fixed** (side effect below) | Search visible at 390 px; hero art visible; no horizontal overflow (`scrollWidth` 390). Header is now **268 px (32 % of the viewport)**, up from 194 px |
| UX-13 | Accessibility baseline | ⚠️ **Partial** | ✅ skip link · ✅ `role="alert"` · ✅ lint error. Open: **62 of 91** interactive elements < 44 px; 31 of 91 < 24 px in one dimension (upper bound — inline text links are WCAG 2.5.8-exempt). 10 px type and contrast: `NOT RE-MEASURED` |
| UX-14 | Hotlinked images, no `next/image` | ❌ **Open — declared out of scope** in `docs/PHASE-3.md` | Still 100 % `printityourway.com/wp-content/...` `<img>` tags |
| UX-15 | SEO scaffolding missing | ⚠️ **Partial** → N-01, N-08 | ✅ sitemap, robots, product canonical/OG/JSON-LD. ❌ canonical bug, no `offers`, favicon 404 |
| UX-16 | Merchandising order | ❌ **Open** | "New Offers → All" opens with Camo Trucker Hat; source leads with White Crewneck |
| UX-17 | CSS architecture | ❌ **Open, worse** | `globals.css` +85 lines; `:root` and `.hero-slider` are each declared twice with conflicting values (e.g. `--green:#294535` then `--green:#171717`, a token named "green" that is now near-black) |
| UX-18 | Inert footer legal/support links | ❌ **Open — deliberate** | "FAQ / Support / Privacy Policy / Terms" are still plain text; needs approved business content |
| UX-19 | Card title clamp / price pin | ❌ **Open** | See N-11 |

### What the source gets wrong (still do **not** port) — `OBSERVED`
Three product images and the FRONT HAT tile render blank · empty logo area · second banner shows only a "BUY NOW" button · a clipped "Sh…" at the top-right edge suggests horizontal overflow · lorem-ipsum step copy.

### Where the repo is better than the source — **preserve**
Real step copy · honest "not sent / not available" states · visible focus rings · reduced-motion support · skip link · accessible carousel controls · single `<h1>` per page · Product JSON-LD with no fabricated ratings or stock · robots rules that exclude non-functional routes · working variation picker.

---

## 3. New findings (introduced by, or first visible in, `b746777`)

### P1

#### N-01 — Every page except products canonicalizes to the homepage  `VERIFIED` · **S**
- **Where:** `app/layout.tsx` sets `alternates: { canonical: "/" }` and `openGraph.url: siteUrl` at the root. Next.js metadata is inherited, so any page that does not set its own value inherits the homepage's.
- **Measured** (`<link rel="canonical">` and `og:url`): `/`, `/shop`, `/about-us`, `/contact-us`, `/product-category/shirt`, `/cart`, `/wishlist` → all `https://printityourway.com`. Only `/product/<slug>` is correct.
- **Impact:** tells search engines that `/shop` and every category page are duplicates of the homepage — the opposite of what the 21-URL sitemap is trying to achieve. This sits squarely in "foundational SEO," so it contradicts the roadmap's assumption.
- **Fix:** delete `alternates` and `openGraph.url` from the root layout; set them per route:
```ts
// app/shop/page.tsx
export const metadata: Metadata = { title: "Shop", alternates: { canonical: "/shop" } };
// app/product-category/[slug]/page.tsx → in generateMetadata: alternates: { canonical: `/product-category/${slug}` }
```
  Repeat for `about-us` and `contact-us`. Keep the product page as is. For `cart`, `checkout`, `wishlist`, `compare` add `robots: { index: false }` (robots.txt `Disallow` alone does not prevent indexing).
- **Gate test:** a script that fetches each route in the sitemap and asserts `canonical === its own URL`.

#### N-02 — Home shows the same 8 products twice  `VERIFIED` · **S**
- **Where:** `app/page.tsx` renders `<OfferTabs/>` (tab "All" = `products.slice(0, 8)`) and, further down, "Made for Your Everyday" with `<Catalog items={products.slice(0, 8)}/>`. Measured: **16 product cards, 8 unique**, in the same order.
- The lower grid also ends on an orphan row (3 + 3 + 2).
- **Fix options:** delete the lower section; or give it a different job (e.g. "Bestsellers"/"Bags & Accessories" from `category`), or restore the source's T SHIRTS and HATS rows there (see N-10). Either way no product should appear twice on one page.

#### N-03 — Product gallery thumbnails stop working once options are chosen  `VERIFIED` · **S**
- **Cause:** the lint fix in `components/ProductGallery.tsx` replaced the effect with `shown = selectedImage && images.includes(selectedImage) ? selectedImage : active`. When a variation provides an image, `selectedImage` always wins, so `setActive` has no visible effect.
- **Measured** (`white-crewneck-t-shirt`): clicking thumbnail 3 with no variation → active index 2 ✅. Select Color + Size → index 0. Click thumbnail 4 → still index 0 ❌.
- **Lint-safe fix (no effect needed):**
```tsx
const [picked, setPicked] = useState<{ src: string; variant?: string } | null>(null);
const shown =
  picked && picked.variant === selectedImage ? picked.src
  : selectedImage && images.includes(selectedImage) ? selectedImage
  : images[0];
// thumbnail onClick: setPicked({ src, variant: selectedImage })
```
  A manual pick holds until the variation changes, then the variation image takes over again. Add a regression test (select options, click thumb, assert the main image changed).

#### N-04 — The custom-order journey ends at "Not sent"  `VERIFIED` · **M** (blocked on decision D-3)
- Product page → **Request a custom order** → `/contact-us?topic=custom&product=…` → message pre-filled ✅ → submit → *"Not sent. This form has no mail backend connected, so your message was not delivered…"* with a mailto link.
- This is honest, and it beats a disabled button, but the repo's primary conversion path currently cannot convert. It is the concrete form of the roadmap's Phase 6 question.
- **Interim (S):** make the pre-filled `mailto:Contact@printityourway.com?subject=…&body=…` the primary button on the product page when no backend exists.
- **Real fix (Phase 6):** a Route Handler (`app/api/contact/route.ts`) with server-side validation and a mail/CRM provider, a honeypot/rate limit, and a success state.
- Step cards ("Upload Design") are still not links and nothing accepts a design file; a quote-based flow can ask for a link or attachment first and defer upload.

---

### P2

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| N-05 | **Mobile menu stays open after tapping a link.** `Header` sits in the root layout, so the `<details>` DOM persists across client navigations | Open menu → tap "Shop" → URL is `/shop` and `details.open === true` | Convert to a small client component with `usePathname()`; close on route change and on `Esc`; style a real button | S |
| N-06 | **"New Offers" tabs advertise `role="tablist"` but don't follow the pattern.** All five tabs have `tabindex=0`; ArrowRight does not move focus | Measured | Roving `tabIndex` (0 on selected, −1 on others), Arrow/Home/End handlers, or drop the tab roles and use buttons with `aria-pressed` | S |
| N-07 | **Mobile product page: primary action ≈ 1.5 screens down** (y = 1,232 of an 844 px viewport; page is 3,605 px) | Measured | Sticky bottom action bar on ≤ 900 px | S |
| N-08 | **Metadata gaps beyond N-01:** Product JSON-LD has no `offers` (the catalog does have real price ranges); `category` is the slug (`front-hat`); no default `og:image` for non-product pages; `/favicon.ico` → 404; all 21 sitemap `lastmod` values equal the generation time; origin string hard-coded in 3 files | Measured | Add `AggregateOffer` (`lowPrice`, `highPrice`, `priceCurrency: "USD"`) for ranged products and `Offer` for single-price ones — *omit* `availability`, ratings and shipping, which the data does not support. Map category slug → label. Add `app/icon.png` + a default `openGraph.images`. Use a real `lastModified` (data file mtime or omit). Centralize `SITE_URL` in one module/env var | M |
| N-09 | **Palette is now a hybrid of three identities:** black buttons, pale-blue hero (`--brand-blue #eaf1fb`), purple numerals/links, but still green eyebrow labels, a sage footer and a white nav. Source: black nav, saturated blue hero (`≈ #225485 → #3583b3`) with white text, purple and teal bands | Rendered + CSS | Decide D-1 (below), then collapse to **one** `:root`, delete the first `.hero-slider`, rename `--green` → `--color-primary` | M |
| N-10 | **Source sections removed from home:** the T SHIRTS and HATS product rows and both promo banners (teal "New T-Shirts", "Hoodies") are gone. Category tiles are alphabetical and plural ("Bags, Hats, Hoodies, T-Shirts") vs. the source's "Shirt, Hoodie, Front Hat, Bag" | Measured: home h2s are *New Offers, Make It Yours, Shop by Category, Made for Your Everyday* | Decision D-5. If parity is the goal, restore the rows (this also resolves N-02) and the teal banner (`#2CBAA3`, confirmed in the mirror's CSS) | M |

### P3 — N-11 polish
- **Pause button label is wrong after a click:** clicking Next leaves keyboard focus in the carousel, which pauses autoplay (by design), but the button still reads "Pause". Show "Play" whenever autoplay is effectively stopped, or resume on blur.
- **Heading order:** `<h1>` → `<h3>` ("Choose Product") with no `<h2>` in between; the steps section needs an h2 or visually-hidden heading.
- **Price alignment varies in a row:** a card with a range shows price + "Select options"; a single-price card pins its price to the bottom, so prices sit at different heights across a row. Use a flex column with a fixed action slot.
- **Header tools and footer rhythm:** header is still text links without icons/badges (UX-04); footer "Company" and "Quick Links" columns use different line spacing; the "Pause" control renders at a different font size from the arrows.
- **Grid density:** New Offers is 3 columns; the source shows 4 at desktop width.

---

## 4. Mapping to your roadmap

The roadmap's sequencing is sound. These are the adjustments the evidence supports.

| Roadmap phase | Keep as written | Add / change |
|---|---|---|
| **Phase 4 — Stabilization & parity audit** | Gate on lint, type-check, test, build, then audit | Make **N-01, N-02, N-03, N-05** the named backlog (all `VERIFIED`, all S effort — one small PR). Add UX-11 (duplicate search/Apply) and N-06. **Resolve D-1 and D-5 first**, or "parity" has no definition and the audit cannot close. Type-check: no separate script exists; `next build` runs it — confirm or add `tsc --noEmit` |
| **Phase 5 — Catalog foundation** | One typed source of truth; validate slugs/assets/duplicates | Add an explicit `order` field (UX-16) and a category label map (N-08). **Pull image localization (UX-14) forward** — `PHASE-3.md` defers it, but every image is hotlinked, so it is the largest production risk and Phase 8 is too late. "No fabricated prices" is compatible with `offers` in JSON-LD *if* the values come from the catalog (N-08) |
| **Phase 6 — Shopping journey** | Decide inquiry vs. quote vs. paid first | Evidence favors **quote-based first**: the UI already behaves that way, there is no backend, and only a minority of products carry a multi-option variation matrix, so a cart total for the rest would have to be invented. Build N-04's handler as the first deliverable; defer payments |
| **Phase 7 — Discovery, SEO & conversion** | Search/filters, JSON-LD, analytics with consent | **Move canonical validation into Phase 4** (N-01). Keep sitemap `lastmod` and default OG image here. Add the sticky mobile CTA (N-07) |
| **Phase 8 — Production hardening** | E2E tests, performance, rollback | Seed the Playwright suite from the checks in §5 — each corresponds to a defect found here. Include a "network blocked to the legacy domain" run so broken-image states are caught |

**Graphify refresh (Phase 4 / 7):** not assessed. I did not run Graphify; `docs/PHASE-3.md` correctly says generated artifacts must come from the real tool, not hand edits.

---

## 5. Acceptance checks (convertible to automated tests)

```bash
npm run lint && npm test && npm run build       # 0 lint errors, 7/7+ tests, all routes
npx next start -p 3100
```
1. **Canonical:** for every `<loc>` in `/sitemap.xml`, `link[rel=canonical]` equals that URL; cart/checkout/wishlist/compare carry `noindex`.
2. **No duplicates:** on `/`, `document.querySelectorAll('.card h3')` contains no repeated text.
3. **Gallery:** on a product with variations — click thumbnail 3, select options, click thumbnail 4; the active thumbnail index follows each click.
4. **Mobile menu:** open → tap a link → `details.open === false`.
5. **Hero (keep passing):** CTA `elementFromPoint` returns its own link on all three slides; exactly one `<h1>`.
6. **Tabs:** ArrowRight moves focus and selection; exactly one tab has `tabindex=0`.
7. **Journey:** "Request a custom order" results in a delivered message or a prefilled `mailto:`; never a dead end.
8. **Mobile product page:** primary action is reachable without scrolling past one viewport.
9. **Metadata:** every product page exposes JSON-LD with `offers` built from catalog data; `/favicon.ico` returns 200; home and shop expose `og:image`.
10. **Resilience:** with `printityourway.com` blocked, no broken-image glyphs render.

---

## 6. Decision log

| ID | Question | Recommendation |
|---|---|---|
| D-1 | Adopt the source palette (black nav, saturated blue, purple, teal) or keep the new hybrid? | Choose one and consolidate tokens; if cutover continuity matters, adopt source values |
| D-2 | Is the "Make It Yours Your Way" copy (no "Printify") intentional? | Confirm with the brand owner |
| D-3 | Inquiry/quote first, or online payment first? | Quote-based first (N-04, §4) |
| D-4 | Are Wishlist / Compare in scope for launch? | Hide the header icons until functional |
| D-5 | Restore the source's T SHIRTS / HATS rows and promo banners on home? | Yes if parity is the goal; it also removes the N-02 duplicate |

---

## 7. Limitations

- The live site was assessed **only through the supplied screenshot**; its hover/mobile behavior, product/shop pages and footer are unknown.
- The sandbox cannot reach `printityourway.com`, so remote images were replaced with placeholders. Layout, interaction and metadata results are real; imagery is not.
- Screenshot colors are sampled and approximate; only teal `#2CBAA3` was confirmed against the mirror's CSS.
- Items marked `NOT RE-MEASURED` (10 px type, contrast ratios) were not re-checked after PR #7.
- Several early probes were invalidated by my own test sequence (focus pausing autoplay; a selector hitting the header's Search button) and were re-run with isolated controls; only the controlled results are reported.
- No repository files were changed; every fix above is a proposal.

---

## Appendix — Measured values (production build, Chromium)

| Metric | v2 value |
|---|---|
| Routes built | 29 (product pages statically generated) |
| `robots.txt` | `Allow: /`; `Disallow: /cart /checkout /wishlist /compare`; sitemap link ✅ |
| Sitemap | 21 URLs (4 pages + 4 categories + 13 products); single identical `lastmod` |
| Home product cards | 16 rendered, 8 unique |
| Home document height | 6,541 px desktop |
| Header height | 210 px desktop · 268 px mobile (844 px viewport) |
| Interactive elements (desktop) | 91 total · 62 < 44 px · 31 < 24 px |
| Hero controls | Prev 44 × 44 · Next 44 × 44 · Pause 69 × 44 |
| Autoplay (untouched, pointer away) | slide 0 → 1 → 2 → 0 at ≈ 5 s intervals; none under reduced motion |
| Product page action (y) | 675 px desktop · 1,232 px mobile |
| `/favicon.ico` | 404 |
