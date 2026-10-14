# Phase 3 — SEO, structured data, and graph maintenance

## Implemented in this phase branch
- Canonical production origin configured as `https://printityourway.com`.
- XML sitemap generated from the actual product/category data plus public informational routes.
- Robots policy exposes public catalog routes and excludes non-functional cart, checkout, wishlist, and compare placeholders.
- Product pages emit Product JSON-LD using the existing catalog data only. No fabricated reviews, ratings, availability, shipping promises, or purchase actions.

## Validation gate
Run locally before merge:
```powershell
npm install
npm run lint
npm test
npm run build
```
Then inspect `/robots.txt`, `/sitemap.xml`, and a product page's rendered JSON-LD.

## Graphify refresh
The repository has an OpenCode Graphify hook and checked-in `graphify-out/` artifacts. Graphify's generator/CLI is an environment-level dependency and is not available through the GitHub file-editing connection used for this branch. Do not hand-edit generated `graph.json`, cache files, or `GRAPH_REPORT.md` and call that a refresh. After checking out this branch in the development environment, run the installed Graphify refresh command for the repository, inspect the graph/report diff, and commit only the regenerated artifacts that Graphify actually changes. Confirm the exact CLI command from the installed Graphify version rather than assuming flags.

## Still deliberately out of scope
- Product image migration to local, licensed assets and Next Image.
- Commerce integrations (cart, inventory, checkout, payments, orders).
- Legal pages or policy text without approved business content.
