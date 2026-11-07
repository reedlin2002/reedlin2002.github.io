# Blog Homepage Editorial Refinement

## Scope
Redesign only the Blog homepage around a clear professional introduction, real research evidence, readable work experience, and the existing Field Notes article list.

## Files Impacted
- `themes/cactus/layout/_partial/profile.ejs`
- `themes/cactus/layout/index.ejs`
- `themes/cactus/layout/_partial/header.ejs`
- `themes/cactus/layout/_partial/footer.ejs`
- `themes/cactus/layout/layout.ejs`
- `themes/cactus/source/css/_profile.styl`
- `themes/cactus/source/css/_landing.styl`
- `themes/cactus/_config.yml`
- `themes/cactus/_config.yml`
- `source/_data/profile.json`
- `source/images/homepage-*.webp` (reused project evidence screenshots)
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
- [x] In Progress
- [ ] Code Done
- [ ] Docs Updated
- [ ] SDD Updated
- [ ] Review Ready
