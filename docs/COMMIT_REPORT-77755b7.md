# Commit Report — `77755b7` on `feat/parity-remediation`

**Full hash:** `77755b7e3d49476336637565029b236cc255fd33`
**Branch:** `feat/parity-remediation` (4 commits ahead of `adee092`)
**Author:** vitrixLab <vitrixlab@gmail.com>
**Date:** Wed Oct 14 05:08:14 2026 +0800
**Subject:** `test: guard mirror-derived catalog data and record remediation status`

---

## Summary

Final commit of the parity-remediation PR. It makes the runtime catalog dataset directly testable and records the verified remediation status of every comparison finding.

## Changes (7 files, +1403 / −200)

| File | Change |
|---|---|
| `data/products.json` | **New** — generator now emits the normalized 13-product dataset as JSON (single source of truth for runtime and tests) |
| `data/products.ts` | Slimmed to types + `import raw from "./products.json"` + categories/money/bySlug helpers (−~100 lines of generated records) |
| `scripts/generate-products.mjs` | Rewritten to build product objects once, emit both `products.json` and the typed TS wrapper |
| `scripts/products.test.mjs` | **New** — 7 `node:test` cases guarding catalog integrity |
| `package.json` | Adds `"test": "node --test scripts/products.test.mjs"` |
| `docs/COMPARISON_FINDINGS.md` | Adds §7 Remediation Status (per-finding FIXED / PARTIAL / BLOCKED with commits and residual scope); updates executive summary to post-remediation verdicts |
| `README-NEXTJS.md` | Documents the mirror → JSON → TS pipeline, `npm test`, and current blockers |

## Test coverage added

- Exact 13-slug roster parity with the mirror
- Verified spot prices/ranges (camo `$32`, white-crewneck `19.18–23.75`, cozy `42.57–48.08`, duffel, laptop sleeve, tote)
- Cozy-three-panel is the only product without a variation matrix (source has `data-product_variations="false"`)
- Every product has gallery (primary === gallery[0]), real description, labeled attributes
- Variation records use only declared attribute values, complete key sets, no duplicates, prices within base range
- Per-product variation counts match the extraction exactly
- Singular source labels (`Bag`, `Front Hat`, `Hoodie`, `Shirt`) present

## Verification at this commit

- `npx tsc --noEmit` — clean
- `npm run lint` — 0 errors (13 warnings, all the pre-existing hotlinked-`<img>` class)
- `npm test` — 7/7 pass
- `npm run build` — green, 27 routes (Next.js 16.4.0)

## Branch context

| Commit | Scope |
|---|---|
| `b671b21` | fix: restore accurate product data from source mirror (CMP-01…16) |
| `192b794` | feat: rebuild header and footer to source parity (CMP-22/23) |
| `bfd069a` | feat: restore page content and catalog controls from source (CMP-17…21, 25…27) |
| `77755b7` | test: guard mirror-derived catalog data and record remediation status |

**Known residuals** (see `docs/COMPARISON_FINDINGS.md` §7): CMP-28 asset hotlinking remains a cutover blocker; popularity/rating/latest sorts and reviews are blocked on missing mirror data; a few cosmetic sections (home tabbed grid, share links, prev/next, some about blocks) were not converted.
