# Personal Brand Landing — React-Bits 風格首頁重構 + RWD/UX 修復

## Scope
把首頁重構為個人品牌 landing（Aurora hero + 精選專案 + 最新文章 + Contact），完整文章列表移交 /archives；徹底清理死代碼 CSS/JS；修復現存 RWD/UX bug；全站視覺一致化。效果以 vanilla JS/CSS 重刻 React Bits 風格，不引入 React。

## Files Impacted
- themes/cactus/layout/index.ejs（重寫為 landing 四區塊）
- themes/cactus/layout/archive.ejs（接手完整文章列表）
- themes/cactus/layout/_partial/post-card.ejs（新增，首頁/archives 共用）
- themes/cactus/layout/layout.ejs、_partial/head.ejs、_partial/scripts.ejs、_partial/music-player.ejs
- themes/cactus/source/js/landing.js（新增）、pjax-init.js、main.js
- themes/cactus/source/js/hero-carousel.js、shoka.js、typewriter.js、cursor-effects.js、particle-system.js（刪除）
- themes/cactus/source/css/_landing.styl（新增）、_minimal.styl、style.styl、_partial/header.styl
- themes/cactus/source/css/_shoka.styl、_modern-enhancements.styl、_typography.styl、_effects-3d.styl、_ux-fixes.styl（刪除，死代碼）
- themes/cactus/_config.yml、_config.yml（根）、themes/cactus/languages/*.yml
- source/_data/projects.json（重寫為真實專案）

## DB Impact
none（純靜態網站主題層）

## Risk
- 7/11 兩輪功能回歸（字數統計、相關文章、版權塊、APlayer、lightbox）→ post.ejs/copyright.ejs/related.ejs/scripts/*.js 不碰
- Stylus 編譯失敗 → Phase A 純刪除 + hash 驗證，之後每次 styl 改動跟 build
- 首頁分頁 /page/N/ 消失 → archives 保有分頁，記入 ADR
- Live2D 疊 hero → 截圖確認

## SDD Update
- 無 SDD.md（本專案為 Hexo 靜態站，無 API/DB）；架構決策記入 docs/decisions/

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-07-18，hexo server + Chrome DevTools）
- Build：每階段 `hexo clean && hexo generate` 通過；Phase A 刪 9 個死檔後 `public/css/style.css` SHA-256 與基準完全一致（e2adee79…）
- 視口矩陣：1440×900 / 375×667 / 844×390（橫向）× 亮/暗模式 × 首頁、archives、文章內頁——版面正常、Aurora 依模式調色
- 行動抽屜：開（面板圓角+陰影+滑降動畫）/ 外部點擊關 / Esc 關均正常——此抽屜樣式修復前從未生效（Stylus 巢狀選擇器錯誤）
- PJAX 巡迴：archives→首頁→文章，split-text 重跑（3 chars）、spotlight 重綁、閱讀進度條/相關文章×3/版權塊/APlayer 均正常
- Console：主題層零錯誤；僅文章內容缺圖 nfc-test-*.png 404（既有內容問題）
- 過程中額外修復：#theme-toggle 被 #header backdrop-filter 劫持 fixed containing block（改為 header 流內）；$base-style 給 h3 的底線蓋掉；抽屜面板改 absolute 定位

## 程式碼區塊重製（2026-07-18）
使用者反映文章內程式碼難看。根因：`$font-family-mono` 竟是 "Nunito"（圓體 sans-serif）、`$color-background-code #f6f8fa` 淺底蓋掉 monokai 深底（style.styl 的 .highlight 規則在 import 之後）、`.content table` 框線滲入 highlight 表格。重製為終端機視窗風：`#0d1117` 深底（亮暗模式皆深）、38px header bar + 紅黃綠三燈、語言徽章與複製鈕移入 bar、JetBrains Mono、行號淡化、表格邊框全滅、`display:block + overflow-x` 處理長行捲動。

## 視覺二版（2026-07-18）
首版 Aurora 柔和風被使用者退回（「太 common」），改為 Dev/Terminal 暗色優先：近黑底 + 點陣紋理、電光青單一 accent、終端 kicker、巨型掃光字、skills 跑馬燈、mono `//` 區段標題、`[tag]` 括號卡片。詳見 decisions/2026-07-18-dev-terminal-visual-language.md。已重新驗證：亮暗兩模式、行動單欄、console 零錯誤。

## 決策參照
- docs/decisions/2026-07-17-vanilla-js-over-react-for-landing-effects.md
- docs/decisions/2026-07-17-delete-dead-css-layers.md
- docs/decisions/2026-07-17-homepage-landing-ia.md
- docs/decisions/2026-07-18-dev-terminal-visual-language.md
