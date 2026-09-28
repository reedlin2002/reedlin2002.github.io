# Portfolio SPA（/portfolio/）

## Scope
新增一個獨立的作品精選頁 `/portfolio/`：以研究與工程兩條時間軸整理專案，每個節點連到文章或 GitHub；以 Vite + React 子專案實作，只從外部連結進入。

## Files Impacted
- `portfolio/`（新增：Vite + React + TypeScript 子專案）
  - `src/sections/`：Hero、DualTimeline、Practice、Converge
  - `src/components/reactbits/`：TargetCursor、DecryptedText、CountUp、ScrollReveal（取自 React Bits，保留授權註記）
  - `src/data/timeline.ts`：所有節點的單一資料來源
- `source/portfolio/`（新增：build 產物，Hexo 原樣複製）
- `_config.yml`：`skip_render` 加入 `portfolio/**`
- `package.json`：新增 `build:portfolio`
- `docs/decisions/2026-09-28-portfolio-spa-react.md`（新增）
- `docs/decisions/2026-07-17-vanilla-js-over-react-for-landing-effects.md`（補交叉引用）
- `docs/SDD.md`（新增 Portfolio SPA 章節）

## Implementation
- 開場：原始 UAV 影格上依 `inference.py` 的切片邏輯（stride 576×432，7×5）逐格掃描，再淡入 2024 年系統實際輸出的遮罩圖與 CCI／PAI。不繪製任何非模型輸出的偵測框。
- 雙軌時間軸：左「研究」、右「工程」，桌機兩欄、手機單欄依時間交錯。
- 效果：Target Cursor（僅桌機）、Decrypted Text、Count Up、Scroll Reveal；`prefers-reduced-motion` 一律顯示最終狀態。
- 頁面加 `noindex`，部落格選單不連入。

## DB Impact
none

## Risk
- React、gsap、motion 只在 `/portfolio/` 載入；需確認其他頁面不受影響。
- build 產物進版控，修改原始碼後必須重新 `npm run build:portfolio`，否則線上頁面不會更新。
- 影像資料來自專題（澎湖海洋公民基金會提供之 UAV 影像），與既有文章使用範圍相同。

## SDD Update
- 新增 Portfolio SPA 元件與 build 流程（`portfolio/` → `source/portfolio/` → `hexo generate`）。

## Validation
- `npm --prefix portfolio run build` 無錯誤。
- `hexo generate` 後 `public/portfolio/index.html` 未被重新渲染且含 `noindex`。
- 桌機 1440、手機 390、reduced motion 三種情境實際檢查；外部連結全部 200；其他頁面未載入 React。

## Progress
- 桌機 1440：Hero 三段依序播放（約 1.1 秒後開始掃描 35 格，再切到 2024 輸出）；Target Cursor 四角吸附到按鈕；Count Up、Animated Content 正常。
- 手機 390：單欄、無橫向溢出、未載入 Target Cursor。
- 減少動態：Hero 直接顯示結果、無打亂文字、卡片全部可見、數字為最終值、引言不拆字。
- 無障礙：Decrypted Text 與 Count Up 另提供螢幕閱讀器文字；流程箭頭設為空替代文字。
- 15 個外部連結全部 200；console 無錯誤；`public/portfolio/` 與 build 產物逐檔相同，其他頁面未引用 portfolio 資源。
- build：JS 494 KB（gzip 168 KB），主要為 React、gsap、motion。
- 依使用者要求：favicon 改用與部落格相同的三個圖示；聯絡 email 改為 kanewolf98@gmail.com。
- 2026-09-28 已部署（main `da76752`）。線上 `/portfolio/` 與 11 個資源檔皆為 200，含 `noindex`。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [ ] Review Ready
