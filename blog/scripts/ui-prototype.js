'use strict';

// THROWAWAY: three home/article designs on existing URLs via ?variant=A|B|C.
// This file is both a CLI launcher and a Hexo script. No build-time generator.
const path = require('node:path');
const fs = require('node:fs');

if (typeof hexo === 'undefined') {
  const { spawn } = require('node:child_process');
  const root = path.resolve(__dirname, '..');
  const port = process.env.BLOG_PROTOTYPE_PORT || '4011';
  const cli = path.join(path.dirname(require.resolve('hexo/package.json')), 'bin', 'hexo');
  console.log(`\nBlog design comparison: http://127.0.0.1:${port}/?variant=B\n`);
  const child = spawn(process.execPath, [cli, 'server', '--ip', '127.0.0.1', '--port', port], {
    cwd: root,
    env: { ...process.env, BLOG_UI_PROTOTYPE: '1' },
    stdio: 'inherit'
  });
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
  child.on('exit', code => { process.exitCode = code || 0; });
} else if (process.env.BLOG_UI_PROTOTYPE === '1' && hexo.env.cmd === 'server') {
  const dir = path.join(hexo.theme_dir, 'prototype');
  const prefix = '/__prototype/';
  const names = { A: '紙感技術刊物', B: '互動技術手帳', C: '文章展覽' };
  const threeDir = path.dirname(require.resolve('three'));
  const assets = new Map([
    ['preview.css', [path.join(dir, 'preview.css'), 'text/css']],
    ['preview.js', [path.join(dir, 'preview.js'), 'text/javascript']],
    ['folder-float.js', [path.join(dir, 'folder-float.js'), 'text/javascript']],
    ['sculpture.js', [path.join(dir, 'sculpture.js'), 'text/javascript']],
    ['three.module.js', [path.join(threeDir, 'three.module.js'), 'text/javascript']],
    ['three.core.js', [path.join(threeDir, 'three.core.js'), 'text/javascript']]
  ]);
  const assetTags = `<link rel="stylesheet" href="${prefix}preview.css"><script type="module" src="${prefix}preview.js"></script>`;

  // A comparison escape hatch on original home/post pages, in this server only.
  hexo.extend.filter.register('after_render:html', html => {
    if (html.includes('data-prototype-page')) return html;
    if (!/<main[^>]*class="[^"]*h-card/.test(html) && !html.includes('<article class="post h-entry"')) return html;
    return html.replace('</head>', `${assetTags}</head>`);
  });

  function normalized(value) {
    return decodeURI(value).replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  }

  hexo.extend.filter.register('server_middleware', app => {
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      let url;
      try { url = new URL(req.url, 'http://127.0.0.1'); } catch { return next(); }
      if (url.pathname.startsWith(prefix)) {
        if (url.pathname === prefix + 'hibiki.css') {
          const stylus = require('stylus');
          const source = '$color-accent-1 = #b5e78b\n' + fs.readFileSync(path.join(hexo.theme_dir, 'source/css/_live2d.styl'), 'utf8');
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          return res.end(req.method === 'HEAD' ? undefined : stylus.render(source));
        }
        const asset = assets.get(url.pathname.slice(prefix.length));
        if (!asset) { res.statusCode = 404; return res.end(); }
        res.setHeader('Content-Type', `${asset[1]}; charset=utf-8`);
        res.setHeader('Cache-Control', 'no-store');
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(asset[0]).on('error', next).pipe(res);
      }
      const variant = url.searchParams.get('variant');
      if (!Object.hasOwn(names, variant)) return next();
      let pathname;
      try { pathname = normalized(url.pathname); } catch { return next(); }
      const sourcePosts = hexo.locals.get('posts').sort('date', -1).toArray();
      const rawPost = sourcePosts.find(p => normalized('/' + p.path) === pathname);
      if (pathname !== '/' && !rawPost) return next();
      const stats = hexo.extend.helper.get('word_count_stats');
      const { stripHTML, unescapeHTML } = require('hexo-util');
      const href = value => {
        const target = new URL('/' + value.replace(/^\//, ''), 'http://127.0.0.1');
        target.searchParams.set('variant', variant);
        return target.pathname + target.search + target.hash;
      };
      const viewPost = p => ({
        title: p.title,
        href: href(p.path),
        path: '/' + p.path,
        date: p.date.format('YYYY.MM.DD'),
        isoDate: p.date.format('YYYY-MM-DD'),
        minutes: stats(p.content).minutes,
        cover: p.cover || '',
        excerpt: unescapeHTML(stripHTML(p.excerpt || p.content || '')).replace(/\s+/g, ' ').trim().slice(0, 145),
        tags: p.tags.toArray().slice(0, 4).map(t => ({ name: t.name, href: '/' + t.path })),
        content: p.content,
        permalink: p.permalink
      });
      const posts = sourcePosts.slice(0, 6).map(viewPost);
      const data = {
        variant, variantName: names[variant], names, href,
        posts, post: rawPost ? viewPost(rawPost) : null,
        count: sourcePosts.length,
        tags: hexo.locals.get('tags').sort('length', -1).limit(7).toArray().map(t => ({ name: t.name, href: '/' + t.path, count: t.length })),
        projects: hexo.locals.get('data').projects || [],
        music: hexo.theme.config.music_player?.playlist || [],
        logo: hexo.theme.config.logo?.url || '/images/logo.png',
        skills: hexo.theme.config.hero?.skills || [],
        live2d: { ...hexo.theme.config.live2d_chat, endpoint: '', persist_visibility: false, start_hidden: false },
        author: hexo.config.author,
        siteTitle: hexo.config.title,
        date: posts[0]?.date || '',
        year: new Date().getFullYear(),
        assetTags
      };
      hexo.render.render({ path: path.join(dir, 'page.ejs'), engine: 'ejs' }, data).then(html => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.end(req.method === 'HEAD' ? undefined : html);
      }).catch(next);
    });
  }, 1);
}
