# Portfolio：成果與證據直接展開

> 已被 `2026-11-07-portfolio-self-intro-layout.md` 取代：使用者看過後改為個人自介版型，此版未保留。

## Scope
接續同日的 academic-engineering 改版，把收在摺疊區塊與時間軸裡、已查證的成果移到首屏和各案例中，讓審查者不用點開就看得到貢獻、決策與結果。

## Files Impacted
- portfolio/src/sections/Overview.tsx（兩欄首屏＋專題輸出圖＋成果佐證列）
- portfolio/src/sections/CaseStudies.tsx（研究／經驗／作品改為展開的 section；經驗三案例；其他作品列表）
- portfolio/src/sections/Background.tsx（展開；學歷旁列獎項）
- portfolio/src/sections/Converge.tsx（對齊主欄，聯絡按鈕）
- portfolio/src/App.tsx（移除與下方重複的主題索引）
- portfolio/src/data/caseStudies.ts（MORE_PROJECTS）
- portfolio/src/editorial.css（新版面樣式，刪除 disclosure／索引的舊規則）
- source/portfolio/（build 產物）

## DB Impact
none

## Risk
- 所有新增敘述都來自 `timeline.ts`（申請文件 v1.8）、About 或公開文章；沒有新增數字。App 規模（9／37／98）標明為參與產品的規模，非個人量。
- 頁面變長（桌面約 7,300px），以頂部導覽與 fragment 深連結補足；完整時間軸仍收在 details。
- 聯絡信箱 Portfolio（kanewolf98@）與 About（lin1022business@）不同，待使用者決定，未更動。
- 本機沒有 Python，未執行 `tools/verify-site.py`。

## SDD Update
- Portfolio SPA「頁面區塊」表

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
