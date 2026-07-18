# Live2D 可聊天看板娘

## Scope
把既有的裝飾性 Live2D（hexo-helper-live2d + hibiki）升級為可互動角色：最簡聊天框（LLM 對話）、時段/情境問候、換模型按鈕。聊天大腦走 OpenRouter，經 Cloudflare Worker 代理（key 不落前端）。

## Files Impacted
- _config.yml（root）：live2d.enable → false（停用舊 helper 注入）
- themes/cactus/source/lib/live2d/L2Dwidget(.0).min.js（vendor 自 node_modules/live2d-widget）
- themes/cactus/source/js/live2d-chat.js（新增：init/問候/聊天/換模型）
- themes/cactus/source/css/_live2d.styl（新增：聊天面板樣式）+ style.styl import
- themes/cactus/layout/layout.ejs（注入設定 + 載入 script）
- themes/cactus/_config.yml（新增 live2d_chat 區塊：endpoint/models）
- workers/live2d-chat/worker.js + README.md（CF Worker 代理，使用者自行部署）

## DB Impact
none（聊天無伺服器端狀態；歷史只存訪客當前分頁記憶體）

## Risk
- L2Dwidget 重新 init 會殘留舊 canvas → 換模型前手動移除 #live2d-widget DOM
- jsdelivr CDN 模型不可用時角色不顯示 → 聊天面板獨立於模型渲染，仍可運作
- OpenRouter 免費模型 ID 會輪替 → model 放 Worker env var，README 註明更換方式
- endpoint 未設定時 → 前端退化為離線劇本回覆，不報錯

## SDD Update
- 無 SDD.md；架構決策記入 docs/decisions/2026-07-18-live2d-chat-architecture.md

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-07-18，hexo server + Chrome DevTools）
- CDN 模型渲染成功（hibiki）；換模型循環 hibiki→shizuku 正常、無殘留 canvas
- 時段問候觸發（「下午好！來看看 Lin 又寫了什麼」）
- 聊天面板開闔、離線劇本關鍵字回覆正常（「你是誰」→ 看板娘自介）
- console 零錯誤；行動版 <=768px 整組隱藏
- endpoint 未設定的離線模式為預設可部署狀態
