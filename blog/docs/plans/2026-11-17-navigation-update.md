# 導覽調整

- Header「筆記」改為「首頁」，「關於」直接連到 /portfolio/。
- /archives/ 先顯示文章，標籤、分類與統計移到文章列表後。
- 保留既有頁面內容與個人資訊設定。
- Hexo generate 通過；瀏覽器確認導覽連結、文章順序與窄視窗選單，未發現水平溢出。
- Cactus 為獨立 Git repository；本次差異另存 tools/cactus-navigation.patch，可在 theme 根目錄使用 git apply 還原。