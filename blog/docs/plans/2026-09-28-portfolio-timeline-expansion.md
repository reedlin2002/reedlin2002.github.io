# Portfolio SPA：Hero 改寫與時間軸擴充

## Scope
改寫 `/portfolio/` 的 Hero 自我介紹，並把時間軸從 12 個節點擴充到 18 個（研究計畫、展覽、Side Project、工作案例等），以大小卡與類型標籤控制閱讀負擔。

## Files Impacted
- `portfolio/src/sections/Hero.tsx`：姓名、學校與職稱兩行、兩段介紹
- `portfolio/src/data/timeline.ts`：資料模型（`tag`、`compact`、`cases`）與節點
- `portfolio/src/sections/DualTimeline.tsx`：類型標籤、小卡、工作案例、終點標記
- `portfolio/src/styles.css`
- `portfolio/src/assets/`：新增 `localai.webp`、`atm.webp`；移除不再使用的 `nfc-test.webp`
- `portfolio/index.html`：`<title>`、`<noscript>` 連結
- `source/portfolio/`：重新 build
- `docs/SDD.md`：Portfolio SPA 章節的資料模型

## Implementation
- 節點事實都對照 repo、文章或使用者提供的資料；日期不明的項目不放，或與同類節點合併。
- 台灣 ATM Finder 只用不含位置資訊的畫面（使用說明、篩選條件）。
- 「現在」不是事件，做成時間軸終點標記。

## DB Impact
none

## Risk
- 節點數變多，桌機兩欄的研究軌會比較空；以小卡降低工程軌的高度。
- build 產物進版控，改原始碼後必須重新 `npm run build:portfolio`。

## SDD Update
- Portfolio SPA 章節：`TimelineNode` 欄位與終點標記。

## Validation
- `npm --prefix portfolio run build` 無錯誤。
- `hexo generate` 後 `public/portfolio/` 與 `source/portfolio/` 逐檔相同。
- 桌機 1440、手機 390、reduced motion 實際檢查；所有外部連結 200；console 無錯誤。

## Progress
- build 通過（JS 498 KB，gzip 169 KB）；`public/portfolio/` 與 `source/portfolio/` 逐檔相同。
- 桌機 1440：Hero 五行結構正確；時間軸 18 張卡，年份 2023–2026，最後是 NOW 標記；8 張圖片都載入。
- 審閱後移除課程作業兩張卡與一張內部 Demo 卡；產品開發節點不寫產品名。
- 手機 390：無橫向溢出，學校與職稱各一行，未載入 Target Cursor。
- console 無錯誤；頁面上所有外部連結皆為 200。
- 已知取捨：時間軸依時間逐列排列，2025–2026 工程節點密集時研究欄會留白。
- 2026-09-28 已部署（main `46cafe5`），線上 `/portfolio/` 與新資源檔皆為 200。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
