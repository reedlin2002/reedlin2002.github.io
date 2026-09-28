# Hibiki 機器人優化 Backlog

## Scope
記錄已確認「想做但現階段先不做」的 Hibiki 優化項目,供之後開工時直接轉成正式 plan。

## Backlog 項目

### 1. 回覆速度與串流
現況痛點：Worker 仍等 OpenRouter 整段生成完才回傳，等待期間訪客只看得到「…」。2026-09-27 已加入模型單次 25 秒、全請求 60 秒、最多三次呼叫與索引三秒期限，串流仍待實作。

- Worker 對 OpenRouter 開 `stream: true`,以 SSE / ReadableStream passthrough 回前端
- 前端逐 chunk 渲染,配合視覺小說風格做打字機效果
- 已完成：每次模型呼叫與整體期限，見 `2026-09-27-hibiki-worker-quality.md`；之後可依實測延遲調整，不再視為未實作的項目
- 可選:Worker isolate 內記住上次成功的模型,優先嘗試,跳過已知故障的供應商

### 2. 濫用防護
現況痛點:CORS 只擋瀏覽器,curl 帶偽造 Origin 就能直接打 endpoint 刷 OpenRouter 額度。屬風險項而非體驗項。

- 選項 A:Cloudflare WAF rate limiting rule(免費方案可用)按 IP 限流
- 選項 B:Cloudflare Turnstile,首次發話時驗證
- 選項 C:Worker 內簡易 token bucket(需 KV 或 Durable Object)
- 可搭配:每日用量上限熔斷,超過即回離線劇本

### 3. 角色表現力
現況限制:L2Dwidget 已停止維護,僅支援 Cubism 2 舊模型,無法做表情/動作 API 控制。

- 說話狀態連動:pending 時播放思考動作、回覆時播放說話動作/表情
- TTS 唸出回覆(Web Speech API 免費,或接 TTS 服務)
- 底座升級:L2Dwidget → pixi-live2d-display,支援 Cubism 3/4 模型與 motion/expression 控制(工程量最大,是前兩項的前置)

### 4. 對話記憶與完整文章

2026-09-27 討論過同一分頁重新整理後保留對話，但使用者最終選擇本次嚴格只改 Worker。前端仍只送最近 10 則和文章前 6,000 字，換頁或重新整理仍清空；更長歷史、sessionStorage 與完整文章檢索留待後續，不宣稱本次已完成。

## DB Impact
none

## Risk
- 串流改造需同時動 Worker 與前端,退化路徑(離線劇本)不可壞
- 濫用防護若加 Turnstile 會增加首次互動摩擦
- 底座升級可能需換模型資源,Hibiki 形象是否保留需另行決策

## SDD Update
- 2026-09-27 已新增 `docs/SDD.md` 記錄 Hibiki 元件、API、重試期限及資料來源；後續功能需同步更新。

## Story Status
- [ ] In Progress(backlog,尚未開工)
- [ ] Code Done
- [x] Docs Updated
- [ ] SDD Updated
- [ ] Review Ready
