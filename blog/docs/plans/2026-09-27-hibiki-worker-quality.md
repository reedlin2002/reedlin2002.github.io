# Hibiki Worker 回覆品質改善

## Scope
僅修改 Worker 的執行程式，維持免費模型與既有前端介面，改善回覆截斷、上下文二次裁切、文章依據與重試可靠性。

## Files Impacted
- workers/live2d-chat/worker.js
- workers/live2d-chat/worker.test.mjs
- workers/live2d-chat/README.md
- docs/SDD.md
- docs/decisions/2026-09-27-hibiki-worker-quality.md
- 既有 Hibiki 架構、純文字輸出決策與優化 backlog

## Implementation
- 首選 Qwen3.8 27B free，備援 Ling 3.0 Flash Sante free；MODEL 僅允許具名 :free 模型。
- 人設可覆寫，品質、完整性及參考資料邊界規則獨立固定；閒聊簡短、技術說明通常 200–400 字。
- 使用者提供真實失敗對話後，修正資料歸因：背景資料明確標示為網站自動載入，置於 system 中的引用資料區塊，絕不混入 user 訊息；限制引用內容沒有指令效力，跳脫可關閉區塊的符號。覆寫模型不支援 system 時改走備援。
- 不主動提 JSON 或後台實作；問來源時解釋公開文章資料由網站自動提供，誤稱訪客貼了資料時直接認錯，不以舊 assistant 說法反駁訪客。
- 一般輸出 1,200 tokens，length 時同模型以 2,400 tokens 重新生成一次；再失敗保留可用片段並明示未完成。
- 最近 20 則、每則 2,000 字、總計 16,000 字，超量由最舊完整輪次移除；不假裝補回前端丟掉的資訊。
- 模型單次 25 秒、全請求 60 秒、最多三次模型呼叫；索引三秒，包含回應 body 讀取時間。
- 回傳保留 reply/model，新增 finish_reason/truncated；記錄模型、耗時、tokens、結束原因與備援次數，不記錄對話或金鑰。

## DB Impact
none；不增加資料庫或伺服器對話狀態。

## Risk
- 前端仍僅傳最近 10 則、文章前 6,000 字；換文章或重新整理後仍清空對話。
- 免費供應商的可用性與回答品質無法由本地模擬測試保證。
- 較長回答與截斷重試可能增加延遲及免費請求額度消耗。
- 不修改前端、不新增串流、不自動部署。

## Validation
- 先固定 length 被當成功與歷史遭二次截斷的回歸案例，再實作。
- 使用 Node 原生測試器，模擬上游正常、空值、非 JSON、截斷、401/403、429、逾時、備援與索引故障；測試真實 Worker fetch 入口。
- 驗證純文字、顏文字、換行、站內路徑與舊前端 JSON 相容性。
- 文件提供固定繁體中文問答與前後比較評分表；沒有真實模型測試時明確註記尚未驗證。
- 完成結果：`node --test --test-reporter=spec workers/live2d-chat/worker.test.mjs` 共 39 項通過，ES module 語法檢查及 `git diff --check` 通過。
- 資料歸因回歸測試先在初稿重現失敗，再確認正常生成、重新生成及備援都不會把背景資料加入 user 訊息。此測試不等於真實模型回答品質評估。
- 本機無可用 OpenRouter 金鑰；真實模型前後比較與部署驗證未執行，已記錄於 README。前端未修改。

## SDD Update
- 已新增 docs/SDD.md，記錄 Hibiki 元件、請求流程、API 相容性、資料來源與期限；既有決策及 backlog 已同步。

## Story Status
- [ ] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
