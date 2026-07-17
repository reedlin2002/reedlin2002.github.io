# Decision: 首頁改品牌 landing，文章列表移交 /archives

**Date**: 2026-07-17
**Status**: Accepted

## Context
站點定位從純 blog 轉為「個人品牌網站 + blog」。原首頁 = 圖片輪播 + 文字 hero + 全文章列表（分頁）+ 站內導覽 + 專案清單，資訊密度高但無品牌敘事。

## Decision
- 首頁四區塊：滿版 Aurora hero（姓名/身分/skill chips/CTA）→ 精選專案卡片（source/_data/projects.json 擴充為真實專案）→ 最新 6 篇文章 → Contact。
- 完整文章列表由 /archives 接手（沿用同款文章卡 partial + 分頁），站內導覽（標籤雲/統計）也遷到 archives 頁首。
- 導覽列收斂為四項：首頁 / 文章(/archives/) / 專案(/#projects) / 關於；搜尋入口移至 footer。
- 首頁圖片輪播移除（hero-carousel.js 刪除，照片保留在 source/images/hero/ 可另作他用）。

## Consequences
- 好處：首頁承擔品牌敘事與作品集門面；LCP 改善（不再 preload 輪播大圖）；文章動線仍完整（hero CTA 與 nav 直達 archives）。
- 壞處：首頁分頁 /page/N/ 停止產生（index_generator per_page: 0），舊分頁外鏈失效；標籤/分類從主導覽降級，可發現性略降（archives 頁首補位）。
