# Live2D 可聊天看板娘

## Scope
把既有的裝飾性 Hibiki 升級為文章聊天助理：桌機所有頁面顯示右下完整 Live2D，平板提供明確入口，手機使用 bottom sheet。文章頁額外提供內容總結與文章上下文。聊天大腦走 OpenRouter，經 Cloudflare Worker 代理（key 不落前端）。

## Files Impacted
- _config.yml（root）：live2d.enable → false（停用舊 helper 注入）
- themes/cactus/source/lib/live2d/L2Dwidget(.0).min.js（vendor 自 node_modules/live2d-widget）
- themes/cactus/source/js/live2d-chat.js（Live2D lazy init、響應式入口、逐文章對話狀態、聊天）
- themes/cactus/source/css/_live2d.styl（右下安全區、視覺小說對話框、手機 bottom sheet）+ style.styl import
- themes/cactus/layout/layout.ejs（注入設定 + 載入 script）
- themes/cactus/_config.yml（live2d_chat 區塊：endpoint/model）
- workers/live2d-chat/worker.js + README.md（CF Worker 代理，使用者自行部署）

## DB Impact
none（聊天無伺服器端狀態；歷史只存訪客當前分頁記憶體）

## Risk
- jsdelivr CDN 模型不可用時角色不顯示 → 聊天面板獨立於模型渲染，仍可運作
- OpenRouter 免費模型 ID 會輪替 → model 放 Worker env var，README 註明更換方式
- endpoint 未設定時 → 前端退化為離線劇本回覆，不報錯
- PJAX 會替換手機文章操作列 → 每次 pjax:complete 重新同步 Hibiki 入口與文章對話 key

## SDD Update
- 無 SDD.md；架構決策記入 docs/decisions/2026-07-18-live2d-chat-architecture.md

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-07-18）
- `node --check` 通過來源與生成後的 live2d-chat.js。
- `hexo generate --force --bail` 完整生成 167 個檔案，Stylus 編譯成功。
- 本機預覽首頁與文章頁皆回應 HTTP 200；兩者皆載入聊天腳本，文章頁包含既有手機操作列。
- 生成 CSS 確認：回頂按鈕 right/bottom 24px、完整角色 right 72px、精簡入口 bottom 76px、手機層級高於既有 footer-post。
- `localhost:4000` 回歸檢查確認完整角色門檻為 769×520、首頁不再依賴文章 selector；Hibiki 模型 CDN 回應 HTTP 200。
- 視覺小說版重新執行 `npm run build` 與 `node --check` 均通過；localhost 已送出 Hibiki 名牌、SELECT 選項及新版 CSS，且舊終端標題與三色圓點已移除。
- 待機台詞版再次通過 `npm run build`、`node --check` 與 diff whitespace 檢查；包含桌面隨機台詞、每頁頻率上限、文章中段觸發、背景分頁暫停及泡泡開啟聊天。
- 修正完整模式泡泡與聊天入口重疊：碰撞檢查由 `COLLISION=True / ABOVE_CHARACTER=False` 轉為 `False / True`；localhost 確認送出 `right: 24px`、`bottom: 252px`、`z-index: 5`，泡泡尾端改為對準 Hibiki 頭部。
- 視覺瀏覽器連線在本次工作環境不可用；像素級畫面仍需人工預覽確認。
