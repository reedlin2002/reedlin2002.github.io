# Decision: 明確設定 Markdown 渲染器，關掉會改寫內文的預設外掛

**Date**: 2026-09-27
**Status**: Accepted

## Context
`_config.yml` 一直沒有 `markdown:` 區塊，`hexo-renderer-multi-markdown-it` 0.1.5 因此用預設值：
`linkify`、`typographer` 全開，23 個外掛全部啟用。2026-09-27 的 UX 健檢在建置結果裡看到它們在改寫內文：

- linkify：`SKILL.md`、`HTML-REPORT.md`、`ASP.NET`、`Render.com` 被變成 `http://SKILL.md` 這類壞連結。
- typographer：`(c) 實例分割` 變成 `© 實例分割`；程式碼式的引言被換成彎引號。
- markdown-it-pangu：在中英文之間、甚至程式碼式的引言裡插空格，作者寫什麼跟讀者看到什麼不一致。
- markdown-it-toc-and-anchor：每個標題塞進 `<a class="markdownIt-Anchor">#</a>`，
  導致 12 篇文章的 `og:description` 以「# 」開頭，`search.xml` 也混進 15 個錨點。

另外，佈景用 `article .content > h1:first-child { display: none }` 一律藏掉文章第一個 `#` 標題，
但其中 8 篇的第一個 `#` 是和標題不同的副標，那句話讀者完全看不到。

## Decision
- 在 `_config.yml` 明確寫出 `markdown:`：
  - `render.linkify: false`、`render.typographer: false`（`html`、`breaks` 維持原本的 `true`）
  - `markdown-it-pangu` **保留**。原本也打算關掉，但實測發現 ios-caller-id、uav-vision-notes、
    tw-grad-lab-skills、twstock-agent 四篇共約 350 處「中文後面接半形 , : ; ? !」，
    是靠 pangu 轉成全形的；關掉後這些文章整篇標點變半形，比它偶爾在程式碼式引言裡插空格更糟。
    要關 pangu，得先把這四篇的標點改成全形。
  - `markdown-it-toc-and-anchor` 保留（仍產生 id 與錨點連結），但 `anchorLinkSymbol: ''`，
    「#」改由 `_reading.styl` 的 `::before` 畫出來，不進入文字內容
- 新增 `scripts/post-lead-heading.js`（`after_post_render` filter）：
  - 文章開頭的 `#` 已被 front-matter title 涵蓋（去掉 emoji、標點與空白後，標題包含這句話）→ 移除
  - 不同 → 改成 `<p class="reading-subtitle">` 副標
  - 同時替空的錨點連結補上 `aria-label`
- 其餘預設外掛（emoji、footnote、task-checkbox、katex、mermaid…）不動。

外掛設定格式依原始碼：`plugins` 是 `{ plugin: { name, enable, options } }` 的清單，
覆寫預設外掛時 `enable` 必須明寫 `true`，否則會被當成關閉（`lib/renderer/index.js:32-64`）。

## Consequences
- 好處：壞連結與 © 消失；摘要、搜尋索引、Hibiki 文章索引不再帶「# 」。
- 好處：8 篇文章的副標重新出現。
- 代價：之後若想讓裸網址自動變連結，要自己寫 `<https://…>` 或 `[文字](網址)`。
  目前只有 `http://localhost:*` 依賴 linkify，這些本來就不該是可點的連結。
- 已知殘留：pangu 仍會在程式碼式的引言裡插空格（例如 dailyleetcode 的 `haystack [0:3]`）。
  這類內容應該改用行內 code 或程式碼區塊，pangu 不會處理 code。
- 若日後升級或更換渲染器，這段設定與 `post-lead-heading.js` 要一起檢查。
