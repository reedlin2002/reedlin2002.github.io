# 首頁頭像捲動動畫

參考 https://1wei.dev/ 的頭像收進 Header 效果。

- 首頁自介頭像為 96px，依捲動距離連續縮小、平移到 sticky Header；站名在後半段淡入。
- 往回捲動反向還原；其他頁面維持原本 Header。
- 使用單一裝飾圖層、requestAnimationFrame 與 passive scroll listener；不攔截原生捲動。
- resize 重新量測；PJAX 離頁清理圖層與事件，回首頁重新初始化。
- prefers-reduced-motion 保留靜態原圖與 Header，停用移動縮放。
- 驗證：Hexo clean/generate、JS 語法、桌機/390px 手機捲動與反向捲動、減少動態、PJAX 離頁清理通過。
- Cactus 差異另存 tools/cactus-avatar-morph.patch，於 theme 根目錄 git apply 可還原。