/**
 * 文章開頭的第一個 # 標題:
 * - 跟 front-matter title 是同一句話 → 移除(頁首已經有標題,避免重複)
 * - 是不同的一句話 → 改成 <p class="reading-subtitle"> 副標,不再整條藏掉
 * 以前是 CSS `article .content > h1:first-child { display: none }` 一律隱藏,
 * 會把 expenses、ollama 這類「真正的副標」一起吃掉。
 */
'use strict';

var LEAD_H1 = /^\s*<h1\b[^>]*>([\s\S]*?)<\/h1>\s*/;

function plain(html) {
  return String(html || '')
    .replace(/<a class="markdownIt-Anchor"[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function key(text) {
  return String(text || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

hexo.extend.filter.register('after_post_render', function (data) {
  if (data.layout !== 'post' || typeof data.content !== 'string') return data;

  var match = data.content.match(LEAD_H1);
  if (!match) return data;

  var text = plain(match[1]);
  var headingKey = key(text);
  var titleKey = key(data.title);
  // 只在「標題已經涵蓋這句話」時才算重複；反過來不算——
  // 例如 LocalAIAgentAPI 的副標「學習專案：LocalAIAgentAPI - 從零開始…」包含整個標題，但它是副標
  var sameAsTitle = headingKey && titleKey && titleKey.indexOf(headingKey) !== -1;

  var lead = sameAsTitle ? '' : '<p class="reading-subtitle">' + text + '</p>\n';
  data.content = data.content.replace(LEAD_H1, lead);
  return data;
});

/* markdownIt 的錨點連結沒有文字(見 _config.yml 的 anchorLinkSymbol),補上可讀名稱 */
hexo.extend.filter.register('after_post_render', function (data) {
  if (typeof data.content !== 'string') return data;
  data.content = data.content.replace(
    /<a class="markdownIt-Anchor" href=/g,
    '<a class="markdownIt-Anchor" aria-label="此段落的連結" href='
  );
  return data;
});
