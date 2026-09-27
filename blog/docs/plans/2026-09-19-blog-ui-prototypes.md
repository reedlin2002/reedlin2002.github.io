# Blog UI Prototypes — articles first

## Scope
Three disposable home/article designs on the existing URLs: A paper journal, B interactive technical notebook, C article exhibition with a local Three.js sculpture. Let the owner compare real content before selecting a production design.

## Files Impacted
- `package.json`, `package-lock.json`: one-command preview and pinned development-only Three.js.
- `scripts/ui-prototype.js`: localhost launcher, server-only request rendering and asset delivery.
- `themes/cactus/prototype/`: disposable EJS views, scoped styles and browser interactions (theme submodule).
- `themes/cactus/source/js/live2d-chat.js`: optional preview-only, in-memory visibility settings; existing defaults unchanged.
- `docs/decisions/2026-09-19-blog-prototype-isolation.md`.

## DB Impact
None. Existing Hexo posts and project data are read only; no new visitor persistence or chat API calls.

## Risk
- Preview must require BOTH `BLOG_UI_PROTOTYPE=1` and the Hexo `server` command. No prototype routes/assets in `hexo generate`.
- All variants must preserve real content, links, Chinese typography, code copying, diagrams and images.
- Prototype navigations use normal document navigation rather than production PJAX, keeping rendering and resource lifetimes isolated. Reading progress and image zoom are reinitialized per document.
- Small screens, reduced motion and unavailable WebGL use a static sculpture. Widgets must not cover content or the comparison toolbar.
- The theme is a submodule; keep its changes inspectable separately. No deployment or automatic design promotion.

## SDD Update
No `docs/SDD.md` exists. Record isolation and lifecycle decisions in the decision log.

## Story Status
- [ ] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Acceptance
- Three visibly different home layouts, each with the same latest six posts and full article pages.
- `npm run prototype`; URL variants A/B/C; shared keyboard-accessible comparison bar and original-site entry.
- Inspect desktop, tablet and mobile; validate real long-form HTML, code, Mermaid and SVG.
- Run production generation and verify no prototype UI/assets in the output.

## Design verdict
Owner prefers B. Refine B before production promotion: restore the current source logo, use the actual existing Live2D Hibiki (offline chat and in-memory visibility for preview), restore the configured skills-marquee, and add a Folder Float-inspired topic folder with floating/draggable links. Reference: https://reactbits.dev/micro/folder-float . A/C remain available for comparison. No production promotion or deployment requested yet.

## Validation — 2026-09-20
- Visually inspected A/B/C homepages on desktop and at 390px. B refinement additionally inspected at 820px tablet width; no page-level horizontal overflow.
- Confirmed current logo image loads and the actual Hibiki model renders. Opened its dialog and received the existing offline greeting response. Desktop dialog raised above the comparison toolbar; mobile article retains the compact Hibiki action.
- Confirmed the skills pause button updates state. Opened the topic folder, dragged a floating link without navigation, visited a real tag archive, and verified Escape closes / Enter opens and focuses the first topic. Mobile folder follows the six latest articles.
- Inspected the real iOS sample article on mobile: 11 section headings, 7 code-copy controls, and rendered Mermaid/SVG content; no page-level overflow. Clipboard copying itself was not exercised.
- C desktop mounts one Three.js canvas with `has-webgl`, with no warning/error logs captured. Small-screen C uses static artwork. Reduced-motion fallback reviewed in code; not emulated in the browser.
- `node --check` passed for launcher, preview interactions and folder module; root/theme `git diff --check` passed (line-ending notices only).
- `npm run build -- --force` passed, generating 236 files. HTML scan found no `__prototype/`, `prototype-switcher`, or `data-prototype-page`; `public/__prototype` does not exist. Existing Browserslist freshness warning remains unrelated.
- No automated test framework added for this disposable prototype. No commit, push or deployment performed.
