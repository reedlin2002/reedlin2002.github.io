/**
 * Hibiki 文章聊天助理
 * - 桌機所有頁面：右下 Live2D + 明確入口，聊天窗在角色上方
 * - 平板：回頂按鈕上方的精簡入口
 * - 手機文章頁：入口整合進既有底部操作列，聊天使用 bottom sheet
 * - PJAX 換文章時清空對話；同篇文章收合再開啟則保留內容
 */
(function () {
  'use strict';

  var cfg = window.LIVE2D_CHAT_CONFIG || {};
  if (!cfg.enabled || window._live2dChatInit) return;
  window._live2dChatInit = true;

  var MODEL_URL = cfg.model || (cfg.models && cfg.models[Object.keys(cfg.models)[0]]);
  var CHAR_NAME = 'Hibiki';
  var FULL_MIN_WIDTH = 769;
  var FULL_MIN_HEIGHT = 520;

  var history = [];
  var bubbleTimer = null;
  var ambientTimer = null;
  var resizeTimer = null;
  var chatOpen = false;
  var pending = false;
  var live2dReady = false;
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
    var article = document.querySelector('article.post .content');
    if (!article) return null;
    var title = (document.title || '').replace(/\s*\|.*$/, '').trim();
    var text = (article.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 6000);
    if (!text) return null;
    return { title: title.slice(0, 100), text: text };
  }

  function getConversationKey() {
    return getPageContext() ? 'article:' + location.pathname : 'site';
  }

  function isPhoneArticle() {
    return window.innerWidth < 500 && !!getPageContext();
  }

  function getMode() {
    var canRenderFull = MODEL_URL && typeof L2Dwidget !== 'undefined';
    if (canRenderFull && window.innerWidth >= FULL_MIN_WIDTH &&
        window.innerHeight >= FULL_MIN_HEIGHT) {
      return 'full';
    }
    return isPhoneArticle() ? 'mobilebar' : 'compact';
  }

  /* ── UI ───────────────────────────────────────── */
  var root = document.createElement('div');
  root.id = 'waifu-chat';
  root.innerHTML =
    '<button type="button" class="waifu-launcher" aria-controls="waifu-term" aria-expanded="false">' +
      '<span class="waifu-launcher-status" aria-hidden="true"></span>' +
      '<span>問 Hibiki</span>' +
    '</button>' +
    '<button type="button" class="waifu-hitbox" title="跟 Hibiki 聊天" aria-label="開啟 Hibiki 聊天" aria-controls="waifu-term" aria-expanded="false" hidden></button>' +
    '<button type="button" class="waifu-bubble" aria-label="開啟 Hibiki 聊天" hidden>' +
      '<span class="waifu-bubble-text"></span>' +
    '</button>' +
    '<button type="button" class="waifu-scrim" aria-label="關閉 Hibiki 聊天" hidden></button>' +
    '<section class="waifu-term" id="waifu-term" role="dialog" aria-label="與 Hibiki 聊天" hidden>' +
      '<div class="waifu-term-bar">' +
        '<div class="waifu-nameplate">' +
          '<strong class="waifu-name">Hibiki</strong>' +
          '<span class="waifu-role">文章聊天助理</span>' +
        '</div>' +
        '<span class="waifu-online"><i aria-hidden="true"></i>ONLINE</span>' +
        '<button type="button" class="waifu-term-btn waifu-btn-close" title="關閉" aria-label="關閉聊天">✕</button>' +
      '</div>' +
      '<div class="waifu-log" aria-live="polite"></div>' +
      '<div class="waifu-chips" hidden>' +
        '<span class="waifu-choice-label" aria-hidden="true">SELECT</span>' +
        '<button type="button" class="waifu-chip waifu-chip-summary">整理本文重點</button>' +
        '<button type="button" class="waifu-chip waifu-chip-explain">簡單解釋這篇</button>' +
      '</div>' +
      '<form class="waifu-form">' +
        '<span class="waifu-prompt" aria-hidden="true">YOU</span>' +
        '<input class="waifu-input" type="text" maxlength="200" autocomplete="off" placeholder="輸入想對 Hibiki 說的話…" aria-label="聊天輸入">' +
        '<button class="waifu-send" type="submit"><span>送出</span><i aria-hidden="true">➤</i></button>' +
      '</form>' +
      '<span class="waifu-next" aria-hidden="true">◆</span>' +
    '</section>';
  document.body.appendChild(root);

  var launcher = root.querySelector('.waifu-launcher');
  var hitbox = root.querySelector('.waifu-hitbox');
  var bubble = root.querySelector('.waifu-bubble');
  var bubbleText = root.querySelector('.waifu-bubble-text');
  var scrim = root.querySelector('.waifu-scrim');
  var term = root.querySelector('.waifu-term');
  var chips = root.querySelector('.waifu-chips');
  var log = root.querySelector('.waifu-log');
  var form = root.querySelector('.waifu-form');
  var input = root.querySelector('.waifu-input');

  function getMobileAction() {
    return document.querySelector('.waifu-mobile-action');
  }

  function syncExpandedState() {
    launcher.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
    hitbox.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
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
      action.innerHTML = '<i class="fa-solid fa-comment-dots fa-lg" aria-hidden="true"></i> Hibiki';
      actions.appendChild(action);
    }
    action.setAttribute('aria-expanded', chatOpen ? 'true' : 'false');
  }

  /* ── Live2D：只在桌機且高度足夠時初始化 ───────── */
  function initLive2D() {
    if (live2dReady || !MODEL_URL || typeof L2Dwidget === 'undefined') return;
    live2dReady = true;
    L2Dwidget.init({
      model: { jsonPath: MODEL_URL },
      display: { position: 'right', width: 120, height: 240, hOffset: 72, vOffset: 0 },
      mobile: { show: false },
      react: { opacityDefault: 0.55, opacityOnHover: 0.95 },
      log: false
    });
  }

  function syncLayout() {
    currentMode = getMode();
    root.className = 'waifu-mode-' + currentMode + (chatOpen ? ' is-open' : '');
    root.setAttribute('data-mode', currentMode);

    var showFull = currentMode === 'full';
    hitbox.hidden = !showFull;
    launcher.hidden = currentMode === 'mobilebar' || chatOpen;
    term.setAttribute('aria-modal', window.innerWidth < 500 ? 'true' : 'false');
    document.body.classList.toggle('waifu-live2d-visible', showFull);
    document.body.classList.toggle('waifu-chat-open', chatOpen && showFull);

    if (showFull) initLive2D();
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
    if (role === 'assistant') {
      appendRichText(div, text);
    } else {
      div.appendChild(document.createTextNode(text));
    }
    log.appendChild(div);
    while (log.children.length > 14) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function ensureIntro() {
    if (log.children.length) return;
    var ctx = getPageContext();
    if (ctx) {
      addLog('assistant', '我可以幫你整理《' + ctx.title.slice(0, 28) + '》，也可以直接問我文章內容。');
    } else {
      addLog('assistant', '嗨！想找文章或聊聊這個網站，都可以問我。');
    }
  }

  function openChat(trigger) {
    if (trigger) lastTrigger = trigger;
    chatOpen = true;
    term.hidden = false;
    scrim.hidden = false;
    bubble.hidden = true;
    clearTimeout(bubbleTimer);
    clearTimeout(ambientTimer);
    ambientTimer = null;
    chips.hidden = !getPageContext();
    ensureIntro();
    syncLayout();
    window.requestAnimationFrame(function () { input.focus(); });
  }

  function closeChat(restoreFocus) {
    if (!chatOpen) return;
    chatOpen = false;
    term.hidden = true;
    scrim.hidden = true;
    document.body.classList.remove('waifu-chat-open');
    syncLayout();
    if (restoreFocus !== false && lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
    scheduleAmbient(randomBetween(30000, 50000));
  }

  function toggleChat(trigger) {
    chatOpen ? closeChat() : openChat(trigger);
  }

  launcher.addEventListener('click', function () { toggleChat(launcher); });
  hitbox.addEventListener('click', function () { toggleChat(hitbox); });
  bubble.addEventListener('click', function () {
    bubble.hidden = true;
    openChat(currentMode === 'full' ? hitbox : launcher);
  });
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

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && chatOpen) closeChat();
  });

  /* ── 待機台詞：讓角色偶爾主動參與，但不打斷閱讀 ─ */
  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getAmbientLines() {
    var ctx = getPageContext();
    if (ctx) {
      var shortTitle = ctx.title.slice(0, 20);
      return [
        '正在讀《' + shortTitle + '》嗎？有不懂的地方可以問我。',
        '讀到這裡還順利嗎？我可以幫你整理重點。',
        '如果內容有點長，可以交給我摘要哦。',
        '需要我用更簡單的方式解釋這篇嗎？',
        '看到重要的段落，也可以直接拿來問我。'
      ];
    }

    if (location.pathname.indexOf('/archives') === 0) {
      return [
        '文章都整理在這裡了，要我陪你找一篇嗎？',
        '不知道要看哪篇？可以問問我的推薦。',
        '慢慢挑吧，我會待在這裡陪你。'
      ];
    }

    return [
      '歡迎回來，今天想看點什麼呢？',
      '需要我介紹這個網站嗎？點我就可以聊天。',
      'Lin 最近寫了不少東西，要一起逛逛嗎？',
      '我不只是在這裡站著哦，也可以陪你聊天。'
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
    return !chatOpen && !document.hidden && window.innerWidth >= 500 &&
      ambientCount < AMBIENT_MAX_PER_PAGE;
  }

  function say(text, ms) {
    if (!canShowAmbient() || currentMode === 'mobilebar') return false;
    bubbleText.textContent = text;
    bubble.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.hidden = true; }, ms || 6500);
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
    scheduleAmbient(3000);
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
      if (window.innerWidth < 500) {
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
      [/你(是誰|叫什麼)|自我介紹/, '我是 Hibiki，這裡的文章聊天助理！Lin 寫程式的時候我負責監工 (｀・ω・´)'],
      [/lin|站長|作者/i, 'Lin 是軟體設計工程師，最近都在玩 AI 應用整合～精選專案可以在首頁找到！'],
      [/專案|project/i, '推薦看看 LocalAIAgentAPI 和 UrlHealthMonitor，首頁往下捲就有～'],
      [/文章|blog|部落格|總結/, '文章都收在「文章」頁，LeetCode 跟技術筆記都有哦'],
      [/謝謝|感謝/, '不客氣～常來玩！'],
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
