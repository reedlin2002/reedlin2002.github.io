# Decision: 以 vanilla JS/CSS 重刻 React-Bits 效果，不引入 React

**Date**: 2026-07-17
**Status**: Accepted

## Context
品牌化改版希望參考 React Bits（reactbits.dev）的動畫元件（Split Text、Aurora 背景、Spotlight 卡片），但本站是 Hexo + EJS + Stylus，無 React runtime。選項：(a) vanilla 重刻、(b) React islands 掛載、(c) 遷移到 Astro/Next。

## Decision
選 (a)：在 cactus 主題內用 vanilla JS + CSS 重刻視覺效果。Aurora 用純 CSS（radial-gradient blob + transform-only keyframes）、Split-Text 用逐字 span + transition-delay、Spotlight/tilt 用 pointermove 寫 CSS custom properties。GSAP 評估後不需要。

## Consequences
- 好處：零額外 runtime（React islands 約 140KB）、與現有 PJAX 生命週期天然相容（Aurora 純 CSS 甚至免 re-init）、亮暗模式靠既有 CSS custom properties 免費適配、prefers-reduced-motion 可完整覆蓋。
- 壞處：不能直接複製 React Bits 官方元件碼，每個效果要手工重刻；後續想要的新效果也要逐一移植。
- 若未來遷移到 React 框架，此決策作廢（Superseded）。
