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
  };

  window.addEventListener('resize', syncScrollbarWidth);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLanding);
  } else {
    window.initLanding();
  }
})();
