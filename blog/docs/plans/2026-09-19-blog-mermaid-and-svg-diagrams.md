# 部落格圖表能力:Mermaid 支援與內嵌 SVG 流程圖

## Scope
為部落格加入 Mermaid 圖表支援(站台能力,未來所有文章可用),並在 iOS 來電辨識文章中以內嵌動畫 SVG 取代原本的 ASCII art 流程圖。

## Files Impacted
- themes/cactus/_config.yml(新增 cdn.mermaid 項目)
- themes/cactus/scripts/mermaid.js(新增,before_post_render filter)
- themes/cactus/layout/_partial/scripts.ejs(新增 window.initMermaid)
- themes/cactus/source/css/_minimal.styl(新增 pre.mermaid 與 .fig 樣式)
- source/_posts/ios-caller-id-resolution-chain.md(三張內嵌 SVG + 一張 mermaid)
- source/_posts/ollama.md(修正誤標的 ```mermaid 圍欄)

## DB Impact
none

## Risk
- **新增 CDN 外部依賴**(cdn.jsdelivr.net 的 mermaid@11)。已設計為按需載入:頁面沒有圖表就完全不發請求;載入失敗時 pre.mermaid 仍以程式碼樣式顯示原始碼,不會留下空白。
- **既有文章誤標**:ollama.md 的 ```mermaid 圍欄裝的是 ASCII art 而非 mermaid 語法。加上 filter 後會被送進 mermaid 解析,已改回一般圍欄。全站已確認無其他誤標。
- **markdown-it 的 HTML block 會在空行截斷**:內嵌 SVG 內部絕對不能有空行,否則 <style> 與圖形會被當成 markdown 輸出成可見文字。本次已踩過這個坑。
- **mermaid 的 CJK 裁字**:節點文字走 foreignObject 會繼承 pre 的等寬字,但 mermaid 以設定的 fontFamily 量測寬度,兩者不一致時中文會被裁掉。已同時在 CSS 強制 $font-sans、並把 fontFamily 設為實際的 body 計算字體。
- 手機寬度下 SVG 等比縮小,次要說明文字會偏小(主標與圖形結構仍清楚)。

## SDD Update
- 無(站台呈現層增強,不影響內容架構)

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Decision Log
**為何不用 three.js / Lottie**:文章主題是一條有優先權的解析鏈,3D 場景與 After Effects 動畫對理解沒有貢獻,卻各自帶來數百 KB 的依賴。改用「內嵌 SVG + 純 CSS 動畫」,同樣有動態效果,但零依賴、可用 CSS 變數跟隨 8 套配色,並尊重 prefers-reduced-motion。

**為何需要 before_post_render filter**:Hexo 的 backtick_code_block 會把 ```mermaid 當成一般程式碼,輸出 figure.highlight.plaintext——語言標記在這一步就遺失,前端無從辨識。因此以 priority 9 搶先把圍欄換成原始 HTML。

**為何 SVG 與 mermaid 併用**:mermaid 適合節點/連線這類結構圖(且作者日後可自行維護);但「兩支手機來電畫面對照」「命中即短路的階梯」這類需要精確視覺隱喻的圖,mermaid 的自動排版做不出來,改用內嵌 SVG。

## Result
- Mermaid 支援已上線:文章可直接寫 ```mermaid 圍欄;按需載入、PJAX 可重入、佈景切換時經 MutationObserver 重繪。
- iOS 文章的三張主圖改為內嵌動畫 SVG:
  - #fig-chain 短路鏈(查詢逐層下探、命中即停、後續層淡出)
  - #fig-pir PIR 流程(封包加密後移動,伺服器端標示看得到/看不到什麼)
  - #fig-screens 兩支手機來電畫面對照(私人備註淡出)
  另有一張 mermaid 流程圖呈現 per-card Integration Policy 的集合切割。
- 已於 Chrome 實測:暗色/亮色兩種佈景、1280px 與行動寬度、無 console 錯誤、頁面無水平捲動、mermaid 自 CDN 正常載入並套用主題色。
- 尚未執行 hexo deploy,待使用者確認後再發布。
