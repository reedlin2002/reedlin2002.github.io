# UX 健檢修正 + 動效（2026-09-27 健檢結果落地）

## Scope
把 2026-09-27 UX 健檢（設計稿：https://claude.ai/artifact/VUVhYgEHzvL6uBCgqN2uiL）找到的 bug 修掉，
原則是「不改版面、只修 bug」：換顏色 token、移位置、補觸控可點區；再加上一套 vanilla 動效。

## Files Impacted
- `_config.yml` — 新增 `markdown:`：關掉 linkify / typographer，錨點不輸出「#」（pangu 保留，見決策記錄）
- `scripts/post-lead-heading.js`（新）— 文章開頭 h1：與標題相同就移除，不同就轉成副標；錨點補 `aria-label`
- `source/_posts/travel-planner-side-project.md`、`singleton-pattern.md` — 粗體假標題改成 `###`
- `source/_posts/tw-grad-lab-skills.md`、`binary-search-learning.md` — cover 改指向新的 1600px JPEG
- `source/images/tw-grad-lab-skills-cover.jpg`、`binary-search-cover-pov.jpg`（新）— 7.5 MB / 1.4 MB PNG 的縮圖版（412 KB / 91 KB），原 PNG 保留
- `themes/cactus/layout/_partial/head.ejs` — viewport 加 `viewport-fit=cover`
- `themes/cactus/layout/layout.ejs` — `lang` 輸出完整語系（`zh-TW`）
- `themes/cactus/layout/_partial/header.ejs` — 站名在首頁／文章頁改用 `p`（每頁一個 h1）；漢堡鈕 `role=button`、`aria-label="選單"`、`aria-expanded`
- `themes/cactus/layout/index.ejs` — 主標逐字 span（BlurText）、條目 `--n`、預覽圖改 `data-src`
- `themes/cactus/layout/_partial/scripts.ejs` — 搜尋包成冪等的 `initSearch()`、每頁載入；複製鈕 1.4 秒回饋 + `aria-label`
- `themes/cactus/layout/_partial/post/actions_mobile.ejs` — 「頁首」不再在網址加 `#`
- `themes/cactus/source/js/main.js` — 手機工具列改用 class 滑入滑出、`body.footer-post-on`；漢堡鈕 `preventDefault` + `aria-expanded`
- `themes/cactus/source/js/pjax-init.js` — `pjax:complete` 呼叫 `initSearch()`；Pjax / NProgress 載入失敗時回頂部仍可用
- `themes/cactus/source/js/landing.js` — 預覽圖滑過才載入；主題資料夾的監聽器與 Observer 可清理
- `themes/cactus/source/js/live2d-chat.js` — 只有文章頁才算「文章內容」；手機非文章頁退回 compact；精簡入口捲動收合
- `themes/cactus/source/css/_reading.styl` — 標題層級（h1–h6、副標）、程式碼標題列／行號／token 固定色／複製鈕、行內 code、引言、表格、手機 SVG 圖橫向捲動、窄螢幕圖片寬度、錨點
- `themes/cactus/source/css/_minimal.styl` — 動效 tokens、站名選擇器、footer 連結 hover
- `themes/cactus/source/css/_partial/post/actions_mobile.styl` — 手機工具列改吃 `--shoka-*`、safe-area、回頂部讓位
- `themes/cactus/source/css/_partial/header.styl` — 手機選單：gap、搜尋對齊、漢堡鈕不再疊在主題鈕上、× 圖示、項目錯開進場
- `themes/cactus/source/css/_live2d.styl` — 桌機回頂部讓開 hitbox、手機輸入框 16px、精簡入口收合、底部操作列入口配色
- `themes/cactus/source/css/_landing.styl` — 連結 hover 藍線、標題綠色底線掃入、主標與條目進場動畫
- `themes/cactus/source/css/style.styl` — `scroll-padding-top` 80px → 24px

