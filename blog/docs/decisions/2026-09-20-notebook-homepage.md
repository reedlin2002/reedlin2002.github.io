# Decision: 全站改為開發筆記本版型（原型 B）

**Date**: 2026-09-20
**Status**: Accepted

## Context
2026-07-17 的 `homepage-landing-ia` 把首頁定為滿版 Aurora hero（姓名／身分／skill chips／CTA），
文章排在第三區。實際使用後，訪客要捲過整個自我介紹才看得到文章。

這次以一次性原型比較了三種方向（紙感刊物 / 互動技術手帳 / 文章展覽），站長選了「互動技術手帳」，
並要求保留自己的 logo、skills 跑馬燈與 Live2D Hibiki。過程中也試過 React Bits 的
Lanyard 吊牌與 Flowing Menu 流動圖帶，站長看過實機後決定都不要。

第一輪只搬了首頁的版面結構，配色、字體、頁首頁尾、文章頁都還留著舊佈景，站長指出「沒有對齊 B」，
要求整套搬過來。

## Decision
**整站對齊原型 B**，不只首頁。

- **首頁**：左右兩欄的筆記本版型。左側是收斂過的作者索引（logo、大標、自介、文章數、主題資料夾、
  More about me），右側是最新文章條目。skills 跑馬燈保留，改成頁首下方的滿版細帶並且可暫停。
- **文章頁**：換成 B 的閱讀版型——標題區 800px、正文 720px、章節標題帶 `//` 前綴、
  文末 ✳ 收尾與 CC 授權單行、兩欄「下一個好奇心」。
  刪掉舊的 `.post-copyright` 方框與 `.related-card` 網格。
- **配色**：`--shoka-*` 換成 B 的墨綠配色（bg `#101816`、accent `#b5e78b`）。
- **字體**：DM Sans（內文）+ JetBrains Mono（meta／小字）+ Instrument Serif（頁尾字標）。
- **容器寬度**：從 `52rem`（832px）放大到 B 的 `min(1200px, 100% - 96px)`。
- **頁首**：86px、不吸頂、logo 42px、站名走 mono 並帶一行小字，搜尋入口收進導覽列。
- **頁尾**：換成 B 的 Stay curious 字標 + 一行資訊。
- **作品區**：從卡片網格換成 B 的「OFF THE PAGE」+ 連結列；保留 `#projects` 錨點（導覽列指向它）。
  B 沒有獨立 Contact 區塊，Email 由頁尾承接。

主題導覽採用 React Bits「Folder Float」的手感，但以 vanilla JS + CSS 自行重刻
（沿用 2026-07-17 `vanilla-js-over-react-for-landing-effects` 的既有決策，不引入 React）。
標籤是真實的 `<a>`，拖曳只是額外手感，點擊仍然是正常導覽。

兩個刻意偏離 B 的地方：

1. **保留深淺切換**（站長指定）。B 只有深色，淺色是照 B 的綠色調另配的一套。
2. **程式碼區塊兩套佈景都維持深底**（新增 `--shoka-code-bg`）。highlight.js 的語法色是為深底調的，
   跟著淺色走會看不見。

不採用 Lanyard 與 Flowing Menu。

## Consequences
- 好處：進站第一屏就是文章標題與閱讀入口；文章頁的閱讀寬度與節奏跟著收斂；全站視覺語言一致。
- 壞處：首頁不再有大字品牌畫面，視覺衝擊較低；`landing.js` 的 Split-Text 與 hero stagger
  效果一併移除，日後要用得重寫。舊的版權方框與相關文章卡片網格不再存在。
- 取代 `docs/decisions/2026-07-17-homepage-landing-ia.md` 的首頁區塊定義；
  該決策中「完整文章列表由 /archives 承接」「導覽列四項」仍然有效（標籤用字改為 B 的版本）。
- 一次性原型（`themes/cactus/prototype/` 與 `scripts/ui-prototype.js`）已完成任務。
  它由 `BLOG_UI_PROTOTYPE` 與 `hexo server` 雙重把關，不會進正式產出；確定不再需要比較時可整包刪除。
