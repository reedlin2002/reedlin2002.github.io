# Decision: Hibiki 回覆格式 — Worker 端剝 markdown 而非前端渲染

**Date**: 2026-07-19
**Status**: Accepted

## Context
免費模型（gemma、gpt-oss）回答「解釋這篇文章」類問題時，幾乎必然無視 persona 的「不要用 markdown」禁令，輸出 `**粗體**`、backtick、編號列表。前端基於防注入使用 createTextNode 純文字渲染，符號原樣顯示；`.waifu-msg` 又沒有 pre-wrap，換行被瀏覽器壓成空格，結果是一坨帶符號的文字牆。

## Decision
1. **目標格式是純文字 + 換行，不是渲染 markdown**。Worker 新增 sanitizeReply 在回傳前剝除格式符號；前端 `.waifu-msg-text` 加 `white-space: pre-wrap` 呈現分行。不在前端寫 markdown mini-renderer——80~200 字的角色對話框裡，粗體與縮排列表是噪音，且引入 XSS 面積。
2. **`[文字](網址)` 轉成 `文字 網址`**，兩者都保留。站內路徑由前端既有的 SITE_PATH_RE 決定是否轉連結，「哪些東西可以變連結」的判斷權維持在前端單一位置；站外 URL 顯示為純文字不可點，與現行防注入 policy 一致。
3. **長度只靠 prompt 正面指令治理**（「每句自成一行」「分點最多三點」「解釋文章最多五行」），max_tokens 維持 300 當天花板。不降 max_tokens、不做 Worker 硬截斷——斷頭句比冗長更傷角色感，且 fallback 鏈四個模型囉嗦程度不一，單一硬上限無法兼顧。
4. **不剝單星號斜體**。顏文字常帶星號（`(*´∀`*)`、`╰(*°▽°*)╯`），天真 regex 會毀容；中文回覆出現單星號斜體的機率趨近零。sanitizer 原則：寧可漏剝、不可誤傷。

## Consequences
- 好處：回覆變成乾淨的分行短句，符合 terminal UI 美學；sanitizer 是純函式、零依賴、可獨立測試；換模型不需重調（不依賴任何模型聽話）。
- 代價：巢狀格式（`***粗斜體***`）會留殘餘星號；模型仍可能偶爾超過建議行數，但傷害已從「文字牆」降為「多幾行」。
- sanitize 後為空字串時回退原文，確保 reply 永不為空。
