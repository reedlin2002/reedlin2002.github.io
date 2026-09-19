# Hibiki 看板娘：訪客可自行收起 / 重開

## Scope
讓訪客自己決定右下角的 Hibiki 要不要出現。收起後所有浮動元素（Live2D 模型、「問 Hibiki」入口、待機台詞泡泡）一併消失，只留一顆 40px 的角色頭像圓鈕可以再打開；選擇寫入 `localStorage`，換頁與回訪都維持。

## Files Impacted
- `themes/cactus/source/js/live2d-chat.js`
  - `HIDE_KEY` / `readDismissed()` / `writeDismissed()`：偏好讀寫，`try-catch` 包住（無痕模式 `localStorage` 會丟例外，退回本次瀏覽有效）
  - `root.innerHTML`：新增 `.waifu-dismiss`（滑過角色浮出的 ×，必須排在 `.waifu-hitbox` 之後供 CSS `~` 選取）、`.waifu-reopen`（內嵌手繪 SVG 頭像）、`.waifu-btn-hide`（面板標題列的收起鈕）
  - `syncLayout()`：唯一控制點，以 `dismissed` 收斂所有浮動元素的顯示與 `initLive2D()` 的呼叫時機
  - `dismiss()` / `finishRestore()` / `waitForLive2D()`：狀態切換、焦點轉移、首次顯示的載入中狀態
  - `canShowAmbient()`：加入 `!dismissed`，一次擋掉所有待機台詞路徑
- `themes/cactus/source/css/_live2d.styl`
  - `.waifu-dismiss`（hover / focus-visible 才浮出）、`.waifu-reopen`（含 `.is-loading` 轉圈）
  - `.waifu-hitbox:focus-visible`：把預設的方框外框換成貼合角色的圓角光暈
  - 手機 `@media (max-width: 499px)` 與 `prefers-reduced-motion` 區塊同步補上新元素

未改動：`ensureMobileAction()`、`layout.ejs`、`themes/cactus/_config.yml`（不需要新的 config key）。

## DB Impact
none（偏好只存在訪客瀏覽器的 `localStorage`，key `hibiki-hidden`）

## Risk
- **手機文章頁底部操作列的 Hibiki 按鈕刻意不受此偏好影響**：它在正常文件流裡、不遮內文，且是該版面唯一入口。同理 `mobilebar` 模式下不顯示重開圓鈕與面板收起鈕，避免在最該乾淨的版面反而多一顆浮動元素。
- 帶著「收起」設定進站的回訪者不會呼叫 `initLive2D()`，所以按重開時才首次下載模型；`waitForLive2D()` 以 canvas 出現當就緒訊號並設 6 秒上限，避免永遠卡在載入中。
- 當次收起時模型已在記憶體，只移除 `body.waifu-live2d-visible`，重開是瞬間的。
- `localStorage` 不可用時功能仍正常，只是重新整理後偏好會消失。

## SDD Update
- 無 SDD.md；本次是既有架構下的 UI 增補，未推翻 `docs/decisions/2026-07-18-live2d-chat-architecture.md` 的任何決定，故不另開 decision record。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-09-19）
於 `localhost:4010` 以 Chrome DevTools 實機操作驗證：

- **桌機 1280×900（full）**：滑過角色右上角浮出 ×；按下後模型、藥丸、泡泡全部消失，只剩右下 40px 頭像圓鈕（right 24 / bottom 76，與 bottom 24 的 `#back-to-top` 不重疊）。
- **回訪不載入**：帶 `hibiki-hidden=1` 重新整理後，Network 面板確認**沒有** `L2Dwidget.0.min.js`、`hibiki.model.json` 或 `texture_00.png` 的請求（僅剩 layout 內建的 26KB loader）。
- **重開**：按圓鈕後 `is-loading` + `disabled` 立即生效，模型載入完成才換回角色；當次收起再打開則是瞬間的。
- **PJAX 換頁**：首頁收起 → 點文章連結 → 收起狀態與 `localStorage` 均維持。
- **面板路徑**：標題列 `–` 收起後，聊天關閉、模型隱藏、焦點落在重開圓鈕（未遺失焦點）。
- **待機台詞**：收起後等待 9 秒（`resetAmbient` 排程為 3 秒）確認泡泡未出現。
- **手機 390×844（mobilebar，文章頁）**：浮動元素數量為 0，底部操作列的 Hibiki 按鈕仍在且可開啟聊天。
- **手機 390×844（compact，列表頁）**：launcher → 收起 → 重開的完整往返回到初始狀態，圓鈕縮為 36px（right 16 / bottom 74）。
- **淺色主題**：圓鈕沿用 widget 既有的深色視覺小說配色，與 launcher 一致。
- `node -e` 語法檢查與 `hexo generate` 皆通過。
