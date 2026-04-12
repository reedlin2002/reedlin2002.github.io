/**
 * 初始化 PJAX 與切換邏輯
 */

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
  
      // 如果使用 Disqus 或其他留言板，這裏可以重新載入，但這裡先跳過
    });
    
    // 為了保證第一頁進來也能初始化（從 main.js / shoka.js 的 ready 事件拿過來）
    if (typeof window.initMainJS === 'function') window.initMainJS();
    if (typeof window.initShokaJS === 'function') window.initShokaJS();
    // Sprint JS 會自己在行內呼叫，這裡不用再次呼叫
  });
