# Minimal → Mizuki Redesign — 乾淨結構＋活潑皮膚全站重構

## Scope
使用者反饋全站「很醜很亂」（按鈕不直覺、header 大黑塊、配色醜、文章分布亂、封面被裁、Live2D 過大）。第一輪訪談定案黑白灰極簡＋墨藍 #2563EB；完成後使用者反饋「太無趣」，第二輪訪談定案：**保留乾淨結構，套上 Mizuki 活潑皮膚**——藍紫漸層 #3B82F6→#8B5CF6、大橫式圓角卡片（封面佔右 38%）、38vh 圓角橫幅輪播復活、漸層區段標題/進度條/文字。今日稍早的功能（字數/相關文章/版權/站點導覽/燈箱/複製鈕/APlayer）全數保留。

## 訪談決策
1. 視覺：黑白灰極簡，保留深色模式（深灰非黑紅），accent #2563EB
2. 移除：粒子/星空、「記」浮水印、頂部彩條、打字機、◇ 符號系統；Live2D 縮小保留
3. Header：60px 細長 sticky 白底＋1px 底線，捲動毛玻璃
4. Hero：極簡文字版（站名＋自介＋技能標籤＋連結，併入原 about 區）
5. 列表：Medium 式水平列表（左文右 3:2 縮圖）
6. 按鈕：右下雙鈕堆疊（深淺切換＋回頂）；APlayer 中性化留左下；文章頁懸浮動作列拆除（TOC 保留）

## Files Impacted
- `themes/cactus/source/css/_colors/minimal.styl`（新增）
- `themes/cactus/source/css/_minimal.styl`（新增，取代 2850 行深紅層）
- `themes/cactus/source/css/style.styl`（import 手術）
- `themes/cactus/source/css/_enrich.styl`（中性化）
- `themes/cactus/source/css/_partial/header.styl、index.styl`（深紅殘留掃除）
- `themes/cactus/layout/index.ejs`（文字 hero + Medium 列表）
- `themes/cactus/layout/layout.ejs、_partial/head.ejs、header.ejs、footer.ejs`
- `themes/cactus/layout/_partial/post/actions_desktop.ejs`（只留 TOC）
- `themes/cactus/layout/_partial/music-player.ejs`（theme 色）
- `themes/cactus/_config.yml`（colorscheme: minimal、carousel off）
- `_config.yml`（live2d 縮小）

## DB Impact
none

## Risk
- 拆除 _shoka.styl 後 --shoka-* CSS 變數消失 → _minimal.styl 必須以中性值重定義同名變數，_enrich 元件才不會裸奔
- Sprint 2/3 JS 依賴的 .card-init/.copy-btn/.lang-badge/.toc-active/#reading-progress-bar 樣式原在 _modern-enhancements → _minimal 需補中性版
- 深色模式：base stylus 色為編譯期，dark 需在 _minimal 以 html[data-theme="dark"] 覆蓋 bg/text/border/header/code

## SDD Update
- none

## 第二輪追加決策（Mizuki 化）
1. 乾淨結構不變，加回個性：藍紫漸層 accent（light #3B82F6→#8B5CF6 / dark #60a5fa→#a78bfa）
2. 首頁卡片：Medium 列表 → Mizuki 大橫式卡（radius 16、封面右側 38%、hover 浮起＋圖微放、行動版封面置頂 16:9）
3. 橫幅輪播復活：38vh 圓角（非滿版）、中性 scrim、文字 hero 移橫幅下方、站名改漸層文字
4. 彩色標籤 pill、漸層區段標題短槓、漸層閱讀進度條、文章 h2 漸層裝飾
5. APlayer theme #8B5CF6

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated（無 SDD 影響）
- [x] Review Ready

## 驗證記錄（2026-07-11，hexo build + curl 檢查；瀏覽器 MCP 中途斷線，視覺請以 localhost:4000 確認）
- 編譯 CSS 深紅殘留 0 處；藍紫漸層樣式 41 處
- 首頁：橫幅輪播 markup ✔、11 張 post-row 卡片 ✔、live2d 縮至 80x160 左下 ✔
- 文章頁：懸浮動作列已拆（僅剩行動版底部列）、TOC/版權/相關文章保留 ✔
- 深色模式規則 17 處（html[data-theme="dark"]）
