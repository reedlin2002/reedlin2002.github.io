# 導覽調整

- Header「筆記」改為「首頁」，「關於」直接連到 /portfolio/。
- /archives/ 先顯示文章，標籤、分類與統計移到文章列表後。
- 保留既有頁面內容與個人資訊設定。
- Hexo generate 通過；瀏覽器確認導覽連結、文章順序與窄視窗選單，未發現水平溢出。
- Cactus 為獨立 Git repository；本次差異另存 tools/cactus-navigation.patch，可在 theme 根目錄使用 git apply 還原。
## About page follow-up
- /about/ 改為以 Lin 為名的作品介紹，包含技術實作、研究專題、精選作品與目前關注。
- 移除原介紹中的姓名、學校、公司、履歷日期與聯絡資訊；Portfolio 本身不變。
- Header 關於改回 /about/。Hexo 建置、站內連結與圖片、章節錨點及 390px 手機版檢查通過。
