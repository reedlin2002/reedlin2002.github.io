/**
 * Live2D 看板娘：渲染 + 問候 + 換模型 + 聊天
 * - 設定來自 window.LIVE2D_CHAT_CONFIG（layout.ejs 注入 theme.live2d_chat）
 * - 聊天：POST {messages} 到 config.endpoint（CF Worker → OpenRouter）
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
      display: { position: 'left', width: 80, height: 160, hOffset: 70, vOffset: 0 },
      mobile: { show: false },
      react: { opacityDefault: 0.65, opacityOnHover: 0.9 },
      log: false
    });
  }

  /* ── UI ──────────────────────────────────────── */
  var root = document.createElement('div');
  root.id = 'waifu-chat';
  root.innerHTML =
    '<div class="waifu-bubble" hidden></div>' +
    '<div class="waifu-panel" hidden>' +
      '<div class="waifu-log"></div>' +
      '<form class="waifu-form">' +
        '<span class="waifu-prompt">&gt;</span>' +
        '<input class="waifu-input" type="text" maxlength="200" placeholder="跟她說點什麼…" aria-label="聊天輸入">' +
      '</form>' +
    '</div>' +
    '<div class="waifu-tools">' +
      '<button type="button" class="waifu-tool waifu-tool-chat" title="聊天" aria-label="開關聊天">💬</button>' +
      '<button type="button" class="waifu-tool waifu-tool-model" title="換個角色" aria-label="換模型">👘</button>' +
    '</div>';
  document.body.appendChild(root);

  var bubble = root.querySelector('.waifu-bubble');
  var panel = root.querySelector('.waifu-panel');
  var log = root.querySelector('.waifu-log');
  var form = root.querySelector('.waifu-form');
  var input = root.querySelector('.waifu-input');

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
    div.textContent = text;
    log.appendChild(div);
    while (log.children.length > 6) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  }

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
    var t = document.querySelector('article.post h1, #header-post + * h1');
    var title = document.title.replace(/\s*\|.*$/, '');
    if (document.querySelector('article.post')) return '正在讀《' + title.slice(0, 20) + '》呀～';
    if (location.pathname.indexOf('/archives') === 0) return '文章都在這裡，慢慢挑～';
    return null;
  }

  setTimeout(function () { say(timeGreeting()); }, 1800);

  document.addEventListener('pjax:complete', function () {
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

  /* ── 換模型 ──────────────────────────────────── */
  root.querySelector('.waifu-tool-model').addEventListener('click', function () {
    var next = modelKeys[(modelKeys.indexOf(currentModel()) + 1) % modelKeys.length];
    localStorage.setItem('live2d-model', next);
    renderModel(next);
    say('鏘鏘～換我上場！');
  });

  /* ── 聊天 ────────────────────────────────────── */
  root.querySelector('.waifu-tool-chat').addEventListener('click', function () {
    chatOpen = !chatOpen;
    panel.hidden = !chatOpen;
    bubble.hidden = true;
    if (chatOpen) {
      if (!log.children.length) addLog('assistant', cfg.endpoint ? '嗨！想聊什麼呢？' : '嗨！（大腦還沒接上線，我只能講講預錄台詞啦）');
      input.focus();
    }
  });

  /* 離線劇本（endpoint 未設定時） */
  function offlineReply(text) {
    var rules = [
      [/你(是誰|叫什麼)|自我介紹/, '我是這裡的看板娘！Lin 寫程式的時候我負責監工 (｀・ω・´)'],
      [/lin|站長|作者/i, 'Lin 是軟體設計工程師，最近都在玩 AI 應用整合～專案都在首頁精選專案那邊！'],
      [/專案|project/i, '推薦看看 LocalAIAgentAPI 和 UrlHealthMonitor，首頁往下捲就有～'],
      [/文章|blog|部落格/, '文章都收在「文章」頁，LeetCode 跟技術筆記都有哦'],
      [/謝謝|感謝/, '不客氣～常來玩！'],
      [/(早安|午安|晚安|你好|嗨|哈囉)/, timeGreeting()]
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(text)) return rules[i][1];
    }
    var fallback = ['嗯嗯，然後呢？', '這個嘛…等我大腦連上線再告訴你！', '(歪頭) 再說一次？', '你可以問我關於 Lin 或這個部落格的事哦'];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  var pending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || pending) return;
    input.value = '';
    addLog('user', text);
    history.push({ role: 'user', content: text });

    if (!cfg.endpoint) {
      var r = offlineReply(text);
      history.push({ role: 'assistant', content: r });
      setTimeout(function () { addLog('assistant', r); }, 400);
      return;
    }

    pending = true;
    var typing = document.createElement('div');
    typing.className = 'waifu-msg waifu-msg-assistant waifu-typing';
    typing.textContent = '…';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-10) })
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
  });

  /* ── 啟動 ────────────────────────────────────── */
  renderModel(currentModel());
})();
