# Hibiki 文章索引推薦

## Scope
讓 Hibiki 知道站上所有文章,能真實推薦/找文章並附可點的站內連結;索引由 Worker 端抓取+快取注入 system prompt,前端只負責安全渲染連結。

## 已收斂的設計決策(grill-me 2026-07-18)
- 優化方向:四選項中選「讓 Hibiki 更聰明」;串流、濫用防護、角色表現力記入 backlog(見 2026-07-18-hibiki-optimization-backlog.md)
- 注入架構:Worker 端抓取+快取(1 小時 TTL,抓取失敗退化為無索引),非前端隨訊息送上
- 索引來源:新建專用 `hibiki-index.json`(scripts/ Hexo generator),不重用含全文的 search.xml
- 注入策略:每次請求都注入(12 篇約 1K tokens,成本可忽略)
- 連結渲染:前端自動把回覆中符合 permalink 格式(`/YYYY/MM/DD/slug/`)的站內相對路徑轉成 `<a>`,其餘維持純文字;不做結構化推薦卡片
- 主動推薦:不做,待機台詞維持靜態

## Files Impacted
- scripts/hibiki-index.js(新增:建置時產出 /hibiki-index.json)
- workers/live2d-chat/worker.js(抓取+快取索引、組進 system prompt、INDEX_URL env)
- workers/live2d-chat/README.md(新增 INDEX_URL 說明)
- themes/cactus/source/js/live2d-chat.js(assistant 訊息站內路徑 linkify、點連結收合聊天)
- themes/cactus/source/css/_live2d.styl(聊天連結樣式)

## DB Impact
none

## Risk
- 索引檔未部署(舊站)時 Worker 抓 404 → 退化為無索引,功能等同現況
- 模型可能編造不存在的路徑 → 前端 pattern 只轉相對站內路徑,點到 404 也僅站內;index block 指示「不要編造」
- PJAX 點站內連結導頁 → 既有 pjax:complete → syncPage 已處理對話重置

## SDD Update
- 無 SDD.md;架構決策記入 docs/decisions/2026-07-18-hibiki-article-index.md

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A,決策記入 docs/decisions/2026-07-18-hibiki-article-index.md)
- [x] Review Ready

## 驗證記錄(2026-07-18)
- `node --check` 通過 scripts/hibiki-index.js、worker.js、live2d-chat.js
- `hexo generate --force --bail` 184 檔案全數生成,`hibiki-index.json` 產出 12 篇,摘要乾淨、路徑正確
- linkify regex 實測:CJK 標點/括號中正確截出路徑;外部網址(https://evil.com/2026/...)僅路徑片段被轉為站內相對連結,無釣魚面
- Worker 端索引注入需部署後以 curl 驗證(問「推薦文章」應回清單內路徑)
