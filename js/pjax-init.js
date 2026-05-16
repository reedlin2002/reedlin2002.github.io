/**
 * 初始化 PJAX 與切換邏輯
 */

/* ──────────────────────────────────────
   About Section 捲動顯示/隱藏
   向下捲動 → 隱藏；向上捲動 → 顯示
   ────────────────────────────────────── */
function initAboutScroll() {
  const about = document.getElementById('about');
  if (!about) return;

  if (window._aboutScrollHandler) {
    window.removeEventListener('scroll', window._aboutScrollHandler);
  }

  let lastScrollY = window.scrollY;

  window._aboutScrollHandler = function () {
    const currentY = window.scrollY;
    // 超過 80px 才觸發，避免微小抖動
    if (currentY > lastScrollY && currentY > 80) {
      // 向下捲動 → 隱藏
      about.classList.add('about-hidden');
    } else {
      // 向上捲動 → 顯示
      about.classList.remove('about-hidden');
    }
    lastScrollY = currentY;
  };

  window.addEventListener('scroll', window._aboutScrollHandler, { passive: true });
  // 初始狀態：頁面頂部就顯示
  about.classList.remove('about-hidden');
}

/* ──────────────────────────────────────
   返回頂部按鈕（Back To Top）
   在 body 末層，跨頁持久存在
   ────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  // 移除舊的監聽器（避免重複綁定）
  if (window._backToTopScrollHandler) {
    window.removeEventListener('scroll', window._backToTopScrollHandler);
  }

  window._backToTopScrollHandler = function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', window._backToTopScrollHandler, { passive: true });

  // 點擊後平滑滾動至頂部
  btn.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 初始判斷（避免進頁時已捲到中段）
  window._backToTopScrollHandler();
}

document.addEventListener('DOMContentLoaded', () => {
    // 覆寫 NProgress 載入條為我們的 cyan 主題色
    const style = document.createElement('style');
    style.innerHTML = `
      #nprogress .bar {
        background: #22d3ee !important;
        height: 3px !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #22d3ee, 0 0 5px #22d3ee !important;
      }
      #nprogress .spinner-icon {
        border-top-color: #22d3ee !important;
        border-left-color: #22d3ee !important;
      }
    `;
    document.head.appendChild(style);
  
    // 避免音樂重新載入，Pjax 只負責抽換主要內容
    var pjax = new Pjax({
      elements: "a[href]:not([target='_blank']):not([href^='#']):not([href^='/#']):not([data-pjax-state])",
      selectors: [
        "title",
        "main.content" // 只抽換 content 區塊
      ],
      cacheBust: false,
      timeout: 5000
    });
  
    // 開始換頁時：顯示進度條
    document.addEventListener("pjax:send", function() {
      NProgress.start();
    });
  
    // 換頁結束時：重新初始化腳本
    document.addEventListener("pjax:complete", function() {
      NProgress.done();
      
      // 確保 window 已經存在要重新觸發的函式
      if (typeof window.initMainJS === 'function') {
        window.initMainJS();
      }
      
      if (typeof window.initShokaJS === 'function') {
        window.initShokaJS();
      }
  
      if (typeof window.initTypewriter === 'function') {
        window.initTypewriter();
      }
      
      if (typeof window.initSprint2JS === 'function') {
        window.initSprint2JS();
      }

      if (typeof window.initSprint3JS === 'function') {
        window.initSprint3JS();
      }

      // Reading progress bar
      if (typeof window.initReadingProgress === 'function') {
        window.initReadingProgress();
      }

      // Back-to-Top 重新初始化（PJAX 換頁後 scroll 位置重置）
      initAboutScroll();
      initBackToTop();
  
      // 如果使用 Disqus 或其他留言板，這裏可以重新載入，但這裡先跳過
    });
    
    // 為了保證第一頁進來也能初始化（從 main.js / shoka.js 的 ready 事件拿過來）
    if (typeof window.initMainJS === 'function') window.initMainJS();
    if (typeof window.initShokaJS === 'function') window.initShokaJS();
    // Sprint JS 會自己在行內呼叫，這裡不用再次呼叫

    // 初始化 About Section 捲動行為
    initAboutScroll();
    // 初始化返回頂部按鈕
    initBackToTop();
  });
