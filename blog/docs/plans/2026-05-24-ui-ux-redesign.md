# UI/UX 大改版 — 三大優化策略

## Scope
對 Hexo 部落格 (cactus 主題) 進行視覺與互動體驗的全面升級，包含深/淺色切換、沉浸式閱讀體驗、日系雜誌感首頁。

## Files Impacted
- `themes/cactus/layout/_partial/head.ejs`
- `themes/cactus/layout/_partial/header.ejs`
- `themes/cactus/layout/_partial/scripts.ejs`
- `themes/cactus/layout/_partial/post/actions_desktop.ejs`
- `themes/cactus/layout/index.ejs`
- `themes/cactus/layout/post.ejs`
- `themes/cactus/source/css/_shoka.styl`
- `themes/cactus/source/css/_modern-enhancements.styl`
- `themes/cactus/source/css/_typography.styl`
- `themes/cactus/source/css/_partial/header.styl`
- `themes/cactus/source/css/_partial/post/actions_desktop.styl`
- `themes/cactus/source/js/main.js`
- `themes/cactus/source/js/shoka.js`

## DB Impact
none

## Risk
- CSS Token 架構改動（策略三）會影響全站色彩，需確認 light/dark 兩套色票都覆蓋完整
- PJAX 頁面切換後需重新 init 新增的 JS 函數（在 `pjax-init.js` 中註冊）
- 行動版 Hamburger 動畫從 jQuery 改為 CSS-class 驅動，需確認所有裝置行為正確

## SDD Update
- 新增 Theme Token 架構說明
- 更新首頁 Hero 版型說明
- 更新 TOC 側欄互動說明

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [ ] SDD Updated
- [ ] Review Ready

---

## 策略執行順序

### 策略三：微互動 + 深/淺色切換（基礎架構）
1. `head.ejs` — 防 FOUC inline script ✅
2. `_shoka.styl` — CSS custom properties + `html[data-theme="light"]` 區塊
3. `header.ejs` — 主題切換按鈕 HTML
4. `_partial/header.styl` — 切換按鈕樣式
5. `main.js` — 切換 handler + hamburger CSS-class 改造
6. `_modern-enhancements.styl` — 微互動細節

### 策略二：沉浸式閱讀體驗
7. `actions_desktop.styl` — TOC 排版修正
8. `_modern-enhancements.styl` — active 指示器、drop cap
9. `_typography.styl` — 68ch 行寬、入場 keyframe
10. `actions_desktop.ejs` — CONTENTS 標題標籤
11. `post.ejs` — 閱讀時間加入 meta
12. `scripts.ejs` — TOC 自動滾動、鍵盤導覽、進度條修正

### 策略一：日系雜誌感 Hero + 首頁
13. `_shoka.styl` — Hero 非對稱排版、featured 卡片
14. `index.ejs` — 期數標記、featured class
15. `shoka.js` — 視差係數調整
16. `_modern-enhancements.styl` — 移除干擾動畫
