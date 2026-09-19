# tw-grad-lab-skills 專案介紹文章

## Scope
為 tw-grad-lab-skills(台灣研究所實驗室探索 Agent Skills)撰寫一篇「開源專案介紹」風格的部落格文章,說明兩個技能、設計理念(證據分級、reach/match/safety、廣撒網)與安裝使用方式。

## Files Impacted
- source/_posts/tw-grad-lab-skills.md(新增)
- source/images/tw-grad-lab-skills-cover.png(新增,封面)

## DB Impact
none

## Risk
- 封面若用生成/截圖方式,需確認尺寸為橫式,避免首頁文章卡片被撐高(參考 twstock 封面調整經驗)
- 內容需忠實反映 repo README / SKILL.md / docs,避免誇大技能能力(技能本身即強調不保證錄取機率)

## SDD Update
- 無(純內容新增,不影響站台架構)

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Result
- 文章:source/_posts/tw-grad-lab-skills.md(開源專案介紹風格,zh-Hant)
  - 涵蓋:專案緣起、兩個技能(find-grad-labs / investigate-grad-lab)、證據分級設計、技術實作、安裝使用、心得
  - 忠實對照 repo README / SKILL.md / EVIDENCE-RULES.md / product-principles.md,強調「不保證錄取機率、社群風評標未查證」
- 封面:source/images/tw-grad-lab-skills-cover.png(1200×630 橫式,用暫時 HTML + Chrome DevTools 截圖產生,截完即刪 HTML 檔,避免首頁卡片被撐高)
- 已 hexo clean + generate + deploy 上線