## DB Impact
none

## Risk
- 關掉 linkify / typographer 會改變既有文章的輸出（這正是目的）。檢查過只有 `http://localhost:*` 依賴 linkify。
- 原本也要關 pangu，實測發現四篇文章約 350 處半形標點靠它轉全形，已改為保留（詳見決策記錄）。
- 文章 h1 過濾器改變 12 篇文章開頭：4 篇與標題相同的照舊不顯示（program、singleton、travel-planner、nfc-test），
  8 篇不同的以副標出現。判斷規則是「標題已涵蓋這句話才算重複」，反過來不算
  （LocalAIAgentAPI 的副標包含整個標題，第一版規則誤刪過，已修正）。
- 手機選單的漢堡鈕位置用 header 56px / 主題鈕 36px 推算（`right: 52px`），header 尺寸改動時要一起調。
- `themes/cactus` 仍有大量未 commit 的變更；本次修改疊在其上。修改前已把整個工作樹備份到 scratchpad。
- 部署會直接更新 https://reedlin2002.github.io 。

## 刻意沒做
- Live2D 模型收起後仍在背景以 60fps 渲染：L2Dwidget 的 rAF 迴圈要改到函式庫內部，風險高，另案處理。
- 含中文的等寬 ASCII 圖錯位：需要加等寬中文字型或改寫圖，另案。
- nfc-test 文末兩張截圖不存在：原文就留了 TODO，需要作者補圖。
- lightGallery 與 medium-zoom 重複綁定、Mermaid 語法錯誤時的 fallback 樣式：低優先，未動。

## SDD Update
無 `docs/SDD.md`，n/a。決策記錄見 `docs/decisions/2026-09-27-markdown-renderer-defaults.md`。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-09-27）
`hexo clean && hexo generate`（236 檔）後，以 `python -m http.server` 服務 `public/`，Chrome DevTools 實測：
- **全站掃描（390px）**：首頁、archives、about、search、tags 與 16 篇文章共 21 頁，
  `scrollWidth` 全部 = 390（修正前 expenses / ollama / UrlHealthMonitor / LocalAIAgentAPI 被
  `style="max-width: 600px"` 的截圖撐到 620px，連帶讓底部工具列跑出畫面）；
  每頁可見 h1 = 1（Aboutme 內文自己寫了第二個 `#`，保留）；沒有斜體引言。
- **程式碼區塊**：語言標籤在 left 77px（燈號之後）、10px；觸控裝置複製鈕常駐 48×38；
  行號到程式碼從 91px 縮到 43px；淺色模式底色與 token 色維持深底色票，標籤 `rgba(255,255,255,.5)`。
- **手機工具列**：底色 `rgb(24,35,30)`；往下捲 `is-hidden`、往上捲出現並加 `body.footer-post-on`，
  回頂部上移到工具列之上且可點。
- **手機選單**：展開後漢堡鈕留在原位 (275,9) 並換成 ×、主題鈕可點、網址不變、項目間距 54px、搜尋左緣對齊。
- **Hibiki**：手機精簡入口往下捲 148px → 44px，停止 1.2 秒後展開；手機 about 頁為 compact 且入口可見；
  桌機回頂部移到 right 128px / bottom 78px，`elementFromPoint` 命中回頂部而非 hitbox。
- **搜尋**：從首頁經 PJAX 進 /search/（navigation entry 仍是 `/`），輸入「NFC」得到 1 筆結果。
- **首頁**：桌機載入時預覽圖 0 張，滑過第一則後才載入 1 張；站名 15px / 600 / 119×18 與修改前相同；
  主標 10 個逐字 span、強調字維持 primary 綠、整句 aria-label。
- **Markdown**：`http://SKILL.md` 連結消失、`(c)` 不再變 ©、program 的 og:description 不再以「# 」開頭；
  pangu 保留後 ios 文章「單純：讓」維持全形。
