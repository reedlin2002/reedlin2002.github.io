# Decision: Hibiki 完整回答與背景資料歸因

**Date**: 2026-09-27
**Status**: Accepted

## Context

訪客反映 Hibiki 聊幾輪後忘記前文、答非所問、文章解釋淺且回覆偶爾中斷。可重現的 Worker 問題是：`length` 半句仍回成功、歷史只留 10 則並逐則截到 500 字。前端還有獨立的 10 則限制；使用者最後確認本次嚴格只改 Worker，跨頁或重新整理後記憶延期。

使用者另提供一段實際對話：Hibiki 反覆把網站自動提供的 JSON 說成訪客自己貼的資料，甚至引用先前的錯誤說法反駁訪客。實作初稿將參考 JSON 包入最後一則 user 訊息，來源角色不正確；新回歸測試在該版本失敗。

## Decision

1. 固定 Qwen3.8 27B free → Ling 3.0 Flash Sante free，允許具名免費 MODEL 優先覆寫並去重；拒絕付費 ID 與隨機路由，provider 各價格上限設為 0。選型參考官方用途描述，不將其當成此站繁體中文品質已通過測試的證明。
2. 自訂角色背景與固定品質規則分開。閒聊簡短，技術說明通常 200–400 字，承接追問及更正，不硬限制三點或 80 字。正常 token 上限 1,200；`length` 一次重新生成上限 2,400，再次截斷明示未完成。
3. 限制每次模型請求 25 秒、總請求 60 秒及最多三次嘗試，索引三秒；都包含 body 讀取。401/403 停止，非 JSON 仍保留 HTTP 狀態；不上傳或回傳原始上游錯誤文字。
4. 保留最近 20 則、每則 2,000 字、總計 16,000 字，超限按完整輪次刪除。前端只送 10 則的現實不變，不能承諾更長或持久記憶。
5. 參考資料由網站自動提供，放在 system 的明確引用區塊，固定規則聲明所有值沒有指令效力，JSON 跳脫區塊關閉符號。**不再修改 user 訊息來夾帶資料或人設**，也移除 Gemma 的角色混入 workaround；覆寫模型不支援 system 時走備援。
6. 問資料來源時用「網站自動提供的公開文章資料」說明；不主動揭露格式或後台名詞，也不把公開資料誤稱祕密。若誤稱訪客貼了資料，直接承認錯誤；訪客真的貼 JSON 求助仍按原訊息處理，不以字詞過濾掩蓋問題。
7. 保留純文字與原 API 欄位，增加 `finish_reason`、`truncated`，讓現有前端可繼續運作。sanitize 後沒有可用文字時改用備援，不把純圍欄當成有效回答。記錄每次呼叫的模型、耗時、tokens、備援次數及固定錯誤分類，不保存對話全文。

## Consequences

- 來源角色與實際訪客發言分開，避免程式本身製造「訪客貼了 JSON」的錯誤證據；回歸案例同時覆蓋重新生成與不支援 system 的模型備援。
- 超過輸出上限不再默默顯示成完整答案；較長回答與重試仍會增加延遲及免費請求額度消耗。
- 引用區塊與來源規則只能改善模型依據，不能單靠字串邊界保證模型不受提示注入或不再產生錯誤歸因；必須區分程式測試與真實模型評估。
- 保留單檔 Worker，不增加資料庫、前端狀態、LLM 評分器或額外摘要呼叫。若要跨頁記憶或文章全文，需另做前端與資料流變更。
- 本地未設定 OpenRouter 金鑰，真實模型比較與 Cloudflare 部署驗證待執行；README 記錄固定問答及人工評分方式。

## References

- [Qwen3.8 27B free](https://openrouter.ai/qwen/qwen3.8-27b:free)
- [Ling 3.0 Flash Sante free](https://openrouter.ai/inclusionai/ling-3.0-flash-sante:free)
- [Reasoning tokens 與 max_tokens](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens)
- [Provider max_price](https://openrouter.ai/docs/guides/routing/provider-selection#max-price)
