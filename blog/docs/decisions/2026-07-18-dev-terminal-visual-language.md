# Decision: 視覺語言改為 Dev/Terminal 暗色優先

**Date**: 2026-07-18
**Status**: Accepted（取代 2026-07-17 landing 首版的 Aurora 藍紫柔和風）

## Context
首版 landing（柔和 Aurora 漸層 blob + 圓角膠囊 chips + 藍紫漸層字）被使用者評為「太 common」——與大量 AI 生成式 landing page 同質，缺乏個人品牌辨識度。提出三個方向（Dev/Terminal 暗色、Brutalist 大字報、Bento 格子），使用者選定 Dev/Terminal。

## Decision
- **暗色優先**：近黑 `#08090d` 為預設主題（anti-FOUC 預設值 light→dark），亮色降為次要模式
- **單一電光青 accent**：`#22d3ee`（亮色模式 `#0891b2`），取代藍紫雙色漸層
- **背景**：Aurora blob 移除，改點陣紋理（radial-gradient 1px tile）+ 電光暈
- **字體語言**：hero 姓名 uppercase 巨型字（clamp 至 9rem）+ shiny 掃光動畫；kicker 改終端提示列 `~/lin $ whoami` + 游標閃爍；區段標題與 meta 大量使用 JetBrains Mono + `//` 前綴
- **Skills**：膠囊 chips 改滿版跑馬燈細帶（純 CSS 循環，hover 暫停，reduced-motion 靜態換行）
- **卡片**：直角化（10px）、mono 編號 `01`–`04`、`[tag]` 括號式標籤、`↗` 外連符、hover 電光青邊框發光；Spotlight 光暈改青色
- 所有效果仍為 vanilla CSS/JS，`--shoka-*` token 架構不變（亮暗自動適配）

## Consequences
- 好處：強烈的工程師個人品牌辨識度；token 集中讓整站（archives/文章頁）自動跟上新配色；效能不變（動畫仍 transform/opacity-only）
- 壞處：亮色模式從主角降為配角，長文閱讀偏好亮色的訪客需手動切換（偏好會記在 localStorage）；殘留的藍紫系素材（logo、文章配圖）與新視覺略有色差，後續可換
