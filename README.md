# swm-shop-theme-crowe-ui-lib-repos

A Shopify Dawn 15.3.0 theme fork for the Southwest Mushrooms store, with a Next.js storefront prototype and a .NET MAUI stub kept in the same repository.

## Status

experimental

Development stopped on 2025-07-18 (last commit on `main`, "Update from Shopify for theme swm-shop-theme-crowe-ui-lib-repos/main", per `git log`). 42 commits, all on 2025-07-18. The Next.js prototype still installs, builds and serves from its lockfile (run on 2026-09-10, below). The Liquid theme is Dawn 15.3.0 with a small number of Crowe Logic sections added. The MAUI folder has no project file and cannot be built.

Southwest Mushrooms was a mushroom farm in Phoenix. The farm closed in February 2025. This theme was built after that, in July 2025.

## Install and first run

Run on 2026-09-10 with Node v26.5.0 and npm 11.17.0:

```
cd packages/next-app
npm ci --ignore-scripts
# added 863 packages in 5s

npm run build
# Route (app)          Size  First Load JS
# /                 9.32 kB        121 kB
# /_not-found         992 B        100 kB
# /api/chat           127 B       99.6 kB
# /api/stt            127 B       99.6 kB
# /api/voice-agent    127 B       99.6 kB
# /crowe-logic      6.22 kB        114 kB

npx next start -p 3123
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3123/
# 200
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3123/crowe-logic
# 200
```

The `/api/chat` route reads `OPENAI_API_KEY` from the environment and `/api/voice-agent` calls `api.elevenlabs.io`. Without those keys the pages render but the chat and voice endpoints do not work. No `.env` file is committed.

The Liquid theme at the repository root is uploaded to Shopify as a theme, not installed. See `SHOPIFY_IMPORT_GUIDE.md` for the steps that were used in 2025. It has not been uploaded anywhere since.

## What runs today

- `packages/next-app/` : Next.js 15.4.1, React 19, Tailwind 4. Builds and serves two pages (`/`, `/crowe-logic`) and three API routes. Storybook config and 13 TSX components are included.

What the rest of the repository holds (counts from `find` on 2026-09-10):

- Root Liquid theme: 66 sections, 48 snippets, 24 templates, 201 assets, 51 locale files, 2 layouts, 2 config files. `config/settings_schema.json` still names it Dawn 15.3.0 by Shopify. Files mentioning Crowe: 9 sections, 7 snippets, 9 assets, 4 templates, 1 layout.
- `packages/shopify-theme/` : a second copy of the theme (395 files). `diff -rq` against the root `sections/` shows 10 differing files.
- `my-maui-app/` : C# and XAML source for a MAUI app (4 `.cs`, 3 `.xaml`). No `.csproj` or `.sln`, so it does not build.
- Eight Markdown notes from the July 2025 build (integration guide, import guide, implementation summaries).

Two pull requests were open on 2026-09-10 (a Dependabot bump for `next`, and a "Smartphone interface enhancement" branch). They are left as they were.

## Limits

- This is storefront code. It carries no cultivation, food-safety or health guidance and must not be read as any.
- The chat and voice routes are thin wrappers over third-party APIs and hold no domain knowledge of their own.
- The theme has not been checked against the current Dawn or Shopify theme requirements since July 2025.
- Nothing here is connected to a live store today.

## License and contact

`LICENSE.md` is the Shopify Dawn license: use is limited to developing themes that integrate with Shopify. The Next.js and MAUI code carry no separate license file.

Contact: michael@crowelogic.com
