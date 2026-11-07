/**
 * Hibiki 文章聊天助理：公會櫃檯抽屜
 * - 平常只有右下角的入口按鈕（手機文章頁改用底部操作列）
 * - 打開時從右側滑出抽屜：上半部是櫃檯，Live2D 角色站在櫃檯後；下半部聊天
 * - Live2D 模型第一次打開抽屜才載入，關起來就暫停繪製
 * - PJAX 換文章時清空對話；同篇文章關掉再開保留內容
 */
(function () {
  'use strict';

  var cfg = window.LIVE2D_CHAT_CONFIG || {};
  if (!cfg.enabled || window._live2dChatInit) return;
  window._live2dChatInit = true;

  var MODEL_URL = cfg.model || (cfg.models && cfg.models[Object.keys(cfg.models)[0]]);
  var CHAR_NAME = 'Hibiki';
  var EXIT_MS = 200;

  var history = [];
  var bubbleTimer = null;
  var ambientTimer = null;
  var resizeTimer = null;
  var chatOpen = false;
  var pending = false;
  var live2dRequested = false;
  var currentMode = '';
  var conversationKey = getConversationKey();
  var conversationVersion = 0;
  var activeRequest = null;
  var lastTrigger = null;
  var ambientCount = 0;
  var ambientPageKey = location.pathname;
  var lastAmbientLine = '';
  var lastAmbientAt = 0;
  var midpointHinted = false;
  var scrollTicking = false;
  var AMBIENT_MAX_PER_PAGE = 4;

  /* ── 當前頁面與文章內容 ───────────────────────── */
  function getPageContext() {
    /* 只有文章頁有 .reading-body;關於、搜尋、標籤頁也是 article.post,不能當成文章內容送出 */
    var article = document.querySelector('article.post .reading-body');
    if (!article) return null;
    var title = (document.title || '').replace(/\s*\|.*$/, '').trim();
    var text = (article.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 6000);
    if (!text) return null;
    return { title: title.slice(0, 100), text: text };
  }

  function getConversationKey() {
    return getPageContext() ? 'article:' + location.pathname : 'site';
  }

  /* 手機文章頁的入口在底部操作列;沒有 #actions-footer 的頁面退回浮動入口 */
  function getMode() {
    return window.innerWidth < 500 && document.getElementById('actions-footer') ? 'mobilebar' : 'float';
  }

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" stroke-linecap="round" stroke-width="2"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  /* ── UI ───────────────────────────────────────── */
  var root = document.createElement('div');
  root.id = 'waifu-chat';
  root.innerHTML =
    '<button type="button" class="waifu-launcher" aria-controls="waifu-term" aria-expanded="false">' +
      ICON_CHAT + '<span class="waifu-launcher-label">Hibiki</span>' +
    '</button>' +
    '<button type="button" class="waifu-bubble" aria-label="開啟 Hibiki 聊天" hidden>' +
      '<span class="waifu-bubble-kicker">HIBIKI</span><span class="waifu-bubble-text"></span>' +
    '</button>' +
    '<button type="button" class="waifu-scrim" aria-label="關閉 Hibiki 聊天" tabindex="-1" hidden></button>' +
    '<section class="waifu-term" id="waifu-term" role="dialog" aria-modal="true" aria-labelledby="waifu-title" tabindex="-1" hidden>' +
      '<header class="waifu-term-bar">' +
        '<div><span class="waifu-kicker">RECEPTION · 文章櫃檯</span><strong class="waifu-name" id="waifu-title">Hibiki</strong></div>' +
        '<button type="button" class="waifu-term-btn waifu-btn-close" title="關閉" aria-label="關閉聊天">' + ICON_CLOSE + '</button>' +
      '</header>' +
      '<div class="waifu-stage" aria-hidden="true">' +
        '<div class="waifu-stage-wall"><span>NOTICE BOARD</span><span>LIN’S FIELD NOTES</span></div>' +
        '<div class="waifu-stage-figure"></div>' +
        '<div class="waifu-counter"><span class="waifu-counter-plate">HIBIKI <i>·</i> 文章導覽</span></div>' +
      '</div>' +
      '<div class="waifu-log" aria-live="polite"></div>' +
      '<div class="waifu-chips" hidden>' +
        '<button type="button" class="waifu-chip waifu-chip-summary">整理本文重點</button>' +
        '<button type="button" class="waifu-chip waifu-chip-explain">簡單解釋這篇</button>' +
      '</div>' +
      '<form class="waifu-form">' +
        '<input class="waifu-input" type="text" maxlength="200" autocomplete="off" placeholder="想問 Hibiki 什麼？" aria-label="聊天輸入">' +
        '<button class="waifu-send" type="submit" aria-label="送出">' + ICON_SEND + '</button>' +
      '</form>' +
    '</section>';
  document.body.appendChild(root);

  var launcher = root.querySelector('.waifu-launcher');
  var bubble = root.querySelector('.waifu-bubble');
  var bubbleText = root.querySelector('.waifu-bubble-text');
  var scrim = root.querySelector('.waifu-scrim');
  var term = root.querySelector('.waifu-term');
  var figure = root.querySelector('.waifu-stage-figure');
  var chips = root.querySelector('.waifu-chips');
  var log = root.querySelector('.waifu-log');
  var form = root.querySelector('.waifu-form');
  var input = root.querySelector('.waifu-input');

  function getMobileAction() {
    return document.querySelector('.waifu-mobile-action');
  }

  function syncExpandedState() {
    launcher.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
    var mobileAction = getMobileAction();
    if (mobileAction) mobileAction.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
  }

  function ensureMobileAction() {
    var actions = document.getElementById('actions-footer');
    var action = getMobileAction();

    if (currentMode !== 'mobilebar' || !actions) {
      if (action) action.remove();
      return;
    }

    if (!action) {
      action = document.createElement('button');
      action.type = 'button';
      action.className = 'icon waifu-mobile-action';
      action.setAttribute('aria-controls', 'waifu-term');
      action.innerHTML = ICON_CHAT + ' Hibiki';
      actions.appendChild(action);
    }
    action.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
  }

  /* ── Live2D：第一次打開抽屜才載入，canvas 搬進櫃檯 ── */
  function initLive2D() {
    if (live2dRequested || !MODEL_URL || typeof L2Dwidget === 'undefined') return;
    live2dRequested = true;
    figure.classList.add('is-loading');
    L2Dwidget.init({
      model: { jsonPath: MODEL_URL },
      display: { position: 'right', width: 170, height: 380, hOffset: 0, vOffset: 0 },
      mobile: { show: true, scale: 1 },
      log: false
    });
    adoptWidget();
  }

  /* L2Dwidget 把 #live2d-widget 掛在 body 且沒有就緒回呼;出現後搬進櫃檯,6 秒內沒出現就放棄 */
  function adoptWidget() {
    var waited = 0;
    (function poll() {
      var widget = document.getElementById('live2d-widget');
      if (widget) {
        figure.appendChild(widget);
        figure.classList.remove('is-loading');
        return;
      }
      waited += 120;
      if (waited >= 6000) {
        figure.classList.remove('is-loading');
        figure.classList.add('is-unavailable');
        return;
      }
      setTimeout(poll, 120);
    })();
  }

  /* L2Dwidget 每幀呼叫 requestAnimationFrame(tick, canvas),沒有暫停 API;
     抽屜關起來時把這條迴圈停在原地,打開再接上,其他 rAF 照常 */
  var nativeRaf = window.requestAnimationFrame;
  var live2dPaused = false;
  var parkedTick = null;
  window.requestAnimationFrame = function (callback, element) {
    if (live2dPaused && element && element.id === 'live2dcanvas') {
      parkedTick = callback;
      return 0;
    }
    return nativeRaf.call(window, callback);
  };

  function setLive2DPaused(paused) {
    live2dPaused = paused;
    if (!paused && parkedTick) {
      var tick = parkedTick;
      parkedTick = null;
      nativeRaf.call(window, tick);
    }
  }

  /* 只有退場動畫需要延後 hidden;減少動態時直接收 */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var exitTimers = new WeakMap();

  function showEl(el) {
    clearTimeout(exitTimers.get(el));
    el.classList.remove('is-leaving');
    el.hidden = false;
  }

  function hideEl(el) {
    if (el.hidden) return;
    if (reduceMotion && reduceMotion.matches) {
      el.hidden = true;
      return;
    }
    el.classList.add('is-leaving');
    clearTimeout(exitTimers.get(el));
    exitTimers.set(el, setTimeout(function () {
      el.classList.remove('is-leaving');
      el.hidden = true;
    }, EXIT_MS));
  }

  function syncLayout() {
    currentMode = getMode();
    root.className = 'waifu-mode-' + currentMode + (chatOpen ? ' is-open' : '');
    launcher.hidden = currentMode === 'mobilebar' || chatOpen;
    document.documentElement.classList.toggle('waifu-drawer-open', chatOpen);
    /* 浮動入口在最下方，回頂鈕讓到它上面；手機文章頁入口在底部操作列，回頂鈕維持原位 */
    document.documentElement.classList.toggle('waifu-float', currentMode === 'float');
    setLive2DPaused(!chatOpen);
    ensureMobileAction();
    syncExpandedState();
  }

  /* ── 對話視窗與可及性 ────────────────────────── */
  /* 只把符合 permalink 格式的站內相對路徑轉成連結,其餘一律純文字(防注入) */
  var SITE_PATH_RE = /\/20\d{2}\/\d{2}\/\d{2}\/[^\s，。、；：！？)）」』〉>"'…]+/g;

  function appendRichText(container, text) {
    var last = 0;
    var match;
    SITE_PATH_RE.lastIndex = 0;
    while ((match = SITE_PATH_RE.exec(text))) {
      if (match.index > last) {
        container.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      var a = document.createElement('a');
      a.className = 'waifu-link';
      a.href = match[0];
      a.textContent = match[0];
      container.appendChild(a);
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      container.appendChild(document.createTextNode(text.slice(last)));
    }
  }

  function addLog(role, text) {
    var div = document.createElement('div');
    div.className = 'waifu-msg waifu-msg-' + role;
    var name = document.createElement('span');
    name.className = 'waifu-msg-name';
    name.textContent = role === 'assistant' ? CHAR_NAME : 'YOU';
    div.appendChild(name);
    var body = document.createElement('span');
    body.className = 'waifu-msg-text';
    if (role === 'assistant') {
      appendRichText(body, text);
    } else {
      body.appendChild(document.createTextNode(text));
    }
    div.appendChild(body);
    log.appendChild(div);
    while (log.children.length > 14) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function ensureIntro() {
    if (log.children.length) return;
    var ctx = getPageContext();
    if (ctx) {
      addLog('assistant', '歡迎來到櫃檯！我可以幫你整理《' + ctx.title.slice(0, 28) + '》，也可以直接問我文章內容。');
    } else {
      addLog('assistant', '歡迎來到櫃檯！想找文章或聊聊這個網站，都可以問我。');
    }
  }

  function openChat(trigger) {
    if (trigger) lastTrigger = trigger;
    chatOpen = true;
    showEl(scrim);
    showEl(term);
    hideEl(bubble);
    clearTimeout(bubbleTimer);
    clearTimeout(ambientTimer);
    ambientTimer = null;
    chips.hidden = !getPageContext();
    ensureIntro();
    initLive2D();
    syncLayout();
    /* 觸控手機一打開就 focus 輸入框會立刻彈出鍵盤,先 focus 對話框本身,要打字再點輸入框 */
    var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    window.requestAnimationFrame(function () {
      (touch ? term : input).focus({ preventScroll: true });
    });
  }

  function closeChat(restoreFocus) {
    if (!chatOpen) return;
    chatOpen = false;
    hideEl(term);
    hideEl(scrim);
    syncLayout();
    if (restoreFocus !== false && lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
    scheduleAmbient(randomBetween(30000, 50000));
  }

  function toggleChat(trigger) {
    chatOpen ? closeChat() : openChat(trigger);
  }

  launcher.addEventListener('click', function () { toggleChat(launcher); });
  bubble.addEventListener('click', function () { openChat(launcher); });
  scrim.addEventListener('click', function () { closeChat(); });
  root.querySelector('.waifu-btn-close').addEventListener('click', function () { closeChat(); });

  /* 點推薦連結導向新文章:先收合聊天,PJAX 導航後由 syncPage 重置對話 */
  log.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a.waifu-link');
    if (link) closeChat(false);
  });

  document.addEventListener('click', function (event) {
    var mobileAction = event.target.closest && event.target.closest('.waifu-mobile-action');
    if (mobileAction) toggleChat(mobileAction);
  });

  /* 抽屜是 modal:Esc 關閉,Tab 不離開抽屜 */
  document.addEventListener('keydown', function (event) {
    if (!chatOpen) return;
    if (event.key === 'Escape') {
      closeChat();
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = term.querySelectorAll('button:not([hidden]):not([disabled]), input, a[href]');
    var visible = Array.prototype.filter.call(focusable, function (el) { return el.offsetParent !== null; });
    if (!visible.length) return;
    var first = visible[0];
    var last = visible[visible.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === term)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ── 待機台詞：偶爾在入口旁出現，不打斷閱讀 ─ */
  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getAmbientLines() {
    var ctx = getPageContext();
    if (ctx) {
      var shortTitle = ctx.title.slice(0, 20);
      return [
        '正在讀《' + shortTitle + '》嗎？有不懂的地方可以來櫃檯問我。',
        '讀到這裡還順利嗎？我可以幫你整理重點。',
        '如果內容有點長，可以交給我摘要哦。',
        '需要我用更簡單的方式解釋這篇嗎？'
      ];
    }

    if (location.pathname.indexOf('/archives') === 0) {
      return [
        '文章都整理在這裡了，要我陪你找一篇嗎？',
        '不知道要看哪篇？來櫃檯問問我的推薦。'
      ];
    }

    return [
      '歡迎光臨！今天想看點什麼呢？',
      '需要我介紹這個網站嗎？櫃檯隨時開著。',
      'Lin 最近寫了不少東西，要一起逛逛嗎？'
    ];
  }

  function pickAmbientLine() {
    var lines = getAmbientLines();
    if (lines.length > 1) {
      lines = lines.filter(function (line) { return line !== lastAmbientLine; });
    }
    var line = lines[Math.floor(Math.random() * lines.length)];
    lastAmbientLine = line;
    return line;
  }

  function canShowAmbient() {
    return cfg.ambient_messages === true && !chatOpen && !document.hidden && currentMode === 'float' && window.innerWidth >= 500 &&
      ambientCount < AMBIENT_MAX_PER_PAGE;
  }

  function say(text, ms) {
    if (!canShowAmbient()) return false;
    bubbleText.textContent = text;
    clearTimeout(bubbleTimer);
    showEl(bubble);
    bubbleTimer = setTimeout(function () { hideEl(bubble); }, ms || 6500);
    return true;
  }

  function showAmbient(text) {
    if (!say(text || pickAmbientLine(), 6500)) return;
    ambientCount += 1;
    lastAmbientAt = Date.now();
    scheduleAmbient();
  }

  function scheduleAmbient(delay) {
    clearTimeout(ambientTimer);
    ambientTimer = null;
    if (!canShowAmbient()) return;
    ambientTimer = setTimeout(function () {
      ambientTimer = null;
      if (!canShowAmbient()) return;
      showAmbient();
    }, delay || randomBetween(45000, 90000));
  }

  function resetAmbient() {
    clearTimeout(ambientTimer);
    ambientTimer = null;
    clearTimeout(bubbleTimer);
    bubble.hidden = true;
    ambientCount = 0;
    lastAmbientLine = '';
    lastAmbientAt = 0;
    midpointHinted = false;
    scheduleAmbient(8000);
  }

  function checkReadingProgress() {
    if (midpointHinted || !canShowAmbient() || Date.now() - lastAmbientAt < 18000) return;
    var article = document.querySelector('article.post .content');
    if (!article) return;
    var rect = article.getBoundingClientRect();
    var viewed = window.innerHeight - rect.top;
    var progress = viewed / Math.max(rect.height, 1);
    if (progress >= 0.5 && progress <= 1.15) {
      midpointHinted = true;
      showAmbient('讀到一半了～需要我幫你整理目前的重點嗎？');
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(ambientTimer);
      clearTimeout(bubbleTimer);
      bubble.hidden = true;
    } else {
      scheduleAmbient(15000);
    }
  });

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      checkReadingProgress();
      scrollTicking = false;
    });
  }, { passive: true });

  /* ── 逐篇文章的對話生命週期 ─────────────────── */
  function resetConversation() {
    conversationVersion += 1;
    history = [];
    pending = false;
    if (activeRequest) {
      activeRequest.abort();
      activeRequest = null;
    }
    log.innerHTML = '';
    if (chatOpen) ensureIntro();
  }

  function syncPage() {
    var nextKey = getConversationKey();
    if (nextKey !== conversationKey) {
      conversationKey = nextKey;
      resetConversation();
    }
    if (location.pathname !== ambientPageKey) {
      ambientPageKey = location.pathname;
      resetAmbient();
    }
    chips.hidden = !getPageContext();
    syncLayout();
  }

  document.addEventListener('pjax:complete', function () {
    setTimeout(syncPage, 0);
  });

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      syncLayout();
      if (!canShowAmbient()) {
        clearTimeout(ambientTimer);
        ambientTimer = null;
        bubble.hidden = true;
      } else if (!ambientTimer) {
        scheduleAmbient(15000);
      }
    }, 120);
  }, { passive: true });

  /* ── 聊天 ────────────────────────────────────── */
  function timeGreeting() {
    var h = new Date().getHours();
    if (h < 5) return '這麼晚還沒睡嗎？要注意身體哦～';
    if (h < 11) return '早安！今天也要加油呢 ☀';
    if (h < 14) return '午安～吃飽了再繼續看吧';
    if (h < 18) return '下午好！來看看 Lin 又寫了什麼';
    if (h < 23) return '晚上好～讀點技術文章放鬆一下吧';
    return '夜深了，看完這篇就去休息吧！';
  }

  function offlineReply(text) {
    var rules = [
      [/你(是誰|叫什麼)|自我介紹/, '我是 Hibiki，這裡的文章櫃檯！Lin 寫程式的時候我負責監工 (｀・ω・´)'],
      [/lin|站長|作者/i, 'Lin 是軟體設計工程師，最近都在玩 AI 應用整合～首頁下方有他的 side projects！'],
      [/專案|project/i, '首頁往下捲就有作品卡片，智慧旅程規劃和 mien 都很推薦～'],
      [/文章|blog|部落格|總結/, '文章都收在「所有文章」頁，LeetCode 跟技術筆記都有哦'],
      [/謝謝|感謝/, '不客氣～歡迎再來櫃檯！'],
      [/(早安|午安|晚安|你好|嗨|哈囉)/, timeGreeting()]
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(text)) return rules[i][1];
    }
    var fallback = ['嗯嗯，然後呢？', '這個嘛…等我大腦連上線再告訴你！', '(歪頭) 再說一次？', '你可以問我關於 Lin 或這個部落格的事哦'];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  function sendMessage(text) {
    if (!text || pending) return;
    addLog('user', text);
    history.push({ role: 'user', content: text });

    if (!cfg.endpoint) {
      var offline = offlineReply(text);
      var offlineVersion = conversationVersion;
      history.push({ role: 'assistant', content: offline });
      setTimeout(function () {
        if (offlineVersion === conversationVersion) addLog('assistant', offline);
      }, 400);
      return;
    }

    pending = true;
    var requestVersion = conversationVersion;
    var typing = addLog('assistant', '…');
    typing.classList.add('waifu-typing');

    var payload = { messages: history.slice(-10) };
    var ctx = getPageContext();
    if (ctx) payload.page = ctx;

    activeRequest = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    if (activeRequest) fetchOptions.signal = activeRequest.signal;

    fetch(cfg.endpoint, fetchOptions)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (requestVersion !== conversationVersion) return;
        typing.remove();
        var reply = data.reply || '（連線怪怪的，等一下再試試？）';
        history.push({ role: 'assistant', content: reply });
        addLog('assistant', reply);
      })
      .catch(function (error) {
        if (requestVersion !== conversationVersion || (error && error.name === 'AbortError')) return;
        typing.remove();
        addLog('assistant', '腦袋連不上線 QQ 稍後再試～');
      })
      .finally(function () {
        if (requestVersion === conversationVersion) {
          pending = false;
          activeRequest = null;
        }
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = input.value.trim();
    input.value = '';
    sendMessage(text);
  });

  root.querySelector('.waifu-chip-summary').addEventListener('click', function () {
    sendMessage('幫我總結這篇文章的重點');
  });

  root.querySelector('.waifu-chip-explain').addEventListener('click', function () {
    sendMessage('請用簡單易懂的方式解釋這篇文章在說什麼');
  });

  syncLayout();
  resetAmbient();
})();
