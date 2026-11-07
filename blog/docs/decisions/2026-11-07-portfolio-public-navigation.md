# Decision: 以公開導航連結研究與工程案例，保留既有索引政策

Date: 2026-11-07
Status: Superseded by `2026-11-07-blog-identity-revert.md`（未部署即撤回）

## Context

使用者明確要求首頁、Portfolio、Research、Experience 與 Blog 互相銜接，服務研究所審查、工程求職與技術閱讀。舊決策將 Portfolio 限於 QR code 入口，與本次需求不同。

## Decision

- 依本次授權，Blog 導覽、首頁、About 與相關文章連入 `/portfolio/` 及案例 fragments。
- 保留現有 Hexo / React 分界與 GitHub Pages 路徑；Portfolio 連結排除 PJAX，以完整文件載入。
- 公開首頁仍以 Lin 呈現，不增加全名、公司或申請動機。既有 Portfolio 內的姓名、雇主、職稱、日期、學歷與獎項不改寫。
- 延續 Portfolio `noindex, nofollow`。本次需求足以授權新增導航，不等同要求更改搜尋引擎索引政策。
- noindex 不提供隱私或存取控制；公開導航會增加既有完整身分頁的可發現性。若日後決定收錄，需另確認 CV、姓名、信箱與工作素材的公開版本。
- 保留歷史作品資料及真實圖像，精選案例與完整時間軸分層呈現。無實驗原始紀錄的數字不新增為成果宣稱。

此決策更新 `2026-09-28-about-page-identity-disclosure.md` 中「沒有 Blog → Portfolio 連結」的部分；其餘公開首頁的身分邊界延續。
