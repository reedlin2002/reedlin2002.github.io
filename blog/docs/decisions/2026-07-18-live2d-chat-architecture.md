# Decision: Live2D 聊天走 Cloudflare Worker 代理 OpenRouter

**Date**: 2026-07-18
**Status**: Accepted

## Context
站點是 GitHub Pages 靜態站，無後端。要讓看板娘接 LLM 聊天，API key 不能寫在前端（任何訪客都能從 JS 扒走刷爆額度）；站主的本地 Ollama 訪客也連不到。使用者指定用 OpenRouter 的模型。

## Decision
- 前端聊天框 → POST 到站主自部署的 **Cloudflare Worker**（免費額度 100k req/day）→ Worker 持 `OPENROUTER_API_KEY` env var 轉呼叫 OpenRouter chat/completions → 回傳單一 reply。
- Worker 端固定 system prompt（人設，env 可覆寫）、裁切歷史（最後 10 則、每則 500 字）、max_tokens 300、CORS 鎖定 blog origin，降低濫用面。
- 前端 `theme.live2d_chat.endpoint` 未設定時退化為離線劇本回覆（關鍵字 + 隨機台詞），介面不變，之後填上 endpoint 即升級為真 LLM。
- 渲染底座沿用 L2Dwidget（vendor 進 theme，棄用 hexo-helper-live2d 的自動注入），模型改從 jsdelivr CDN 載入 4 隻 Cubism 2 模型（hibiki/shizuku/koharu/tororo），換模型 = 移除舊 canvas 後重新 init。

## Consequences
- 好處：key 安全、零月費、免費模型可隨時在 env 換；聊天/問候/換裝均為前端漸進增強，CDN 或 Worker 掛掉都不影響部落格本體。
- 壞處：站主需維護一個 Worker（一次性 ~10 分鐘部署）；OpenRouter 免費模型有速率/可用性波動；L2Dwidget 停止維護，僅支援 Cubism 2 舊模型。
