# Decision: 刪除從未被 import 的死代碼 CSS/JS 層

**Date**: 2026-07-17
**Status**: Accepted

## Context
主題 css 目錄長期存在多層「皮膚」：_shoka.styl（1200 行）、_modern-enhancements.styl（1082 行）、_typography.styl、_effects-3d.styl、_ux-fixes.styl，全站 209 個 !important 中約 184 個集中在這些檔。實查 style.styl 的 @import 鏈（Hexo 只編譯非底線開頭的 style.styl）證實這五檔**從未被 import**，對編譯產物貢獻為零。js 目錄同理：shoka.js、typewriter.js、cursor-effects.js、particle-system.js 未被任何模板載入。

副作用發現：PJAX 淡入（main.content.pjax-loading）唯一的樣式定義在死檔 _modern-enhancements.styl 內，功能目前靜默壞掉；另有數個活 JS 對死選擇器 toggle class 的 no-op（#header.scrolled、heading-entered、aplayer-active）。

## Decision
整批刪除五個死 styl 與四個死 js；活檔中對死選擇器的 no-op JS 一併移除；PJAX 淡入規則在 _minimal.styl 重建（reduced-motion gated）。刪除前後以 public/css/style.css hash 比對驗證零差異。

## Consequences
- 好處：-4600 行維護負擔；!important 從 209 降到約 25；暗色模式規則不再有幽靈層可疑；新 landing 樣式寫在乾淨地基上。
- 壞處：若未來想回 shoka 紅色皮膚需從 git 歷史撈回。
- /page/2/ 等首頁分頁 URL 在後續 landing 改版停用（archives 保有分頁），舊外鏈可忽略。
