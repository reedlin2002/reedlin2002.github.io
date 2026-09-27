# 全站改為開發筆記本版型（原型 B 正式化）

## Scope
把原型 B（互動技術手帳）完整搬進 cactus 佈景：配色、字體、頁首頁尾、首頁、文章頁全部對齊 B。

## Files Impacted
- `themes/cactus/layout/index.ejs` — 重寫：滿版 skills 跑馬燈 + 左側作者索引 + 右側文章條目；專案與 Contact 區塊沿用
- `themes/cactus/source/css/_landing.styl` — hero 區塊整段換成 notebook 版型；`.landing-section` / `.project-card*` / `.landing-contact*` 保留，並補回 `.hero-btn`（Contact 仍在用）
- `themes/cactus/source/js/landing.js` — 重寫：跑馬燈控制、主題資料夾互動、專案卡 Spotlight；Split-Text 與 hero stagger 隨 hero 一起移除

## 版面
- **Skills 跑馬燈**：滿版細帶，滑過／鍵盤聚焦／按暫停鈕／捲出畫面都會停。
- **左側作者索引**：現有 logo、姓名、身分、tagline、文章數，加上主題資料夾與社群連結。
- **主題資料夾**：借用 React Bits 的 Folder Float 手感，以 vanilla 重刻——滑過或按下展開，
  標籤會漂浮、可以拖，點下去進真實的標籤頁。鍵盤啟動會把焦點交給第一個標籤，Esc 收起。
- **文章條目**：編號 + 日期 + 閱讀時間 + 標題 + 摘要 + 標籤；寬螢幕滑過浮出封面縮圖。
- 手機：資料夾移到文章之後，第一屏留給文章。

## 刻意保留
- `#projects` 與 `#contact` 錨點不變（導覽列的「專案」指向 `/#projects`）。
- 配色沿用既有 `--shoka-*` tokens，深／淺佈景都跟著走；沒有改動全站強調色。
- `/archives/` 的文章列表與 `_partial/post-card.ejs` 未動。

## DB Impact
none

## Risk
- `$base-style` 會給 `h2` / `h3` 塞底線與紫色，版型內的標題需要明寫 `color` / `text-decoration: none` 才不會被吃到。
- 滿版細帶用 `100vw`，而 `100vw` 含捲軸寬度。改以 `calc(100vw - var(--sbw))` 計算，`--sbw`
  由 `landing.js` 量測後寫進 `:root`；量不到時退回 0，最多只是少掉幾 px 的出血。
- `landing.js` 舊的 `[data-split]` / `.landing-hero-inner` 路徑已無對應 DOM，一併刪除。

## SDD Update
無 `docs/SDD.md`，n/a。決策記錄見 `docs/decisions/2026-09-20-notebook-homepage.md`。

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## 驗證記錄（2026-09-20）
於乾淨的 `hexo server`（`127.0.0.1:4012`，未帶原型旗標）以 Chrome DevTools 實測：
- 桌機 1280×900、手機 390×844：`scrollWidth === clientWidth`，沒有水平溢出。
- 深／淺兩套佈景掃描首頁 + 專案 + Contact + footer 的文字對比度：各 0 筆低對比。
- 主題資料夾：鍵盤啟動 → `aria-expanded=true`、標籤浮出、焦點落在第一個標籤（`/tags/project/`）；Esc 收起。
- 跑馬燈：在畫面內 `running`，按暫停 → `paused` 且 `aria-label` 改為「播放技能跑馬燈」，再按恢復；捲出畫面自動 `is-offscreen` 暫停。
- 專案卡進場動畫（`card-init` → `card-visible`）正常，四張卡片都顯示。
- 手機：主題資料夾被搬到 `.notebook-feed` 之後，第一篇文章標題在第一屏內。
- PJAX 首頁 → `/archives/`（10 筆）→ iOS 文章：版面正常，Mermaid 正確重繪。
- `hexo generate` 產出 236 檔。

---

## 第二輪：完整對齊原型 B（2026-09-20）

第一輪只搬了首頁結構，配色、字體、頁首頁尾、文章頁都還是舊的，站長指出「沒有對齊 B」。
第二輪把 B 整套搬過來。

### 追加的 Files Impacted
- `themes/cactus/source/css/_minimal.styl` — `--shoka-*` 換成 B 的墨綠配色；容器寬度改為 B 的 `.wrap`；
  頁首改 86px 不吸頂、logo 42px、站名 mono + 小字、搜尋入口；頁尾換成 Stay curious 字標；
  新增 `--shoka-code-bg`（兩套佈景都維持深色）
- `themes/cactus/source/css/_fonts.styl`、`layout/_partial/head.ejs` — 字體換成 DM Sans / JetBrains Mono / Instrument Serif
- `themes/cactus/source/css/_landing.styl` — 改用 B 的 px 級距，補上 `.eyebrow` / `.text-link` / `.projects-strip`
- `themes/cactus/source/css/_reading.styl` — **新檔**，B 的閱讀版型（最後 import 蓋掉舊文章樣式）
- `themes/cactus/source/css/_partial/footer.styl` — 舊 `.footer-mono-bar` 清掉
- `themes/cactus/layout/post.ejs` — 換成 B 的閱讀版型
- `themes/cactus/layout/layout.ejs`、`_partial/header.ejs`、`_partial/footer.ejs`
- `themes/cactus/_config.yml` — nav 標籤改為 B 的用字；`hero` 增加 `brand_kicker` / `kicker_label` /
  `headline_*` / `intro` / `projects_line`

