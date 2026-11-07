# 部落格移除個人資訊、還原改版前首頁

## Scope
依使用者要求，部落格不顯示全名、雇主等個人資訊並還原成改版前樣子；個人資訊只保留在 Portfolio。

## Files Impacted
- themes/cactus/layout/index.ejs、layout/post.ejs、layout/_partial/header.ejs、layout/_partial/footer.ejs（還原）
- themes/cactus/layout/_partial/profile.ejs、source/css/_profile.styl（刪除）
- themes/cactus/_config.yml、scripts/page_title.js、source/js/live2d-chat.js、source/css/_live2d.styl（還原）
- themes/cactus/layout/layout.ejs（恢復載入 landing.js）、source/css/style.styl（移除 _profile import，加入 skip link 樣式）
- _config.yml、source/about/index.md、source/_posts/{mapgo-hackathon,smart-trip-planner,uav-analysis-refactor,uav-vision-notes}.md（還原）
- source/_data/profile.json → portfolio/src/data/profile.json；portfolio/src/sections/{Overview,Background}.tsx 匯入路徑
- source/portfolio/（重新 build）

## DB Impact
none

## Risk
- Portfolio 失去部落格導流，只能從 QR code 進入。
- 本機沒有 Python，`tools/verify-site.py` 未執行；改以 hexo generate、全站關鍵字掃描與瀏覽器檢查首頁替代。
- 還原前的檔案備份在本次 session 的 scratchpad（before-revert.tar）。

## SDD Update
- Portfolio SPA 章節：入口說明、元件圖中 profile.json 位置、個人資料存放規則

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
