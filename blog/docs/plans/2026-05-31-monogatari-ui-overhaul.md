# Blog UI/UX Overhaul — Monogatari Series Inspired

## Scope
全站 UI/UX 大改版，參考物語系列官網視覺語言，在現有深色緋紅主題上疊加：
◇ 菱形符號系統、> 導覽前綴、極簡頁尾、清爽文章排版。

## Files Impacted
- `themes/cactus/layout/_partial/header.ejs` (nav dividers)
- `themes/cactus/source/css/_modern-enhancements.styl` (nav >, back-to-top diamond; fixed `#header nav` → `#header #nav` selector bug)
- `themes/cactus/source/css/_partial/header.styl` (removed dotted li borders; cream-ivory nav link color; light mode hamburger + dropdown)
- `themes/cactus/source/css/_shoka.styl` (section headers, card borders, scrolled light-mode fix)
- `themes/cactus/layout/index.ejs` (section header HTML)
- `themes/cactus/source/css/_typography.styl` (H2/H3 ◇, post title)
- `themes/cactus/layout/_partial/footer.ejs` (minimal footer)
- `themes/cactus/source/css/_partial/footer.styl` (minimal footer CSS)
- `source/_data/custom.styl` (global additions)

## DB Impact
none

## Risk
- nav `::before` 與 `::after` 衝突需合併
- 頁尾簡化後需確認所有導覽連結仍在 header nav 可達

## SDD Update
- none

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
