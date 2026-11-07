# 部落格首頁整理、Hibiki 改為櫃檯抽屜、Portfolio 導覽微調

## Scope
依使用者回饋整理部落格首頁（文章列表圖片、側欄、作品區、頁尾、主題切換 icon、跑馬燈暫停 bug），把 Hibiki 改成右側抽屜裡的「公會櫃檯」角色，並把 Portfolio 的部落格連結改成 icon、拿掉職稱行。只動首頁與共用元件，其他頁面不改。

## 使用者決定（2026-11-07）
- Portfolio：部落格從導覽列移到右上角，以 icon 呈現，換掉文件 icon；拿掉自介上方的職稱行。
- 首頁文章列表：圖片不用 hover 才出現，直接顯示且放大；「繼續往前翻／VIEW ALL」改成一般網站慣用的「查看全部文章」。
- 側欄：保留頭像與「持續探索，持續記錄」；拿掉「打開一個好奇心」主題資料夾與 More about me。
- 「有些想法，也寫成了程式」改成作品卡片（圖片、一句話、tag、GitHub／文章連結），只用 Lin 身分，不連 Portfolio。
- 頁尾：保留 Stay curious 與版權，連結改成 icon。
- Hibiki：保留功能，改成右側抽屜，角色像遊戲公會櫃檯小姐站在櫃檯後，下方聊天。
- 主題切換 icon 與網站其他線條 icon 一致。
- 修正跑馬燈暫停後無法恢復。

## Files Impacted
- portfolio/src/sections/About.tsx、Awards.tsx、components/Icons.tsx、data/portfolio.ts、site.css
- themes/cactus/layout/index.ejs、_partial/header.ejs、_partial/footer.ejs
- themes/cactus/source/css/_landing.styl、_live2d.styl、相關 footer／header 樣式
- themes/cactus/source/js/live2d-chat.js、landing.js、main.js（主題 icon）
- themes/cactus/scripts/（縮圖 helper）
- source/_data/projects.json、source/images/thumbs/（封面縮圖）

## DB Impact
none

## Risk
- Hibiki 版面模型從 full／compact／mobilebar 改為「入口＋抽屜」，SDD 的 Hibiki 版面章節需重寫；Live2D canvas 需搬進抽屜，模型改為打開抽屜才載入。
- 文章列表常駐顯示封面會增加首頁流量 → 產生 640px WebP 縮圖並 lazy load。
- 主題資料夾的 landing.js 程式需移除，避免殘留監聽。

## SDD Update
- Hibiki：前端版面與顯示狀態（模式表、狀態圖）
- 部落格首頁：元件說明（新增）
- Portfolio：Header

## 實作紀錄
- 跑馬燈：原因是整條 `:hover`／`:focus-within` 也會暫停，點完暫停鈕焦點留在鈕上，恢復後仍被卡住。改為只綁 `.marquee-inner:hover` 與 `.is-paused`；瀏覽器實測暫停後不動、恢復後移動（焦點仍在按鈕上）。
- 首頁：移除主題資料夾、More about me、landing.js 的資料夾與 hover 預覽程式；封面縮圖常駐顯示（15 張 640px WebP 縮圖，合計約 320KB，原圖數 MB）；「查看全部 N 篇文章」按鈕；作品卡片 6 張（移除只連到 GitHub 個人頁的 my-ollama、HTTP Status Checker）。
- 頁尾與 header：GitHub／Email／搜尋 icon、主題切換與回頂鈕改為 1.5 線寬 SVG。
- Hibiki：入口＋右側抽屜櫃檯；canvas 改 170×380 讓頭頂留白；決策見 docs/decisions/2026-11-07-hibiki-reception-drawer.md。
- Portfolio：部落格改為右上羽毛筆 icon（Feather Icons，MIT），拿掉職稱行。
- 使用者追加：Hibiki 入口與回頂鈕上下對調（入口在最底，回頂鈕在上方；手機文章頁入口在底部操作列，回頂鈕維持原位）。
- 驗證：Chrome 1536px 深色／淺色、390px 手機；首頁無水平溢出、所有縮圖與作品圖載入；抽屜開啟、模型載入並搬進櫃檯、Esc 關閉與焦點還原、手機滿版、文章頁底部入口與快捷選項；console 無錯誤。未實際送出聊天訊息（避免呼叫正式 Worker）。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
