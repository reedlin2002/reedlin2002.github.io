/**
 * 產出 /hibiki-index.json — Hibiki 聊天 Worker 的文章索引
 * Worker 端抓取此檔並注入 system prompt,讓看板娘能真實推薦/找文章。
 * 只含標題、路徑、日期、tags 與短摘要;全文搜尋仍走 search.xml。
 */
'use strict';

hexo.extend.generator.register('hibiki-index', function (locals) {
  var posts = locals.posts.sort('-date').map(function (post) {
    var excerpt = String(post._content || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[#>*`|_~-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);

    return {
      title: post.title,
      url: '/' + post.path,
      date: post.date.format('YYYY-MM-DD'),
      tags: post.tags ? post.tags.map(function (tag) { return tag.name; }) : [],
      excerpt: excerpt
    };
  });

  return {
    path: 'hibiki-index.json',
    data: JSON.stringify({ generated: new Date().toISOString(), posts: posts })
  };
});
