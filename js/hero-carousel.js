/*
 * Hero 橫幅輪播 — cross-fade
 * PJAX 換頁後由 pjax-init.js 重新呼叫；離開首頁時自清 timer
 */
window.initHeroCarousel = function () {
  // 清掉舊 timer（PJAX 重入 / 離開首頁）
  if (window._heroCarouselTimer) {
    clearInterval(window._heroCarouselTimer);
    window._heroCarouselTimer = null;
  }

  var carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  var slides = carousel.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  // 尊重減少動態偏好：停在第一張
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var current = 0;
  var interval = parseInt(carousel.getAttribute('data-interval'), 10) || 6000;

  window._heroCarouselTimer = setInterval(function () {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, interval);
};

document.addEventListener('DOMContentLoaded', function () {
  window.initHeroCarousel();
});
