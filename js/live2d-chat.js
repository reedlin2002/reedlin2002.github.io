/**
 * Live2D 看板娘：渲染 + 問候 + 換模型 + 聊天（終端機視窗風）
 * - 設定來自 window.LIVE2D_CHAT_CONFIG（layout.ejs 注入 theme.live2d_chat）
 * - 點角色本體開關聊天視窗；關閉狀態只有角色 + 偶發氣泡
 * - 文章頁自動把當前文章內容（裁 6000 字）附進請求，支援「總結這篇」
 * - 聊天：POST {messages, page} 到 config.endpoint（CF Worker → OpenRouter）
 *   endpoint 未設定時退化為離線劇本回覆
 * - 掛在 body 上、只 init 一次，PJAX 換頁不受影響
 */
(function () {
  'use strict';

  var cfg = window.LIVE2D_CHAT_CONFIG || {};
  if (!cfg.enabled) return;
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return;
  if (window._live2dChatInit) return;
  window._live2dChatInit = true;

  var MODELS = cfg.models || {};
  var modelKeys = Object.keys(MODELS);
  if (!modelKeys.length) return;

  var history = [];          // {role, content}，只存本分頁
  var bubbleTimer = null;
  var chatOpen = false;
  var pending = false;

  /* ── Live2D 渲染 ─────────────────────────────── */
  function currentModel() {
    var saved = localStorage.getItem('live2d-model');
    return (saved && MODELS[saved]) ? saved : (cfg.default_model || modelKeys[0]);
  }

  function renderModel(key) {
    var old = document.getElementById('live2d-widget');
    if (old) old.remove();
    if (typeof L2Dwidget === 'undefined') return;
    L2Dwidget.init({
      model: { jsonPath: MODELS[key] },
      display: { position: 'left', width: 120, height: 240, hOffset: 110, vOffset: 0 },
      mobile: { show: false },
      react: { opacityDefault: 0.7, opacityOnHover: 0.95 },
      log: false
    });
  }

  /* ── 當前文章內容（文章頁自動帶入分析上下文）───── */
  function getPageContext() {
    var article = document.querySelector('article.post .content');
    if (!article) return null;
    var title = (document.title || '').replace(/\s*\|.*$/, '').trim();
    var text = (article.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 6000);
    if (!text) return null;
    return { title: title.slice(0, 100), text: text };
  }

  /* ── UI：終端機視窗 ──────────────────────────── */
  var root = document.createElement('div');
  root.id = 'waifu-chat';
  root.innerHTML =
    '<div class="waifu-bubble" hidden></div>' +
    '<div class="waifu-term" hidden>' +
      '<div class="waifu-term-bar">' +
        '<span class="waifu-term-dots" aria-hidden="true"></span>' +
        '<span class="waifu-term-title"></span>' +
        '<button type="button" class="waifu-term-btn waifu-btn-model" title="換個角色" aria-label="換模型">⇄</button>' +
        '<button type="button" class="waifu-term-btn waifu-btn-close" title="關閉" aria-label="關閉聊天">✕</button>' +
      '</div>' +
      '<div class="waifu-chips" hidden>' +
        '<button type="button" class="waifu-chip waifu-chip-summary">✦ 總結這篇</button>' +
      '</div>' +
      '<div class="waifu-log"></div>' +
      '<form class="waifu-form">' +
        '<span class="waifu-prompt">&gt;</span>' +
        '<input class="waifu-input" type="text" maxlength="200" placeholder="跟她說點什麼…" aria-label="聊天輸入">' +
      '</form>' +
    '</div>';
  document.body.appendChild(root);

  var bubble = root.querySelector('.waifu-bubble');
  var term = root.querySelector('.waifu-term');
  var termTitle = root.querySelector('.waifu-term-title');
  var chips = root.querySelector('.waifu-chips');
  var log = root.querySelector('.waifu-log');
  var form = root.querySelector('.waifu-form');
  var input = root.querySelector('.waifu-input');

  function refreshTermMeta() {
    termTitle.textContent = currentModel() + '@reedlin:~';
    chips.hidden = !getPageContext();
  }

  function say(text, ms) {
    if (chatOpen) { addLog('assistant', text); return; }
    bubble.textContent = text;
    bubble.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.hidden = true; }, ms || 6000);
  }

  function addLog(role, text) {
    var div = document.createElement('div');
    div.className = 'waifu-msg waifu-msg-' + role;
    if (role === 'assistant') {
      var name = document.createElement('span');
      name.className = 'waifu-msg-name';
      name.textContent = currentModel();
      div.appendChild(name);
    }
    div.appendChild(document.createTextNode(text));
    log.appendChild(div);
    while (log.children.length > 14) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function openChat() {
    if (chatOpen) return;
    chatOpen = true;
    term.hidden = false;
    bubble.hidden = true;
    refreshTermMeta();
    if (!log.children.length) {
      addLog('assistant', cfg.endpoint ? '嗨！想聊什麼呢？' : '嗨！（大腦還沒接上線，我只能講講預錄台詞啦）');
    }
    input.focus();
  }

  function closeChat() {
    chatOpen = false;
    term.hidden = true;
  }

  /* 點角色本體開關聊天（元素會被換模型重建，用事件委派） */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#live2d-widget')) {
      chatOpen ? closeChat() : openChat();
    }
  });

  root.querySelector('.waifu-btn-close').addEventListener('click', closeChat);

  /* ── 換模型後的狀態還原（reload 不失憶）────────── */
  var wasSwitched = false;
  try {
    JSON.parse(sessionStorage.getItem('waifu-history') || '[]').forEach(function (m) {
      history.push(m);
      addLog(m.role, m.content);
    });
    if (sessionStorage.getItem('waifu-open')) {
      chatOpen = true;
      term.hidden = false;
      refreshTermMeta();
    }
    if (sessionStorage.getItem('waifu-switched')) {
      sessionStorage.removeItem('waifu-switched');
      wasSwitched = true;
    }
  } catch (e) { /* sessionStorage 不可用就算了 */ }

  /* ── 問候 ────────────────────────────────────── */
  function timeGreeting() {
    var h = new Date().getHours();
    if (h < 5)  return '這麼晚還沒睡嗎？要注意身體哦～';
    if (h < 11) return '早安！今天也要加油呢 ☀';
    if (h < 14) return '午安～吃飽了再繼續看吧';
    if (h < 18) return '下午好！來看看 Lin 又寫了什麼';
    if (h < 23) return '晚上好～讀點技術文章放鬆一下吧';
    return '夜深了，看完這篇就去休息吧！';
  }

  function pageGreeting() {
    var ctx = getPageContext();
    if (ctx) return '正在讀《' + ctx.title.slice(0, 20) + '》呀～需要我幫你總結嗎？點我聊聊！';
    if (location.pathname.indexOf('/archives') === 0) return '文章都在這裡，慢慢挑～';
    return null;
  }

  setTimeout(function () { say(wasSwitched ? '鏘鏘～換我上場！' : timeGreeting()); }, 1500);

  document.addEventListener('pjax:complete', function () {
    refreshTermMeta();
    var g = pageGreeting();
    if (g && Math.random() < 0.6) setTimeout(function () { say(g); }, 800);
  });

  document.addEventListener('copy', function () {
    say('轉載的話，記得註明出處哦～');
  });

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var dark = document.documentElement.dataset.theme === 'dark';
    say(dark ? '燈亮起來囉 ☀' : '夜間模式，眼睛舒服多了～');
  });

  /* ── 換模型 ──────────────────────────────────────
     L2Dwidget 重 init 不會真的載入新模型（內部快取首次設定），
     可靠做法是 reload；聊天記錄先存 sessionStorage 保留 */
  root.querySelector('.waifu-btn-model').addEventListener('click', function () {
    var next = modelKeys[(modelKeys.indexOf(currentModel()) + 1) % modelKeys.length];
    localStorage.setItem('live2d-model', next);
    try {
      sessionStorage.setItem('waifu-history', JSON.stringify(history.slice(-12)));
      sessionStorage.setItem('waifu-open', chatOpen ? '1' : '');
      sessionStorage.setItem('waifu-switched', '1');
    } catch (e) {}
    location.reload();
  });

  /* ── 聊天 ────────────────────────────────────── */

  /* 離線劇本（endpoint 未設定時） */
  function offlineReply(text) {
    var rules = [
      [/你(是誰|叫什麼)|自我介紹/, '我是這裡的看板娘！Lin 寫程式的時候我負責監工 (｀・ω・´)'],
      [/lin|站長|作者/i, 'Lin 是軟體設計工程師，最近都在玩 AI 應用整合～專案都在首頁精選專案那邊！'],
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
      var r = offlineReply(text);
      history.push({ role: 'assistant', content: r });
      setTimeout(function () { addLog('assistant', r); }, 400);
      return;
    }

    pending = true;
    var typing = addLog('assistant', '…');
    typing.classList.add('waifu-typing');

    var payload = { messages: history.slice(-10) };
    var ctx = getPageContext();
    if (ctx) payload.page = ctx;

    fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) { return res.json(); })
      .then(function (data) {
        typing.remove();
        var reply = data.reply || '（連線怪怪的，等一下再試試？）';
        history.push({ role: 'assistant', content: reply });
        addLog('assistant', reply);
      })
      .catch(function () {
        typing.remove();
        addLog('assistant', '腦袋連不上線 QQ 稍後再試～');
      })
      .finally(function () { pending = false; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    input.value = '';
    sendMessage(text);
  });

  root.querySelector('.waifu-chip-summary').addEventListener('click', function () {
    sendMessage('幫我總結這篇文章的重點');
  });

  /* ── 啟動 ────────────────────────────────────── */
  renderModel(currentModel());
  refreshTermMeta();
})();
