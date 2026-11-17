/**
 * 首頁互動（vanilla）
 * - Skills 跑馬燈：滑過文字、按暫停、捲出畫面時停下
 * initLanding() 為冪等函式；PJAX 換頁後由 pjax-init.js 重新呼叫。
 */
(function () {
  'use strict';

  /* 100vw 含捲軸寬度，滿版細帶就會多撐出一條水平捲軸。量一次給 CSS 用。 */
  function syncScrollbarWidth() {
    var w = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--sbw', (w > 0 ? w : 0) + 'px');
  }

  var disposeAvatar = null;

  function initAvatarMorph() {
    if (disposeAvatar) disposeAvatar();
    var source = document.querySelector('.notebook-emblem img');
    var target = document.querySelector('#header #logo');
    var header = document.getElementById('header');
    if (!source || !target || !header) return;

    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var clone = source.cloneNode(false);
    clone.className = 'scroll-avatar';
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    document.body.appendChild(clone);
    header.classList.add('avatar-morph-header');
    document.documentElement.classList.add('avatar-morph-home');

    var frame = 0;
    var origin, destination, distance;

    function measure() {
      var a = source.getBoundingClientRect();
      var b = target.getBoundingClientRect();
      // Store the original document position, independent of restored scroll.
      origin = { x: a.left, y: a.top + window.scrollY, size: a.width };
      destination = { x: b.left, y: b.top - header.getBoundingClientRect().top, size: b.width };
      distance = Math.max(80, origin.y - destination.y);
      render();
    }

    function render() {
      frame = 0;
      var reduced = motion.matches;
      var progress = Math.max(0, Math.min(1, window.scrollY / distance));
      var moving = !reduced && progress < 1;
      source.style.visibility = reduced ? '' : 'hidden';
      target.style.opacity = reduced || !moving ? '1' : '0';
      header.style.setProperty('--avatar-name-opacity', reduced ? 1 : Math.max(0, (progress - .55) / .45));
      clone.hidden = !moving;
      if (!moving) return;
      var size = origin.size + (destination.size - origin.size) * progress;
      var x = origin.x + (destination.x - origin.x) * progress;
      var y = origin.y + (destination.y - origin.y) * progress;
      clone.style.width = origin.size + 'px';
      clone.style.height = origin.size + 'px';
      clone.style.borderRadius = (16 + (11 * origin.size / destination.size - 16) * progress) + 'px';
      clone.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + size / origin.size + ')';
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    motion.addEventListener('change', render);
    measure();
    disposeAvatar = function () {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      motion.removeEventListener('change', render);
      source.style.visibility = '';
      target.style.opacity = '';
      header.style.removeProperty('--avatar-name-opacity');
      header.classList.remove('avatar-morph-header');
      document.documentElement.classList.remove('avatar-morph-home');
      clone.remove();
      disposeAvatar = null;
    };
  }

  document.addEventListener('pjax:send', function () {
    if (disposeAvatar) disposeAvatar();
  });

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

  window.initLanding = function () {
    syncScrollbarWidth();
    initMarquee();
    initAvatarMorph();
  };

  window.addEventListener('resize', syncScrollbarWidth);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLanding);
  } else {
    window.initLanding();
  }
})();
