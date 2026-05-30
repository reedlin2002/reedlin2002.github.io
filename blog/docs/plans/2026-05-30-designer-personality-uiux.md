# UIUX 全面調整 — Designer Personality Overhaul

## Scope
全面重設 blog 的視覺風格，從通用「科技深色 + cyan」轉向更有個性的設計師風格，調整配色、首頁卡片排版、文章閱讀體驗、導覽列/Header。

## Files Impacted
- themes/cactus/source/css/_colors/modern-dark.styl
- themes/cactus/source/css/_shoka.styl
- themes/cactus/source/css/_modern-enhancements.styl
- themes/cactus/source/css/_typography.styl
- source/_data/custom.styl
- themes/cactus/layout/index.ejs
- themes/cactus/layout/_partial/header.ejs

## DB Impact
none

## Risk
配色大幅改動（cyan #22d3ee → violet #a855f7），需確認 light mode 下對比度仍符合 WCAG AA；hardcoded 顏色分散多個檔案，需全部更新。

## SDD Update
- none（純樣式調整，不影響架構）

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A — 純樣式，無架構影響)
- [x] Review Ready
