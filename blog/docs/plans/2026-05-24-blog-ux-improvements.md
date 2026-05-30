# Blog UX 全面改善

## Scope
對 Hexo Cactus 主題進行九項 UX 改善：可讀性與對比度、卡片樣式、關於我頁、導航結構、搜尋功能、閱讀體驗、音樂播放器、底部區塊、響應式設計。

## Files Impacted
- `themes/cactus/_config.yml`
- `themes/cactus/layout/index.ejs`
- `themes/cactus/source/css/_shoka.styl`
- `themes/cactus/layout/_partial/search.ejs`
- `themes/cactus/layout/_partial/music-player.ejs`
- `themes/cactus/source/js/music-player.js`
- `source/_data/custom.styl`
- `source/about/index.md`
- `source/categories/index.md`（新建）

## DB Impact
none

## Risk
- 移除 `#hero-issue-num` 改變英雄區塊佈局，已調整 `#hero-text-group` max-width 補償
- 導覽列增至 6 項，在手機漢堡選單垂直空間需留意

## SDD Update
- 無 API/DB/Auth 變更，SDD 不需更新

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [ ] SDD Updated
- [ ] Review Ready
