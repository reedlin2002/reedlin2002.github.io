# iOS 來電辨識架構技術文章

## Scope
撰寫一篇技術研究文,說明在 iOS 上讓自有 App 決定原生來電畫面顯示內容的三個 Apple API(Live Caller ID Lookup + PIR、Call Directory Extension、Contact Provider Extension),以及它們之間的優先權關係如何反過來決定產品的資料模型與 UI 設計。全文匿名,不出現任何實際產品名或公司名。

## Files Impacted
- source/_posts/ios-caller-id-resolution-chain.md(新增)
- docs/plans/2026-09-19-ios-caller-id-article.md(本檔,新增)

## DB Impact
none

## Risk
- 產品名洩漏:交稿前需全文 grep 確認無實際產品名/公司名
- 未實機驗證:Contact Provider 與 Call Directory 同時啟用的短路行為係依 Apple DTS 於開發者論壇的公開說明推導,尚未實機驗證,文中須明確標註
- API 版本:Contact Provider 為較新框架,文中不寫死 iOS 版本號
- 封面須為橫式,避免首頁文章卡片被撐高(參考 twstock 封面調整經驗)
- 本站不支援 mermaid,所有架構圖須以 ASCII art 置於 fenced code block

## SDD Update
- 無(純內容新增,不影響站台架構)

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Decision Log
無新架構決策(站台層面)。文章記錄的是 App 端設計決策,不影響本 repo 架構,故未新增 docs/decisions/。

## Result
- 文章:source/_posts/ios-caller-id-resolution-chain.md(技術研究文,zh-Hant,note-style)
  - 敘事結構:從四個使用者情境倒推,最後揭曉這四個資料來源其實是一條有優先權的短路鏈
  - 核心論點:
    1. iOS 的來電辨識資料來源是嚴格階層(Contacts > Contact Provider > Call Directory > Live Caller ID Lookup > SIP),只取第一個命中者
    2. Call Directory 與 Contact Provider 的差異是「隱私範圍」而非「精緻度」
    3. 解法為 per-card integration policy 加上不相交 invariant
    4. 由此推導出 Identity 與 Relationship 的領域邊界
  - 四張 ASCII 架構圖:短路鏈、PIR 流程、集合切割、模式切換的寫入順序
- 封面:https://images.unsplash.com/photo-1520923642038-b4259acecbd7(Unsplash 橫式,復古轉盤電話,已 curl 驗證 200)
- 資安/防濫用/個資法遵議題依使用者要求留待下一篇,文末已列為未竟事項
- 尚未執行 hexo generate/deploy,待使用者確認內容後再發布
