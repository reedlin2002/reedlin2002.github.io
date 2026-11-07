# Portfolio：改成個人自介版型

## Scope
依使用者回饋，把 /portfolio/ 從「介紹專案」改成「介紹我」：About → Experience → News → Research → Projects → Awards，每塊精簡、以圖片／影片與 tag 呈現個人做了什麼。

## 使用者決定（2026-11-07）
- 職稱寫 Software Engineer · Computer Vision，不用 Applied AI。
- 首屏只放自介與聯絡方式，拿掉 CTA 按鈕、分割圖與成果列；分割圖移到 Research。
- 獎項獨立成 Awards；不寫限制／待補資料。
- 作品區叫 Projects，做成小卡片（圖＋一句話＋tag），圖可點開放大；保留「其他作品」列表。
- 跨平台 App 經驗要寫，先精簡，之後使用者補技術細節。
- 移除完整時間軸、背景區、頁尾標語與影像來源說明。
- 不放照片、不做 Interests；Portfolio 信箱用 kanewolf98@gmail.com；學歷 2021–2025。
- 作品沒有錄影：mien 用 repo 既有 demo.gif（轉成 mp4/webm），twstock-agent 由 agent 從線上版錄製。

## Files Impacted
- portfolio/src/App.tsx、sections/*（Overview → About、CaseStudies、Background、Converge；移除 DualTimeline、Practice）
- portfolio/src/data/caseStudies.ts、data/profile.json
- portfolio/src/components/Lightbox（新）
- portfolio/src/assets/（mien、twstock 影片）
- portfolio/src/editorial.css、portfolio/index.html
- source/portfolio/（build 產物）

## DB Impact
none

## Risk
- 所有敘述來自 timeline.ts（申請文件 v1.8）、About、公開文章與 repo README，不新增數字。
- 影片會增加頁面重量：使用 preload="none"／lazy、muted loop，提供 poster。

## SDD Update
- Portfolio SPA「頁面區塊」表、元件圖

## 實作紀錄
- twstock-agent 線上版（Vercel）查詢時回傳「無法取得 Yahoo Finance 股價資料」，無法錄到正常畫面，改用既有截圖；也未在卡片放 Demo 連結。
- 移除：Overview、CaseStudies、Background、Converge、DualTimeline、Practice、lib/media.ts、styles.css、editorial.css、data/caseStudies.ts、data/profile.json。
- 驗證：`npm run build`（tsc + vite）通過，CSS 26KB → 10KB；Chrome 1536px 與 390px 無水平溢出、console 無錯誤；放大檢視開啟／Esc／背景點擊關閉正常；mien 影片卡片自動播放。未檢查淺色主題；本機無 Python，未跑 verify-site.py。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
