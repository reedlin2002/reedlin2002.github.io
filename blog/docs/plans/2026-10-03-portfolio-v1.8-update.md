# Portfolio SPA：依申請文件 v1.8 更新時間軸

## Scope
讓 `/portfolio/` 的事實與申請文件 v1.8 一致（App 規模數字、工作案例、專題角色），並加入 v1.8 新增的作品與證照。

## Files Impacted
- `portfolio/src/data/timeline.ts`：節點資料；`NodeLink.kind` 新增 `site`（官網）
- `portfolio/src/styles.css`：`.btn.is-site`
- `portfolio/src/assets/`：新增 `mien.webp`、`twstock.webp`、`trip-planner.webp`、`app.webp`
- `portfolio/index.html`：`<noscript>` 連結清單
- `source/portfolio/`：重新 build
- `docs/SDD.md`：Portfolio SPA 章節

## Implementation
- 新增：mien（2026.10）、twstock-agent（2026.07）、企業電子化資料分析師（2024.12）、TQC+ HTML5（2024.02）。
- App 卡：改名「數位名片 App 開發」、2025.08–至今、9 功能模組／37 畫面／98 後端 API（v1.1.2）、三個案例改用「問題 → 處理 → 結果」，附一張已遮蔽產品名的畫面。
- Travel Planner 卡改為 9/28 重做的「智慧旅程規劃」。
- 既有卡片依 v1.8 補充：國科會計畫編號、競賽組別、專題角色、重構時找到的兩個問題、轉正職後的工作範圍、NFC-test 對正式產品的影響、ATM Finder 資料管線、UrlHealthMonitor 三種模式。
- 不採用：AI 面試系統與法說會簡報（使用者決定）、PowerPoint 證照、內部教材、MapGo 的「整合 TDX」（程式實際未接）、獎狀與競賽現場照（含隊友全名與臉）。

## DB Impact
none

## Risk
- App 截圖必須確認產品名與個資已遮蔽。
- 時間軸從 18 張卡增為 22 張，頁面變長。
- build 產物進版控，改原始碼後必須重新 `npm run build:portfolio`。

## SDD Update
- Portfolio SPA 章節：更新日期、`links` 欄位支援官網。

## Validation
- `npm run build:portfolio` 無錯誤。
- `hexo generate` 後 `public/portfolio/` 與 `source/portfolio/` 逐檔相同。
- 桌機 1440、手機 390、reduced motion 實際檢查；外部連結皆為 200；console 無錯誤。

## Progress
- 圖片：App 圖取自申請資料 docx 的登入與 NFC 綁定畫面（產品名、卡片文字原本就已模糊），排成兩張圓角面板；twstock 取三張部落格截圖；旅程規劃用「插入景點」截圖；mien 是線上編輯器實際截圖（@octocat 範例資料）。轉檔用 scratchpad 裡的 sharp，沒有加進專案依賴。
- build 通過（JS 500.75 KB，gzip 170.82 KB；剛好超過 Vite 500 KB 的提示門檻，只是警告）。`public/portfolio/` 與 `source/portfolio/` 逐檔相同。
- 桌機 1440：22 張卡，2023–2026 年份與排序正確，12 張圖都有載入，console 沒有錯誤；頁面上 23 個外部連結都回 200。
- 手機 390：沒有橫向溢出；reduced motion 時 App 卡數字直接顯示 9／37／98。
- 已知：手機寬度下，有 3 個數字的卡片會排成 2＋1（`.stats` 的 auto-fit 原本就是這樣，專題卡也一樣），不改 UI。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
