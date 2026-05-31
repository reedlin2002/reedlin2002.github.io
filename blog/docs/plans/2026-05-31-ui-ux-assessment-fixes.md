# UI/UX Assessment Short-term Fixes

## Scope
針對專業 UI/UX 評估報告中列出的 6 個短期問題進行 CSS/模板修正，提升對比度、觸控目標尺寸、視覺層次與導覽易讀性。

## Files Impacted
- `themes/cactus/source/css/_shoka.styl` — Hero 文字對比、社群連結尺寸與 icon-label
- `themes/cactus/source/css/_partial/header.styl` — 導覽列字重與間距
- `themes/cactus/source/css/_modern-enhancements.styl` — 返回頂部按鈕可視性
- `themes/cactus/layout/index.ejs` — 社群連結加入文字標籤
- `source/_data/custom.styl` — 卡片對齊、作品區塊樣式

## DB Impact
none

## Risk
- `_shoka.styl` 多處修改，需確認 hero 暗色/亮色模式兩者皆正常
- Social icon 從固定正方形改為 flex-column，需確認舊版面不跑版

## SDD Update
- 無架構異動，純 UI 修正

## Change Summary

| # | 問題 | 修正 |
|---|---|---|
| 1 | Hero 副標語無 text-shadow、badge 與漸層背景對比不足 | 加入 text-shadow；`#hero-text-group` 加半透明黑色 backdrop；亮色模式 subtitle 不透明度 0.70→0.88 |
| 2 | 導覽文字過細（font-weight: 200）、間距過緊 | font-weight 200→500；li margin-right 15px→20px；gap 0→4px |
| 3 | 文章卡片有無標籤時 metadata 排列高度不一 | `.shoka-card-tags` 加 margin-bottom: 12px；`.shoka-card-excerpt` 加 min-height: 3.4rem |
| 4 | 作品區塊與文章區塊外觀無差異 | `#projects` 加金色上邊框；`.project-item` 加金色 left-border + 淡金背景 |
| 5 | 社群連結圖示 34px，低於 44px 觸控目標；無文字標籤 | icon 改 flex-column 52px+ padding，加 `.icon-label` 文字標籤；gap 8px→12px |
| 6 | 返回頂部按鈕近黑底不易辨識 | background 改為緋紅 rgba(196,30,58,0.16)；border opacity 0.60→0.85；box-shadow 增加 glow |

## Story Status
- [x] In Progress
- [x] Code Done
- [ ] Docs Updated
- [x] SDD Updated
- [ ] Review Ready
