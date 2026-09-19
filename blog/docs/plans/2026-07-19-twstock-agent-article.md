# twstock-agent(010401 Finance)專案介紹文章

## Scope
為 twstock-agent(台股 AI 分析助手)撰寫一篇「專案作品展示」風格的部落格文章,附行動裝置外觀的實機截圖,完成後直接 deploy。

## Files Impacted
- source/_posts/twstock-agent.md(新增)
- source/images/twstock-agent-*.png(新增,dev server + Chrome DevTools 手機模擬截圖)

## DB Impact
none

## Risk
- 截圖依賴外部 API(Yahoo Finance / FinMind / OpenRouter),若當下 API 失效,AI 報告區塊可能截不到
- deploy 走 hexo deployer,不影響 source 分支既有未 commit 的變更

## SDD Update
- 無(純內容新增,不影響站台架構)

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Result
- 文章:source/_posts/twstock-agent.md(專案作品展示風格,核心 App 為主 + LINE 一節帶過)
- 截圖 6 張:home / analysis-top / chart / ai / checklist / chips(390×844 行動裝置模擬,查詢 2330 實測)
- 已 hexo clean + generate + deploy,上線於 https://reedlin2002.github.io/2026/07/19/twstock-agent/
- 封面調整:原本用直式手機截圖當 cover,首頁文章卡片被撐到 ~630px 高;改用 Unsplash 免費授權的橫式 K 線圖(images/twstock-agent-cover.jpg,Maxim Hopman 攝),重新 deploy(commit fe5e178)
