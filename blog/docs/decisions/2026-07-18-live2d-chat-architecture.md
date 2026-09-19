# Decision: Live2D 聊天走 Cloudflare Worker 代理 OpenRouter

**Date**: 2026-07-18
**Status**: Accepted

## Context
站點是 GitHub Pages 靜態站，無後端。要讓看板娘接 LLM 聊天，API key 不能寫在前端（任何訪客都能從 JS 扒走刷爆額度）；站主的本地 Ollama 訪客也連不到。使用者指定用 OpenRouter 的模型。

## Decision
- 前端聊天框 → POST 到站主自部署的 **Cloudflare Worker**（免費額度 100k req/day）→ Worker 持 `OPENROUTER_API_KEY` env var 轉呼叫 OpenRouter chat/completions → 回傳單一 reply。
- Worker 端固定 system prompt（人設，env 可覆寫）、裁切歷史（最後 10 則、每則 500 字）、max_tokens 300、CORS 鎖定 blog origin，降低濫用面。
- 前端 `theme.live2d_chat.endpoint` 未設定時退化為離線劇本回覆（關鍵字 + 隨機台詞），介面不變，之後填上 endpoint 即升級為真 LLM。
- 渲染底座沿用 L2Dwidget（vendor 進 theme，棄用 hexo-helper-live2d 的自動注入），固定使用 jsdelivr CDN 的 Hibiki Cubism 2 模型，避免換模型 reload 與殘留 canvas。
- Hibiki 定位為「文章聊天助理」：桌機所有頁面顯示右下完整角色，避免原本看板娘在首頁消失；平板顯示明確的「問 Hibiki」入口；手機文章頁將入口整合進既有底部操作列。文章判斷只控制總結功能與對話上下文。
- 完整角色與右下回頂按鈕保留安全間距。桌機聊天採視覺小說式對話框，從 Hibiki 左側貼近畫面底部展開，提供角色名牌、遊戲選項與自由輸入；不再使用終端機外觀，也不再為聊天面板壓縮文章寬度。手機使用同風格的 bottom sheet，不載入 Live2D 模型。
- Hibiki 在桌面使用待機台詞維持參與感：每頁進入約 3 秒後首次說話，其後以 45–90 秒隨機間隔出現，每頁上限四次；文章閱讀中段可觸發情境台詞。泡泡可直接開啟聊天，聊天開啟、背景分頁與手機版均停止自動台詞。
- 聊天歷史以文章路徑為生命週期；同篇文章收合後保留，PJAX 切換文章或重新整理時清空。

## Consequences
- 好處：key 安全、零月費、免費模型可隨時在 env 換；聊天與 Live2D 均為前端漸進增強，CDN 或 Worker 掛掉都不影響部落格本體；行動裝置仍可使用文章助理而不承擔模型渲染成本。
- 壞處：站主需維護一個 Worker（一次性 ~10 分鐘部署）；OpenRouter 免費模型有速率/可用性波動；L2Dwidget 停止維護，僅支援 Cubism 2 舊模型。
