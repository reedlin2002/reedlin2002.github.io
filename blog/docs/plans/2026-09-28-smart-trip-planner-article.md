# 新文章：智慧旅程規劃（以 PRD 角度介紹新版旅遊平台）

## Scope
為重做後的旅遊平台（`travel_frontend` 的 `src/planner/`）新寫一篇以 PRD 為主軸、附大量真實截圖的文章；5 月的舊文保留為 v0.1 紀錄並加註連結。

## Files Impacted
- `source/_posts/smart-trip-planner.md`（新增）
- `source/_posts/travel-planner-side-project.md`（文首加一行連到新文、加 `updated:`，其餘不動）
- `source/images/smart-trip-planner-*.png`（新增截圖與封面）

## Implementation
- 需求起點取自 travel_frontend repo 的 `docs/prd.md`（V0.1）、`docs/epic.md`、`docs/front-end-spec.md`、`docs/architecture.md`、`docs-ver1.1/*.md`；新功能從本機執行的畫面與 `src/planner/` 程式碼歸納。沒有新版 PRD 文件，文中補寫的用戶故事標明是「這一版補上的需求」。
- 不呼叫 Gemini API；截圖一律用內建範例行程「東京・京都・大阪 5 日」。
- 截圖用 Chrome DevTools MCP 的 isolatedContext（不碰使用者瀏覽器資料），桌機 1440×900、手機 390×844。
- 不放 repo 連結（新版尚未 commit），不出現 API key 與 `.env` 內容。

## DB Impact
none

## Risk
- travel_frontend 的新版尚未 commit，文章描述的是 2026-09-28 本機工作目錄的版本。
- 順路推薦依賴公開的維基百科與 Overpass 伺服器，截圖時可能被限流。

## SDD Update
- none（只改內容，不動站台程式）。hibiki-index 由 `scripts/hibiki-index.js` 在建置時自動收錄新文章。

## Validation
- `npx hexo clean && npx hexo generate` 無錯誤。
- 本機預覽：無破圖、mermaid 在淺色與深色模式皆正常、首頁摘要在 `<!-- more -->` 截斷、舊文頂端連結可點到新文。
- 文中每個數字、範圍、名稱對照 travel_frontend 原檔與截圖。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated（N/A，只改內容）
- [ ] Review Ready
