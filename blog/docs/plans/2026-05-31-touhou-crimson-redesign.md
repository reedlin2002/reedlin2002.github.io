# Touhou 紅魔鄉 (Gothic Crimson Night) Blog Redesign

## Scope
全站主題從紫色科技風改為紅魔鄉風格：深緋紅/金色調、Playfair Display 字型、CSS 紅月、粒子星空系統色彩更新，並加入 Live2D 看板娘。

## Files Impacted
- `themes/cactus/source/css/_shoka.styl` — 全域色彩 token 替換 (20+ replace_all)
- `themes/cactus/source/css/_modern-enhancements.styl` — back-to-top 按鈕色彩
- `themes/cactus/source/css/_colors/modern-dark.styl` — 暗色主題 Stylus 變數
- `themes/cactus/source/css/_colors/modern-light.styl` — 亮色主題 Stylus 變數
- `themes/cactus/source/js/main.js` — 主題切換 flash overlay 色彩
- `themes/cactus/source/js/pjax-init.js` — NProgress 進度條色彩
- `themes/cactus/source/js/particle-system.js` — 粒子系統色彩
- `themes/cactus/layout/_partial/head.ejs` — Playfair Display Google Font
- `themes/cactus/layout/index.ejs` — Hero subtitle 文案修正
- `source/_data/custom.styl` — 客製化樣式色彩同步
- `_config.yml` — Live2D 設定

## DB Impact
none

## Risk
- Stylus 色彩 token 大量替換，若有遺漏可能局部殘留舊紫色
- Live2D CDN 載入受網路環境影響

## SDD Update
- 無架構異動，純 UI 變更

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [ ] SDD Updated
- [x] Review Ready
