# 2026-11-07 Layout Follow-up

## User feedback

The first redesign still felt crowded: content appeared in left and right columns, and too much detail was visible at once. The follow-up prioritizes a predictable, single-column reading order and short section summaries that lead to detail on demand.

## Implemented

- Portfolio introduction now flows in one column, with education and current role following the introduction.
- Portfolio index presents Research, Experience, Projects, and Background as four consistent rows.
- Those four sections are collapsed by default. Selecting an index row or section navigation link opens its matching details; project evidence and limitations remain inside the relevant section.
- Blog landing page uses a single reading column, stacks the role/education context and featured work, and shows three recent posts instead of six. Existing posts and archive routes remain intact.
- Suppressed the floating Hibiki assistant on the Blog landing page, where its launcher and speech bubble obscured content. It remains available on article pages.

## Validation

- `npm run build:portfolio`: passed (`tsc --noEmit` and Vite production build).
- `npm run clean` followed by `npm run build`: passed; Hexo generated 317 files and retained Blog and Portfolio routes.
- `python tools/verify-site.py`: passed; 17 identical Portfolio files, 19 article routes, 68 HTML files, 67 valid JSON-LD blocks, and checked homepage/About/Portfolio links, assets, and indexing policy.
- `node --check themes/cactus/source/js/live2d-chat.js`: passed.
- Existing Worker tests: 39 passed, 0 failed.
- Browser check at 390 px: Blog and Portfolio both measured 390 px document width with no horizontal overflow. Blog homepage showed 3 articles. Portfolio showed 4 index rows; sections start collapsed, and navigating to `#research` opens the research section.
- Desktop screenshots confirmed the Portfolio introduction and the Blog single-column feature list. The Blog landing page no longer shows the floating assistant.

No production deploy or push was performed.
