# Blog Homepage Editorial Refinement

## Scope
Redesign only the Blog homepage around a clear professional introduction, real research evidence, readable work experience, and the existing Field Notes article list.

## Files Impacted
- `themes/cactus/layout/index.ejs`
- `themes/cactus/layout/_partial/header.ejs`
- `themes/cactus/layout/_partial/footer.ejs`
- `themes/cactus/source/css/_landing.styl`
- `themes/cactus/source/css/_live2d.styl`
- `themes/cactus/source/js/live2d-chat.js`
- `themes/cactus/_config.yml`
- `themes/cactus/scripts/cover_thumb.js`
- `source/images/homepage-research.webp`
- `docs/validation/2026-11-07-blog-homepage-editorial-refinement.md`

## DB Impact
None.

## Risk
- Existing cover assets and routes must remain valid; article thumbnails need dimensions, alt text, and lazy loading.
- Hero contact links should use the verified profile data and visible, accessible labels.
- Do not add generated project imagery that could be mistaken for real evidence.
- Changes should remain limited to the homepage; article reading layouts and content remain intact.

## SDD Update
- No API, service, schema, or third-party integration changes.

## Story Status
- [ ] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (not applicable; no API/service/schema/third-party changes)
- [x] Review Ready
