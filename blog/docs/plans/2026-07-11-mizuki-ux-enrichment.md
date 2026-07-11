# Mizuki UX Enrichment — 功能移植（物語風視覺不變）

## Scope
參考 Mizuki 主題，在保留物語系列深紅美學的前提下豐富 UI/UX：文章頁（字數/相關文章/版權/燈箱）、首頁（橫幅輪播/站點導覽）、APlayer 音樂播放器、微動效收斂。

## Files Impacted
- `themes/cactus/scripts/word-count.js`（新增：CJK-aware 字數 helper）
- `themes/cactus/scripts/related-posts.js`（新增：相關文章 helper）
- `themes/cactus/layout/post.ejs`（meta 字數 + copyright/related partials）
- `themes/cactus/layout/index.ejs`（hero 輪播、站點導覽、卡片閱讀時間）
- `themes/cactus/layout/_partial/post/copyright.ejs`（新增）
- `themes/cactus/layout/_partial/post/related.ejs`（新增）
- `themes/cactus/layout/_partial/music-player.ejs`（重寫為 APlayer）
- `themes/cactus/layout/_partial/scripts.ejs`（刪重複 ClipboardJS、燈箱 init）
- `themes/cactus/layout/_partial/head.ejs`（首頁 preload 輪播首圖）
- `themes/cactus/layout/layout.ejs`（script 掛載調整）
- `themes/cactus/source/js/hero-carousel.js`（新增）
- `themes/cactus/source/js/pjax-init.js`（註冊新 init）
- `themes/cactus/source/js/shoka.js`（視差目標 fallback）
- `themes/cactus/source/js/music-player.js`（刪除）
- `themes/cactus/source/css/_enrich.styl`（新增：本案所有新樣式）
- `themes/cactus/source/css/style.styl`（import _enrich、刪 .btn-copy）
- `themes/cactus/source/lib/medium-zoom/`、`source/lib/aplayer/`（vendor）
- `themes/cactus/languages/zh-TW.yml`、`default.yml`、`en.yml`（i18n）
- `themes/cactus/_config.yml`（hero.carousel / music_player / creative_commons）
- `source/images/hero/`（新增橫幅圖）
- `source/_data/custom.styl`（死檔，規則併入 _enrich 後移除）

## DB Impact
none

## Risk
- 主題為 embedded repo 非正規 submodule，commit 只存在本機（詳見 decision log 候選）
- PJAX 重入：新互動元件需 idempotent init + `pjax:complete` 註冊
- `themes/cactus/scripts/*.js` boot 載入，語法錯誤會使 `hexo g` 全掛
- Hero 多圖需壓縮 + lazy + preload 首圖，避免 LCP 惡化
- 每個新元件需 light mode（`html[data-theme="light"]`）變體

## SDD Update
- none（純前端主題層，無 API/DB/auth 變更）

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated（無 SDD 影響，確認免更）
- [x] Review Ready

## 驗證記錄（2026-07-11，hexo server + Chrome DevTools 實測）
- 文章 meta：`1580 字 · 6 min read`（CJK-aware，非舊 len/300）
- 版權區塊：作者/連結/CC BY-NC-SA 4.0（deed.zh-hant）/分享提示 ✔
- 延伸閱讀：3 張卡依標籤相似度推薦，無共同標籤 fallback 最新 ✔
- Hero 輪播：4 張 cross-fade、PJAX 進出單一 timer、preload 首圖 ✔
- 站點導覽：標籤雲 12、統計 11 篇/11.9k 字（分類為 0 時自動隱藏該欄）✔
- 複製按鈕：9 個 code block 恰好各 1 鈕 + 語言標籤（舊 .btn-copy 已移除）✔
- 燈箱：medium-zoom 深紅 overlay z-index 200、PJAX 重入 detach ✔
- APlayer：左下懸浮、雙曲目 200 OK（含雙空格檔名 encodeURI）、行動版隱藏 ✔
- 行動版 375px：無水平溢出；修復 `.content img { height:auto !important }` 蓋掉輪播圖高度的 bug（改用 `#hero-carousel .hero-slide` 提高特異度）
- 亮/暗雙模式：hero、站點導覽、版權、相關卡皆有 light 變體 ✔
