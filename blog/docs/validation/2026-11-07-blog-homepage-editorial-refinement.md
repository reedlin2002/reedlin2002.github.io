# Homepage Editorial Refinement — Validation

Date: 2026-11-07

## Implemented

- Reorganized the Blog homepage into a clear profile hero, visible GitHub and email actions, a real research image, and a readable work-experience section.
- Removed the homepage topic-folder block and redundant project strip while keeping the Field Notes article list and its existing posts.
- Made article covers visible without hover, clarified the archive action, and moved search beside the article list.
- Removed the unexplained slogan and duplicate footer contact links.
- Disabled Hibiki ambient greeting popups; manually opening Hibiki remains available.
- Used existing project screenshots as evidence; no metrics or animated media were invented.

## Verification

- `npm.cmd run clean` — passed.
- `npm.cmd run build` — passed; Hexo generated 340 files.
- `node --check themes/cactus/source/js/live2d-chat.js` — passed.
- `git diff --check` — passed.
- `python tools/verify-site.py` — passed: 21 identical Portfolio files, 19 article routes, 68 HTML files, 67 valid JSON-LD blocks; homepage, About, Portfolio links/assets, and indexing policy verified.
- Prior local visual review at 390px showed no horizontal overflow and confirmed the hero stacks into a readable single column. Browser screenshot recheck after the latest changes could not run because Chrome DevTools reported its browser profile was already in use.

## Reference and content notes

The reference site was opened in Chrome and reviewed for its information hierarchy: concise identity and intro, prominent contact/CV links, consistent experience entries, and visual project evidence. The implementation uses those presentation principles without copying its content or assets.

Research result figures and dates remain limited to evidence already present in the repository. A downloadable CV and genuine GIF/video project captures can be added when supplied; current repository evidence includes static screenshots only.

## Deployment

No remote push or production deployment was performed.
