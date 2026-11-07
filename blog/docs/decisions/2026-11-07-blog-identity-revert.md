# Decision: 部落格不顯示個人資訊，個人資訊只留在 Portfolio

**Date**: 2026-11-07
**Status**: Accepted

## Context

同日的改版把部落格首頁換成個人簡介區塊，顯示全名「林立人」、職稱與雇主，並在選單、About、文章底部加上通往 `/portfolio/` 的連結（`2026-11-07-portfolio-public-navigation.md`）。使用者明確表示：部落格不要出現名字等個人資訊，改回之前的樣子；只有 Portfolio 需要個人資訊。

## Decision

- 部落格首頁、選單、頁尾、About、四篇文章與網站描述還原成改版前（已部署的）版本；身分只用「Lin」。
- 部落格各處不連入 `/portfolio/`，Portfolio 回到只從作品集 QR code 進入，維持 `noindex`。
- `profile.json` 從 Hexo `source/_data/` 移到 `portfolio/src/data/`，主題無法再讀取個人資料。
- 保留與身分無關的改進：skip link（樣式移入 `style.styl`）、搜尋框 aria-label、`head.ejs` 與 JSON-LD（作者仍為 config.author = Lin）、PJAX 排除 `/portfolio/`。
- `2026-09-28-about-page-identity-disclosure.md` 的身分邊界恢復有效。

## Consequences

- 公開、可索引的頁面不會出現全名或雇主；同事或搜尋引擎無法從部落格一鍵找到完整身分頁。
- 申請審查者仍需透過 PDF 的 QR code 才能進入 Portfolio，部落格無法替作品集導流。
- 改版用的 `homepage-*.webp` 圖片保留在 `source/images/`，目前沒有頁面引用。
