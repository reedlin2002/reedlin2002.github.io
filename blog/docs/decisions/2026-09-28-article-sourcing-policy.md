# Decision: 專案文章的程式碼與事實只取自 repo

**Date**: 2026-09-28
**Status**: Accepted

## Context
2026-05-31 的 nfc-test 文章（plan：`docs/plans/2026-05-31-nfc-test-blog.md`）在 Risk 欄寫明「程式碼為 Web NFC API 標準用法示意，非直接擷取自 repo」。
結果文章描述的是 Web NFC API、零套件依賴，但 NFC-test repo 實際是 React + Capacitor，加上自製的 Android HCE plugin。
文章與原始碼整篇對不上，還留下 TODO 註解與兩張不存在的截圖。

專案文章會被當成專案的說明入口，讀者可能對照 GitHub 原始碼來看。示意碼一旦跟實際程式不同，損害的是整個網站的可信度，不只是一篇文章。

## Decision
- 專案文章裡的程式碼片段一律從 repo 原樣擷取，並註明檔案路徑；唯一允許的修改是把 Java package 等識別字匿名化。
- 技術描述、架構、數字只寫得出 repo（原始碼、README、commit、docs）能佐證的內容。
- repo 查不到的事實（動機、分工、活動名稱、實機測試結果）先向作者確認，不自行推測補寫。
- 截圖取自實際執行 repo 內容的畫面，不用 placeholder 路徑。

## Consequences
- 好處：文章可以逐段對照原始碼，不會再出現「文章寫的不是這個 repo」的情況。
- 好處：之後改寫舊文章時，有明確的核對基準。
- 代價：撰寫前要先讀完原始碼，也要多一輪向作者確認事實，速度比較慢。
- 代價：不能用簡化的示意碼講概念；需要簡化時，改用文字或圖說明，不偽造程式碼。
