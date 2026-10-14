# PR 1 — Critical UI/SEO fixes (N-01 … N-06)

**Base:** `dev` @ `e2e498e` · **Branch:** `surgical/pr1-ui-ux-fixes` (11 existing commits + 2 new)
**Scope:** only the verified P1 defects from `UI_UX_UPGRADE_REPORT_v2` and their tests. No palette, section, image, backend, JSON-LD or payment changes (those are PR 2–5).

## What was already on the branch (11 commits, reviewed)
| Item | Result |
|---|---|
| N-01 root `canonical` and `og:url` removed; per-route canonicals for `/shop`, `/about-us`, `/contact-us`, `/product-category/[slug]` | ✅ correct |
| `noindex` on `/cart`, `/checkout`, `/wishlist`, `/compare`; `Disallow` lines removed from `robots.ts` so crawlers can see it | ✅ correct |
| N-02 duplicate "Made for Your Everyday" grid removed | ✅ correct |
| **Gap found:** removing the root canonical left **`/` with no canonical at all** (`app/page.tsx` had no metadata) | ❌ fixed in this PR |
| N-03, N-04, N-05, N-06 and all tests | not present → added here |

## What this PR adds (2 commits)
| ID | Change | Files |
|---|---|---|
| N-01 (gap) | Homepage `alternates.canonical: "/"` | `app/page.tsx` |
| N-03 | Manual thumbnail pick holds until the variation changes; derived during render, no `useEffect` (keeps lint at 0 errors) | `components/ProductGallery.tsx` |
| N-05 | `MobileMenu` client component; open state is tied to the pathname so it closes after navigation; Escape closes and returns focus to the toggle; `aria-expanded` | `components/MobileMenu.tsx`, `components/Shell.tsx`, `app/globals.css` |
| N-06 | New Offers filters are plain buttons with `aria-pressed` inside a labelled group (the partial `role="tab"` model is removed); polite "Showing N of M" status | `components/OfferTabs.tsx`, `app/globals.css` |
| N-04 | Interim handoff: **"Open in email app"** on `/contact-us` (controlled fields so the `mailto:` always reflects current input) and **"Email us about this item"** on product pages. Body capped at 1,500 chars. Submit still shows "Not sent" and never claims delivery | `lib/mailto.ts`, `components/ContactForm.tsx`, `components/ProductDetails.tsx` |
| Tests | 11 Playwright e2e tests; `@playwright/test` pinned to `1.56.0`; excluded from the Next type-check | `tests/e2e/pr1.spec.ts`, `playwright.config.ts`, `package.json`, `tsconfig.json`, `.gitignore` |

## Evidence (sandbox, Node 22, production build)
| Gate | Result |
|---|---|
| `npm run lint` | 0 errors, 14 warnings (same warning set as `dev`) |
| `npm test` | 7 / 7 pass |
| `npm run build` | ✅ 29 routes, TypeScript clean |
| `npm run test:e2e` | **11 / 11 pass** |
| **Same suite against unfixed `dev`** | **10 of 11 fail**; the 1 pass is the hero regression guard (protects already-fixed behavior). So the tests detect the defects they target |
| Patches apply to `origin/surgical/pr1-ui-ux-fixes` with `git am` | ✅ clean; tree identical (24 files, +300 / −46 vs `dev`) |

## Acceptance gates (from the agreed PR 1 criteria)
| Area | Result |
|---|---|
| SEO | Every `<loc>` in `/sitemap.xml` has its own canonical (all 21); no query strings in canonicals; utility pages `noindex` and not blocked in `robots.txt` |
| Homepage | No product repeated inside any grid; no two grids identical |
| Gallery | Thumbnails work before and after choosing options; a manual pick holds until the variation changes |
| Navigation | Menu closes after navigation and on Escape; focus returns to toggle |
| Accessibility | Filter buttons expose pressed state; no leftover `tab`/`tablist` roles |
| Custom order | Working prefilled `mailto:`; submit shows "Not sent"; test asserts no success wording |
| Scope | No payment, redesign, image, JSON-LD or backend work |

## Not covered / honest limits
- Tested in headless Chromium with remote images stubbed; no real email client was opened (the test asserts the `mailto:` URL, not delivery). Some clients truncate long URLs — hence the 1,500-char cap.
- Mobile menu tested at 390 px only.
- `package-lock.json` is **not** committed (the repo does not track one); adding Playwright is pinned exactly in `package.json`. Decide on a lockfile separately.
- Graphify was **not** refreshed — run the installed tool after merge and commit only what it regenerates (`docs/PHASE-3.md`).
- Known and deliberately left for later PRs: header icons/badges, hiding Wishlist/Compare/Cart (D-4), duplicate shop-page search, 3-column offers grid, palette (D-1), restoring T SHIRTS / HATS rows and banners (D-5), image localization, JSON-LD `offers`, favicon.

## Apply and push (the sandbox has no GitHub credentials)
```bash
git fetch origin
git checkout surgical/pr1-ui-ux-fixes          # tracks origin/surgical/pr1-ui-ux-fixes @ 20f0e94
git am /path/to/pr1/*.patch                     # 2 patches, apply cleanly
npm install && npm run lint && npm test && npm run build
npx playwright install chromium                 # first time only
npm run test:e2e
git push origin surgical/pr1-ui-ux-fixes
gh pr create --base dev --head surgical/pr1-ui-ux-fixes --title "PR 1: critical UI/SEO fixes (N-01…N-06)" --body-file PR1_DESCRIPTION.md
```
