# Hibiki 回覆輸出格式規範

## Scope
Hibiki 回答文章問題時常吐出整坨含 markdown 符號（`**`、backtick、`1. 2. 3.`）的長文，前端純文字渲染下符號原樣顯示、換行被壓扁，難以閱讀。本次在 Worker 端剝 markdown、前端保留換行，讓回覆呈現為乾淨的分行短句。

## Files Impacted
- workers/live2d-chat/worker.js（新增 sanitizeReply、persona 改正面格式指令、pageBlock 補分行要求）
- themes/cactus/source/js/live2d-chat.js（訊息內容包進 .waifu-msg-text span）
- themes/cactus/source/css/_live2d.styl（.waifu-msg-text 加 white-space: pre-wrap）

## DB Impact
none

## Risk
- sanitizer 採「寧可漏剝、不可誤傷」：不碰單星號（保護顏文字），`***粗斜體***` 之類巢狀格式會留下殘餘星號，屬可接受瑕疵
- 長度控制只靠 prompt 正面指令（max_tokens 300 不變），free 模型偶爾仍會超標，但配合換行後傷害降為「多幾行」
- sanitize 後若變空字串會回退原文，不會讓前端收到空 reply
- 前端 DOM 結構變動（多一層 span）：訊息由 flex 子項改為單一 span 內流式排版，站內連結改為隨文字內聯顯示

## SDD Update
- 無 SDD.md；設計取捨記錄於 docs/decisions/2026-07-19-hibiki-plaintext-output.md

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated（n/a，無 SDD.md，以 decision 記錄替代）
- [x] Review Ready
