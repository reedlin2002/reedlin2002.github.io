# Decision: Hibiki 文章索引由 Worker 端抓取注入

**Date**: 2026-07-18
**Status**: Accepted

## Context
Hibiki 原本不知道站上有哪些文章,訪客問「推薦文章」只能瞎掰。需要把文章清單放進模型 context,且要決定:資料從哪來、由誰注入、推薦結果如何呈現。站上僅 12 篇文章,全量注入即可,不需檢索/RAG。

## Decision
- **注入架構**:Worker 向正式站抓 `/hibiki-index.json`(`INDEX_URL` env 可覆寫)，成功快取 1 小時、失敗快取 5 分鐘後重試。2026-09-27 起，資料置於來源明確、沒有指令效力的 system 引用區塊，絕不混入訪客 user 訊息；快取依 URL 區別，抓取含 body 最多三秒。見 [資料歸因決策](2026-09-27-hibiki-worker-quality.md)。前端 payload 不變。
- **索引來源**:新增 `scripts/hibiki-index.js` Hexo generator,建置時產出 title/url/date/tags/120 字摘要的專用 JSON(約 5KB)。不重用含全文的 `search.xml`,避免 Worker 解 XML 與抓取肥大檔案。
- **注入策略**:每次請求都注入(約 1K tokens,成本可忽略),文章頁也能回答「還有哪篇相關」。
- **連結渲染**:人設指示推薦時附原樣路徑;前端只把符合 permalink 格式(`/YYYY/MM/DD/slug/`)的相對路徑轉成 `<a>`,其餘維持 createTextNode 純文字。點連結先收合聊天,交給 PJAX 導航與既有 `syncPage` 重置對話。
- **範圍邊界**:待機泡泡維持靜態台詞,不吃索引;不做結構化推薦卡片。

## Consequences
- 好處:推薦/找文章成為真實功能且可一鍵導頁;索引隨部落格部署自動更新,Worker 無需重新部署;所有退化路徑(索引 404、抓取失敗)等同現況,聊天不受影響;白名單式 linkify 讓注入風險趨近零(外部網址只會被截成站內相對路徑)。
- 壞處:Worker 對站點多一個(有快取的)fetch 依賴;索引更新有最長 1 小時延遲;模型仍可能組出格式正確但不存在的路徑,點到為站內 404(index block 已指示不要編造)。
- 同場記錄:串流回覆、濫用防護、角色表現力三項確認想做但延後,見 docs/plans/2026-07-18-hibiki-optimization-backlog.md。
