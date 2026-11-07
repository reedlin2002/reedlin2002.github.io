# Portfolio：依新履歷修正、中英切換、深淺色切換

## Scope
以使用者 2026-11-07 提供的新履歷（Resume_ZH.pdf／Resume_EN.pdf）修正 /portfolio/ 文案，加入中英雙語與深淺色切換，統一字體，換上公司與學校 logo。

## 使用者要求
- About 依履歷改寫；保留技術筆記連結與 Email／GitHub。
- 中英文名字的字體不協調，整頁標題字體統一。
- Experience：程曦資訊、銘傳大學用官方 logo；銘傳內容補充；程曦的深度細節之後再討論。
- News 改標題，內容不要混雜成經驗或專題。
- Research：說清楚做了什麼，影像要會動；重構只是整體程式整理，不要誇大。
- Projects、其他作品不改。
- Awards：國科會那條不寫指導教授。
- 頁尾聯絡置中，能用 icon 就用 icon。
- 中英切換、深淺色切換（不用月亮／太陽 icon）。

## Files Impacted
- portfolio/src/data/portfolio.ts（雙語文案）
- portfolio/src/i18n.tsx（新：語言 context）
- portfolio/src/sections/*、components/*
- portfolio/src/assets/（logo、研究動畫）
- portfolio/src/site.css、portfolio/index.html
- source/portfolio/（build 產物）

## DB Impact
none

## Risk
- 履歷為最新事實來源，與 timeline.ts（v1.8）不同處以履歷為準（例：實習至 2025.12、研究個人工作含全景拼接與增強方法）。
- 英文名依履歷用 Lin Li-Ren（原頁面為 Jerry Lin）。
- 不公開電話。
- logo 為第三方商標，僅作經歷識別用途。

## SDD Update
- Portfolio SPA：元件圖、頁面區塊、i18n／theme 狀態

## 實作紀錄
- 字體：移除 Instrument Serif，姓名、職稱與各區標題統一 DM Sans + Noto Sans TC。
- News 改為 Milestones（里程碑），只放事件；移除「重構推論程式」那條，研究區改寫為履歷的四項工作，重構只留連結。
- Research 動畫只用真實素材：影格、程式實際切片位置（lib/tiles.ts）、2024 系統輸出；修正容器比例為 16:9，使切片與影像對齊。
- 深淺色 icon 改為半實心圓（對比符號），淺色時旋轉 180°；localStorage `theme` 與部落格共用。
- Logo 取自官網：chainsea.com.tw（LOGO_無線.png 裁出圖形）、mcu.edu.tw（MCU-LOGO.png 裁出校徽）。
- 中文換行（使用者追加）：自介手動標詞組斷點；經歷、研究、作品、里程碑、獎項內文以 Intl.Segmenter 分詞後只在詞間換行，加 text-wrap: pretty。1536／390／360／320px 檢查無斷詞、無一兩字的孤行、無溢出。
- 驗證：`npm run build`（tsc + vite）通過；Chrome 1536px 中文／英文、深色／淺色，390px 手機，無水平溢出、console 無錯誤；研究動畫依序播放；英文模式除姓名外無殘留中文。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready
