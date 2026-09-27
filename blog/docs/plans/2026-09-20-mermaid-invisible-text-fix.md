# Mermaid 圖表文字變黑看不見

## Scope
修好文章裡 Mermaid 圖表「內容變成黑色、看不到文字」與「換頁後只剩原始碼」兩個問題。

## Files Impacted
- `themes/cactus/layout/_partial/scripts.ejs` — `initMermaid` 的 `render()` 改成排隊執行，算完再確認佈景沒變過
- `themes/cactus/source/js/pjax-init.js` — `pjax:complete` 補上 `window.initMermaid()`
- `themes/cactus/source/css/_minimal.styl` — `pre.mermaid[data-processed]` 的標籤顏色以實際生效的佈景色兜底

## Root Cause
1. **顏色競態**：`mermaid.run()` 是非同步的，而顏色是 `initialize()` 當下燒進 SVG 的。
   `_mermaidThemeWatcher` 在 `data-theme` 改變時重繪，但沒有等前一次算完；
   佈景在算圖途中切換時，兩次重繪互相覆蓋，就會出現深色標籤配深色底＝文字整塊看不見。
2. **PJAX 沒重繪**：`pjax-init.js` 的 `pjax:complete` 重跑了 `initMainJS` / `initSprint2JS` /
   `initSprint3JS` / `initReadingProgress` / `initLanding` / `initLightbox`，唯獨漏掉 `initMermaid`。
   從站內連結進文章時，`pre.mermaid` 是全新節點且沒人重繪，畫面上只剩 `flowchart TD ...` 原始碼。

## Fix
- `render()` 改為推進 `window._mermaidQueue`，同一時間只跑一張重繪；
  `draw()` 記下開始時的佈景，`run()` 結束後若佈景已變就再畫一次。
- `pjax:complete` 補呼叫 `initMermaid()`（函式本身冪等，會重收集 `pre.mermaid`）。
- CSS 兜底：`pre.mermaid[data-processed]` 內的 `.nodeLabel` / `.edgeLabel` / `text` / `tspan`
  一律吃 `var(--shoka-color-text)`，邊標籤底色吃 `var(--shoka-color-bg)`。
  即使哪次重繪仍燒錯顏色，文字也不會消失。

## DB Impact
none

## Risk
- CSS 兜底用 `!important`，會蓋掉 Mermaid 自訂的語意色。目前站內唯一一張圖
  （`ios-caller-id-resolution-chain.md`）是沒有 `style` 指令的純 flowchart，不受影響；
  日後若要在圖裡自訂顏色，需要放寬這條規則。
- `_mermaidQueue` 掛在 `window` 上，跨 PJAX 換頁沿用同一條佇列，這是刻意的（避免兩頁同時重繪）。

## SDD Update
無 `docs/SDD.md`，n/a。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-09-20）
於 `127.0.0.1:4011` 以 Chrome DevTools 實測：
- 全 16 篇文章 × 深/淺兩套佈景掃描靜態內文對比度：0 筆低對比 → 黑字問題確定來自前端算圖，不在 Markdown。
- 修正前：從 `/archives/` 點進 iOS 那篇（PJAX），`pre.mermaid` 仍是原始碼（`renderedAsSvg: false`）。
- 修正後：同一條路徑 `renderedAsSvg: true`，標籤 `rgb(232,234,237)` 配底色 `rgb(8,9,13)`。
- 競態壓測：30/30/40ms 連續切換 `data-theme` 四次，最後停在深色 →
  標籤 `rgb(232,234,237)`、節點 `rgb(20,23,31)`；再切淺色、再切回深色皆正確。
- `hexo generate` 產出 236 檔，`public/` 內沒有任何原型資產。
