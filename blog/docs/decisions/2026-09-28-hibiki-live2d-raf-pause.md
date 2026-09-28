# Decision: 包裝 requestAnimationFrame 暫停 Live2D，並把全身模式門檻改為 960px

**Date**: 2026-09-28
**Status**: Accepted

## Context
- 訪客收起 Hibiki 後，`#live2d-widget` 只是 `display: none`，L2Dwidget 的繪製迴圈照跑。實測收起前後都是每秒 146 次 `requestAnimationFrame`（headless，不鎖 60Hz）。2026-09-27 UX audit 已把這條列為「另案處理」，理由是暫停要改函式庫內部，風險高。
- L2Dwidget 3.x（`themes/cactus/source/lib/live2d/L2Dwidget.0.min.js`）沒有暫停或銷毀 API。但它每一幀都重新讀 `window.requestAnimationFrame`，並以 `requestAnimationFrame(tick, canvas)` 呼叫，第二參數固定是 `#live2dcanvas`。
- 全身模式門檻原本是 769px。文章欄 720px 置中時，角色（right 26、寬 92）在 769–955px 會站在內文上。透明 hitbox（92×184）會擋住底下的文字與連結，點下去反而打開聊天。

## Decision
- 在 `live2d-chat.js` 開頭包裝 `window.requestAnimationFrame`：只有第二參數是 `#live2dcanvas`、且 `live2dPaused` 為真時，才把 callback 暫存起來、不排程。其餘呼叫一律原樣轉給原生 rAF。`syncLayout()` 以 `setLive2DPaused(!showFull)` 控制；恢復時把暫存的 tick 交給原生 rAF，接回同一條迴圈。
- 不改函式庫檔案，也不重新 `L2Dwidget.init()`（重複 init 會再建一個 canvas）。
- `FULL_MIN_WIDTH` 由 769 改為 960，也就是 (960 − 720) / 2 = 120 ≥ 118。窄於此一律使用精簡入口。

## Consequences
- 收起或縮成精簡入口後，Live2D 繪製降為 0 次／秒；重新顯示時恢復且模型狀態連續。站上其他 rAF（閱讀進度條等）不受影響。
- 依賴 L2Dwidget 的呼叫方式（每幀讀全域 rAF、第二參數是 canvas）。更換 Live2D 函式庫或版本時必須重新確認；若函式庫改成在載入時快取 rAF，暫停會靜默失效，但不會壞掉其他功能。
- 769–959px（含 iPad 直立 820 / 834）不再顯示全身角色，改顯示「問 Hibiki」入口，這是刻意的行為變更。
