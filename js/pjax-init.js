/**
 * 初始化 PJAX 與切換邏輯
 */

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

  // 點擊後平滑滾動至頂部（減少動效時直接跳轉）
  btn.onclick = function () {
    var reduce = window.prefersReducedMotion && window.prefersReducedMotion();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  // 初始判斷（避免進頁時已捲到中段）
  window._backToTopScrollHandler();
}

document.addEventListener('DOMContentLoaded', () => {
    // 覆寫 NProgress 載入條為品牌藍
    const style = document.createElement('style');
    style.innerHTML = `
      #nprogress .bar {
        background: #3B82F6 !important;
        height: 3px !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #3B82F6, 0 0 5px rgba(59,130,246,0.6) !important;
      }
      #nprogress .spinner-icon {
        border-top-color: #3B82F6 !important;
        border-left-color: #3B82F6 !important;
      }
    `;
    document.head.appendChild(style);

    if (typeof NProgress !== 'undefined') {
      NProgress.configure({ showSpinner: false });
    }
  
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
  
    // 開始換頁時：顯示進度條 + 淡出
    document.addEventListener("pjax:send", function() {
      NProgress.start();
      var main = document.querySelector('main.content');
      if (main) main.classList.add('pjax-loading');
    });

    // 換頁結束時：淡入 + 重新初始化腳本
    document.addEventListener("pjax:complete", function() {
      NProgress.done();
      var main = document.querySelector('main.content');
      if (main) {
        main.classList.remove('pjax-loading');
      }
      
      // 確保 window 已經存在要重新觸發的函式
      if (typeof window.initMainJS === 'function') {
        window.initMainJS();
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

      // Landing 效果（split-text / spotlight；冪等，首頁進出都可重呼叫）
      if (typeof window.initLanding === 'function') {
        window.initLanding();
      }

      // 圖片燈箱（medium-zoom，init 內會先 detach 舊實例）
      if (typeof window.initLightbox === 'function') {
        window.initLightbox();
      }

      // Back-to-Top 重新初始化（PJAX 換頁後 scroll 位置重置）
      initBackToTop();
  
      // 如果使用 Disqus 或其他留言板，這裏可以重新載入，但這裡先跳過
    });
    
    // 為了保證第一頁進來也能初始化（從 main.js 的 ready 事件拿過來）
    if (typeof window.initMainJS === 'function') window.initMainJS();
    // Sprint JS 會自己在行內呼叫，這裡不用再次呼叫

    // 初始化返回頂部按鈕
    initBackToTop();
  });
