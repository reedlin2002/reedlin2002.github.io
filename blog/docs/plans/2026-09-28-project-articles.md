# 補寫與重寫四篇專案文章

## Scope
替四個公開 repo 補上內容正確、能對照原始碼的專案文章：新增 project 重構與 MapGo 兩篇，重寫 nfc-test 與 UrlHealthMonitor 兩篇。

## Files Impacted
- `source/_posts/uav-analysis-refactor.md`（新增）
- `source/_posts/nfc-test.md`（重寫，保留 date 與網址）
- `source/_posts/mapgo-hackathon.md`（新增）
- `source/_posts/UrlHealthMonitor.md`（重寫，保留 date 與網址）
- `source/images/`（新增文章截圖與封面：`uav-analysis-refactor-*`、`nfc-test-*`、`UrlHealthMonitor-cover.png`、`UrlHealthMonitor-02.png`）
- `docs/decisions/2026-09-28-article-sourcing-policy.md`（新增）

## Implementation
- 事實與程式碼只取自各 repo 的原始碼、README、commit 與 docs；repo 查不到的內容先向作者確認，不自行補寫。
- 程式碼片段原樣擷取並註明檔案路徑，只將 Java package 名稱匿名化。
- 風格比照 `ios-caller-id-resolution-chain.md`、`uav-vision-notes.md`：標題不加 emoji、敘事寫法、`<!-- more -->` 摘要、圖用 theme 的 `.fig` SVG 或 mermaid。
- 重寫舊文章保留原檔名與 `date`（permalink 含日期），另加 `updated:`。
- 執行順序：project → nfc-test → MapGo → UrlHealthMonitor；第一篇完成後先由作者確認風格。

## DB Impact
none

## Risk
- nfc-test 與 UrlHealthMonitor 的內容大幅改寫，舊版讀者看到的內容會不同（網址不變）。
- NFC-test repo 的 node_modules 路徑過長，Windows 無法完整 clone，原始碼改用 GitHub API 逐檔讀取。
- 截圖取自各 repo 內已建置的 `dist/`，可能與最新原始碼有些微差異。

## SDD Update
- none（只改內容，不動站台程式）。hibiki-index 由 `scripts/hibiki-index.js` 在建置時自動收錄新文章。

## Validation
- `npx hexo clean && npx hexo generate` 無錯誤。
- 本機預覽逐篇檢查：無破圖、mermaid 與 SVG 在淺色與深色模式皆正常、首頁摘要在 `<!-- more -->` 截斷、舊文網址不變。
- 逐段核對文章中的程式碼與 repo 實際檔案一致。

## Progress
- [x] project 重構：`uav-analysis-refactor.md`，封面與兩張切圖比較圖（真實 UAV 影像 + 格線，`make_tile_figs.py` 產生）
- [x] nfc-test 重寫：封面、瀏覽器執行 `dist/` 的三張截圖；舊版的 Web NFC 描述已移除，文末附更新紀錄
- [x] UrlHealthMonitor 重寫：本機實際執行 `serve` 模式重截 Dashboard（`UrlHealthMonitor-02.png`）；舊文中「FluentAssertions」「超時處理與資料庫測試」與 repo 不符，已移除
- [ ] MapGo：待作者確認黑客松名稱、日期、分工與結果
- 程式碼片段已用腳本逐段比對 repo 原檔（含歷史 commit 版本），全部一致
- 2026-09-28 已部署前三篇（main `4314369`）

## Story Status
- [x] In Progress
- [ ] Code Done
- [ ] Docs Updated
- [ ] SDD Updated
- [ ] Review Ready
