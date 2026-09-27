/**
 * 首頁互動（vanilla 重刻，無 React）
 * - Skills 跑馬燈：滑過/聚焦/按暫停/捲出畫面都停下來
 * - 主題資料夾：滑過或按下展開，標籤可以拖，點下去進標籤頁
 * initLanding() 為冪等函式；PJAX 換頁後由 pjax-init.js 重新呼叫。
 */
(function () {
  'use strict';

  function reduce() {
    if (typeof window.prefersReducedMotion === 'function') return window.prefersReducedMotion();
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  /* 100vw 含捲軸寬度，滿版細帶就會多撐出一條水平捲軸。量一次給 CSS 用。 */
  function syncScrollbarWidth() {
    var w = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--sbw', (w > 0 ? w : 0) + 'px');
  }

  /* ── Skills 跑馬燈 ─────────────────────────────── */
  function initMarquee() {
    var marquee = document.querySelector('.skills-marquee:not([data-marquee-bound])');
    if (!marquee) return;
    marquee.setAttribute('data-marquee-bound', '1');

    var toggle = marquee.querySelector('.marquee-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var paused = marquee.classList.toggle('is-paused');
        toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
        toggle.setAttribute('aria-label', paused ? '播放技能跑馬燈' : '暫停技能跑馬燈');
        toggle.textContent = paused ? '▶' : 'Ⅱ';
      });
    }

    /* 捲出畫面就別讓它空轉 */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        marquee.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(marquee);
    }
  }

  /* ── 滑過預覽圖：第一次滑過條目才載入 ─────────────
     預覽圖平常是 opacity 0，但 <img src> 照樣會下載（首頁因此載了約 9.6 MB）。
     改成 data-src，只在有滑鼠的寬螢幕、第一次滑過或聚焦條目時才換成 src。 */
  function initPreviewImages() {
    var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (min-width: 761px)').matches;
    if (!canHover) return;
    var entries = document.querySelectorAll('.notebook-entry:not([data-preview-bound])');
    Array.prototype.forEach.call(entries, function (entry) {
      entry.setAttribute('data-preview-bound', '1');
      var img = entry.querySelector('.notebook-preview img[data-src]');
      if (!img) return;
      var load = function () {
        if (img.getAttribute('src')) return;
        img.setAttribute('src', img.getAttribute('data-src'));
      };
      entry.addEventListener('pointerenter', load, { once: true });
      entry.addEventListener('focusin', load, { once: true });
    });
  }

  /* ── 主題資料夾（Folder Float 風格）───────────── */
  /* PJAX 每次回首頁都會重新 init；上一輪掛在 document / matchMedia / Observer 上的
     監聽要先拆掉，否則每回首頁一次就多一組（舊的還抓著已移除的 DOM）。 */
  var folderTeardown = null;
  var folderRoot = null;

  function teardownFolder() {
    if (folderTeardown) folderTeardown();
    folderTeardown = null;
    folderRoot = null;
  }

  function initTopicFolder() {
    if (folderRoot && !document.body.contains(folderRoot)) teardownFolder();
    var root = document.querySelector('[data-topic-folder]:not([data-folder-bound])');
    if (!root) return;
    teardownFolder();
    root.setAttribute('data-folder-bound', '1');
    folderRoot = root;

    var aborter = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var listenOpts = aborter ? { signal: aborter.signal } : false;
    var observers = [];

    var world = root.querySelector('.folder-world');
    var button = root.querySelector('.folder-button');
    var links = Array.prototype.slice.call(world.querySelectorAll('a'));
    if (!links.length) return;

    var open = false;
    var pinned = false;
    var dragging = null;
    var frame = 0;
    var closeTimer = 0;
    var visible = true;
    var last = 0;

    var items = links.map(function (el, index) {
      return { el: el, index: index, x: 0, y: 0, vx: 0, vy: 0, homeX: 0, homeY: 0, w: 0, h: 0, angle: (index % 2 ? 1 : -1) * 5 };
    });

    function place(item) {
      item.el.style.setProperty('--pill-x', item.x + 'px');
      item.el.style.setProperty('--pill-y', item.y + 'px');
      item.el.style.setProperty('--pill-angle', (reduce() ? 0 : item.angle) + 'deg');
    }

    function layout() {
      var width = world.clientWidth;
      items.forEach(function (item) {
        item.w = item.el.offsetWidth;
        item.h = item.el.offsetHeight;
        var row = Math.floor(item.index / 2);
        var oddLast = item.index === items.length - 1 && items.length % 2;
        item.homeX = oddLast ? (width - item.w) / 2 : (item.index % 2 ? width - item.w - 9 : 9);
        item.homeY = 8 + row * 45 + (item.index % 2 ? 8 : 0);
        item.x = item.homeX;
        item.y = item.homeY;
        item.vx = 0;
        item.vy = 0;
        place(item);
      });
    }

    function tick(now) {
      frame = 0;
      if (!open || !visible || document.hidden || reduce()) { last = 0; return; }
      var dt = Math.min(2, last ? (now - last) / 16.67 : 1);
      last = now;
      var width = world.clientWidth;
      var height = world.clientHeight;

      items.forEach(function (item) {
        if (dragging && dragging.item === item) return;
        var phase = now / 1500 + item.index * 2;
        item.vx = (item.vx + (item.homeX - item.x) * 0.0018 * dt + Math.sin(phase) * 0.018 * dt) * 0.98;
        item.vy = (item.vy + (item.homeY - item.y) * 0.0018 * dt + Math.cos(phase * 0.7) * 0.018 * dt) * 0.98;
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        if (item.x < 3 || item.x > width - item.w - 3) item.vx *= -0.6;
        if (item.y < 3 || item.y > height - item.h - 3) item.vy *= -0.6;
        item.x = clamp(item.x, 3, width - item.w - 3);
        item.y = clamp(item.y, 3, height - item.h - 3);
        item.angle = Math.sin(phase * 0.4) * 5;
      });

      /* 互相推開，避免標籤疊在一起看不清楚 */
      for (var i = 0; i < items.length; i++) {
        for (var j = i + 1; j < items.length; j++) {
          var a = items[i];
          var b = items[j];
          var dx = b.x + b.w / 2 - a.x - a.w / 2;
          var dy = b.y + b.h / 2 - a.y - a.h / 2;
          var overlapX = (a.w + b.w) / 2 + 4 - Math.abs(dx);
          var overlapY = (a.h + b.h) / 2 + 4 - Math.abs(dy);
          if (overlapX > 0 && overlapY > 0) {
            var push = (dy >= 0 ? 1 : -1) * Math.min(overlapY * 0.15, 2);
            if (!dragging || dragging.item !== a) a.vy -= push;
            if (!dragging || dragging.item !== b) b.vy += push;
          }
        }
      }

      items.forEach(place);
      frame = requestAnimationFrame(tick);
    }

    function animate() {
      if (!frame && open && visible && !document.hidden && !reduce()) frame = requestAnimationFrame(tick);
    }

    function setOpen(value) {
      open = value;
      root.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', (open ? '收起' : '開啟') + '主題資料夾');
      if ('inert' in world) world.inert = !open;
      if (open) { layout(); animate(); }
      else { cancelAnimationFrame(frame); frame = 0; last = 0; }
    }

    root.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(closeTimer);
      if (!open) setOpen(true);
    });

    root.addEventListener('pointerleave', function () {
      closeTimer = setTimeout(function () {
        if (!pinned && !dragging && !root.contains(document.activeElement)) setOpen(false);
      }, 240);
    });

    button.addEventListener('click', function (event) {
      if (event.detail === 0) {
        /* 鍵盤啟動：展開後把焦點交給第一個標籤 */
        pinned = !open;
        setOpen(pinned);
        if (open && links[0]) links[0].focus();
      } else if (open && !pinned) {
        pinned = true;
      } else {
        pinned = !pinned;
        setOpen(pinned);
      }
    });

    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      pinned = false;
      setOpen(false);
      button.focus();
    });

    items.forEach(function (item) {
      var dragged = false;

      item.el.addEventListener('dragstart', function (event) { event.preventDefault(); });

      item.el.addEventListener('pointerdown', function (event) {
        if (event.button !== 0 || reduce()) return;
        dragging = { item: item, startX: event.clientX, startY: event.clientY, x: item.x, y: item.y, lastX: event.clientX, lastY: event.clientY };
        dragged = false;
        item.el.setPointerCapture(event.pointerId);
      });

      item.el.addEventListener('pointermove', function (event) {
        if (!dragging || dragging.item !== item) return;
        var dx = event.clientX - dragging.startX;
        var dy = event.clientY - dragging.startY;
        if (Math.abs(dx) + Math.abs(dy) > 5) dragged = true;
        if (!dragged) return;
        item.x = clamp(dragging.x + dx, 3, world.clientWidth - item.w - 3);
        item.y = clamp(dragging.y + dy, 3, world.clientHeight - item.h - 3);
        item.vx = clamp((event.clientX - dragging.lastX) * 0.5, -4, 4);
        item.vy = clamp((event.clientY - dragging.lastY) * 0.5, -4, 4);
        dragging.lastX = event.clientX;
        dragging.lastY = event.clientY;
        place(item);
      });

      function release() {
        if (dragging && dragging.item === item) { dragging = null; animate(); }
      }
      item.el.addEventListener('pointerup', release);
      item.el.addEventListener('pointercancel', release);
      item.el.addEventListener('lostpointercapture', release);

      /* 拖過就不要順便把人帶去標籤頁 */
      item.el.addEventListener('click', function (event) {
        if (!dragged) return;
        event.preventDefault();
        dragged = false;
      });
    });

    if ('IntersectionObserver' in window) {
      var visibilityObserver = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        animate();
      });
      visibilityObserver.observe(root);
      observers.push(visibilityObserver);
    }
    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(world);
      observers.push(resizeObserver);
    }
    document.addEventListener('visibilitychange', animate, listenOpts);
    layout();

    /* 手機：資料夾移到文章之後，第一屏留給文章 */
    var topics = root.closest('.notebook-topics');
    var sidebar = document.querySelector('.notebook-sidebar');
    var feed = document.querySelector('.notebook-feed');
    if (topics && sidebar && feed && window.matchMedia) {
      var mobile = window.matchMedia('(max-width: 760px)');
      var placeTopics = function () {
        topics.classList.toggle('is-mobile-topics', mobile.matches);
        if (mobile.matches) feed.appendChild(topics);
        else sidebar.insertBefore(topics, sidebar.querySelector(':scope > .text-link'));
        layout();
      };
      if (mobile.addEventListener) mobile.addEventListener('change', placeTopics, listenOpts);
      placeTopics();
    }

    folderTeardown = function () {
      if (aborter) {
        aborter.abort();
      } else {
        document.removeEventListener('visibilitychange', animate);
        if (mobile && mobile.removeEventListener) mobile.removeEventListener('change', placeTopics);
      }
      observers.forEach(function (observer) { observer.disconnect(); });
      cancelAnimationFrame(frame);
      frame = 0;
    };
  }

  window.initLanding = function () {
    syncScrollbarWidth();
    initMarquee();
    initTopicFolder();
    initPreviewImages();
  };

  window.addEventListener('resize', syncScrollbarWidth);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLanding);
  } else {
    window.initLanding();
  }
})();
