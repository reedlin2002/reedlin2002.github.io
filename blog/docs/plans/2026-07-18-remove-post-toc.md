# Remove Post TOC (桌機側欄 + 手機底部)

## Scope
移除文章頁的目錄（TOC）：桌機右側 sticky TOC 與手機底部動作列的「目錄」toggle，連同配套的章節高亮 JS、j/k 鍵盤導航與樣式一併刪除。

## Motivation（/grill-me 訪談定案）
1. 視覺太雜，站點走極簡方向（延續先前「極簡改版」）。
2. 右側 TOC 與 Live2D 看板娘等浮動元件位置打架。
3. 沒人用、維護成本高 → 決策為「徹底刪除」而非 CSS 隱藏或 config 開關。
4. j/k 鍵盤跳章節是 TOC 配套功能（依賴 TOC 的 IntersectionObserver 提供 activeId），一併刪除，不重構保留。

## Files Impacted
- themes/cactus/layout/layout.ejs — 移除 actions_desktop partial include
- themes/cactus/layout/_partial/post/actions_desktop.ejs — 整檔刪除（現在只剩 TOC）
- themes/cactus/layout/_partial/post/actions_mobile.ejs — 移除 #toc-footer 區塊與「目錄」按鈕
- themes/cactus/layout/_partial/scripts.ejs — 移除 Sprint 3 的 TOC IntersectionObserver 高亮 + 自動捲動 + j/k 導航（約 70 行）
- themes/cactus/source/css/_partial/post/actions_desktop.styl — 整檔刪除
- themes/cactus/source/css/style.styl — 移除 actions_desktop import 與 `#header-post #actions` 殘塊
- themes/cactus/source/css/_minimal.styl — 移除 TOC 區塊（#header-post / #toc / .toc-active）
- themes/cactus/source/css/_partial/post/actions_mobile.styl — 移除 #toc-footer 樣式
- themes/cactus/source/js/main.js — 移除 `$("#toc-footer").hide()` 一行

## 刻意不動的部分
- 20 個語言檔的 `post.mobile.toc` key：留為未使用 key，避免跨檔 churn 與上游合併摩擦。
- `_enrich.styl` 的全站 smooth scroll 與 heading scroll-margin：服務所有錨點連結，非 TOC 專屬。
- `main.js` 中 `#menu-icon-tablet` 的 jQuery 參照：上游既有死碼（無害 no-op），與本次變更無關。

## DB Impact
none

## Risk
- 長文（如 binary-search-learning）失去章節導航；現有右下「回頂」按鈕與文末 post-nav 為僅存導航手段。已知取捨，使用者接受。
- scripts.ejs 該 script 區塊同時含 code block 複製鈕與 mobile nav 邏輯，刪除範圍需精準，勿誤刪相鄰功能。
- 主題為 submodule，需依既有慣例先在 submodule commit 再 bump 主 repo。

## SDD Update
- docs/SDD.md 不存在，n/a。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated（n/a — SDD.md 不存在）
- [x] Review Ready
