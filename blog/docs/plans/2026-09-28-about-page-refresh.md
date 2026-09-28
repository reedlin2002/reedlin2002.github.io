# 更新 About 頁（依自傳／作品集 v1.5）

## Scope
把 `/about/` 從 2026-05 的舊自介更新成跟自傳、作品集 v1.5 一致的內容：經歷時間軸、目前關注、技術背景，身分只露出「Lin」。

## Files Impacted
- `source/about/index.md`（全文改寫）
- `docs/decisions/2026-09-28-about-page-identity-disclosure.md`（新增）

## Implementation
- 事實只取自 `college/v1.5/自傳v1.5.pdf`、`作品集v1.5.pdf` 與 GitHub profile README（`source/_posts/Aboutme.md`）；不自行補寫。
- 結構：你好，我是 Lin → 經歷（2025/12 正職、2025/08 實習、2025/06 畢業、2023/05–2025/02 專題）→ 目前關注 → 技術背景 → 這個部落格寫些什麼 → 聯絡方式。
- 身分揭露（見 decision）：不寫全名、公司名、產品名；學校照寫；獎項只寫「全國大專院校競賽獎項與校內專題研究獎」，不寫競賽全名、不放獎狀圖。
- 工作只寫時間軸、技術棧，以及 Deep Link、FCM、NFC 三個整合主題；不放 15/92/236/79 等公司程式碼規模數字。
- 未來方向只寫興趣（CV 模型跨環境穩定性、AI 輔助開發），不提升學。
- 不列代表作品，改成一句連到首頁 `#projects`。
- 技術背景刪掉沒有任何佐證的 Vue.js；加上有 repo 佐證的 .NET 8、SQLite、Docker、Flutter。
- 維持純 Markdown，沿用 `page.ejs`，不動 UI。

## DB Impact
none

## Risk
- 首頁作品區（`source/_data/projects.json`）仍是舊資料（my-ollama、HTTP Status Checker 連到 GitHub 首頁），About 導過去後會看到過時內容。本次不處理，留待下一輪。
- 「🧣 | GitHub」一文（GitHub profile README 的複本）與新 About 的用詞略有差異，本次不處理。
- 模糊寫法的獎項，搭配學校名稱仍可能搜到官方得獎名單；使用者已知情並接受。

## SDD Update
- none（只改內容，不動站台程式）

## Validation
- `npx hexo clean && npx hexo generate` 無錯誤。
- `public/about/index.html` 各節標題、列表、連結正常渲染；全文不含全名、公司名、產品名。
- 部署後線上 `/about/` 顯示新內容。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated（N/A，只改內容）
- [x] Review Ready
