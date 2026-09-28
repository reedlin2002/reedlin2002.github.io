# Decision: /portfolio/ 以獨立的 Vite + React 子專案實作

**Date**: 2026-09-28
**Status**: Accepted

## Context
需要一個獨立的作品精選頁，用 React Bits 的互動效果（Target Cursor、Decrypted Text、Count Up、Scroll Reveal）呈現研究與工程兩條時間軸。
2026-07-17 的決策（`2026-07-17-vanilla-js-over-react-for-landing-effects.md`）規定 cactus 主題內以 vanilla JS/CSS 重刻 React Bits 效果、不引入 React。當時的理由是主題沒有 React runtime、React islands 約 140KB，且要與 PJAX 生命週期相容。

## Decision
- 在 repo 根目錄新增 `portfolio/`（Vite + React + TypeScript），build 輸出到 `source/portfolio/`，網址 `/portfolio/`。
- `_config.yml` 的 `skip_render` 排除 `portfolio/**`，Hexo 只原樣複製，不經過主題與 PJAX。
- React、gsap、motion 只打包在這一頁；cactus 主題與其他頁面不變，vanilla 決策在主題範圍內繼續有效。
- React Bits 元件直接取用官方原始碼（TS + CSS 版本），保留授權註記，不再手工重刻。
- build 產物進版控，確保只跑 `hexo generate` / `hexo deploy` 也不會漏掉這一頁。

## Consequences
- 好處：可以直接使用 React Bits 元件，效果與官方一致；頁面生命週期獨立，不受 PJAX 影響。
- 好處：部落格其他頁面的 bundle 與行為完全不變。
- 代價：repo 內多一套建置工具與依賴，需要單獨更新。
- 代價：這一頁的 JS 體積大於主題頁面（React + gsap + motion）。
- 代價：修改 `portfolio/` 後要記得重新 build，否則線上仍是舊版。
