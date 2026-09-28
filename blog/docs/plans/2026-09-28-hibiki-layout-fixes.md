# Hibiki 位置與展開收合修正

## Scope
修正 Hibiki 看板娘的定位、聊天框、待機泡泡與展開／收合時的 10 個 bug，不改視覺風格、角色大小、配色與入口文案。設計與 before/after 截圖：https://claude.ai/artifact/XPLJtKN1ieGEwezrkjkDYd

## Files Impacted
- `themes/cactus/source/js/live2d-chat.js`
  - `FULL_MIN_WIDTH` 769 → 960
  - 啟動器文字加 `.waifu-launcher-label`；對話框 `tabindex="-1"`
  - `showEl()` / `hideEl()`：`.is-leaving` 退場動畫後才設 `hidden`，減少動態時直接切換
  - `openChat()`：觸控手機 focus 對話框本身，其餘 focus 輸入框
  - `window.requestAnimationFrame` 包裝 + `setLive2DPaused()`：角色看不見時停住 L2Dwidget 的繪製迴圈
  - 刪除 L2Dwidget 3.x 不認得的 `react.opacityDefault / opacityOnHover`
- `themes/cactus/source/css/_live2d.styl`
  - 全身模式泡泡 bottom 252 → 196、尾巴 right 96 → 43
  - `.waifu-term` bottom 132 → 76、max-height `100vh - 100px`、`overflow: clip`、transform-origin 右下
  - `.waifu-log` min-height `clamp(0px, 100vh - 300px, 120px)`；高度 ≤ 420px 壓縮標題列、隱藏 SELECT
  - 收合啟動器：狀態燈 `flex-shrink: 0`、文字與 TALK 收到 0 寬
  - 退場 keyframes；手機 sheet 滑入／滑出、遮罩淡入淡出
  - 手機表單下邊距 12px + safe-area，隱藏 `.waifu-next`
  - `prefers-reduced-motion` 區塊補上新動畫
- `docs/SDD.md`：新增「前端版面與顯示狀態」
- `docs/decisions/2026-09-28-hibiki-live2d-raf-pause.md`

## DB Impact
none

## Risk
- 769–959px（含 iPad 直立 820 / 834）從全身 Hibiki 改成精簡入口，是刻意的行為變更。
- rAF 包裝依賴 L2Dwidget 每幀以 `requestAnimationFrame(tick, canvas)` 呼叫、第二參數是 `#live2dcanvas`；換函式庫版本時要重新確認。其他呼叫一律原樣轉給原生 rAF。
- `overflow: clip` 需要 Safari 16+；舊瀏覽器退回 `overflow: hidden`，只少了防捲動這層保險，版面的高度修正仍有效。
- 觸控手機不再自動 focus 輸入框，需要 iPhone 實機確認鍵盤行為（headless 無虛擬鍵盤）。

## SDD Update
- 新增前端顯示模式表（手機／精簡／全身與寬度門檻）
- 新增聊天面板開關與收起 Hibiki 的狀態圖（含退場動畫與 Live2D 暫停）

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated
- [x] Review Ready

## 驗證記錄（2026-09-28）
本機 `hexo server` + headless Chromium（puppeteer 5，playwright 的 chromium-1179）以實際檔案量測：

- **泡泡**：1440×900 全身模式 bottom 196，尾巴中心距右 72px = 角色中心。
- **門檻**：959px 為 compact，960px 為 full；960 時內文右緣 840、角色左緣 842。
- **面板位置**：1440 全身模式仍是 right 128 / bottom 24 / 560 寬（未變）；900、768 精簡模式為 right 24 / bottom 76；關閉動畫中維持 76，不會跳回 132。
- **短螢幕**：844×390 面板 270px、標題列 y 45、scrollTop 0；740×320 面板 220px、標題列 y 25、輸入框完整。
- **收合鈕**：390×844 往下捲後為 44×44，只剩置中的狀態燈（3× 截圖確認）。
- **手機 sheet**：文章頁（mobilebar）沒有浮動元素；sheet bottom 0，輸入框距底 12px，◆ 隱藏；觸控模擬下 activeElement = `.waifu-term`。點遮罩後 60ms 兩者都帶 `.is-leaving`，250ms 後都 hidden。
- **動態**：Esc 關閉 60ms 時帶 `.is-leaving`、之後 hidden；泡泡出現 6.5 秒後進入退場；`prefers-reduced-motion` 下 animation-name 為 none，關閉同一幀即 hidden。
- **快速連點**：關閉後 50ms 再開，面板維持開啟。初版因 `#waifu-chat > *` 權重蓋過 `.is-leaving` 的 `pointer-events: none`，點擊被淡出中的面板吃掉；已改為 `#waifu-chat > .is-leaving`。
- **Live2D 暫停**：`#live2dcanvas` 的 rAF 呼叫在顯示時 145 次／秒、收起後 0、重開後 145。
- **跨門檻縮放**：聊天開啟時 1440 → 959 → 1440，模式與面板位置正確切換，角色在 959 隱藏、1440 恢復。
- `node --check` 通過；`hexo clean && hexo generate` 產生 272 個檔案、無錯誤，輸出含新 CSS/JS；頁面 0 個 JS 錯誤。
- **未驗證**：iPhone 實機上「打開 sheet 不彈鍵盤」的行為（headless 沒有虛擬鍵盤）；未部署。
