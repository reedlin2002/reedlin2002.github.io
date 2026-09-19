# 空拍影像辨識學習筆記文章

## Scope
撰寫一篇部落格文章,整理空拍(UAV)場景下常見的電腦視覺技術地圖:分割方式選擇(語義/實例/全景分割)、偵測模型架構(anchor-free、CenterMask2 三大組件)、評估指標(IoU/mAP)與微調取捨、影像拼接原理(Homography/RANSAC/cv2.Stitcher)與深度學習式拼接在低紋理場景的常見陷阱、資料稀缺情境下的因應(半監督學習、極小物件偵測)。內容為一般性技術筆記,不涉及特定推甄/面試準備或特定過往專題的個人脈絡。

## Files Impacted
- source/_posts/uav-vision-notes.md(新增)
- source/images/uav-vision-notes-cover.png(新增,封面)
- source/images/uav-vision-notes-seg-{original,semantic,instance,panoptic}.jpg(新增,取自原始論文圖)
- source/images/uav-vision-notes-centermask2-architecture.png(新增,取自官方 repo)
- source/images/uav-vision-notes-iou.jpg(新增,取自 Wikimedia Commons)
- source/images/uav-vision-notes-stitching-pipeline.jpg(新增,取自 OpenCV 官方文件)

## DB Impact
none

## Risk
- 內容涉及模型架構細節(CenterMask2 組件、homography 數學),需確保技術描述正確,避免誤導讀者
- 封面沿用既有慣例(暫時 HTML + Chrome DevTools 截圖,1200×630 橫式),截完即刪暫存 HTML,避免首頁卡片被撐高
- 內文圖表改用真實來源(論文/官方 repo/官方文件)截圖或原檔下載,而非自繪示意圖;每張圖均標註來源與連結,避免版權/歸屬爭議

## SDD Update
無(純內容新增,不影響站台架構)

## Decision Log
無新架構決策

## Story Status
- [x] In Progress
- [x] Code Done
- [x] Docs Updated
- [x] SDD Updated (N/A)
- [x] Review Ready

## Result
- 文章:source/_posts/uav-vision-notes.md(zh-Hant,標題改為「空拍影像辨識技術地圖:分割策略、模型架構與影像拼接的技術取捨」,語氣從第一人稱學習筆記調整為研究整理/研究結果導向,移除「我搞懂了」式開頭)
  - 涵蓋:語義/實例/全景分割差異(以 Kirillov et al. CVPR 2019 論文原圖 + 具體數字例子說明)、anchor-based vs anchor-free 與 CenterMask2 三大組件(對照官方架構圖精確描述 Backbone+FPN / FCOS Box Head / SAG-Mask 的 SAM 模組)、IoU 與 mAP 評估(對照 Wikimedia 圖說明,補上 precision/recall/AP 公式與 COCO vs VOC 標準差異)、遷移學習微調取捨、Homography + RANSAC + cv2.Stitcher 拼接原理(對照 OpenCV 官方 Registration/Compositing 兩階段 pipeline 圖)、深度學習式特徵匹配在低紋理重複場景的失敗教訓、半監督學習(pseudo-labeling / FixMatch / Mean Teacher)與極小物件偵測(FPN / SAHI 切圖推論 / copy-paste 增強)因應方式,並附延伸閱讀清單
  - 刻意不提及推甄口試準備脈絡或特定過往專題,內容以一般性技術筆記呈現
  - 內容篇幅與圖片數量依使用者回饋(「內容文字有點少 圖片有點少」)大幅擴充
- 封面:source/images/uav-vision-notes-cover.png(1200×630 橫式)。用暫時 HTML(純 CSS/SVG,偵測框+標籤的科技感視覺,呼應 binary-search 系列的介面風格)+ Chrome DevTools 截圖產生,截圖後因視窗縮放比例偏差(1502×788)用 .NET Graphics 二次縮放校正為精確 1200×630,暫存 HTML 截完即刪
- 內文圖表改用真實來源(使用者明確要求:「用chrome devtools MCP 是要你去web search...人家作者有圖片,不需要自己做html」),流程為 WebSearch 定位原始論文/官方 repo/官方文件 → chrome-devtools 開頁確認 → 直接 curl 下載原始圖檔(比截圖更乾淨,無縮放/浮水印問題):
  - 分割比較四連圖:取自 Kirillov et al., *Panoptic Segmentation* (arXiv:1801.00868) 的 ar5iv HTML 版內嵌圖
  - CenterMask2 架構圖:取自官方 GitHub repo `youngwanLEE/centermask2` README 內嵌的 Dropbox 圖檔
  - IoU 示意圖:取自 Wikimedia Commons(作者 Adrian Rosebrock,CC BY-SA)
  - Stitching Pipeline 圖:取自 OpenCV 2.4 官方文件 `StitchingPipeline.jpg`
  - 每張圖皆於文中標註來源與原始連結
- 尚未執行 hexo generate/deploy,待使用者確認內容後再發布
