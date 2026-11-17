# 內容整理：下架三篇、修正三篇、新增專題介紹

## Scope
逐篇對照專題論文、各專案 repo 與既有的身分規則，把說法沒有依據、尚未驗證或不符規則的內容收起來或改正，並新增一頁只用已核對內容寫成的專題介紹。

## Files Impacted
- source/_posts/{tw-grad-lab-skills,uav-analysis-refactor,LocalAIAgentAPI}.md → source/_drafts/（下架，不刪除）
- source/_posts/uav-vision-notes.md（沒有出處的結論改成有出處的說法；拼接段落改寫成論文 8.2 節記載的經過）
- source/_posts/twstock-agent.md（拿掉沒量測過的成效說法、宣傳語氣與 emoji）
- source/_posts/mapgo-hackathon.md（一個小節標題）
- source/_posts/beach-litter-monitoring.md（新增：專題介紹）
- source/images/beach-litter-monitoring-*.{jpg,png}、source/images/thumbs/beach-litter-monitoring-cover.webp（新增，取自專題論文的圖）
- source/_data/projects.json（LocalAIAgentAPI 卡片只留 GitHub 連結）
- portfolio/src/data/{portfolio,timeline}.ts、portfolio/src/sections/Hero.tsx、portfolio/src/site.css、portfolio/index.html
- portfolio/src/assets/tile-output.webp（新增）；portfolio/src/assets/refactor.webp、portfolio/src/lib/tiles.ts（刪除）
- source/portfolio/（重新 build）
- docs/SDD.md、docs/decisions/2026-11-17-content-curation.md

## DB Impact
none

## Risk
- 尚未部署：線上網站在使用者確認前維持原狀。
- 下架的三篇網址會變成 404。原稿在 `source/_drafts/`，移回 `_posts/` 即可恢復；文章用到的圖片仍留在 `source/images/`。
- Portfolio 研究區的動畫第二步從「7×5 重疊切片掃描」換成「一張 640×480 小影像上的模型輸出」（論文圖 5.5）。前者是 2026 重構版的切法，不是產生頁面上那些結果的流程，也與論文表 5.2（3840×2160 切成 24 張）不同。
- 專題介紹的內容只取自申請文件的專題摘要與專題論文；文字仍需使用者審閱。
- 本機沒有 Python，`tools/verify-site.py` 無法執行；改以 `hexo generate`、產出檔掃描（下架網址與標題零殘留）與瀏覽器檢查（專題頁、首頁、Portfolio 研究區）替代。
- GitHub 端的調整（repo 可見性、`project` repo 的預設內容、`twstock-agent` README 的同一句說法）不在本次範圍，由使用者決定。

## SDD Update
- 部落格首頁：文章下架方式（`source/_drafts/`）、作品卡片連結
- Portfolio SPA：研究區動畫步驟與連結、og:image、noscript 清單

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready（本機完成並驗證；尚未 commit、尚未部署）

## Final validation
- 使用者確認全景拼接為本人參與工作；研究限制與後續工作保留。
- Portfolio TypeScript/Vite 與 Hexo clean/generate 通過。
- 本機無可用 Python；以 Node 檢查作品集逐檔一致、文章上下架路徑、站內連結與圖片、搜尋索引數量及 65 個結構化資料區塊，全部通過。
- 舊計畫文件移除個人規劃字樣。既有 Cactus 版本差異不納入本次提交。