### 決定
- **深淺切換保留**（站長指定）。B 只有深色，淺色是照 B 的綠色調另配的一套。
- 刪掉 `.post-copyright` 方框與 `.related-card` 網格，換成 B 的 `reading-end`（✳ + 謝謝你讀到這裡 + 標籤 + CC）
  與 `read-next`（兩欄）。
- 程式碼區塊兩套佈景都維持深底：highlight.js 的語法色是為深底調的，跟著淺色走會看不見。

### 踩到的坑
- Stylus 會攔截 CSS 的 `min()`，要用 `unquote('min(...)')`。
- 舊佈景在 `article h2::before` 放了一條漸層短槓，`.reading-body h2::before` 只換 `content` 會被色塊蓋住，
  要一併清掉 `width` / `height` / `background`。
- markdownIt 的 `#` 錨點留在文字流裡會在標題中間撐出一個洞，改成絕對定位移到左側，滑過才浮出。
- base cactus 把 `#title` 做成 `table`、`h1` 做成 `table-cell`，站名小字會被排到標題右邊，要改回 `block`。
- 容器原本是 `.max-width: 52rem`（832px），B 是 1200px——這是第一輪「看起來不像 B」最大的原因。

---

## 第三輪：三點調整（2026-09-20）

### 1. topic-folder 標籤大小 —— 是真的有 bug

第一次只比對 computed style（`font-size` / `padding` / `max-width` / `offsetWidth` 都與 B 一致）
就下了「沒有差異」的結論，是錯的：那些屬性量的是**版面尺寸**，看不出 transform 有沒有生效。
站長提供兩張截圖後才看出標籤明顯偏小、而且黏在資料夾上。

根因：`--pill-angle` 由 `landing.js` 的物理迴圈**每一幀**改寫，而我把 rotate 寫進了
`transform` 簡寫：

```styl
transform: translateY(100px) scale(0.55) rotate(var(--pill-angle, 0deg))
transition: opacity .24s, transform .52s cubic-bezier(.2, 1.4, .4, 1)
```

`transform` 是單一屬性，值每幀變動 → 轉場每幀從頭開始 → 標籤永遠到不了
`scale(1)` / `translateY(0)`，就停在半路（實測 `scale ≈ 0.55`、rect `43×17`）。

原型 B 用的是獨立的 `translate` / `scale` / `rotate` 屬性，而且 transition 只列
`opacity, translate, scale`——rotate 每幀變動不會干擾另外兩個。照搬過來即修復：

```styl
translate: 0 100px
scale: 0.55
rotate: var(--pill-angle, 0deg)
transition: opacity 0.24s ease, translate 0.52s cubic-bezier(0.2, 1.4, 0.4, 1), scale 0.52s cubic-bezier(0.2, 1.4, 0.4, 1)
```

`prefers-reduced-motion` 的 `transform: none` 也要一併改成 `translate/scale/rotate: none`。

修正後實測（225px 與 265px 兩種側欄寬度）：`scale: 1`、`translate: 0px`、
標籤 rect 78–103px，五顆全部在資料夾上緣之上（`onFolder: []`）。

**教訓**：比對視覺差異時，computed style 的版面屬性不足以證明「一樣」，
要一併看 `getBoundingClientRect()` 與 transform 的最終值。

### 2. 滑過文章時預覽圖蓋住標題
`.notebook-preview` 是絕對定位浮在條目右上角，而標題沒有寬度上限，長標題會被蓋住。
在「會出現預覽」的同一個 media query 裡替文字欄留出空間：

    @media (hover: hover) and (min-width: 1000px)
      .notebook-entry-copy
        max-width: calc(100% - 250px)

窄螢幕不顯示預覽，所以不受影響。

### 3. Hibiki 太佔位 + 音樂播放器不像 B
- **音樂**：拿掉 APlayer（含 `_enrich.styl` 的 re-skin），改成 B 的做法——
  左下角一顆 41px 圓鈕，點開才是面板（`A LITTLE BACKGROUND MUSIC` / 閱讀的背景音。/
  選一首歌 select / 原生 `<audio controls>`）。換歌保留播放狀態；Esc 與點擊外部可收起。
- **Hibiki**：`L2Dwidget` 從 `120×240` 縮到 `92×184`，`hOffset` 72→26 往右靠；
  `.waifu-hitbox`、收起鈕、待機泡泡、聊天面板的定位一起跟上
  （launcher/泡泡/面板 `right: 204px` → `128px`，面板寬度 620→560）。

### 追加 Files Impacted
- `themes/cactus/layout/_partial/music-player.ejs` — 改寫為 B 的 dock + panel
- `themes/cactus/source/css/_enrich.styl` — 移除 APlayer re-skin，新增 `.companion-dock` / `.companion-panel`
- `themes/cactus/source/css/_landing.styl` — 預覽圖讓位
- `themes/cactus/source/css/_live2d.styl`、`source/js/live2d-chat.js` — Hibiki 縮小與重新定位

### 驗證
深／淺兩套佈景掃首頁（含面板）低對比 0 筆；預覽圖與標題幾何上不再重疊
（title right 1070 < preview left 1112）；APlayer 已不存在；播放面板位置
`left 24 / bottom 80`、曲目讀到 2 首；Live2D 實測 `92×184`；無水平溢出。
