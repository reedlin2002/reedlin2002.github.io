/**
 * Landing 效果（React-Bits 風格，vanilla 重刻）
 * - Split-Text：hero 標題逐字進場（CJK code-point 安全）
 * - Hero stagger：其餘 hero 元素依序浮現
 * - Spotlight + Tilt：專案卡滑鼠跟隨光暈與微傾斜
 * initLanding() 為冪等函式；PJAX 換頁後由 pjax-init.js 重新呼叫。
 */
(function () {
  'use strict';

  function reduce() {
    if (typeof window.prefersReducedMotion === 'function') return window.prefersReducedMotion();
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  window.initLanding = function () {
    /* ── Split-Text 逐字進場 ── */
    document.querySelectorAll('[data-split]:not([data-split-done])').forEach(function (el) {
      el.setAttribute('data-split-done', '1');
      if (reduce()) return; // 減少動效：維持純文字
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      el.textContent = '';
      var frag = document.createDocumentFragment();
      Array.from(text).forEach(function (ch, i) {
        var span = document.createElement('span');
        span.className = 'split-char';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.transitionDelay = (i * 35) + 'ms';
        frag.appendChild(span);
      });
      el.appendChild(frag);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.classList.add('split-in');
        });
      });
    });

    /* ── Hero 其餘元素 stagger 進場 ── */
    var heroInner = document.querySelector('.landing-hero-inner:not(.hero-entered)');
    if (heroInner) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroInner.classList.add('hero-entered');
        });
      });
    }

    /* ── Spotlight + Tilt（僅滑鼠裝置且未要求減少動效）──
       listener 綁在 .project-grid 上：PJAX 換掉 DOM 時自然清除，不會重複綁 */
    var grid = document.querySelector('.project-grid:not([data-spotlight-bound])');
    if (grid) {
      grid.setAttribute('data-spotlight-bound', '1');
      var hoverable = window.matchMedia && window.matchMedia('(hover: hover)').matches;
      if (hoverable && !reduce()) {
        grid.addEventListener('pointermove', function (e) {
          var card = e.target.closest('.project-card');
          if (!card) return;
          var r = card.getBoundingClientRect();
          var x = e.clientX - r.left;
          var y = e.clientY - r.top;
          card.style.setProperty('--mx', x + 'px');
          card.style.setProperty('--my', y + 'px');
          card.style.setProperty('--ry', (((x / r.width) - 0.5) * 8).toFixed(2) + 'deg');
          card.style.setProperty('--rx', (((y / r.height) - 0.5) * -8).toFixed(2) + 'deg');
        });
        grid.addEventListener('pointerout', function (e) {
          var card = e.target.closest('.project-card');
          if (!card) return;
          if (e.relatedTarget && card.contains(e.relatedTarget)) return;
          card.style.removeProperty('--mx');
          card.style.removeProperty('--my');
          card.style.removeProperty('--rx');
          card.style.removeProperty('--ry');
        });
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initLanding);
  } else {
    window.initLanding();
  }
})();
